import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import './light.css';
import './dark.css';
import api from '../../utils/api';
import { getCachedContests, cacheContests, clearContestsCache } from '../../components/cache/contests_list';

const Contests = ({ theme }) => {
    const [allContests, setAllContests] = useState([]);
    const [contests, setContests] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAuthor, setFilterAuthor] = useState('');
    const [isLoadingLocal, setIsLoadingLocal] = useState(true);
    const [isCached, setIsCached] = useState(false);
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleClearCache = () => {
        clearContestsCache();
        window.location.reload();
    };

    useEffect(() => {
        const fetchContests = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found. Please log in.');
                return;
            }

            setIsLoadingLocal(true);

            const cachedContests = getCachedContests();
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
                    cacheContests({ allContests: data });
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

    if (error) {
        return <div className="contests-error">Error: {error}</div>;
    }

    const authors = allContests ? [...new Set(allContests.flatMap(c => c.authors))] : [];

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
                <ul className="contests-list">
                    {contests.map(contest => {
                        const { status, timeInfo, progress } = getContestStatus(contest);
                        return (
                            <li key={contest.id} className="contests-list-item">
                                <Link to={`/contests/${contest.id}`} className="contests-list-item-link">
                                    <h3>{contest.name} ({contest.id})</h3>
                                </Link>
                                <p><strong>Status:</strong> {status}</p>
                                {timeInfo && <p>{timeInfo}</p>}
                                {status === "Running 🚀" && (
                                    <div className="contest-progress-bar-container">
                                        <div className="contest-progress-bar" style={{ width: `${progress}%` }}></div>
                                    </div>
                                )}
                                <p><strong>Description:</strong> {contest.description}</p>
                                <p><strong>Authors:</strong> ✍️ {contest.authors.join(', ')}</p>
                                <p><strong>Start Time:</strong> 🗓️ {new Date(contest.startTime).toLocaleString()}</p>
                                <p><strong>End Time:</strong> 🏁 {new Date(contest.endTime).toLocaleString()}</p>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default Contests;
