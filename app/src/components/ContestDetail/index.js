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
import ContestNotRegistered from '../../components/ContestNotRegistered';
import ContestNotStarted from '../../components/ContestNotStarted';

const ContestDetail = ({ theme }) => {
    const { contestId } = useParams();
    const [contest, setContest] = useState(null);
    const [error, setError] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [isLoadingLocal, setIsLoadingLocal] = useState(true);
    const [isCached, setIsCached] = useState(false);

    const [activeTab, setActiveTab] = useState('problems'); // Default to problems tab
    const [contestProblemsDetails, setContestProblemsDetails] = useState({});
    const [isLoadingContestProblems, setIsLoadingContestProblems] = useState(false);

    const [userProblemStatus, setUserProblemStatus] = useState({}); // New state for user problem status




    const handleClearCache = async () => {
        await clearContestDetailCache(contestId);
        window.location.reload();
    };



    useEffect(() => {
        const fetchContestData = async () => {
            console.log('Fetching data for contest:', contestId);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found. Please log in.');
                return;
            }
            console.log('Token:', token);

            setIsLoadingLocal(true);

            const cachedContest = await getCachedContestDetail(contestId);
            console.log('Cached contest:', cachedContest);
            if (cachedContest) {
                setContest(cachedContest);
                setIsCached(true);

                setIsLoadingLocal(false);
                return;
            }

            try {
                const contestData = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/contests/${contestId}`, token);

                console.log('Contest data response:', contestData);

                setContest(contestData);
                await cacheContestDetail(contestId, contestData);

            } catch (err) {
                console.error("Error fetching contest details:", err);
                console.error("Error object:", JSON.stringify(err, null, 2));
                setError(`Failed to fetch for ${contestId}`);
            } finally {
                setIsLoadingLocal(false);
            }
        };

        fetchContestData();
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
                        const problemData = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/problems/${problemId}/meta`, token);
                        return { [problemId]: { meta: problemData } };
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

    const { status, timeInfo, progress } = contest.status_info;



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
            </div>
        </div>
    );
};

export default ContestDetail;