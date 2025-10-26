import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './index.css';
import './light.css';
import './dark.css';
import api from '../../utils/api';
import { getCachedContests, cacheContests, clearContestsCache } from '../../components/cache/contests_list';
import ContestCard from '../ContestCard';

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
                            contestStatus={contest.status_info}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Contests;