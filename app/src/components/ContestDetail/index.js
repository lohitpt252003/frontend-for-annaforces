import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';
import api from '../../utils/api'; // Import the new api utility
import { getCachedContestDetail, cacheContestDetail, clearContestDetailCache } from '../../components/cache/contest_detail';
import { getCachedProblemDetail, cacheProblemDetail } from '../../components/cache/problem_detail';

const ContestDetail = ({ theme }) => {
    const { contestId } = useParams();
    const [contest, setContest] = useState(null);
    const [error, setError] = useState('');
    const [isLoadingLocal, setIsLoadingLocal] = useState(true);
    const [isCached, setIsCached] = useState(false);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [activeTab, setActiveTab] = useState('problems'); // Default to problems tab
    const [contestProblemsDetails, setContestProblemsDetails] = useState({});
    const [isLoadingContestProblems, setIsLoadingContestProblems] = useState(false);
    const [userProblemStatus, setUserProblemStatus] = useState({}); // New state for user problem status

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleClearCache = async () => {
        await clearContestDetailCache(contestId);
        window.location.reload();
    };

    useEffect(() => {
        const fetchContest = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found. Please log in.');
                return;
            }

            setIsLoadingLocal(true);

            const cachedContest = await getCachedContestDetail(contestId);
            if (cachedContest) {
                setContest(cachedContest);
                setIsCached(true);
                setIsLoadingLocal(false);
                return;
            }

            try {
                const data = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/contests/${contestId}`, token);
                setContest(data);
                await cacheContestDetail(contestId, data);
            } catch (err) {
                if (err.message.includes("404")) {
                    setError("The contest is not there.");
                } else {
                    setError(err.message || 'Network error or server is unreachable');
                }
            }
            finally {
                setIsLoadingLocal(false);
            }
        };

        fetchContest();
    }, [contestId]);

    useEffect(() => {
        const fetchContestProblemsAndStatus = async () => {
            if (!contest || !contest.problems || contest.problems.length === 0) {
                setContestProblemsDetails({});
                return;
            }

            setIsLoadingContestProblems(true);
            const token = localStorage.getItem('token');
            const loggedUserId = localStorage.getItem('user_id');

            const problemsDetails = {};

            for (const problemId of contest.problems) {
                const cachedProblem = await getCachedProblemDetail(problemId);
                if (cachedProblem) {
                    problemsDetails[problemId] = cachedProblem;
                } else {
                    try {
                        const data = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/problems/${problemId}`, token);
                        problemsDetails[problemId] = data;
                        await cacheProblemDetail(problemId, data);
                    } catch (err) {
                        console.error(`Error fetching details for problem ${problemId}:`, err);
                        problemsDetails[problemId] = { error: true, message: err.message };
                    }
                }
            }
            setContestProblemsDetails(problemsDetails);

            // Fetch user problem status
            if (loggedUserId) {
                try {
                    const statusData = await api.get(
                        `${process.env.REACT_APP_API_BASE_URL}/api/users/${loggedUserId}/problem-status`,
                        token
                    );
                    if (statusData) {
                        setUserProblemStatus(statusData);
                    }
                } catch (statusError) {
                    console.error("Error fetching user problem status for contest problems:", statusError);
                }
            }

            setIsLoadingContestProblems(false);
        };

        fetchContestProblemsAndStatus();
    }, [contest]);

    if (error) {
        return <div className="contest-detail-error">Error: {error}</div>;
    }

    if (isLoadingLocal) {
        return <div className="contest-detail-loading">Loading contest details...</div>;
    }

    if (!contest) {
        return <div className="contest-detail-not-found">Contest not found.</div>;
    }

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

    const { status, timeInfo, progress } = getContestStatus(contest);

    return (
        <div className="contest-detail-container">
            <h2 className="contest-detail-title">{contest.name} ({contestId}) 🏆</h2>
            {isCached && (
                <div className="cache-notification">
                    <p>This contest is being displayed from the cache. <button onClick={handleClearCache}>Clear Cache</button> to see the latest updates.</p>
                </div>
            )}
            <div className="contest-detail-header-content">
                <div className="contest-detail-info">
                    <p><strong>Status:</strong> {status}</p>
                    {timeInfo && <p>{timeInfo}</p>}
                    {status === "Running 🚀" && (
                        <div className="contest-progress-bar-container">
                            <div className="contest-progress-bar" style={{ width: `${progress}%` }}></div>
                        </div>
                    )}
                    <p><strong>Authors:</strong> ✍️ {contest.authors.join(', ')}</p>
                    <p><strong>Start Time:</strong> 🗓️ {new Date(contest.startTime).toLocaleString()}</p>
                    <p><strong>End Time:</strong> 🏁 {new Date(contest.endTime).toLocaleString()}</p>
                </div>
                <div className="contest-detail-actions">
                    {/* Add action links relevant to contests, e.g., Register, View Leaderboard */}
                    <Link to={`/contests/${contestId}/problems`} className="contest-detail-link-button contest-detail-view-problems-button">
                        View Problems 📋
                    </Link>
                </div>
            </div>
            <hr className="contest-detail-separator" />

            <div className="contest-detail-tabs">
                <button
                    className={`contest-detail-tab-button ${activeTab === 'problems' ? 'active' : ''}`}
                    onClick={() => setActiveTab('problems')}
                >
                    Problems 🧩
                </button>
                <button
                    className={`contest-detail-tab-button ${activeTab === 'description' ? 'active' : ''}`}
                    onClick={() => setActiveTab('description')}
                >
                    Description 📝
                </button>
                <button
                    className={`contest-detail-tab-button ${activeTab === 'theory' ? 'active' : ''}`}
                    onClick={() => setActiveTab('theory')}
                >
                    Theory 🧠
                </button>
            </div>

            <div className="contest-detail-tab-content">
                {activeTab === 'problems' && (
                    <div className="contest-detail-section">
                        <h3>Problems in this Contest 🧩</h3>
                        {isLoadingContestProblems ? (
                            <p className="contest-problems-loading">Loading problems...</p>
                        ) : Object.keys(contestProblemsDetails).length === 0 ? (
                            <p className="contest-problems-no-problems">No problems available for this contest.</p>
                        ) : (
                            <ul className="contest-problems-list">
                                {Object.entries(contestProblemsDetails).map(([problemId, problemData]) => (
                                    <li key={problemId} className="contest-problems-list-item">
                                        {problemData.error ? (
                                            <p className="contest-problem-error">Error loading {problemId}: {problemData.message}</p>
                                        ) : (
                                            <>
                                                <Link to={`/problems/${problemId}`} className="contest-problems-list-item-link">
                                                    <h3>{problemData.meta.title} ({problemId})</h3>
                                                </Link>
                                                <Link to={`/problems/${problemId}/submit`} className="contest-problems-link-button contest-problems-submit-button">
                                                    Submit Code ✏️
                                                </Link>
                                                <Link to={`/problems/${problemId}/submissions`} className="contest-problems-link-button contest-problems-view-submissions-button">
                                                    View Submissions 📋
                                                </Link>
                                                <p><strong>Difficulty:</strong> ⭐ {problemData.meta.difficulty}</p>
                                                <p><strong>Tags:</strong> 🏷️ {problemData.meta.tags.join(', ')}</p>
                                                <p><strong>Authors:</strong> ✍️ {problemData.meta.authors.join(', ')}</p>
                                                <p><strong>Status:</strong>
                                                    {userProblemStatus[problemId] === 'solved' && <span style={{ color: 'green', fontWeight: 'bold' }}> ✅ Solved</span>}
                                                    {userProblemStatus[problemId] === 'not_solved' && <span style={{ color: 'orange', fontWeight: 'bold' }}> ❌ Not Solved</span>}
                                                    {(!userProblemStatus[problemId] || userProblemStatus[problemId] === 'not_attempted') && <span style={{ color: 'gray' }}> ❓ Not Attempted</span>}
                                                </p>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {activeTab === 'description' && (
                    <div className="contest-detail-section">
                        <h3>Description 📝</h3>
                        <ReactMarkdown
                    components={{
                        // Custom component to prevent <p> tags from wrapping <div>s (e.g., from BlockMath)
                        p: ({ children }) => {
                            if (children && children[0] && children[0].props && children[0].props.node && children[0].props.node.tagName === 'div') {
                                return children;
                            }
                            return <p>{children}</p>;
                        },
                    }}
                >{contest.contest_description}</ReactMarkdown>
                    </div>
                )}

                {activeTab === 'theory' && (
                    <div className="contest-detail-section">
                        <h3>Theory Behind the Contest 🧠</h3>
                        <ReactMarkdown
                    components={{
                        // Custom component to prevent <p> tags from wrapping <div>s (e.g., from BlockMath)
                        p: ({ children }) => {
                            if (children && children[0] && children[0].props && children[0].props.node && children[0].props.node.tagName === 'div') {
                                return children;
                            }
                            return <p>{children}</p>;
                        },
                    }}
                >{contest.contest_theory}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContestDetail;