const MIN_QUESTION_COUNT = 5;
const MAX_QUESTION_COUNT = 20;

function hasValidQuestions(questions, { requireCorrectAnswer = false } = {}) {
  return (
    Array.isArray(questions) &&
    questions.length >= MIN_QUESTION_COUNT &&
    questions.length <= MAX_QUESTION_COUNT &&
    questions.every((question) =>
      question &&
      typeof question.question === 'string' &&
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      question.options.every((option) => typeof option === 'string') &&
      (!requireCorrectAnswer ||
        (Number.isInteger(question.correct) &&
          question.correct >= 0 &&
          question.correct < 4))
    )
  );
}

export function isValidQuizPayload(quiz) {
  return Boolean(
    quiz &&
    typeof quiz.creator === 'string' &&
    typeof quiz.title === 'string' &&
    hasValidQuestions(quiz.questions)
  );
}

export function shouldResumeProgress(saved) {
  if (!saved || typeof saved !== 'object') return false;
  const name = typeof saved.name === 'string' ? saved.name.slice(0, 30) : '';
  return saved.started !== false && name.trim().length > 0;
}

export function isValidSubmissionResult(result) {
  return Boolean(
    result &&
    typeof result === 'object' &&
    Number.isFinite(result.score) &&
    Number.isFinite(result.total) &&
    result.total > 0 &&
    result.score >= 0 &&
    result.score <= result.total
  );
}

export function isValidResultsPayload(data) {
  return Boolean(
    data &&
    typeof data === 'object' &&
    data.quiz &&
    typeof data.quiz.title === 'string' &&
    hasValidQuestions(data.quiz.questions, { requireCorrectAnswer: true }) &&
    (data.attempts == null || Array.isArray(data.attempts))
  );
}

export function scoreTier(score, total) {
  if (!isValidSubmissionResult({ score, total })) return 'invalid';
  if (score === total) return 'perfect';

  const ratio = score / total;
  if (ratio >= 0.8) return 'high';
  if (ratio >= 0.5) return 'medium';
  return 'low';
}


function normalizeAttempts(attempts, totalQuestions) {
  if (!Array.isArray(attempts) || !Number.isFinite(totalQuestions) || totalQuestions <= 0) return [];
  return attempts.filter((attempt) =>
    attempt &&
    Number.isFinite(attempt.score) &&
    attempt.score >= 0 &&
    attempt.score <= totalQuestions
  );
}

export function getCreatorRecap(attempts, totalQuestions) {
  const validTotal = Number.isFinite(totalQuestions) && totalQuestions > 0
    ? totalQuestions
    : 0;
  const records = normalizeAttempts(attempts, validTotal);
  const scoreSum = records.reduce((sum, attempt) => sum + attempt.score, 0);
  const topFriend = records.reduce((top, attempt) =>
    !top || attempt.score > top.score ? attempt : top, null
  );

  return {
    totalAttempts: records.length,
    averageScore: records.length
      ? Math.round((scoreSum / records.length) * 10) / 10
      : 0,
    averagePercent: records.length && validTotal
      ? Math.round((scoreSum / (records.length * validTotal)) * 100)
      : 0,
    perfectScores: records.filter((attempt) => attempt.score === validTotal).length,
    topFriend: typeof topFriend?.friend_name === 'string' ? topFriend.friend_name : '',
    topScore: topFriend ? topFriend.score : 0,
    totalQuestions: validTotal,
  };
}

export function getCreatorAchievements(attempts, totalQuestions) {
  const recap = getCreatorRecap(attempts, totalQuestions);
  const attemptsCount = recap.totalAttempts;
  const averageRatio = recap.totalQuestions
    ? recap.averageScore / recap.totalQuestions
    : 0;

  const milestone = (id, title, icon, description, current, target, unlocked) => ({
    id,
    title,
    icon,
    description,
    unlocked,
    progress: target > 0 ? Math.min(1, current / target) : 0,
    progressText: `${Math.min(current, target)} / ${target}`,
  });

  const mindReader = {
    id: 'mind-reader',
    title: 'Mind reader',
    icon: '🧠',
    description: 'Average at least 80% across 3 or more friend attempts.',
    unlocked: attemptsCount >= 3 && averageRatio >= 0.8,
    progress: Math.min(1, averageRatio / 0.8),
    progressText: attemptsCount < 3
      ? `${attemptsCount} / 3 attempts`
      : `${recap.averagePercent}% / 80% average`,
  };

  return [
    milestone('first-player', 'First challenger', '🎉', 'A friend has played your quiz.', attemptsCount, 1, attemptsCount >= 1),
    milestone('party-starter', 'Party starter', '🫂', 'Get 5 friends to take the challenge.', attemptsCount, 5, attemptsCount >= 5),
    milestone('viral-challenge', 'Gathering momentum', '🚀', 'Reach 10 completed friend attempts.', attemptsCount, 10, attemptsCount >= 10),
    milestone('perfect-score', 'Perfect match', '💯', 'At least one friend earns a perfect score.', recap.perfectScores, 1, recap.perfectScores >= 1),
    mindReader,
    milestone('quiz-architect', 'Quiz architect', '🏗️', 'Build a challenge with at least 15 questions.', recap.totalQuestions, 15, recap.totalQuestions >= 15),
  ];
}
