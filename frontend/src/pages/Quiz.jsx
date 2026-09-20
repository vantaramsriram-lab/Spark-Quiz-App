import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visited, setVisited] = useState(new Set([0]));
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [showPalette, setShowPalette] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.post('/quiz/start');
        const { questions: qs, attempt, duration } = res.data;
        setQuestions(qs);
        setStartedAt(new Date(attempt.startedAt));

        // Restore previous answers if resuming
        if (attempt.answers && attempt.answers.length > 0) {
          const restored = {};
          attempt.answers.forEach(a => {
            if (a.selectedAnswer) {
              restored[a.questionId] = a.selectedAnswer;
            }
          });
          setAnswers(restored);
        }

        // Calculate time left
        const elapsed = (Date.now() - new Date(attempt.startedAt).getTime()) / 1000;
        const total = duration * 60;
        const remaining = Math.max(0, Math.floor(total - elapsed));
        setTimeLeft(remaining);
        setLoading(false);
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load quiz';
        setError(msg);
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft !== null]); // eslint-disable-line

  // Track visited questions
  useEffect(() => {
    setVisited(prev => new Set([...prev, currentQuestion]));
  }, [currentQuestion]);

  const handleSelectAnswer = (option) => {
    const qId = questions[currentQuestion]._id;
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
    setShowPalette(false);
  };

  const handleSubmitQuiz = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setShowConfirm(false);

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      }));

      await api.post('/quiz/submit', { answers: formattedAnswers });
      navigate('/quiz-completed');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
      setSubmitting(false);
    }
  }, [answers, navigate, submitting]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;

  const getPaletteColor = (index) => {
    if (index === currentQuestion) return 'bg-[#00aeef] text-[#031018] border-[#00aeef]';
    const qId = questions[index]?._id;
    if (answers[qId]) return 'bg-[#00aeef]/20 text-[#00aeef] border-[#00aeef]/50';
    if (visited.has(index)) return 'bg-[#172936] text-[#f1f7fa] border-[#315568]';
    return 'bg-[#050e17] text-[#8295a1] border-[#172936]';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030910]">
        <div className="text-center animate-fadeIn">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aeef] mx-auto mb-4"></div>
          <p className="text-[#8295a1]">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030910] p-4">
        <div className="bg-[#08131d] border border-[#172936] rounded-2xl p-8 max-w-md w-full text-center animate-scaleIn">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-[#f1f7fa] mb-2">Error</h2>
          <p className="text-[#8295a1] mb-6">{error}</p>
          <button
            onClick={() => {
              logout();
              navigate('/auth');
            }}
            className="px-6 py-2 bg-[#172936] hover:bg-[#315568] text-[#f1f7fa] rounded-lg transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-[#030910]">
      {/* Header */}
      <header className="bg-[#08131d] border-b border-[#172936] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00aeef] to-[#21b9ef] rounded-lg flex items-center justify-center">
                <span className="text-[#031018] font-bold text-sm">Q</span>
              </div>
              <span className="font-semibold text-[#f1f7fa] hidden sm:block">Quiz</span>
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              timeLeft <= 60 
                ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                : timeLeft <= 300
                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                  : 'bg-[#050e17] border-[#172936] text-[#f1f7fa]'
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
            </div>

            {/* Palette toggle (mobile) */}
            <button
              onClick={() => setShowPalette(!showPalette)}
              className="lg:hidden px-3 py-2 bg-[#172936] hover:bg-[#315568] rounded-lg text-[#f1f7fa] text-sm"
            >
              📋 {answeredCount}/{totalQuestions}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Main Quiz Area */}
          <div className="flex-1">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-[#8295a1] mb-2">
                <span>Question {currentQuestion + 1} of {totalQuestions}</span>
                <span>{answeredCount} answered</span>
              </div>
              <div className="w-full h-2 bg-[#08131d] rounded-full border border-[#172936] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00aeef] to-[#21b9ef] rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-[#08131d] border border-[#172936] rounded-2xl p-6 sm:p-8 mb-6 animate-fadeIn" key={currentQuestion}>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-[#00aeef]/10 border border-[#00aeef]/30 rounded-lg text-[#00aeef] font-bold">
                  {currentQuestion + 1}
                </span>
                <span className="text-sm text-[#8295a1] font-medium">Question {currentQuestion + 1}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-semibold text-[#f1f7fa] mb-8 leading-relaxed">
                {question.questionText}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = answers[question._id] === option;
                  const optionLabel = String.fromCharCode(65 + index);
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(option)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 group ${
                        isSelected
                          ? 'bg-[#00aeef]/10 border-[#00aeef] shadow-lg shadow-[#00aeef]/5'
                          : 'bg-[#050e17] border-[#172936] hover:border-[#315568] hover:bg-[#071521]'
                      }`}
                    >
                      <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                        isSelected
                          ? 'bg-[#00aeef] text-[#031018]'
                          : 'bg-[#172936] text-[#8295a1] group-hover:bg-[#315568] group-hover:text-[#f1f7fa]'
                      }`}>
                        {optionLabel}
                      </span>
                      <span className={`font-medium ${isSelected ? 'text-[#f1f7fa]' : 'text-[#8295a1] group-hover:text-[#f1f7fa]'} transition-colors`}>
                        {option}
                      </span>
                      {isSelected && (
                        <svg className="w-5 h-5 ml-auto text-[#00aeef]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center gap-4">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-[#08131d] border border-[#172936] text-[#f1f7fa] rounded-xl font-medium hover:bg-[#172936] hover:border-[#315568] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              {currentQuestion === totalQuestions - 1 ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#00aeef] to-[#21b9ef] text-[#031018] rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00aeef]/20 transition-all"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(prev => Math.min(totalQuestions - 1, prev + 1))}
                  className="px-6 py-3 bg-[#00aeef] hover:bg-[#21b9ef] text-[#031018] rounded-xl font-semibold transition-all"
                >
                  Next →
                </button>
              )}
            </div>
          </div>

          {/* Question Palette (Desktop) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-[#08131d] border border-[#172936] rounded-2xl p-6 sticky top-24">
              <h3 className="font-semibold text-[#f1f7fa] mb-4">Question Palette</h3>
              
              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`w-10 h-10 rounded-lg border text-sm font-medium transition-all ${getPaletteColor(index)}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#00aeef] border border-[#00aeef]"></div>
                  <span className="text-[#8295a1]">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#00aeef]/20 border border-[#00aeef]/50"></div>
                  <span className="text-[#8295a1]">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#172936] border border-[#315568]"></div>
                  <span className="text-[#8295a1]">Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#050e17] border border-[#172936]"></div>
                  <span className="text-[#8295a1]">Not visited</span>
                </div>
              </div>

              <button
                onClick={() => setShowConfirm(true)}
                className="w-full mt-6 py-3 bg-gradient-to-r from-[#00aeef] to-[#21b9ef] text-[#031018] rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00aeef]/20 transition-all"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Palette Overlay */}
      {showPalette && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 flex items-end" onClick={() => setShowPalette(false)}>
          <div className="bg-[#08131d] border-t border-[#172936] rounded-t-2xl p-6 w-full animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[#f1f7fa]">Question Palette</h3>
              <button onClick={() => setShowPalette(false)} className="text-[#8295a1] hover:text-[#f1f7fa]">✕</button>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-full aspect-square rounded-lg border text-sm font-medium transition-all ${getPaletteColor(index)}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setShowConfirm(true); setShowPalette(false); }}
              className="w-full py-3 bg-gradient-to-r from-[#00aeef] to-[#21b9ef] text-[#031018] rounded-xl font-semibold"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#08131d] border border-[#172936] rounded-2xl p-6 sm:p-8 max-w-sm w-full animate-scaleIn">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00aeef]/10 border border-[#00aeef]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-[#f1f7fa] mb-2">Submit Quiz?</h3>
              <p className="text-[#8295a1] mb-2">
                Are you sure you want to submit the quiz?
              </p>
              <p className="text-sm text-[#8295a1] mb-6">
                You have answered <span className="text-[#00aeef] font-semibold">{answeredCount}</span> out of <span className="text-[#f1f7fa] font-semibold">{totalQuestions}</span> questions.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={submitting}
                  className="flex-1 py-3 px-4 bg-[#172936] hover:bg-[#315568] text-[#f1f7fa] rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-[#00aeef] to-[#21b9ef] text-[#031018] rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00aeef]/20 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#031018]"></div>
                      Submitting...
                    </span>
                  ) : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
