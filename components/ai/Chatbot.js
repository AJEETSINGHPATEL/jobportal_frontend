import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

export default function Chatbot() {
    const { token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isVoiceSupported, setIsVoiceSupported] = useState(false);
    const recognitionRef = useRef(null);
    const messagesEndRef = useRef(null);

    // ... rest of state ...

    // Initialize voice recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setIsVoiceSupported(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setIsListening(true);
            };

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
        }
    }, []);

    // Initialize with welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMsg = {
                role: 'assistant',
                content: "Hello! I'm Luna, your AI Career Assistant. I can help you find jobs, connect with employers, and provide career guidance. How can I assist you today?",
                timestamp: new Date()
            };
            setMessages([welcomeMsg]);
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleVoiceInput = () => {
        if (!isVoiceSupported) {
            alert('Voice input is not supported in your browser');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = {
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002';

            const res = await fetch(`${apiUrl}/api/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: messages.map(m => ({ role: m.role, content: m.content }))
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to fetch AI response');
            }

            const data = await res.json();
            const response = data.response;

            const assistantMessage = {
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                role: 'assistant',
                content: "I'm having trouble responding right now. Please try again later.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Chat Icon - Positioned on right side */}
            <div className="fixed bottom-6 right-6 z-50 font-sans">
                {!isOpen ? (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center w-14 h-14"
                        aria-label="Open chatbot"
                    >
                        <FaRobot className="text-xl" />
                    </button>
                ) : (
                    <div className="bg-white rounded-2xl shadow-2xl w-80 max-w-[90vw] flex flex-col overflow-hidden border border-gray-200" style={{ height: '450px' }}>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <FaRobot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Luna - AI Assistant</h3>
                                    <div className="flex items-center gap-2 text-xs opacity-90">
                                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                        <span>Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/20 p-1.5 rounded-full transition-colors text-white"
                                aria-label="Close chat"
                            >
                                <FaTimes size={16} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role !== 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 mr-2 flex-shrink-0 border border-blue-200">
                                            <FaRobot size={14} />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] rounded-2xl p-3 px-4 shadow-sm ${msg.role === 'user'
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                            }`}
                                    >
                                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start mb-4">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 mr-2 flex-shrink-0 border border-blue-200">
                                        <FaRobot size={14} />
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-4 shadow-sm">
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area - With message input and microphone */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me about jobs or careers..."
                                    className="flex-1 bg-gray-100 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isLoading || isListening}
                                />
                                {isVoiceSupported && (
                                    <button
                                        type="button"
                                        onClick={toggleVoiceInput}
                                        disabled={isLoading}
                                        className={`p-2 rounded-full transition-colors ${isListening
                                            ? 'bg-red-500 text-white animate-pulse'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                            } disabled:opacity-50`}
                                        title={isListening ? "Stop listening" : "Voice input"}
                                    >
                                        {isListening ? <FaMicrophoneSlash size={16} /> : <FaMicrophone size={16} />}
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading || isListening}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-full hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 w-9 h-9 flex items-center justify-center shadow-sm"
                                    aria-label="Send message"
                                >
                                    <FaPaperPlane size={12} className="ml-0.5" />
                                </button>
                            </form>
                            <div className="text-center mt-2">
                                <p className="text-[10px] text-gray-400">
                                    Powered by <span className="font-semibold text-gray-500">Luna AI Assistant</span>
                                    {isListening && (
                                        <span className="block text-blue-600 animate-pulse">🎤 Listening...</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}