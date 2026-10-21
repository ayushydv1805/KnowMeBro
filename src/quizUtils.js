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
