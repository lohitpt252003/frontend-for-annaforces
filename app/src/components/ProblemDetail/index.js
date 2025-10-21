import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { InlineMath, BlockMath } from 'react-katex'; // Import KaTeX components
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { toast } from 'react-toastify';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';
import SampleCases from '../SampleCases';
import ProblemHeader from '../ProblemHeader';
import ProblemStatement from '../ProblemStatement';
import ProblemInputFormat from '../ProblemInputFormat';
import ProblemOutputFormat from '../ProblemOutputFormat';
import ProblemConstraints from '../ProblemConstraints';
import ProblemNotes from '../ProblemNotes';
import ProblemDetailActions from '../ProblemDetailActions';
import api from '../../utils/api'; // Import the new api utility
import { getCachedProblemDetail, cacheProblemDetail, clearProblemDetailCache } from '../../components/cache/problem_detail';

function ProblemDetail() { // Accept setIsLoading prop
  const { problem_id } = useParams();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);
  const [isCached, setIsCached] = useState(false);

  const handleClearCache = async () => {
    await clearProblemDetailCache(problem_id);
    window.location.reload();
  };

  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const handleViewPdf = async () => {
    if (isPdfLoading) return; // Prevent multiple clicks

    setIsPdfLoading(true);
    toast.info("Fetching PDF statement...");
    const token = localStorage.getItem('token');
    try {
      const data = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/problems/${problem_id}/statement.pdf`, token);
      if (data.pdf_data) {
        const byteCharacters = atob(data.pdf_data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'application/pdf'});
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        toast.success("PDF opened in a new tab!");
      } else {
        toast.warn("No PDF data found in the response.");
      }
    } catch (err) {
      if (err.message.includes("not found")) {
        toast.error('PDF statement not uploaded yet.');
      } else {
        toast.error('Failed to load PDF statement.');
      }
    } finally {
      setIsPdfLoading(false);
    }
  };

  useEffect(() => {
    const fetchProblem = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      setIsLoadingLocal(true);

      const cachedProblem = await getCachedProblemDetail(problem_id);
      if (cachedProblem) {
        setProblem(cachedProblem);
        setIsCached(true);
        setIsLoadingLocal(false);
        return;
      }

      try {
        const data = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/problems/${problem_id}`, token);
        if (data.status === 'not_started') {
            setInfoMessage(data.message);
            setProblem(null); // Reset problem state
        } else if (data.status === 'started') {
            setProblem(data.data);
            await cacheProblemDetail(problem_id, data.data);
        }
      } catch (err) {
        if (err.message.includes("404")) {
            setError("The problem is not there.");
        } else {
            setError(err.message || 'Network error or server is unreachable');
        }
      } finally {
        setIsLoadingLocal(false);
      }
    };

    fetchProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem_id]);

  if (error) {
    return <div className="problem-detail-error">Error: {error}</div>;
  }

  if (infoMessage) {
    console.log("Rendering infoMessage:", infoMessage);
    return <div className="problem-detail-info-message">{infoMessage}</div>;
  }

  if (isLoadingLocal) {
    return <div className="problem-detail-loading">Loading problem details...</div>;
  }

  if (!problem) {
    console.log("Problem is null, rendering Problem not found.");
    return <div className="problem-detail-not-found">Problem not found.</div>;
  }

  console.log("Rendering ProblemDetail with problem:", problem);

  return (
    <div className="problem-detail-container">
      <ProblemHeader
        problem={problem}
        problem_id={problem_id}
        isCached={isCached}
        handleClearCache={handleClearCache}
      />
      <hr className="problem-detail-separator" />
      <div className="problem-detail-body">
        <ProblemStatement description_content={problem.description_content} />

        <ProblemInputFormat input_content={problem.input_content} />

        <ProblemOutputFormat output_content={problem.output_content} />

        <ProblemConstraints constraints_content={problem.constraints_content} />

        <SampleCases samples_data={problem.samples_data} />

        <ProblemNotes notes_content={problem.notes_content} />
      </div>
      <ProblemDetailActions
        problem_id={problem_id}
        problem={problem}
        handleViewPdf={handleViewPdf}
        isPdfLoading={isPdfLoading}
      />
    </div>
  );
}

export default ProblemDetail;
