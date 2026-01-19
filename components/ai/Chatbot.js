import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaRobot, FaPaperPlane, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function Chatbot() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showQuickButtons, setShowQuickButtons] = useState(true);
    const messagesEndRef = useRef(null);

    // Get context-aware quick buttons based on current page
    const getContextualQuickButtons = () => {
        const pathname = router.pathname;
        
        if (pathname.includes('/jobs') || pathname === '/') {
            return [
                { label: 'Find Remote Jobs', prompt: 'Help me find remote job opportunities' },
                { label: 'Salary Insights', prompt: 'What are typical salaries for software engineers?' },
                { label: 'Job Application Tips', prompt: 'Give me tips for applying to jobs' },
                { label: 'Career Growth', prompt: 'How can I grow my career?' }
            ];
        } else if (pathname.includes('/resume') || pathname.includes('/profile')) {
            return [
                { label: 'Resume Review', prompt: 'Review my resume and give feedback' },
                { label: 'Cover Letter Help', prompt: 'Help me write a cover letter' },
                { label: 'Skills Optimization', prompt: 'How can I improve my resume skills section?' },
                { label: 'ATS Tips', prompt: 'What makes a resume ATS-friendly?' }
            ];
        } else if (pathname.includes('/ai') || pathname.includes('/ai-demo')) {
            return [
                { label: 'AI Capabilities', prompt: 'What can you help me with?' },
                { label: 'Job Matching', prompt: 'How does AI job matching work?' },
                { label: 'Interview Prep', prompt: 'Help me prepare for interviews with AI' },
                { label: 'Skill Assessment', prompt: 'How can AI assess my skills?' }
            ];
        } else if (pathname.includes('/companies')) {
            return [
                { label: 'Top Companies', prompt: 'Which companies are hiring now?' },
                { label: 'Company Research', prompt: 'How should I research companies?' },
                { label: 'Industry Trends', prompt: 'What are current industry trends?' },
                { label: 'Company Culture', prompt: 'How can I assess company culture?' }
            ];
        } else {
            // Default buttons for other pages
            return [
                { label: 'Career Guidance', prompt: 'Give me career advice' },
                { label: 'Job Search Tips', prompt: 'Help me with job searching' },
                { label: 'Skill Development', prompt: 'What skills should I develop?' },
                { label: 'Interview Prep', prompt: 'Prepare me for interviews' }
            ];
        }
    };

    // Initialize with welcome message when chat opens
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setTimeout(() => {
                setMessages([
                    {
                        role: 'assistant',
                        content: "Hello! I'm your Learning Assistant. I'm here to help with career guidance, learning resources, and job search tips. How can I assist you today?",
                        timestamp: new Date()
                    }
                ]);
            }, 300);
        }
    }, [isOpen, messages.length, router.pathname]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleQuickAction = (prompt) => {
        setInput(prompt);
        setShowQuickButtons(false);
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
        setShowQuickButtons(false);
        setIsLoading(true);

        try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://jobportal-backend-2-i07w.onrender.com'}/api/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any additional headers if needed
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: messages.filter(msg => msg.role === 'user' || msg.role === 'assistant').map(msg => ({
                        role: msg.role,
                        content: msg.content
                    }))
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                // Try to get error details from response
                let errorMessage = 'Failed to get response';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.detail || errorData.message || errorMessage;
                } catch (e) {
                    // If we can't parse the error, use status text
                    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            
            // Handle different possible response formats
            let assistantResponse = '';
            if (data && typeof data === 'object') {
                if (data.response) {
                    assistantResponse = data.response;
                } else if (data.message) {
                    assistantResponse = data.message;
                } else if (data.answer) {
                    assistantResponse = data.answer;
                } else {
                    // If the entire response is meant to be the message
                    assistantResponse = JSON.stringify(data);
                }
            } else {
                // If the response is a string directly
                assistantResponse = data || 'No response received';
            }
            
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: assistantResponse,
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            
            // Check for specific error types and provide appropriate messages
            let errorMessage = "I apologize, but I'm having trouble connecting right now. Please try again later.";
            
            if (error.name === 'AbortError') {
                errorMessage = "The request timed out. The server took too long to respond. Please try again.";
            } else if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
                errorMessage = "Unable to connect to the AI service. Please check your internet connection and try again.";
            } else if (error.message.includes('429')) {
                errorMessage = "Too many requests. Please wait a moment before trying again.";
            }
            
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorMessage,
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Public chatbot - no authentication required
    return (
        <>
            {/* Floating Chat Icon - Positioned absolutely to not affect layout */}
            <div className="fixed bottom-6 right-6 z-50 font-sans pointer-events-none" style={{
                display: "flex",
                justifyContent: "right",
                position: "sticky",
                margin: "25px"

            }}
               
            

                 ><div className="pointer-events-auto">
                    {!isOpen ? (
                        <button
                            onClick={() => setIsOpen(true)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center w-14 h-14 group"
                            aria-label="Open chatbot"
                        >
                            <FaRobot className="text-xl" />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                !
                            </span>
                        </button>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-2xl w-80 max-w-[90vw] flex flex-col overflow-hidden border border-gray-200 shadow-xl" style={{ height: '450px' }}>
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-2 rounded-full">
                                        <FaRobot size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Learning Assistant</h3>
                                        <div className="flex items-center gap-2 text-xs opacity-90">
                                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                            <span>Online now</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="hover:bg-white/20 p-1.5 rounded-full transition-colors text-white hover:text-white"
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
                                            className={`max-w-[80%] rounded-2xl p-3 px-4 shadow-sm ${
                                                msg.role === 'user'
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                                                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
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
                                
                                {/* Contextual Quick Action Buttons */}
                                {showQuickButtons && messages.length === 1 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-xs text-gray-500 text-center mb-2">Quick questions:</p>
                                        {getContextualQuickButtons().map((button, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleQuickAction(button.prompt)}
                                                className="block w-full text-left bg-white border border-gray-200 rounded-lg p-2 text-sm hover:bg-blue-50 hover:border-blue-300 transition-colors mb-1 last:mb-0"
                                            >
                                                {button.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-gray-200">
                                <form onSubmit={handleSubmit} className="flex gap-2 items-center bg-gray-100 p-2 rounded-full border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-transparent border-none px-4 py-2 text-sm focus:outline-none text-gray-700 placeholder-gray-500 flex-grow"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || isLoading}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-full hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 w-9 h-9 flex items-center justify-center shadow-sm"
                                        aria-label="Send message"
                                    >
                                        <FaPaperPlane size={12} className="ml-0.5" />
                                    </button>
                                </form>
                                <div className="text-center mt-2">
                                    <p className="text-[10px] text-gray-400">
                                        Powered by <span className="font-semibold text-gray-500">AI Learning Platform</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}