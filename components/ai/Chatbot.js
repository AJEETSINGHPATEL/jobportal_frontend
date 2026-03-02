import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute, FaGlobe, FaEllipsisV, FaArrowsAlt, FaBars, FaChevronRight, FaCalendarAlt, FaBriefcase, FaUserTie, FaCog } from 'react-icons/fa';
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
    const [sessionId, setSessionId] = useState('');

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
                recognitionRef.current.lang = 'en-IN';

                recognitionRef.current.onstart = () => setIsListening(true);
                recognitionRef.current.onresult = (event) => {
                    const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
                    setInput(transcript);
                    if (event.results[0].isFinal) handleVoiceSubmit(transcript);
                };
                recognitionRef.current.onend = () => setIsListening(false);
                recognitionRef.current.onerror = () => setIsListening(false);
            }

            // Speech Synthesis
            if ('speechSynthesis' in window) {
                synthRef.current = window.speechSynthesis;
            }

            // Session ID
            let sId = localStorage.getItem('chatbot_session_id');
            if (!sId) {
                sId = 'sess_' + Math.random().toString(36).substring(2, 15);
                localStorage.setItem('chatbot_session_id', sId);
            }
            setSessionId(sId);
        }
    }, []);

    // Welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMsg = {
                role: 'assistant',
                content: "Hi, I am Luna, your AI Career Assistant. How can I help you today?",
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
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            if (isVoiceMode) setTimeout(() => recognitionRef.current?.start(), 500);
        };
        utterance.onerror = () => setIsSpeaking(false);
        synthRef.current.speak(utterance);
    };

    const toggleVoiceMode = () => {
        if (!isVoiceSupported) return;
        if (isVoiceMode) {
            setIsVoiceMode(false);
            recognitionRef.current?.stop();
            synthRef.current?.cancel();
        } else {
            setIsOpen(true);
            setIsVoiceMode(true);
            setInput('');
            setTimeout(() => recognitionRef.current?.start(), 300);
        }
    };

    const handleVoiceSubmit = async (val) => {
        if (!val.trim()) return;
        await processChatMessage(val);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        const msg = input;
        setInput('');
        await processChatMessage(msg);
    };

    const handleQuickAction = async (action) => {
        setInput(action);
        await processChatMessage(action);
    };

    const processChatMessage = async (msgContent) => {
        const userMessage = { role: 'user', content: msgContent, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://jobportal-backend-ckuk.onrender.com';
            const res = await fetch(`${apiUrl}/api/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
                body: JSON.stringify({ message: msgContent, session_id: sessionId, history: messages.slice(-5).map(m => ({ role: m.role, content: m.content })) }),
            });
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            const assistantMessage = { role: 'assistant', content: data.response, timestamp: new Date() };
            setMessages(prev => [...prev, assistantMessage]);
            speak(data.response);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm offline. Please check your connection.", timestamp: new Date() }]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickActions = [
        { label: "Book a Meeting", icon: <FaCalendarAlt /> },
        { label: "Our Services", icon: <FaCog /> },
        { label: "Career Opportunities", icon: <FaBriefcase /> },
        { label: "Talk to Human", icon: <FaUserTie /> }
    ];

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end animate-fadeIn">
                <button
                    onClick={toggleVoiceMode}
                    className="bg-white text-[#2563eb] rounded-full p-4 shadow-xl border border-blue-50 transition-all hover:scale-110 active:scale-95 group relative"
                >
                    <FaMicrophone size={24} />
                    <span className="absolute right-full mr-3 bg-[#2563eb] text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Voice Mode</span>
                </button>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white rounded-full p-5 shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center w-16 h-16"
                >
                    <FaRobot className="text-3xl" />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans animate-fadeIn">
            <div className="bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] w-96 max-w-[95vw] sm:max-w-md mobile-chatbot flex flex-col overflow-hidden border border-gray-100 transition-all duration-300" style={{ height: '650px' }}>

                {/* Header (Inspired by good.png) */}
                <div className="bg-gradient-to-r from-[#2563eb] to-[#1e40af] text-white p-5 flex justify-between items-center relative overflow-hidden shrink-0">
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="relative">
                            <div className="bg-white p-1 rounded-full w-12 h-12 flex items-center justify-center">
                                <div className="bg-[#2563eb] rounded-full p-2">
                                    <FaRobot size={24} className="text-white" />
                                </div>
                            </div>
                            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-[#2563eb] rounded-full"></span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">Luna AI</h3>
                            <div className="flex items-center gap-1.5 opacity-90">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-[12px] font-medium tracking-wide">We're online!</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-1 relative z-10">
                        <button className="p-2 hover:bg-white/15 rounded-full transition-colors"><FaGlobe size={16} /></button>
                        <button className="p-2 hover:bg-white/15 rounded-full transition-colors"><FaEllipsisV size={16} /></button>
                        <button className="p-2 hover:bg-white/15 rounded-full transition-colors"><FaArrowsAlt size={16} /></button>
                        <button onClick={() => setIsOpen(false)} className="ml-1 p-2 hover:bg-red-500/80 rounded-full transition-all active:scale-90 bg-white/10 flex items-center justify-center">
                            <FaTimes size={18} />
                        </button>
                    </div>
                    {/* Decorative header shape */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-5 bg-white space-y-6">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            {msg.role === 'assistant' && (
                                <div className="bg-gray-100 p-2 rounded-full mt-1 shrink-0">
                                    <div className="bg-[#2563eb] text-white rounded-full p-1.5 flex items-center justify-center">
                                        <FaRobot size={14} />
                                    </div>
                                </div>
                            )}
                            <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm text-[15px] leading-relaxed relative ${msg.role === 'user'
                                    ? 'bg-[#2563eb] text-white rounded-tr-none'
                                    : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-none'
                                }`}>
                                {msg.content}
                                <span className="block text-[10px] opacity-60 mt-1.5 text-right uppercase font-semibold tracking-tighter">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Quick Action Grid (Only show initially or after clear conversation) */}
                    {messages.length <= 1 && !isLoading && (
                        <div className="grid grid-cols-2 gap-3 pt-4">
                            {quickActions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleQuickAction(action.label)}
                                    className="flex items-center gap-3 bg-white border border-[#2563eb]/20 p-4 rounded-xl text-[#2563eb] font-semibold text-sm hover:bg-[#2563eb] hover:text-white transition-all duration-300 shadow-sm active:scale-95 group"
                                >
                                    <span className="text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
                                    <span className="text-left">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex justify-start items-center gap-3">
                            <div className="bg-gray-100 p-2 rounded-full shrink-0">
                                <div className="bg-[#2563eb] text-white rounded-full p-1.5 flex items-center justify-center"><FaRobot size={14} /></div>
                            </div>
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 bg-[#2563eb] rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-[#2563eb] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-[#2563eb] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Footer Input Bar */}
                <div className="p-6 bg-white border-t border-gray-50 relative shrink-0">
                    <form onSubmit={handleSubmit} className="flex gap-3 items-center">
                        <div className="flex-1 bg-white border border-gray-200 rounded-full px-5 py-3.5 text-[15px] focus-within:ring-2 focus-within:ring-[#2563eb]/30 transition-all flex items-center gap-3 shadow-inner">
                            <button type="button" className="text-gray-400 hover:text-[#2563eb] transition-colors"><FaBars size={18} /></button>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-transparent border-none focus:outline-none placeholder-gray-400"
                                disabled={isLoading}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={toggleVoiceMode}
                                className={`text-gray-400 hover:text-[#2563eb] transition-all duration-300 ${isListening ? 'text-[#2563eb] scale-125' : ''}`}
                            >
                                <FaMicrophone size={18} className={isListening ? 'animate-pulse' : ''} />
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="bg-[#2563eb] text-white p-4 rounded-full hover:bg-[#1d4ed8] disabled:opacity-40 transition-all shadow-lg shadow-blue-200 active:scale-90 flex items-center justify-center shrink-0 w-[54px] h-[54px]"
                        >
                            <FaPaperPlane size={20} />
                        </button>
                    </form>

                    <div className="mt-4 flex justify-center items-center gap-2 text-[10px] text-gray-400 font-medium">
                        <button className="hover:text-gray-600 transition-colors uppercase tracking-widest">Privacy & Policy</button>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="uppercase tracking-widest">Powered By Luna AI</span>
                    </div>
                </div>

                {/* Premium Voice Overlay inside Chat Window (Optional) */}
                {isVoiceMode && (
                    <div className="absolute inset-0 z-50 bg-[#0f172a]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-fadeIn text-white">
                        <button onClick={() => setIsVoiceMode(false)} className="absolute top-6 right-6 p-3 hover:bg-white/10 rounded-full transition-colors"><FaTimes size={24} /></button>

                        <div className="mb-12 relative">
                            <div className="w-48 h-48 rounded-full bg-blue-500/20 blur-3xl absolute inset-0 animate-pulse scale-150"></div>
                            <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1e40af] flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(37,99,235,0.4)] ${isListening || isSpeaking ? 'animate-pulse scale-110' : ''}`}>
                                <FaRobot size={48} className={isSpeaking ? 'animate-bounce' : ''} />
                            </div>
                        </div>

                        <p className={`text-2xl font-light mb-8 italic text-center text-blue-100 min-h-[4rem]`}>
                            {input || (isListening ? "I'm listening..." : "Ready to talk")}
                        </p>

                        <div className="flex gap-8 items-center pt-8">
                            <button onClick={() => setIsTTSEnabled(!isTTSEnabled)} className={`p-4 rounded-full border border-white/10 shadow-lg transition-all active:scale-95 ${!isTTSEnabled ? 'bg-red-500/20 border-red-500/50' : 'bg-white/10'}`}>
                                {isTTSEnabled ? <FaVolumeUp size={24} /> : <FaVolumeMute size={24} />}
                            </button>
                            <button
                                onClick={() => isListening ? recognitionRef.current?.stop() : recognitionRef.current?.start()}
                                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 ${isListening ? 'bg-red-600' : 'bg-[#2563eb] overflow-hidden'}`}
                            >
                                {isListening ? <FaMicrophoneSlash size={32} /> : <FaMicrophone size={32} />}
                                {isListening && <div className="absolute inset-0 border-4 border-red-400 animate-ping rounded-full"></div>}
                            </button>
                            <button onClick={() => setIsVoiceMode(false)} className="p-4 rounded-full border border-white/10 shadow-lg bg-white/10 active:scale-95"><FaPaperPlane size={24} /></button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                
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
