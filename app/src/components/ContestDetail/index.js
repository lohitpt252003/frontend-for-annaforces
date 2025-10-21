import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';
import api from '../../utils/api'; // Import the new api utility
import { getCachedContestDetail, cacheContestDetail, clearContestDetailCache } from '../../components/cache/contest_detail';

import ProblemCard from '../../components/ProblemCard';
import ContestHeader from '../../components/ContestHeader';
import ContestTabs from '../../components/ContestTabs';
import ContestProblems from '../../components/ContestProblems';
import ContestDescription from '../../components/ContestDescription';
import ContestTheory from '../../components/ContestTheory';
import ContestLeaderboard from '../../components/ContestLeaderboard';
import ContestNotRegistered from '../../components/ContestNotRegistered';
import ContestNotStarted from '../../components/ContestNotStarted';

const ContestDetail = ({ theme }) => {
    const { contestId } = useParams();
    const [contest, setContest] = useState(null);
    const [error, setError] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [isLoadingLocal, setIsLoadingLocal] = useState(true);
    const [isCached, setIsCached] = useState(false);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [activeTab, setActiveTab] = useState('problems'); // Default to problems tab
    const [contestProblemsDetails, setContestProblemsDetails] = useState({});
    const [isLoadingContestProblems, setIsLoadingContestProblems] = useState(false);

    const [userProblemStatus, setUserProblemStatus] = useState({}); // New state for user problem status
    const [isRegistered, setIsRegistered] = useState(false); // New state for user registration status
    const [leaderboardData, setLeaderboardData] = useState(null); // New state for leaderboard data

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

    const handleRegister = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to register for the contest.');
            return;
        }

        try {
            setIsLoadingLocal(true);
            const response = await api.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/contests/${contestId}/register`,
                {},
                token
            );
            if (response && response.message) {
                toast.success(response.message);
                setIsRegistered(true);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to register for the contest.');
            console.error('Contest registration error:', err);
        } finally {
            setIsLoadingLocal(false);
        }
    };

    useEffect(() => {
        console.log("Fetching contest and registration status...");
        const fetchContestAndRegistrationStatus = async () => {
            const token = localStorage.getItem('token');
            const loggedUserId = localStorage.getItem('username');
            if (!token || !loggedUserId) {
                setError('No token or user ID found. Please log in.');
                return;
            }

            setIsLoadingLocal(true);

            const cachedContest = await getCachedContestDetail(contestId);
            if (cachedContest) {
                setContest(cachedContest);
                setIsCached(true);
                // Fetch registration status even if contest is cached
                try {
                    const registrationStatus = await api.get(
                        `${process.env.REACT_APP_API_BASE_URL}/api/contests/${contestId}/is-registered`,
                        token
                    );
                    if (registrationStatus) {
                        setIsRegistered(registrationStatus.is_registered);
                    }
                } catch (regError) {
                    console.error("Error fetching registration status:", regError);
                }
                setIsLoadingLocal(false);
                return;
            }

            try {
                const data = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/contests/${contestId}`, token);
                if (data.status === 'not_started') {
                    console.log("Contest not started yet.");
                    setInfoMessage(data.message);
                } else if (data.status === 'started') {
                    console.log("Contest started, data:", data.data);
                    setContest(data.data);
                    await cacheContestDetail(contestId, data.data);
                }

                // Fetch registration status after contest is fetched
                const registrationStatus = await api.get(
                    `${process.env.REACT_APP_API_BASE_URL}/api/contests/${contestId}/is-registered`,
                    token
                );
                if (registrationStatus) {
                    console.log("Registration status:", registrationStatus);
                    setIsRegistered(registrationStatus.is_registered);
                }

            } catch (err) {
                console.error("Error fetching contest details:", err);
                if (err.message.includes("404")) {
                    setError("The contest is not there.");
                } else {
                    setError(err.message || 'Network error or server is unreachable');
                }
            } finally {
                setIsLoadingLocal(false);
            }
        };

        fetchContestAndRegistrationStatus();
    }, [contestId]);

    useEffect(() => {
        console.log("Fetching contest problems and status...");
        const fetchContestProblemsAndStatus = async () => {
            if (!contest || !contest.problems || contest.problems.length === 0) {
                setContestProblemsDetails({});
                return;
            }

            setIsLoadingContestProblems(true);
            try {
                const token = localStorage.getItem('token');
                const loggedUserId = localStorage.getItem('username');

                const problemPromises = contest.problems.map(async (problemId) => {
                    try {
                        const problemData = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/contests/${contestId}/problems/${problemId}`, token);
                        return { [problemId]: { meta: problemData.meta } };
                    } catch (err) {
                        console.error(`Error fetching problem ${problemId}:`, err);
                        return { [problemId]: { meta: { title: 'Error loading problem', difficulty: 'N/A', tags: [], authors: [] }, error: true, message: err.message } };
                    }
                });

                const problemsResults = await Promise.all(problemPromises);
                const problemsDetails = Object.assign({}, ...problemsResults);
                setContestProblemsDetails(problemsDetails);

                // Fetch user problem status
                if (loggedUserId) {
                    try {
                        const statusData = await api.get(
                            `${process.env.REACT_APP_API_BASE_URL}/api/users/${loggedUserId}/problem-status`,
                            token
                        );
                        if (statusData) {
                            console.log("Fetched user problem status:", JSON.stringify(statusData, null, 2));
                            setUserProblemStatus(statusData);
                        }
                    } catch (statusError) {
                        console.error("Error fetching user problem status for contest problems:", statusError);
                    }
                }
            } finally {
                setIsLoadingContestProblems(false);
            }
        };

        fetchContestProblemsAndStatus();
    }, [contest]);

    useEffect(() => {
        console.log("Fetching leaderboard...");
        const fetchLeaderboard = async () => {
            if (activeTab === 'leaderboard' && contestId) {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found. Please log in.');
                    return;
                }
                try {
                    const data = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/contests/${contestId}/leaderboard`, token);
                    console.log("Fetched leaderboard data:", data);
                    setLeaderboardData(data);
                } catch (err) {
                    console.error("Error fetching leaderboard:", err);
                    setError(err.message || 'Failed to fetch leaderboard');
                }
            }
        };
        fetchLeaderboard();
    }, [activeTab, contestId]);

    if (error) {
        return <div className="contest-detail-error">Error: {error}</div>;
    }

    if (infoMessage) {
        return <div className="contest-detail-info-message">{infoMessage}</div>;
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

    if (!isRegistered && status !== "Over 🏁") {
        return (
            <ContestNotRegistered
                contest={contest}
                contestId={contestId}
                handleRegister={handleRegister}
            />
        );
    }

    if (isRegistered && status === "Upcoming ⏳") {
        return (
            <ContestNotStarted
                contest={contest}
                contestId={contestId}
                timeInfo={timeInfo}
            />
        );
    }

    return (
        <div className="contest-detail-container">
            <ContestHeader
                contest={contest}
                contestId={contestId}
                isCached={isCached}
                handleClearCache={handleClearCache}
                status={status}
                timeInfo={timeInfo}
                progress={progress}
                isRegistered={isRegistered}
                handleRegister={handleRegister}
            />
            <hr className="contest-detail-separator" />

            <ContestTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="contest-detail-tab-content">
                {activeTab === 'problems' && (
                    <ContestProblems
                        isLoadingContestProblems={isLoadingContestProblems}
                        contestProblemsDetails={contestProblemsDetails}
                        userProblemStatus={userProblemStatus}
                    />
                )}

                {activeTab === 'description' && (
                    <ContestDescription contest_description={contest.contest_description} />
                )}

                {activeTab === 'theory' && (
                    <ContestTheory contest_theory={contest.contest_theory} />
                )}

                {activeTab === 'leaderboard' && (
                    <ContestLeaderboard leaderboardData={leaderboardData} contest={contest} />
                )}
            </div>
        </div>
    );
};

export default ContestDetail;