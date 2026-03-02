import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute, FaGlobe, FaEllipsisV, FaArrowsAlt, FaBars, FaChevronRight, FaCalendarAlt, FaBriefcase, FaUserTie, FaCog, FaArrowRight } from 'react-icons/fa';
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
            <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white rounded-full p-5 shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center w-16 h-16 border-2 border-white"
                >
                    <FaRobot className="text-3xl" />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans animate-fadeIn">
            <div className="bg-white rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-96 max-w-[95vw] sm:max-w-md mobile-chatbot flex flex-col overflow-hidden border border-gray-100 transition-all duration-300" style={{ height: '680px' }}>

                {/* Professional Header */}
                <div className="bg-gradient-to-r from-[#2563eb] to-[#1e40af] text-white p-6 flex justify-between items-center relative overflow-hidden shrink-0">
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="relative">
                            <div className="bg-white p-1 rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                                <div className="bg-[#2563eb] rounded-full p-2.5">
                                    <FaRobot size={26} className="text-white" />
                                </div>
                            </div>
                            <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-400 border-2 border-[#2563eb] rounded-full shadow-sm"></span>
                        </div>
                        <div>
                            <h3 className="font-bold text-xl leading-tight tracking-tight">Luna AI</h3>
                            <div className="flex items-center gap-2 opacity-90 mt-0.5">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></span>
                                <span className="text-[13px] font-medium tracking-wide">We're online!</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-1.5 relative z-10">
                        <button className="p-2.5 hover:bg-white/15 rounded-full transition-colors active:scale-90"><FaGlobe size={18} /></button>
                        <button className="p-2.5 hover:bg-white/15 rounded-full transition-colors active:scale-90"><FaEllipsisV size={18} /></button>
                        <button onClick={() => setIsOpen(false)} className="ml-1.5 p-2.5 hover:bg-red-500/80 rounded-full transition-all active:scale-90 bg-white/10 flex items-center justify-center">
                            <FaTimes size={20} />
                        </button>
                    </div>
                    {/* Background decorations for "Premium" feel */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc] space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            {msg.role === 'assistant' && (
                                <div className="bg-white shadow-sm p-1.5 rounded-full mt-1 shrink-0 border border-gray-100 transition-transform hover:scale-105">
                                    <div className="bg-[#2563eb] text-white rounded-full p-1.5 flex items-center justify-center">
                                        <FaRobot size={12} />
                                    </div>
                                </div>
                            )}
                            <div className={`max-w-[80%] rounded-[20px] p-4 shadow-sm text-[15px] leading-relaxed relative ${msg.role === 'user'
                                    ? 'bg-[#2563eb] text-white rounded-tr-none shadow-blue-100'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                }`}>
                                {msg.content}
                                <span className={`block text-[10px] opacity-60 mt-2 text-right uppercase font-bold tracking-tighter ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Quick Action Grid */}
                    {messages.length <= 1 && !isLoading && (
                        <div className="grid grid-cols-2 gap-4 pt-4 animate-slideUp">
                            {quickActions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleQuickAction(action.label)}
                                    className="flex items-center gap-3 bg-white border border-gray-100 p-4 rounded-xl text-[#2563eb] font-bold text-sm hover:border-[#2563eb] hover:shadow-md transition-all duration-300 shadow-sm active:scale-95 group hover:-translate-y-1"
                                >
                                    <span className="text-xl group-hover:scale-110 transition-transform bg-[#2563eb]/5 p-2 rounded-lg">{action.icon}</span>
                                    <span className="text-left font-bold leading-tight">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex justify-start items-center gap-3">
                            <div className="bg-white shadow-sm p-1.5 rounded-full shrink-0 border border-gray-100">
                                <div className="bg-[#2563eb] text-white rounded-full p-1.5 flex items-center justify-center"><FaRobot size={12} /></div>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-[#2563eb]/40 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-[#2563eb]/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-[#2563eb] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Professional Footer with Integrated Mic */}
                <div className="p-6 bg-white border-t border-gray-50 shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
                    <form onSubmit={handleSubmit} className="flex gap-3 items-center">
                        <div className="flex-1 bg-[#f8fafc] border border-gray-200 rounded-full px-5 py-4 text-[15px] focus-within:ring-2 focus-within:ring-[#2563eb]/40 focus-within:bg-white transition-all flex items-center gap-4 shadow-sm overflow-hidden">
                            <button type="button" className="text-gray-400 hover:text-[#2563eb] transition-colors active:scale-90"><FaBars size={18} /></button>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Write your message..."
                                className="flex-1 bg-transparent border-none focus:outline-none placeholder-gray-400 font-medium text-gray-700"
                                disabled={isLoading}
                                autoFocus
                            />
                            {/* Integrated Microphone Icon */}
                            <button
                                type="button"
                                onClick={toggleVoiceMode}
                                className={`transition-all duration-300 flex items-center justify-center w-10 h-10 rounded-full ${isListening ? 'bg-red-50 text-red-500 scale-110' : 'text-gray-400 hover:text-[#2563eb] hover:bg-blue-50'}`}
                            >
                                <FaMicrophone size={19} className={isListening ? 'animate-pulse' : ''} />
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="bg-[#2563eb] text-white p-4 rounded-full hover:bg-[#1d4ed8] disabled:opacity-40 transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center justify-center shrink-0 w-[58px] h-[58px] border-b-4 border-[#1e40af]"
                        >
                            <FaPaperPlane size={22} className={input.trim() ? 'translate-x-0.5' : ''} />
                        </button>
                    </form>

                    <div className="mt-5 flex justify-center items-center gap-3 text-[11px] text-gray-400 font-extrabold tracking-widest">
                        <button className="hover:text-[#2563eb] transition-colors uppercase">Privacy Policy</button>
                        <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                        <span className="uppercase">Powered By Luna AI</span>
                    </div>
                </div>

                {/* Premium Voice Overlay */}
                {isVoiceMode && (
                    <div className="absolute inset-0 z-50 bg-[#0f172a]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 animate-fadeIn text-white">
                        <button onClick={() => setIsVoiceMode(false)} className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-full transition-colors active:scale-90">
                            <FaTimes size={28} />
                        </button>

                        <div className="mb-14 relative">
                            <div className="w-56 h-56 rounded-full bg-blue-500/20 blur-3xl absolute inset-0 animate-pulse scale-150"></div>
                            <div className={`w-40 h-40 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1e40af] flex items-center justify-center relative z-10 shadow-[0_0_60px_rgba(37,99,235,0.4)] border-4 border-white/10 transition-all duration-500 ${isListening || isSpeaking ? 'scale-110' : ''}`}>
                                <div className={`w-full h-full rounded-full border-4 border-white/20 absolute inset-0 ${isListening ? 'animate-ping opacity-30' : ''}`}></div>
                                <FaRobot size={60} className={`relative z-20 ${isSpeaking ? 'animate-bounce' : ''}`} />
                            </div>
                        </div>

                        <div className="text-center space-y-4 max-w-sm px-4">
                            <p className="text-blue-300 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">
                                {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Ready to talk"}
                            </p>
                            <p className={`text-2xl font-light italic text-blue-50 leading-relaxed min-h-[6rem] opacity-90 transition-all duration-300`}>
                                {input || (isListening ? "Say something..." : "How can I help you?")}
                            </p>
                        </div>

                        <div className="flex gap-10 items-center mt-12">
                            <button
                                onClick={() => setIsTTSEnabled(!isTTSEnabled)}
                                className={`w-14 h-14 rounded-full border border-white/10 flex items-center justify-center transition-all bg-white/5 hover:bg-white/10 ${!isTTSEnabled ? 'text-red-400 border-red-500/30' : 'text-blue-300'}`}
                            >
                                {isTTSEnabled ? <FaVolumeUp size={22} /> : <FaVolumeMute size={22} />}
                            </button>

                            <button
                                onClick={() => isListening ? recognitionRef.current?.stop() : recognitionRef.current?.start()}
                                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 ${isListening ? 'bg-red-600 scale-105' : 'bg-[#2563eb]'}`}
                            >
                                {isListening ? <FaMicrophoneSlash size={36} /> : <FaMicrophone size={36} />}
                                {isListening && <div className="absolute inset-0 border-8 border-red-500/30 animate-pulse rounded-full"></div>}
                            </button>

                            <button onClick={() => setIsVoiceMode(false)} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-blue-300 transition-all">
                                <FaArrowRight size={22} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse-slow { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
                
                .animate-fadeIn { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
                .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
                .animate-pulse-slow { animation: pulse-slow 2s infinite ease-in-out; }
                
                .scrollbar-thin::-webkit-scrollbar { width: 4px; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                
                @media (max-width: 640px) {
                    .mobile-chatbot {
                        position: fixed !important;
                        inset: 4px !important;
                        width: auto !important;
                        height: auto !important;
                        max-width: none !important;
                        border-radius: 20px !important;
                        z-index: 2000 !important;
                    }
                }
            `}</style>
        </div>
    );
}
