import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './index.css';
import './light.css';
import './dark.css';
import { getContests } from '../../utils/api.js';
import { getCachedContests, cacheContests } from '../../components/cache/contests_list.js';
import ContestCard from '../ContestCard/index.js';

const Contests = ({ theme }) => {
    const [allContests, setAllContests] = useState([]);
    const [contests, setContests] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAuthor, setFilterAuthor] = useState('');
    const [isLoadingLocal, setIsLoadingLocal] = useState(true);
    const [isCached, setIsCached] = useState(false);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [userRegistrations, setUserRegistrations] = useState({}); // New state for user registrations

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getContestStatus = (contest) => {
        const start = new Date(contest.startTime).getTime();
        const end = new Date(contest.endTime).getTime();
        const now = currentTime;

        if (now < start) {
            const diff = start - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            return {
                status: "Upcoming ⏳",
                timeInfo: `Starts in: ${days}d ${hours}h ${minutes}m ${seconds}s`,
                progress: 0
            };
        } else if (now >= start && now <= end) {
            const totalDuration = end - start;
            const elapsed = now - start;
            const remaining = end - now;
            const progress = (elapsed / totalDuration) * 100;

            const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            return {
                status: "Running 🚀",
                timeInfo: `Ends in: ${days}d ${hours}h ${minutes}m ${seconds}s`,
                progress: progress
            };
        } else {
            return {
                status: "Over 🏁",
                timeInfo: "",
                progress: 100
            };
        }
    };

    useEffect(() => {
        const fetchContests = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found. Please log in.');
                return;
            }

            setIsLoadingLocal(true);

            const cachedContests = await getCachedContests();
            if (cachedContests) {
                setAllContests(cachedContests.allContests);
                setContests(cachedContests.allContests);
                setIsCached(true);
                setIsLoadingLocal(false);
                return;
            }

            try {
                const data = await api.get(
                    `${process.env.REACT_APP_API_BASE_URL}/api/contests/`,
                    token
                );

                if (Array.isArray(data)) {
                    
                    setAllContests(data);
                    setContests(data);
                    await cacheContests({ allContests: data });
                } else {
                    setError(data.error || 'Failed to fetch contests');
                }
            } catch (err) {
                setError(err.message || 'Network error or server is unreachable');
                console.error('Fetch contests error:', err);
            } finally {
                setIsLoadingLocal(false);
            }
        };

        fetchContests();
    }, []);

    useEffect(() => {
        const fetchUserRegistrations = async () => {
            const token = localStorage.getItem('token');
            if (!token || allContests.length === 0) {
                return;
            }

            const registrations = {};
            for (const contest of allContests) {
                try {
                    const response = await api.get(
                        `${process.env.REACT_APP_API_BASE_URL}/api/contests/${contest.id}/is-registered`,
                        token
                    );
                    registrations[contest.id] = response.is_registered;
                } catch (err) {
                    console.error(`Error fetching registration status for contest ${contest.id}:`, err);
                    registrations[contest.id] = false; // Assume not registered on error
                }
            }
            setUserRegistrations(registrations);
        };

        fetchUserRegistrations();
    }, [allContests]);

    useEffect(() => {
        let filtered = [...allContests];

        if (searchTerm) {
            filtered = filtered.filter(contest =>
                contest.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contest.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterAuthor) {
            filtered = filtered.filter(contest =>
                contest.authors.some(author => author.toLowerCase().includes(filterAuthor.toLowerCase()))
            );
        }

        setContests(filtered);
    }, [allContests, searchTerm, filterAuthor]);

    const handleClearCache = async () => {
        await clearContestsCache();
        window.location.reload();
    };

    const handleRegister = async (contestId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to register for the contest.');
            return;
        }

        try {
            // Optimistically update UI
            setUserRegistrations(prev => ({ ...prev, [contestId]: true }));
            toast.info('Registering for contest...');

            const response = await api.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/contests/${contestId}/register`,
                {},
                token
            );
            if (response && response.message) {
                toast.success(response.message);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to register for the contest.');
            console.error('Contest registration error:', err);
            // Revert optimistic update on error
            setUserRegistrations(prev => ({ ...prev, [contestId]: false }));
        }
    };

    if (error) {
        return <div className="contests-error">Error: {error}</div>;
    }

    const authors = allContests ? [...new Set(allContests.flatMap(c => c.authors))] : [];

    return (
        <div className="contests-container">
            <h2>Contests 🏆</h2>
            {isCached && (
                <div className="cache-notification">
                    <p>This list is being displayed from the cache. <button onClick={handleClearCache}>Clear Cache</button> to see the latest updates.</p>
                </div>
            )}
            <div className="contests-filters">
                <input
                    type="text"
                    placeholder="Search by name or ID... 🔍"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="contests-filter-input"
                />
                <select
                    value={filterAuthor}
                    onChange={(e) => setFilterAuthor(e.target.value)}
                    className="contests-filter-select"
                >
                    <option value="">All Authors ✍️</option>
                    {authors.map(author => <option key={author} value={author}>{author}</option>)}
                </select>
            </div>
            {isLoadingLocal ? (
                <p className="contests-loading">Loading contests...</p>
            ) : contests.length === 0 ? (
                <p className="contests-no-contests">No contests available.</p>
            ) : (
                <div className="contest-card-container">
                    {contests.map(contest => (
                        <ContestCard
                            key={contest.id}
                            contest={contest}
                            contestStatus={getContestStatus(contest)}
                            isRegistered={userRegistrations[contest.id] || false}
                            onRegister={handleRegister}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Contests;