import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { FaChartBar, FaRobot, FaSearch, FaHistory, FaLightbulb, FaArrowLeft, FaComments, FaCalendar, FaEllipsisV } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function KnowledgeBase() {
    const router = useRouter();
    const { user, token } = useAuth();
    const [knowledge, setKnowledge] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchKnowledge = async () => {
            try {
                const data = await api.request('/api/ai/knowledge-base');
                setKnowledge(data);
            } catch (error) {
                console.error('Error fetching knowledge base:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchKnowledge();
    }, [token, router]);

    const filteredKnowledge = knowledge.filter(item =>
        item.intent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"
                    >
                        <FaArrowLeft className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Chat Knowledge Base</h1>
                        <p className="text-gray-600">Personalized insights and intents distilled from your AI interactions.</p>
                    </div>
                </div>

                {/* Search & Stats Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="lg:col-span-3">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search intents or messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-pink-500 transition-all text-lg"
                            />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                            <FaLightbulb className="text-pink-200" />
                            <span className="font-medium">Total Insights</span>
                        </div>
                        <div className="text-4xl font-bold">{knowledge.length}</div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                    </div>
                ) : filteredKnowledge.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredKnowledge.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-4 py-1.5 rounded-full text-sm font-semibold 
                    ${item.intent === 'Job Search' ? 'bg-blue-50 text-blue-600' :
                                            item.intent === 'Resume Advice' ? 'bg-green-50 text-green-600' :
                                                item.intent === 'Interview Prep' ? 'bg-purple-50 text-purple-600' :
                                                    'bg-pink-50 text-pink-600'}`}
                                    >
                                        {item.intent}
                                    </div>
                                    <div className="text-gray-400 group-hover:text-pink-500 transition-colors">
                                        <FaHistory />
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <p className="text-gray-800 text-lg leading-relaxed mb-4">
                                        "{item.content.length > 120 ? item.content.substring(0, 120) + '...' : item.content}"
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-50 mt-auto">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <FaCalendar className="text-pink-400" />
                                            {formatDate(item.created_at)}
                                        </div>
                                        <button
                                            onClick={() => router.push('/chatbot')}
                                            className="text-pink-600 font-semibold text-sm hover:underline flex items-center gap-1"
                                        >
                                            Revisit <FaComments className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-50 rounded-full mb-6 text-pink-500">
                            <FaRobot size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No insights discovered yet</h3>
                        <p className="text-gray-600 max-w-md mx-auto mb-8">Start chatting with our AI Career Advisor to build your personalized knowledge base.</p>
                        <button
                            onClick={() => router.push('/chatbot')}
                            className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
                        >
                            Start Chatting
                        </button>
                    </div>
                )}
            </main>

            <Footer />

            <style jsx>{`
        .container {
          max-width: 1200px;
        }
      `}</style>
        </div>
    );
}
