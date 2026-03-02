import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute, FaHeadset } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

export default function Chatbot() {
    const { token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isVoiceSupported, setIsVoiceSupported] = useState(false);
    const [isTTSEnabled, setIsTTSEnabled] = useState(true);

    const recognitionRef = useRef(null);
    const messagesEndRef = useRef(null);
    const synthRef = useRef(null);

    // Initialize voice recognition and synthesis
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Speech Recognition
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                setIsVoiceSupported(true);
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'en-IN'; // Set to English (India) for better local accent support

                recognitionRef.current.onstart = () => {
                    setIsListening(true);
                };

                recognitionRef.current.onresult = (event) => {
                    const transcript = Array.from(event.results)
                        .map(result => result[0])
                        .map(result => result.transcript)
                        .join('');

                    setInput(transcript);

                    if (event.results[0].isFinal) {
                        handleVoiceSubmit(transcript);
                    }
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                    if (isVoiceMode) setIsVoiceMode(false);
                };
            }

            // Speech Synthesis
            if ('speechSynthesis' in window) {
                synthRef.current = window.speechSynthesis;
            }
        }
    }, []);

    // Welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMsg = {
                role: 'assistant',
                content: "Hello! I'm Luna, your AI Career Assistant. Click the headset icon for a human-like voice conversation, or type your message below. How can I assist you today?",
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

    const speak = (text) => {
        if (!isTTSEnabled || !synthRef.current) return;

        // Cancel any ongoing speech
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.1; // Slightly higher pitch for a friendlier "Luna" voice

        // Find a female voice if possible
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Female')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            // If in voice mode, start listening again after speaking
            if (isVoiceMode) {
                setTimeout(() => {
                    if (!isListening) recognitionRef.current?.start();
                }, 500);
            }
        };
        utterance.onerror = () => setIsSpeaking(false);

        synthRef.current.speak(utterance);
    };

    const toggleVoiceMode = () => {
        if (!isVoiceSupported) {
            alert('Voice recognition is not supported in your browser.');
            return;
        }

        if (isVoiceMode) {
            setIsVoiceMode(false);
            recognitionRef.current?.stop();
            synthRef.current?.cancel();
        } else {
            setIsOpen(true);
            setIsVoiceMode(true);
            setInput('');
            setTimeout(() => {
                recognitionRef.current?.start();
            }, 300);
        }
    };

    const handleVoiceSubmit = async (finalTranscript) => {
        if (!finalTranscript.trim()) return;
        await processChatMessage(finalTranscript);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        const msg = input;
        setInput('');
        await processChatMessage(msg);
    };

    const processChatMessage = async (msgContent) => {
        const userMessage = {
            role: 'user',
            content: msgContent,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://jobportal-backend-ckuk.onrender.com';

            const res = await fetch(`${apiUrl}/api/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    message: msgContent,
                    history: messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
                }),
            });

            if (!res.ok) throw new Error('Failed to fetch AI response');

            const data = await res.json();
            const response = data.response;

            const assistantMessage = {
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);

            // Speak the response
            speak(response);

        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                role: 'assistant',
                content: "I'm having trouble responding right now. Please check your connection.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            if (isVoiceMode) speak("I'm sorry, I encountered a connection error.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Main Toggle Button */}
            {!isOpen && (
                <div className="flex flex-col gap-3 items-end">
                    <button
                        onClick={toggleVoiceMode}
                        className="bg-white text-blue-600 rounded-full p-3 shadow-xl border border-blue-100 hover:scale-110 transition-transform group relative"
                        title="Voice Chat"
                    >
                        <FaHeadset size={20} />
                        <span className="absolute right-full mr-3 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Voice Mode</span>
                    </button>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center w-14 h-14"
                    >
                        <FaRobot className="text-2xl" />
                    </button>
                </div>
            )}

            {/* Chat Window */}
            {isOpen && !isVoiceMode && (
                <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-[95vw] mobile-chatbot transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden" style={{ height: '550px' }}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="bg-white/20 p-2 rounded-full border border-white/30">
                                    <FaRobot size={20} />
                                </div>
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-blue-600 rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-base leading-none">Luna AI</h3>
                                <p className="text-[10px] opacity-80 mt-1">Active Career Advisor</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={toggleVoiceMode}
                                className={`hover:bg-white/20 p-1.5 rounded-full transition-all ${isVoiceSupported ? 'text-white' : 'text-white/30 cursor-not-allowed'}`}
                                title={isVoiceSupported ? "Start Voice Call" : "Voice not supported"}
                                disabled={!isVoiceSupported}
                            >
                                <FaMicrophone size={20} className={isListening ? 'animate-pulse text-green-400' : ''} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm text-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none px-4'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none px-4'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-3 px-4 shadow-sm">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Message Luna..."
                                className="flex-1 bg-gray-100/50 border-none rounded-2xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="bg-blue-600 text-white p-2.5 rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md shadow-blue-200"
                            >
                                <FaPaperPlane size={14} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Voice Mode Overlay */}
            {isVoiceMode && (
                <div className="fixed inset-0 z-[60] bg-blue-900/95 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 animate-fadeIn">
                    <button
                        onClick={toggleVoiceMode}
                        className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <FaTimes size={24} />
                    </button>

                    <div className="text-center mb-12">
                        <div className="mb-6 relative inline-block">
                            <div className={`w-32 h-32 rounded-full bg-blue-500/30 flex items-center justify-center transition-all duration-500 ${isListening || isSpeaking ? 'scale-110 shadow-[0_0_50px_rgba(59,130,246,0.5)]' : 'scale-100'}`}>
                                <div className={`w-24 h-24 rounded-full bg-blue-400/50 flex items-center justify-center transition-all ${isListening ? 'animate-pulse' : ''}`}>
                                    <FaRobot size={48} className={isSpeaking ? 'animate-bounce' : ''} />
                                </div>
                            </div>

                            {/* Pulse Waves */}
                            {(isListening || isSpeaking) && (
                                <>
                                    <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping" style={{ animationDuration: '2s' }}></div>
                                    <div className="absolute inset-0 rounded-full border-2 border-blue-400/20 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
                                </>
                            )}
                        </div>

                        <h2 className="text-3xl font-bold mb-2">Luna Voice</h2>
                        <p className={`text-lg font-medium transition-colors ${isListening ? 'text-green-400' : 'text-blue-200'}`}>
                            {isListening ? 'Listening...' : isSpeaking ? 'Luna is speaking...' : isLoading ? 'Processing...' : 'Ready'}
                        </p>
                    </div>

                    <div className="bg-white/10 p-6 rounded-3xl max-w-md w-full mb-12 border border-white/10">
                        <p className="text-center text-xl italic min-h-[3rem]">
                            {input || (isListening ? "Say something..." : "Waiting for response...")}
                        </p>
                    </div>

                    <div className="flex gap-6 items-center">
                        <button
                            onClick={() => setIsTTSEnabled(!isTTSEnabled)}
                            className={`p-4 rounded-full border ${isTTSEnabled ? 'bg-white/10 border-white/20' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}
                        >
                            {isTTSEnabled ? <FaVolumeUp size={20} /> : <FaVolumeMute size={20} />}
                        </button>

                        <button
                            onClick={() => isListening ? recognitionRef.current?.stop() : recognitionRef.current?.start()}
                            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-green-500 hover:bg-green-600'
                                }`}
                        >
                            {isListening ? <FaMicrophoneSlash size={28} /> : <FaMicrophone size={28} />}
                        </button>

                        <button
                            onClick={() => { setIsVoiceMode(false); setIsOpen(true); }}
                            className="bg-white/10 border border-white/20 p-4 rounded-full"
                            title="Switch to Text"
                        >
                            <FaPaperPlane size={20} />
                        </button>
                    </div>

                    <p className="mt-12 text-blue-300/60 text-sm font-medium">LUNA AI • VOICE ASSISTANT</p>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                
                @media (max-width: 640px) {
                    .mobile-chatbot {
                        position: fixed;
                        inset: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        max-width: none !important;
                        border-radius: 0 !important;
                        z-index: 1000;
                    }
                }
            `}</style>
        </div>
    );
}