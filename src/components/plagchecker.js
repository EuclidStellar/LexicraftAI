import React, { useState } from 'react';
import { geminiService } from '../services/geminiAPI';

const PlagiarismChecker = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await geminiService.checkPlagiarism(text);
      if (response.success) {
        setAnalysis(response.analysis);
      }
    } catch (err) {
      setError('Failed to check originality: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'major': return '#f97316';
      case 'minor': return '#eab308';
      default: return '#6b7280';
    }
  };

  return (
    <div className="component grammar-checker">
      <h2>🔍 Plagiarism & Originality Checker</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here to check for originality, clichés, and AI-generated content patterns..."
        className="text-area grammar-textarea"
        style={{ height: '350px' }}
      />

      <div className="text-stats">
        <div className="stat-item">
          <span className="stat-number">{text.split(' ').filter((w) => w).length}</span>
          <span className="stat-label">Words</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{text.length}</span>
          <span className="stat-label">Characters</span>
        </div>
      </div>

      <button
        onClick={handleCheck}
        disabled={loading || !text.trim()}
        className="button"
      >
        {loading ? '🔄 Analyzing...' : '🔍 Check Originality'}
      </button>

      {error && <div className="error-message">{error}</div>}

      {analysis && (
        <div className="grammar-results">
          <div className="analysis-summary">
            <div className="score-card">
              <h3 style={{ color: getScoreColor(analysis.originalityScore) }}>
                Originality Score: {analysis.originalityScore}/100
              </h3>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${analysis.originalityScore}%`,
                    backgroundColor: getScoreColor(analysis.originalityScore),
                  }}
                ></div>
              </div>
              <p><strong>Verdict:</strong> {analysis.verdict}</p>
            </div>

            <div className="issue-counts">
              <span className="issue-count" style={{ color: '#667eea' }}>
                AI-Generated Probability: {analysis.aiGeneratedProbability}%
              </span>
              <span className="issue-count" style={{ color: '#6b7280' }}>
                Vocabulary Diversity: {analysis.vocabularyDiversity}
              </span>
              <span className="issue-count" style={{ color: '#6b7280' }}>
                Structural Originality: {analysis.structuralOriginality}
              </span>
            </div>
          </div>

          {analysis.strengths && analysis.strengths.length > 0 && (
            <div className="style-insights">
              <h3>✅ Strengths</h3>
              <ul>
                {analysis.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.issues && analysis.issues.length > 0 && (
            <div className="issues-list">
              <h3>⚠️ Issues Found ({analysis.issues.length})</h3>
              {analysis.issues.map((issue, index) => (
                <div key={index} className={`issue-item ${issue.severity}`}>
                  <div className="issue-header">
                    <span
                      className="severity-badge"
                      style={{ backgroundColor: getSeverityColor(issue.severity) }}
                    >
                      {issue.severity.toUpperCase()}
                    </span>
                    <span className="issue-type">{issue.type}</span>
                  </div>
                  <div className="issue-content">
                    {issue.excerpt && (
                      <p className="issue-text">
                        <strong>Excerpt:</strong> "{issue.excerpt}"
                      </p>
                    )}
                    <p className="issue-description">{issue.description}</p>
                    {issue.suggestion && (
                      <div className="suggestion">
                        <p><strong>Suggestion:</strong> {issue.suggestion}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="style-insights">
            <h3>📋 Overall Feedback</h3>
            <p>{analysis.overallFeedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlagiarismChecker;
