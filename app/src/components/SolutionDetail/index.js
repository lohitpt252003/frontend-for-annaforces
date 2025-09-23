import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import { InlineMath, BlockMath } from 'react-katex'; // Import KaTeX components
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { toast } from 'react-toastify';
import './index.css'; // For component-specific styles
import './light.css'; // For component-specific styles
import './dark.css'; // For component-specific styles
import { getCachedSolution, cacheSolution, clearSolutionCache } from '../../components/cache/solution';

const SolutionDetail = () => {
  const { problemId } = useParams();
  const [solutionData, setSolutionData] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedLanguage, setSelectedLanguage] = useState('python'); // State to control selected language in modal
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);
  const [isCached, setIsCached] = useState(false);

  const handleClearCache = () => {
    clearSolutionCache(problemId);
    window.location.reload();
  };

  useEffect(() => {
    const fetchSolution = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setIsLoadingLocal(false);
        return;
      }

      setIsLoadingLocal(true);

      const cachedSolution = getCachedSolution(problemId);
      if (cachedSolution) {
        setSolutionData(cachedSolution);
        setIsCached(true);
        setIsLoadingLocal(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/problems/${problemId}/solution`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch solution');
        }

        const data = await response.json();
        setSolutionData(data);
        cacheSolution(problemId, data);

        // Set default selected language if available
        if (data.python) {
          setSelectedLanguage('python');
        } else if (data.cpp) {
          setSelectedLanguage('cpp');
        } else if (data.c) {
          setSelectedLanguage('c');
        }

      } catch (err) {
        setError(err.message);
        console.error('Error fetching solution:', err);
      } finally {
        setIsLoadingLocal(false);
      }
    };

    if (problemId) {
      fetchSolution();
    }
  }, [problemId]);

  const handleViewSolutionClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success('Code copied to clipboard!');
    }, (err) => {
      toast.error('Failed to copy code.');
      console.error('Could not copy text: ', err);
    });
  };

  const renderCodeBlock = (language) => {
    const code = solutionData[language];
    if (!code) return <p>No {language} solution available.</p>;

    const codeToShow = code.endsWith('\n') ? code.slice(0, -1) : code;

    return (
      <div className="solution-detail-code-block-container">
        <button onClick={() => handleCopyCode(codeToShow)} className="solution-detail-copy-code-button">Copy Code</button>
        <pre><code className={`language-${language}`}>{codeToShow}</code></pre>
      </div>
    );
  };

  if (error) {
    return <div className="solution-detail-error">Error: {error}</div>;
  }

  if (isLoadingLocal) {
    return <div className="solution-detail-loading">Loading solution...</div>;
  }

  if (!solutionData) {
    return <div className="solution-detail-not-found">Solution not found.</div>;
  }

  return (
    <div className="solution-detail-container">
      <h2 className="solution-detail-title">Solution for Problem {problemId}</h2>
      {isCached && (
        <div className="cache-notification">
          <p>This solution is being displayed from the cache. <button onClick={handleClearCache}>Clear Cache</button> to see the latest updates.</p>
        </div>
      )}
      
      <div className="solution-detail-section">
        <h3 className="solution-detail-subtitle">Explanation (solution.md)</h3>
        {solutionData.markdown ? (
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              math: ({ value }) => <BlockMath>{value}</BlockMath>,
              inlineMath: ({ value }) => <InlineMath>{value}</InlineMath>,
            }}
          >
            {solutionData.markdown}
          </ReactMarkdown>
        ) : (
          <p>No markdown explanation available.</p>
        )}
      </div>

      <div className="solution-detail-actions">
        <button onClick={handleViewSolutionClick} className="solution-detail-view-solution-button">
          View Author's Solution 💡
        </button>
      </div>

      {showModal && (
        <div className="solution-modal-overlay">
          <div className="solution-modal-content">
            <div className="solution-modal-header">
              <h3>Author's Solution for Problem {problemId}</h3>
              <button onClick={handleCloseModal} className="solution-modal-close-button">×</button>
            </div>
            <div className="solution-modal-tabs">
              {solutionData.python && (
                <button 
                  className={`solution-modal-tab ${selectedLanguage === 'python' ? 'active' : ''}`}
                  onClick={() => setSelectedLanguage('python')}
                >
                  Python
                </button>
              )}
              {solutionData.cpp && (
                <button 
                  className={`solution-modal-tab ${selectedLanguage === 'cpp' ? 'active' : ''}`}
                  onClick={() => setSelectedLanguage('cpp')}
                >
                  C++
                </button>
              )}
              {solutionData.c && (
                <button 
                  className={`solution-modal-tab ${selectedLanguage === 'c' ? 'active' : ''}`}
                  onClick={() => setSelectedLanguage('c')}
                >
                  C
                </button>
              )}
            </div>
            <div className="solution-modal-code-display">
              {selectedLanguage === 'python' && renderCodeBlock('python')}
              {selectedLanguage === 'cpp' && renderCodeBlock('cpp')}
              {selectedLanguage === 'c' && renderCodeBlock('c')}
            </div>
          </div>
        </div>
      )}

      <Link to={`/problems/${problemId}`} className="solution-detail-back-link">Back to Problem</Link>
    </div>
  );
};

export default SolutionDetail;