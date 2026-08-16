import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, Trophy, RotateCcw, ChevronRight, Star, Timer, CheckCircle, XCircle, ArrowRight, Home, X } from 'lucide-react';
import { generateDailyQuiz } from '../data/dailyQuizGenerator';
import PageHeader from './common/PageHeader';
import { playSound } from '../utils/audio';

const TOTAL_QUESTIONS = 15;
const TIME_PER_QUESTION = 10; // seconds
const BLITZ_THRESHOLD = 3; // seconds for speed bonus

// XP constants
const XP_CORRECT = 10;
const XP_STREAK_BONUS = 5;
const XP_BLITZ_BONUS = 5;

// Grade thresholds
function getGrade(score) {
  if (score === 15) return { letter: 'S', label: 'Perfekt!', color: 'text-amber-500' };
  if (score >= 13) return { letter: 'A', label: 'Ausgezeichnet!', color: 'text-emerald-500' };
  if (score >= 10) return { letter: 'B', label: 'Sehr gut!', color: 'text-blue-500' };
  if (score >= 7) return { letter: 'C', label: 'Gut gemacht', color: 'text-purple-500' };
  if (score >= 4) return { letter: 'D', label: 'Weiter üben', color: 'text-orange-500' };
  return { letter: 'F', label: 'Nicht aufgeben!', color: 'text-red-500' };
}

function getStars(score) {
  if (score >= 14) return 5;
  if (score >= 12) return 4;
  if (score >= 9) return 3;
  if (score >= 6) return 2;
  return 1;
}

// LocalStorage helpers
const STORAGE_KEY = 'dailyQuizStats';

function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { allTimeHigh: 0, allTimeHighXP: 0, dailyScores: {} };
  } catch {
    return { allTimeHigh: 0, allTimeHighXP: 0, dailyScores: {} };
  }
}

function saveStats(stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

// SVG Timer Ring Component
const TimerRing = ({ timeLeft, total, isUrgent, isExpired }) => {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / total;
  const dashOffset = circumference * (1 - progress);

  const getColor = () => {
    if (isExpired) return '#ef4444';
    if (timeLeft <= 3) return '#ef4444';
    if (timeLeft <= 6) return '#f59e0b';
    return '#22c55e';
  };

  return (
    <div className={`relative w-24 h-24 md:w-28 md:h-28 ${isUrgent ? 'animate-pulse-fast' : ''} ${isExpired ? 'animate-timer-expire' : ''}`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          className="text-border-subtle"
        />
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.3s linear, stroke 0.3s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-3xl md:text-4xl font-black tracking-tighter font-mono leading-none transition-colors duration-300 ${
          isExpired ? 'text-red-500' : timeLeft <= 3 ? 'text-red-500' : timeLeft <= 6 ? 'text-amber-500' : 'text-text'
        }`}>
          {Math.ceil(timeLeft)}
        </span>
      </div>
    </div>
  );
};

// Confetti effect for results
const Confetti = () => {
  const pieces = useMemo(() => {
    const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1.5}s`,
      size: 6 + Math.random() * 8,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute top-0 animate-confetti-fall rounded-sm"
          style={{
            left: p.left,
            animationDelay: p.delay,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────

const DailyQuiz = ({ onMainMenu }) => {
  // Phase: 'intro' | 'countdown' | 'quiz' | 'results'
  const [phase, setPhase] = useState('intro');
  const [countdownNum, setCountdownNum] = useState(3);

  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Score state
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [blitzCount, setBlitzCount] = useState(0);
  const [topicResults, setTopicResults] = useState({});
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // Animation triggers
  const [scorePopKey, setScorePopKey] = useState(0);
  const [blitzFlash, setBlitzFlash] = useState(false);

  // Persistent stats
  const [stats, setStats] = useState(loadStats);

  const timerRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  // Generate quiz on mount or restart
  const startQuiz = useCallback(() => {
    const q = generateDailyQuiz();
    setQuestions(q);
    setCurrentQ(0);
    setTimeLeft(TIME_PER_QUESTION);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowFeedback(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalXP(0);
    setBlitzCount(0);
    setTopicResults({});
    setIsNewHighScore(false);
    scoreRef.current = 0;
    totalXPRef.current = 0;
    streakRef.current = 0;
    setPhase('countdown');
    setCountdownNum(3);
  }, []);

  // Countdown 3-2-1
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdownNum === 0) {
      setPhase('quiz');
      return;
    }
    playSound.tick();
    const t = setTimeout(() => setCountdownNum(prev => prev - 1), 800);
    return () => clearTimeout(t);
  }, [phase, countdownNum]);

  // Timer tick
  useEffect(() => {
    if (phase !== 'quiz' || showFeedback) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current);
          // Time's up — auto-skip
          handleAnswer(null);
          return 0;
        }
        if (prev <= 3.1 && prev > 0.9 && Math.abs(prev % 1) < 0.1) {
          playSound.tick();
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [phase, currentQ, showFeedback]);


  // Track score in a ref to avoid stale closures
  const scoreRef = useRef(0);
  const totalXPRef = useRef(0);
  const streakRef = useRef(0);

  // Handle answer selection
  const handleAnswer = useCallback((option) => {
    if (showFeedback) return;
    clearInterval(timerRef.current);

    const question = questions[currentQ];
    const correct = option === question.correctAnswer;
    const timeSpent = TIME_PER_QUESTION - timeLeft;
    const wasBlitz = correct && timeSpent < BLITZ_THRESHOLD && option !== null;

    setSelectedOption(option);
    setIsCorrect(correct);
    setShowFeedback(true);

    // Update topic results
    setTopicResults(prev => {
      const t = question.topic;
      const existing = prev[t] || { correct: 0, total: 0 };
      return {
        ...prev,
        [t]: { correct: existing.correct + (correct ? 1 : 0), total: existing.total + 1 }
      };
    });

    if (correct) {
      if (wasBlitz) {
        playSound.blitz();
      } else {
        playSound.correct();
      }
      scoreRef.current += 1;
      setScore(scoreRef.current);
      setScorePopKey(prev => prev + 1);
      streakRef.current += 1;
      const newStreak = streakRef.current;
      setStreak(newStreak);
      setMaxStreak(prev => Math.max(prev, newStreak));

      let xpGain = XP_CORRECT + (newStreak > 1 ? XP_STREAK_BONUS * (newStreak - 1) : 0);
      if (wasBlitz) {
        xpGain += XP_BLITZ_BONUS;
        setBlitzCount(prev => prev + 1);
        setBlitzFlash(true);
        setTimeout(() => setBlitzFlash(false), 600);
      }
      totalXPRef.current += xpGain;
      setTotalXP(totalXPRef.current);
    } else {
      if (option === null) {
        playSound.timeout();
      } else {
        playSound.wrong();
      }
      streakRef.current = 0;
      setStreak(0);
    }

    // Auto-advance after feedback
    const isLast = currentQ >= TOTAL_QUESTIONS - 1;
    feedbackTimeoutRef.current = setTimeout(() => {
      if (isLast) {
        // Finish quiz — use refs for up-to-date values
        setPhase('results');
        const finalScore = scoreRef.current;
        const finalXP = totalXPRef.current;
        const currentStats = loadStats();
        const todayKey = getTodayKey();
        const todayBest = currentStats.dailyScores[todayKey] || 0;

        if (finalScore > todayBest) {
          currentStats.dailyScores[todayKey] = finalScore;
        }
        if (finalScore > currentStats.allTimeHigh) {
          currentStats.allTimeHigh = finalScore;
          setIsNewHighScore(true);
          playSound.highScore();
        }
        if (finalXP > (currentStats.allTimeHighXP || 0)) {
          currentStats.allTimeHighXP = finalXP;
        }
        setStats(currentStats);
        saveStats(currentStats);
      } else {
        setCurrentQ(prev => prev + 1);
        setTimeLeft(TIME_PER_QUESTION);
        setSelectedOption(null);
        setIsCorrect(null);
        setShowFeedback(false);
      }
    }, correct ? 1200 : 1800);
  }, [showFeedback, questions, currentQ, timeLeft]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  const question = questions[currentQ];
  const progressPercent = ((currentQ + (showFeedback ? 1 : 0)) / TOTAL_QUESTIONS) * 100;
  const todayBest = stats.dailyScores[getTodayKey()] || 0;

  // ─── PHASE: INTRO ─────────────────────────────────────────────────────

  if (phase === 'intro') {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8 pb-32 md:pb-24 relative animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)]">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center relative z-10 pt-8 md:pt-12">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-rose-100 rounded-3xl mb-6 shadow-sm border border-rose-200">
            <Timer className="text-rose-600" size={40} strokeWidth={2} />
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text mb-3 leading-tight">
            Tägliche<br />Herausforderung
          </h1>
          <p className="text-text-muted text-base md:text-lg max-w-md mx-auto mb-10 font-light">
            15 questions · 10 seconds each · All topics
          </p>

          {/* Stats cards */}
          <div className="flex items-stretch justify-center gap-3 mb-10 max-w-sm mx-auto">
            <div className="flex-1 bg-surface/60 backdrop-blur-md border border-subtle rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] mb-1">Today's Best</div>
              <div className="text-2xl md:text-3xl font-black text-text tracking-tighter">
                {todayBest}<span className="text-base text-text-muted font-bold ml-0.5">/{TOTAL_QUESTIONS}</span>
              </div>
            </div>
            <div className="flex-1 bg-surface/60 backdrop-blur-md border border-subtle rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] mb-1">All-Time High</div>
              <div className="text-2xl md:text-3xl font-black text-primary tracking-tighter">
                {stats.allTimeHigh}<span className="text-base text-text-muted font-bold ml-0.5">/{TOTAL_QUESTIONS}</span>
              </div>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={startQuiz}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-text text-background font-black text-xl tracking-tight rounded-2xl hover:scale-105 hover:shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] active:scale-95 shadow-xl"
          >
            <Zap size={24} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
            Los geht's!
            <ArrowRight size={22} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Rules */}
          <div className="mt-10 bg-surface/40 backdrop-blur-md border border-subtle rounded-2xl p-5 max-w-sm mx-auto shadow-sm text-left">
            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3">How it works</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li className="flex items-start gap-2.5">
                <Timer size={16} className="text-rose-500 shrink-0 mt-0.5" />
                <span><strong className="text-text">10 seconds</strong> per question — be quick!</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Flame size={16} className="text-orange-500 shrink-0 mt-0.5" />
                <span>Build <strong className="text-text">streaks</strong> for bonus XP</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Zap size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span>Answer under 3s for <strong className="text-text">Blitz ⚡</strong> bonus</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Trophy size={16} className="text-primary shrink-0 mt-0.5" />
                <span>Beat your <strong className="text-text">high score!</strong></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ─── PHASE: COUNTDOWN ─────────────────────────────────────────────────

  if (phase === 'countdown') {
    return (
      <div className="fixed inset-0 z-40 bg-background flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={countdownNum}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="text-center"
          >
            {countdownNum > 0 ? (
              <span className="text-[8rem] md:text-[12rem] font-black text-text tracking-tighter leading-none select-none">
                {countdownNum}
              </span>
            ) : (
              <span className="text-5xl md:text-7xl font-black text-primary tracking-tight select-none">
                Los!
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ─── PHASE: QUIZ ──────────────────────────────────────────────────────

  if (phase === 'quiz' && question) {
    const isUrgent = timeLeft <= 3 && !showFeedback;
    const isExpired = timeLeft <= 0;

    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8 pb-32 md:pb-24 relative animate-[fade-in_0.3s_ease-out]">
        {/* Background urgency overlay */}
        <div
          className="fixed inset-0 pointer-events-none transition-opacity duration-500 z-0"
          style={{
            background: isUrgent
              ? 'radial-gradient(ellipse at center, rgba(239,68,68,0.06) 0%, transparent 70%)'
              : 'none',
            opacity: isUrgent ? 1 : 0,
          }}
        />

        {/* Progress bar */}
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-border-subtle z-50">
          <div
            className="h-full bg-gradient-to-r from-rose-500 via-primary to-amber-500 transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Top stats strip */}
        <div className="flex items-center justify-between mb-6 relative z-10 pt-2">
          {/* Question counter + Quit */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                clearInterval(timerRef.current);
                clearTimeout(feedbackTimeoutRef.current);
                setPhase('intro');
              }}
              className="p-2 rounded-full bg-surface/60 border border-subtle text-text-muted hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
              title="Quit Quiz"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Question</span>
              <span className="text-lg font-black text-text tracking-tighter font-mono">
                {currentQ + 1}<span className="text-text-muted opacity-50">/{TOTAL_QUESTIONS}</span>
              </span>
            </div>
          </div>

          {/* Live score & streak */}
          <div className="flex items-center gap-3">
            {/* Blitz flash */}
            <AnimatePresence>
              {blitzFlash && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: -20 }}
                  className="text-amber-500 font-black text-sm flex items-center gap-1"
                >
                  <Zap size={16} fill="currentColor" />
                  Blitz!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Streak */}
            {streak > 0 && (
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                streak > 2 ? 'bg-orange-100 text-orange-600' : 'bg-surface border border-subtle text-text-muted'
              } transition-all duration-300`}>
                <Flame size={14} strokeWidth={2.5} fill={streak > 2 ? 'currentColor' : 'none'} className={streak > 2 ? 'animate-pulse' : ''} />
                <span className="text-sm font-black tracking-tight">{streak}</span>
              </div>
            )}

            {/* Score */}
            <div key={scorePopKey} className={`bg-surface/60 backdrop-blur-md border border-subtle rounded-xl px-3 py-1.5 shadow-sm ${scorePopKey > 0 ? 'animate-score-pop' : ''}`}>
              <span className="text-xl font-black text-primary tracking-tighter font-mono">{score}</span>
            </div>
          </div>
        </div>

        {/* Main quiz card */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            >
              {/* Topic badge + Timer */}
              <div className="flex items-center justify-between mb-5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide bg-surface border border-subtle shadow-sm ${question.topicColor}`}>
                  {question.topic}
                </span>
                <TimerRing timeLeft={timeLeft} total={TIME_PER_QUESTION} isUrgent={isUrgent} isExpired={isExpired} />
              </div>

              {/* Question sentence */}
              <div className="bg-surface/40 backdrop-blur-md border border-subtle rounded-2xl p-6 md:p-8 mb-6 shadow-sm text-center">
                <p className="text-xl md:text-2xl font-black text-text tracking-tight leading-relaxed">
                  {question.sentence.split('_____').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="inline-block mx-1 px-4 py-0.5 bg-rose-100 border-2 border-dashed border-rose-300 rounded-lg text-rose-400 font-mono select-none">
                          ?
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </div>

              {/* 4 Option buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map((option, index) => {
                  let btnStyle = '';
                  let icon = null;

                  if (showFeedback) {
                    if (option === question.correctAnswer) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-500 scale-[1.02] shadow-lg';
                      icon = <CheckCircle size={20} strokeWidth={2.5} className="text-white shrink-0" />;
                    } else if (option === selectedOption) {
                      btnStyle = 'bg-red-50 text-red-600 border-red-400 animate-shake';
                      icon = <XCircle size={20} strokeWidth={2.5} className="text-red-500 shrink-0" />;
                    } else {
                      btnStyle = 'bg-transparent border-border-subtle text-text/25 cursor-not-allowed scale-[0.98]';
                    }
                  } else {
                    btnStyle = 'bg-surface border-subtle text-text hover:border-text hover:shadow-lg hover:-translate-y-0.5 cursor-pointer active:scale-95 shadow-sm';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => !showFeedback && handleAnswer(option)}
                      disabled={showFeedback}
                      className={`flex items-center justify-between gap-3 px-5 py-4 rounded-xl text-base md:text-lg font-bold tracking-tight transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] border-2 ${btnStyle}`}
                    >
                      <span className="text-left flex-1 break-words">{option}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {/* Feedback explanation */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <div className={`rounded-xl px-5 py-3 text-sm font-medium border ${
                      isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      {isCorrect ? '✓ ' : '✗ '}
                      {question.explanation}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ─── PHASE: RESULTS ───────────────────────────────────────────────────

  if (phase === 'results') {
    const grade = getGrade(score);
    const stars = getStars(score);
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
    const topicEntries = Object.entries(topicResults).sort((a, b) => a[0].localeCompare(b[0]));

    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8 pb-32 md:pb-24 relative animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)]">
        {isNewHighScore && <Confetti />}

        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center relative z-10 pt-4 md:pt-8">
          {/* High score banner */}
          {isNewHighScore && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-amber-100 border border-amber-300 text-amber-700 rounded-full font-black text-sm tracking-wide mb-6 shadow-sm"
            >
              <Trophy size={16} fill="currentColor" />
              Neuer Rekord!
            </motion.div>
          )}

          {/* Grade */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
          >
            <div className={`text-[7rem] md:text-[9rem] font-black leading-none tracking-tighter ${grade.color} select-none`}>
              {grade.letter}
            </div>
            <p className="text-lg md:text-xl font-bold text-text-muted mt-1">{grade.label}</p>
          </motion.div>

          {/* Stars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-1.5 mt-4 mb-8"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={28}
                strokeWidth={2}
                className={i < stars ? 'text-amber-400' : 'text-border'}
                fill={i < stars ? 'currentColor' : 'none'}
              />
            ))}
          </motion.div>

          {/* Score cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8"
          >
            <div className="bg-surface/60 backdrop-blur-md border border-subtle rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] mb-1">Score</div>
              <div className="text-2xl md:text-3xl font-black text-text tracking-tighter font-mono">
                {score}<span className="text-sm text-text-muted font-bold">/{TOTAL_QUESTIONS}</span>
              </div>
              <div className="text-xs text-text-muted font-medium mt-0.5">{percentage}%</div>
            </div>
            <div className="bg-surface/60 backdrop-blur-md border border-subtle rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] mb-1">XP Earned</div>
              <div className="text-2xl md:text-3xl font-black text-amber-500 tracking-tighter font-mono">{totalXP}</div>
              <div className="text-xs text-text-muted font-medium mt-0.5">points</div>
            </div>
            <div className="bg-surface/60 backdrop-blur-md border border-subtle rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] mb-1">Best Streak</div>
              <div className="text-2xl md:text-3xl font-black text-orange-500 tracking-tighter font-mono flex items-center justify-center gap-1">
                <Flame size={20} fill="currentColor" />
                {maxStreak}
              </div>
              <div className="text-xs text-text-muted font-medium mt-0.5">{blitzCount} blitz{blitzCount !== 1 ? 'es' : ''}</div>
            </div>
          </motion.div>

          {/* Topic breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-surface/40 backdrop-blur-md border border-subtle rounded-2xl p-5 max-w-md mx-auto mb-8 shadow-sm"
          >
            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 text-left">Performance by Topic</h3>
            <div className="space-y-3">
              {topicEntries.map(([topic, result]) => {
                const pct = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
                return (
                  <div key={topic} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-text w-28 text-left truncate">{topic}</span>
                    <div className="flex-1 h-2.5 bg-border-subtle rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-text-muted w-10 text-right">
                      {result.correct}/{result.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              onClick={startQuiz}
              className="group flex items-center gap-3 px-8 py-4 bg-text text-background font-black text-lg tracking-tight rounded-2xl hover:scale-105 hover:shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] active:scale-95 shadow-xl"
            >
              <RotateCcw size={22} strokeWidth={2.5} className="group-hover:-rotate-180 transition-transform duration-500" />
              Play Again
            </button>
            {onMainMenu && (
              <button
                onClick={onMainMenu}
                className="group flex items-center gap-3 px-8 py-4 bg-surface border-2 border-subtle text-text font-black text-lg tracking-tight rounded-2xl hover:scale-105 hover:shadow-lg hover:border-border transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] active:scale-95 shadow-sm"
              >
                <Home size={22} strokeWidth={2.5} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
                Main Menu
              </button>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
};

export default DailyQuiz;
