import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { FaSearch, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

export default function CandidateSearch() {
    const { user } = useAuth();
    const router = useRouter();
    const [filters, setFilters] = useState({
        skills: '',
        location: '',
        min_experience: 0
    });
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);
        try {
            const token = localStorage.getItem('token');
            // Convert skills string to array
            const skillsArray = filters.skills.split(',').map(s => s.trim()).filter(Boolean);

            const response = await fetch('/api/recruiters/search/candidates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    skills: skillsArray.length > 0 ? skillsArray : undefined,
                    location: filters.location || undefined,
                    min_experience: Number(filters.min_experience) || undefined
                })
            });

            if (response.ok) {
                const data = await response.json();
                setCandidates(data);
            } else {
                alert('Failed to search candidates');
            }
        } catch (error) {
            console.error('Search error:', error);
            alert('An error occurred during search');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Find Candidates</h1>

                {/* Search Box */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Skills (comma separated)</label>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Java, React, Python..."
                                    className="w-full pl-10 border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                    value={filters.skills}
                                    onChange={e => setFilters({ ...filters, skills: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Location</label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Bangalore, Mumbai..."
                                    className="w-full pl-10 border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                    value={filters.location}
                                    onChange={e => setFilters({ ...filters, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Min Experience (Years)</label>
                            <div className="relative">
                                <FaBriefcase className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="w-full pl-10 border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                    value={filters.min_experience}
                                    onChange={e => setFilters({ ...filters, min_experience: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Searching...' : 'Search Candidates'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                {searched && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            {candidates.length} Candidate{candidates.length !== 1 ? 's' : ''} Found
                        </h2>

                        {candidates.length > 0 ? (
                            <div className="grid gap-6">
                                {candidates.map((cand) => (
                                    // Note: The API returns `JobSeekerProfile` objects, but we might want to mask names if we want to charge for contact info ("Resdex" style)
                                    // For now, displaying basic info.
                                    <div key={cand.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">{cand.user.full_name}</h3>
                                                <p className="text-gray-600 mb-2">{cand.resume_headline || cand.headline}</p>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                                                    <span><FaMapMarkerAlt className="inline mr-1" />{cand.personal_details?.current_location || 'Location not set'}</span>
                                                    {/* Add experience summary calculation if needed */}
                                                </div>

                                                <div className="mb-4">
                                                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Key Skills</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {cand.skills && cand.skills.map((skill, idx) => (
                                                            <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                                {typeof skill === 'string' ? skill : skill.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Employment Summary */}
                                                {cand.employment_history && cand.employment_history.length > 0 && (
                                                    <div className="mb-2">
                                                        <h4 className="font-semibold text-sm text-gray-700 mb-1">Latest Experience</h4>
                                                        <p className="text-sm">
                                                            {cand.employment_history[0].designation} at {cand.employment_history[0].company}
                                                        </p>
                                                    </div>
                                                )}

                                            </div>
                                            <div className="text-right">
                                                <button className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700">
                                                    View Profile
                                                </button>
                                                {/* Placeholder for "Unlock Contact" feature */}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-white rounded-lg">
                                <p className="text-gray-500">No candidates found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
