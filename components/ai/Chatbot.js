import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute, FaGlobe, FaEllipsisV, FaArrowsAlt, FaBars, FaChevronRight, FaCalendarAlt, FaBriefcase, FaUserTie, FaCog, FaArrowRight, FaCommentAlt, FaQuestionCircle, FaMagic, FaLightbulb } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

export default function Chatbot() {
    const { token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [showWelcomeBubble, setShowWelcomeBubble] = useState(true);
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

            if ('speechSynthesis' in window) {
                synthRef.current = window.speechSynthesis;
            }

            let sId = localStorage.getItem('chatbot_session_id');
            if (!sId) {
                sId = 'sess_' + Math.random().toString(36).substring(2, 15);
                localStorage.setItem('chatbot_session_id', sId);
            }
            setSessionId(sId);
        }
    }, []);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMsg = {
                role: 'assistant',
                content: "Hello! 👋 I'm your Luna AI support assistant. How can I help you today?",
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
        setInput('');
        setIsMenuOpen(false);
        await processChatMessage(action);
    };

    const processChatMessage = async (msgContent) => {
        const userMessage = { role: 'user', content: msgContent, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://jobportal-backend-ckuk.onrender.com';
            const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
            const res = await fetch(`${baseUrl}/api/ai/chat`, {
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
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm currently experiencing some technical difficulties. Please try again in a few moments.", timestamp: new Date() }]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickActions = [
        { label: "Career Guidance", sub: "Navigate your path", icon: "🛡️", bgColor: "#eef2ff" },
        { label: "Book Meeting", sub: "Schedule a talk", icon: "⚡", bgColor: "#fff7ed" },
        { label: "Job Search", sub: "Find opportunities", icon: "📞", bgColor: "#fdf2f8" },
        { label: "Luna Features", sub: "What's new?", icon: "🔑", bgColor: "#fefce8" }
    ];

    return (
        <div className="chatbot-root-container">
            {/* Widget (Visible when closed) */}
            {!isOpen && (
                <div id="chatbot-widget" className="chatbot-widget">
                    {showWelcomeBubble && (
                        <div id="welcome-bubble" className="chatbot-welcome-bubble">
                            <button id="close-welcome" className="chatbot-welcome-bubble-close" onClick={() => setShowWelcomeBubble(false)}>✕</button>
                            How can I help?
                        </div>
                    )}
                    <button id="toggle-chat" className="chatbot-button" onClick={() => setIsOpen(true)}>
                        <div className="icon-wrapper">
                            <img
                                src="/images/bot-icon.jpg"
                                alt="Chat"
                                className="floating-icon-img"
                                onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/2040/2040946.png' }}
                            />
                        </div>
                    </button>
                </div>
            )}

            {/* Chat Panel (Visible when open) */}
            <div id="chat-panel" className={`chat-panel ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="chat-header-wrapper">
                    <div className="chat-header">
                        <div className="left-section">
                            <div className="chat-header-avatar">
                                <FaRobot size={24} color="#1f80e0" />
                            </div>
                            <div className="title-section">
                                <h3>Luna AI</h3>
                                <p><span className="status-dot"></span> We're online!</p>
                            </div>
                        </div>
                        <div className="right-section">
                            <div className="header-lang-wrapper">
                                <button id="btn-lang" className="icon-btn" onClick={() => setIsLangOpen(!isLangOpen)}>
                                    <FaGlobe size={18} />
                                </button>
                                {isLangOpen && (
                                    <div id="language-menu" className={`siyanoav-language-menu ${isLangOpen ? 'show' : ''}`}>
                                        <div className="language-option active"><span className="language-flag">EN</span><span className="language-name">English</span></div>
                                        <div className="language-option"><span className="language-flag">HI</span><span className="language-name">हिंदी</span></div>
                                    </div>
                                )}
                            </div>
                            <div className="header-options-wrapper">
                                <button id="btn-options" className="icon-btn" onClick={() => setIsOptionsOpen(!isOptionsOpen)}>⋮</button>
                                {isOptionsOpen && (
                                    <div id="options-menu" className={`siyanoav-options-menu ${isOptionsOpen ? 'show' : ''}`}>
                                        <div className="option-item" onClick={() => { setMessages([]); setIsOptionsOpen(false); }}>
                                            <span className="option-icon">💬</span>
                                            <span className="option-text">New Chat</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button id="btn-close" className="icon-btn close-btn" onClick={() => setIsOpen(false)}>✕</button>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div id="chat-messages" className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message-row ${msg.role === 'assistant' ? 'bot' : 'user'}`}>
                            {msg.role === 'assistant' && (
                                <div className="avatar bot">
                                    <FaRobot size={18} color="#1f80e0" />
                                </div>
                            )}
                            <div className="message-content-group">
                                <div className="message-bubble-wrapper">
                                    <div className={`message ${msg.role === 'assistant' ? 'bot' : 'user'}`}>
                                        <span>{msg.content}</span>
                                        <span className="message-timestamp">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>

                                {msg.role === 'assistant' && idx === 0 && (
                                    <div className="intent-buttons-grid">
                                        <button className="intent-card-button" onClick={() => handleQuickAction("Download Luna AI")}><span className="intent-icon">⬇️</span>Download Luna AI</button>
                                        <button className="intent-card-button" onClick={() => handleQuickAction("Job Search")}><span className="intent-icon">🛡️</span>Job Search</button>
                                        <button className="intent-card-button" onClick={() => handleQuickAction("Luna Features")}><span className="intent-icon">⚡</span>View Features</button>
                                    </div>
                                )}

                                {msg.role === 'assistant' && (
                                    <div className="bot-feedback-actions">
                                        <button title="Helpful">👍</button>
                                        <button title="Not Helpful">👎</button>
                                        <button title="Copy">📋</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message-row bot">
                            <div className="avatar bot"><FaRobot size={18} color="#1f80e0" /></div>
                            <div className="message-content-group">
                                <div className="message-bubble-wrapper">
                                    <div className="message bot">
                                        <div className="typing-dots">
                                            <span></span><span></span><span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="chat-input-container">
                    <form id="chat-form" className="chat-input-pill" onSubmit={handleSubmit}>
                        <button type="button" id="btn-menu" className="menu-btn" onClick={() => setIsMenuOpen(true)}>☰</button>
                        <input
                            type="text"
                            id="chat-input"
                            className="chat-input-field"
                            placeholder="Type your message..."
                            autoComplete="off"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="button" id="btn-voice" className={`mic-btn ${isListening ? 'active' : ''}`} onClick={toggleVoiceMode}>
                            <FaMicrophone size={18} />
                        </button>
                        <button type="submit" id="btn-send" className="send-btn" disabled={!input.trim() || isLoading}>
                            <FaPaperPlane size={18} />
                        </button>
                    </form>
                    <div className="footer-branding">
                        Privacy & Policy | Powered By Luna AI
                    </div>
                </div>

                {/* ALL OVERLAYS AT THE END */}
                {isMenuOpen && (
                    <div id="menu-overlay" className={`siyanoav-menu-overlay ${isMenuOpen ? 'show' : ''}`}>
                        <div className="menu-header">
                            <h3>Menu</h3>
                            <button id="close-menu" className="close-menu-btn" onClick={() => setIsMenuOpen(false)}>✕</button>
                        </div>
                        <div className="menu-section">
                            <h4>QUICK ACTIONS</h4>
                            <div className="menu-grid">
                                {quickActions.slice(0, 2).map((action, idx) => (
                                    <div key={idx} className="menu-card" onClick={() => handleQuickAction(action.label)}>
                                        <div className="menu-icon">{action.icon}</div>
                                        <div className="menu-text">
                                            <span className="menu-title">{action.label}</span>
                                            <span className="menu-subtitle">{action.sub}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="menu-section">
                            <h4>SUPPORT & HELP</h4>
                            <div className="menu-grid">
                                {quickActions.slice(2).map((action, idx) => (
                                    <div key={idx} className="menu-card" onClick={() => handleQuickAction(action.label)}>
                                        <div className="menu-icon">{action.icon}</div>
                                        <div className="menu-text">
                                            <span className="menu-title">{action.label}</span>
                                            <span className="menu-subtitle">{action.sub}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Translation Overlay */}
                {isTranslating && (
                    <div id="translation-overlay" className="translation-loader-overlay">
                        <div className="translation-loader">
                            <div className="loader-spinner"></div>
                            <p>Translating...</p>
                        </div>
                    </div>
                )}

                {isVoiceMode && (
                    <div className={`siyanoav-voice-overlay ${isVoiceMode ? 'active' : ''}`}>
                        <div className="siyanoav-voice-header">
                            <button className="siyanoav-voice-back" onClick={() => setIsVoiceMode(false)}>
                                <FaChevronRight style={{ transform: 'rotate(180deg)' }} />
                            </button>
                            <span>Voice chat</span>
                            <button className="siyanoav-voice-menu">⋮</button>
                        </div>
                        <div className="siyanoav-voice-visualizer">
                            <div className="siyanoav-voice-status">{isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Tap mic to speak"}</div>
                            <div className={`siyanoav-voice-sphere ${isListening || isSpeaking ? 'listening' : ''}`}></div>
                            <div className="siyanoav-voice-subtitle">{input}</div>
                        </div>
                        <div className="siyanoav-voice-controls">
                            <button className="siyanoav-voice-btn secondary" onClick={() => setIsVoiceMode(false)}><FaCommentAlt /></button>
                            <button className={`siyanoav-voice-btn primary ${isListening ? 'active' : ''}`} onClick={() => isListening ? recognitionRef.current?.stop() : recognitionRef.current?.start()}>
                                {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                            </button>
                            <button className="siyanoav-voice-btn secondary" onClick={() => setIsVoiceMode(false)}><FaTimes /></button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                :root {
                  --primary-color: #007bff;
                  --header-bg: #007bff;
                  --bg-color: #ffffff;
                  --bot-msg-bg: #f3f4f6;
                  --user-msg-bg: #007bff;
                  --text-color: #333;
                }

                .chatbot-widget {
                  position: fixed;
                  bottom: 2rem;
                  right: 30px;
                  z-index: 1000;
                  font-family: 'Inter', system-ui, sans-serif;
                  background: #8169f1;
                  border-radius: 100px;
                  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
                }

                .chatbot-welcome-bubble {
                  position: absolute;
                  bottom: 95px;
                  right: 0;
                  background: white;
                  padding: 10px 15px 12px 11px;
                  border-radius: 9px;
                  border-bottom-right-radius: 4px;
                  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
                  width: 158px;
                  font-size: 16px;
                  line-height: 1.5;
                  color: #333;
                  animation: bubbleFadeIn 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28);
                  z-index: 1001;
                  pointer-events: auto;
                  border: 1px solid rgba(0, 0, 0, 0.05);
                }

                .chatbot-welcome-bubble::after {
                  content: '';
                  position: absolute;
                  bottom: -8px;
                  right: 30px;
                  border-width: 8px 8px 0;
                  border-style: solid;
                  border-color: white transparent transparent transparent;
                }

                .chatbot-welcome-bubble-close {
                  position: absolute;
                  top: 6px;
                  right: 6px;
                  background: #f0f0f0;
                  border: none;
                  border-radius: 50%;
                  width: 14px;
                  height: 14px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                  font-size: 10px;
                  color: #666;
                  transition: all 0.2s;
                }

                @keyframes bubbleFadeIn {
                  from { opacity: 0; transform: translateY(10px) scale(0.95); }
                  to { opacity: 1; transform: translateY(0) scale(1); }
                }

                .chatbot-button {
                  width: 80px;
                  height: 80px;
                  background-color: transparent;
                  border: none;
                  cursor: pointer;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  transition: transform 0.2s;
                  position: relative;
                  z-index: 1000;
                  padding: 0;
                  border-radius: 50%;
                }

                .icon-wrapper {
                  width: 65%;
                  height: 65%;
                  border-radius: 50%;
                  overflow: hidden;
                  position: relative;
                  z-index: 2;
                  background: white;
                  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }

                .chatbot-button::before,
                .chatbot-button::after {
                  content: '';
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                  transform: translate(-50%, -50%);
                  border: 4px solid #8169f1;
                  z-index: 1;
                  animation: waveRipple 2s infinite ease-out;
                }

                .chatbot-button::after { animation-delay: 0.8s; }

                .floating-icon-img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                  padding: 5px;
                }

                @keyframes waveRipple {
                  0% { width: 100%; height: 100%; opacity: 0.8; border-width: 3px; }
                  100% { width: 220%; height: 220%; opacity: 0; border-width: 0px; }
                }

                .chat-panel {
                  position: fixed;
                  bottom: 6rem;
                  right: 30px;
                  width: 380px;
                  height: 650px;
                  max-height: 80vh;
                  border-radius: 24px;
                  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                  display: flex;
                  flex-direction: column;
                  overflow: hidden;
                  font-family: 'Inter', system-ui, sans-serif;
                  opacity: 0;
                  transform: translateY(20px) scale(0.95);
                  pointer-events: none;
                  transition: all 0.3s ease;
                  background: white;
                  z-index: 2147483647;
                }

                .chat-panel.open {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                  pointer-events: all;
                }

                .chat-header-wrapper {
                  background: #1f80e0;
                  padding: 15px 20px;
                  color: white;
                  border-top-left-radius: 20px;
                  border-top-right-radius: 20px;
                  position: relative;
                  z-index: 10;
                  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
                }

                .chat-header { display: flex; justify-content: space-between; align-items: center; }
                .left-section { display: flex; align-items: center; gap: 12px; }
                .chat-header-avatar {
                  background: white;
                  width: 45px;
                  height: 45px;
                  border-radius: 50%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
                }
                .title-section h3 { margin: 0; font-size: 18px; font-weight: 600; }
                .title-section p { margin: 3px 0 0; font-size: 13px; color: #d2f5d2; display: flex; align-items: center; gap: 6px; }
                .status-dot { width: 8px; height: 8px; background: #00ff5e; border-radius: 50%; display: inline-block; }

                .siyanoav-language-menu {
                  display: none;
                  position: absolute;
                  top: 60px;
                  right: 20px;
                  background: #fff;
                  border-radius: 12px;
                  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                  width: 140px;
                  padding: 8px 0;
                  z-index: 100;
                  flex-direction: column;
                }
                .siyanoav-language-menu.show { display: flex; }
                .language-option { display: flex; align-items: center; gap: 10px; padding: 8px 12px; cursor: pointer; font-size: 14px; color: #333; }
                .language-option.active { background: #e6f0ff; color: #007bff; font-weight: 600; }

                .right-section { display: flex; gap: 8px; }
                .icon-btn { width: 35px; height: 35px; border-radius: 10px; border: none; background: whitesmoke; color: black; cursor: pointer; display: flex; justify-content: center; align-items: center; }

                .chat-messages {
                  flex: 1;
                  padding: 20px;
                  overflow-y: auto;
                  background: #f8f9fa;
                  display: flex;
                  flex-direction: column;
                  gap: 15px;
                }

                .message-row { display: flex; max-width: 100%; align-items: flex-end; }
                .message-row.user { justify-content: flex-end; }
                .avatar { width: 36px; height: 36px; flex-shrink: 0; border-radius: 50%; background: #fff; display: flex; justify-content: center; align-items: center; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
                .message-content-group { display: flex; flex-direction: column; max-width: 80%; gap: 4px; }
                .message { padding: 12px 12px 24px 12px; border-radius: 18px; font-size: 14px; line-height: 1.5; position: relative; word-wrap: break-word; min-width: 120px; }
                .message.bot { background-color: white; color: #333; border-top-left-radius: 4px; border: 1px solid #eef0f2; }
                .message.user { background-color: #007bff; color: white; border-top-right-radius: 4px; }
                .message-timestamp { position: absolute; bottom: 6px; right: 12px; font-size: 10px; color: #94a3b8; }
                .message.user .message-timestamp { color: rgba(255, 255, 255, 0.7); }

                .intent-buttons-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 15px; }
                .intent-card-button { background-color: white; color: #333; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 110px; transition: all 0.3s; }
                .intent-card-button:hover { transform: translateY(-4px); border-color: #007bff; color: #007bff; }
                .intent-icon { font-size: 24px; color: #007bff; background: #eef5ff; width: 45px; height: 45px; border-radius: 10px; display: flex; justify-content: center; align-items: center; }

                .bot-feedback-actions { display: flex; gap: 12px; margin-top: 4px; justify-content: flex-end; }
                .bot-feedback-actions button { background: none; border: none; cursor: pointer; color: #b0b8c4; }

                .chat-input-container { padding: 15px 20px 10px 20px; background: white; display: flex; flex-direction: column; gap: 8px; border-bottom-left-radius: 24px; border-bottom-right-radius: 24px; }
                .chat-input-pill { background: white; border: 2px solid #1f80e0; border-radius: 30px; display: flex; align-items: center; padding: 4px 6px 4px 15px; }
                .chat-input-field { flex: 1; background: none; border: none; outline: none; padding: 10px 0; font-size: 15px; }
                .send-btn { background: #1f80e0; border: none; border-radius: 50%; width: 40px; height: 40px; color: white; display: flex; justify-content: center; align-items: center; }
                .footer-branding { text-align: center; font-size: 11px; color: #94a3b8; }

                .siyanoav-menu-overlay { position: absolute; top: 60px; left: 0; right: 0; bottom: 0; background: #f0f4f8; z-index: 100; padding: 20px; display: flex; flex-direction: column; gap: 20px; }
                .menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                .menu-card { background: white; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; align-items: center; height: 110px; cursor: pointer; transition: all 0.3s; }
                .menu-card:hover { transform: translateY(-4px); border-color: #007bff; }
                .menu-icon { font-size: 24px; color: #007bff; background: #eef5ff; width: 45px; height: 45px; border-radius: 10px; display: flex; justify-content: center; align-items: center; }

                .siyanoav-voice-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, #1f80e0, #4facfe); z-index: 2000; display: none; flex-direction: column; color: white; border-radius: 24px; }
                .siyanoav-voice-overlay.active { display: flex; }
                .siyanoav-voice-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; }
                .siyanoav-voice-back, .siyanoav-voice-menu { background: rgba(255,255,255,0.1); border: none; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                .siyanoav-voice-visualizer { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 30px; }
                .siyanoav-voice-status { font-size: 18px; font-weight: 500; margin-bottom: 20px; opacity: 0.9; }
                .siyanoav-voice-sphere { width: 120px; height: 120px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; position: relative; }
                .siyanoav-voice-sphere.listening { animation: voiceRipple 2s infinite; }
                .siyanoav-voice-subtitle { font-size: 16px; margin-top: 30px; text-align: center; max-width: 80%; opacity: 0.8; height: 1.5em; overflow: hidden; }
                
                .siyanoav-voice-controls { display: flex; justify-content: center; align-items: center; gap: 30px; padding-bottom: 50px; }
                .siyanoav-voice-btn { border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .siyanoav-voice-btn.secondary { width: 50px; height: 50px; background: rgba(255,255,255,0.15); color: white; font-size: 18px; }
                .siyanoav-voice-btn.secondary:hover { background: rgba(255,255,255,0.25); transform: scale(1.05); }
                .siyanoav-voice-btn.primary { width: 80px; height: 80px; background: white; color: #1f80e0; font-size: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
                .siyanoav-voice-btn.primary:hover { transform: scale(1.1); box-shadow: 0 15px 35px rgba(0,0,0,0.3); }
                .siyanoav-voice-btn.primary.active { background: #ff4b2b; color: white; }
                
                @keyframes voiceRipple { 0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); } 100% { box-shadow: 0 0 0 40px rgba(255,255,255,0); } }

                .typing-dots { display: flex; gap: 5px; }
                .typing-dots span { width: 7px; height: 7px; background: #007bff; border-radius: 50%; animation: typing-bounce 1.3s infinite; }
                @keyframes typing-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

                .siyanoav-options-menu { display: none; position: absolute; top: 50px; right: 10px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 150px; padding: 5px 0; z-index: 100; }
                .siyanoav-options-menu.show { display: flex; flex-direction: column; }
            `}</style>
        </div>
    );
}
