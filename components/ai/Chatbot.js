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

    const [sessionId, setSessionId] = useState('');

    // Generate or retrieve session ID
    useEffect(() => {
        if (typeof window !== 'undefined') {
            let sId = localStorage.getItem('chatbot_session_id');
            if (!sId) {
                sId = 'sess_' + Math.random().toString(36).substring(2, 15);
                localStorage.setItem('chatbot_session_id', sId);
            }
            setSessionId(sId);
        }
    }, []);

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
                    session_id: sessionId,
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
                        className="bg-white text-blue-600 rounded-full p-4 shadow-xl border border-blue-100 hover:scale-110 transition-transform group relative"
                        title="Voice Chat"
                    >
                        <FaMicrophone size={24} />
                        <span className="absolute right-full mr-3 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-lg">Voice Mode</span>
                    </button>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center w-16 h-16"
                    >
                        <FaRobot className="text-3xl" />
                    </button>
                </div>
            )}

            {/* Chat Window */}
            {isOpen && !isVoiceMode && (
                <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-[95vw] mobile-chatbot transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden" style={{ height: '600px' }}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="bg-white/20 p-2 rounded-full border border-white/30">
                                    <FaRobot size={22} />
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-600 rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-none">Luna AI</h3>
                                <p className="text-[11px] opacity-90 mt-1">Active Career Advisor</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={toggleVoiceMode}
                                className={`hover:bg-white/20 p-2 rounded-full transition-all ${isVoiceSupported ? 'text-white' : 'text-white/30 cursor-not-allowed'}`}
                                title={isVoiceSupported ? "Start Voice Call" : "Voice not supported"}
                                disabled={!isVoiceSupported}
                            >
                                <FaMicrophone size={20} className={isListening ? 'animate-pulse text-green-400' : ''} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm text-[15px] ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none px-4'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none px-4 shadow-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-3 px-4 shadow-sm">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Message Luna..."
                                className="flex-1 bg-gray-100/70 border-none rounded-2xl px-5 py-3 text-[15px] focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 active:scale-95"
                            >
                                <FaPaperPlane size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Premium Voice Mode Overlay */}
            {isVoiceMode && (
                <div className="fixed inset-0 z-[60] bg-gradient-to-b from-[#0f172a] to-[#1e293b] flex flex-col items-center animate-fadeIn text-white font-sans overflow-hidden">
                    {/* Header */}
                    <div className="w-full p-6 flex justify-between items-center bg-white/5 backdrop-blur-sm">
                        <button
                            onClick={() => { setIsVoiceMode(false); setIsOpen(true); }}
                            className="p-3 hover:bg-white/10 rounded-full transition-colors"
                            aria-label="Back"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        <span className="text-lg font-semibold tracking-wide">Voice chat</span>
                        <button className="p-3 hover:bg-white/10 rounded-full transition-colors" aria-label="Menu">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle>
                            </svg>
                        </button>
                    </div>

                    {/* Visualizer Section */}
                    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg px-6">
                        <div className="text-blue-300 text-sm font-medium tracking-widest uppercase mb-8" id="siyanoav-voice-status">
                            {isListening ? 'Listening...' : isSpeaking ? 'Luna speaking' : isLoading ? 'Processing...' : 'Tap mic to speak'}
                        </div>

                        {/* Animated Sphere */}
                        <div className="relative mb-12">
                            <div className={`w-48 h-48 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 blur-2xl opacity-20 absolute inset-0 animate-pulse ${isListening || isSpeaking ? 'scale-150' : ''}`}></div>
                            <div className={`siyanoav-voice-sphere w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_50px_rgba(59,130,246,0.5)] flex items-center justify-center relative z-10 transition-all duration-500 ${isListening || isSpeaking ? 'scale-110' : 'scale-100'}`}>
                                <div className={`w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center ${isListening ? 'animate-ping opacity-40' : ''}`}>
                                    <FaRobot size={64} className={isSpeaking ? 'animate-bounce' : ''} />
                                </div>
                            </div>
                        </div>

                        {/* Subtitle / Transcription */}
                        <div className="min-h-[4rem] text-center mb-12 px-4">
                            <p className="text-xl md:text-2xl font-light text-blue-50 leading-relaxed italic opacity-90">
                                {input || (isListening ? "I'm listening..." : "How can I help you today?")}
                            </p>
                        </div>

                        {/* Waveform Bars */}
                        <div className={`flex items-end gap-1.5 h-12 transition-opacity duration-300 ${isListening || isSpeaking ? 'opacity-100' : 'opacity-0'}`}>
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1.5 bg-blue-400 rounded-full transition-all duration-300 ${isListening || isSpeaking ? 'animate-waveform-bar' : ''}`}
                                    style={{
                                        height: '40%',
                                        animationDelay: `${i * 0.1}s`,
                                        animationDuration: '0.8s'
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="w-full pb-12 pt-6 flex justify-center items-center gap-8 bg-black/10 backdrop-blur-md">
                        <button
                            onClick={() => { setIsVoiceMode(false); setIsOpen(true); }}
                            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/10 active:scale-90"
                            aria-label="Chat"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </button>

                        <button
                            onClick={() => isListening ? recognitionRef.current?.stop() : recognitionRef.current?.start()}
                            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 ${isListening ? 'bg-red-500 hover:bg-red-600 ring-8 ring-red-500/20' : 'bg-blue-600 hover:bg-blue-700 ring-8 ring-blue-600/20'
                                }`}
                            aria-label="Mic"
                        >
                            {isListening ? (
                                <FaMicrophoneSlash size={36} />
                            ) : (
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                    <line x1="12" y1="19" x2="12" y2="23"></line>
                                    <line x1="8" y1="23" x2="16" y2="23"></line>
                                </svg>
                            )}
                        </button>

                        <button
                            onClick={() => setIsVoiceMode(false)}
                            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/10 active:scale-90"
                            aria-label="Close"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                
                @keyframes animate-waveform-bar {
                    0%, 100% { height: 20%; }
                    50% { height: 100%; }
                }
                .animate-waveform-bar {
                    animation: animate-waveform-bar infinite ease-in-out;
                }

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
                
                .siyanoav-voice-sphere {
                    background: radial-gradient(circle at 30% 30%, #60a5fa, #2563eb);
                    box-shadow: 0 0 50px rgba(37, 99, 235, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}
