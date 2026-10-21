import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isValidQuizPayload,
  isValidSubmissionResult,
  isValidResultsPayload,
  shouldResumeProgress,
  scoreTier,
} from '../src/quizUtils.js';

function makeQuestions(count = 5, includeCorrect = false) {
  return Array.from({ length: count }, (_, index) => ({
    question: `Question ${index + 1}`,
    options: ['A', 'B', 'C', 'D'],
    ...(includeCorrect ? { correct: 0 } : {}),
  }));
}

function makeQuiz(count = 5, includeCorrect = false) {
  return {
    creator: 'Test creator',
    title: 'Test quiz',
    questions: makeQuestions(count, includeCorrect),
  };
}

test('accepts quizzes with 5–20 questions and four string options', () => {
  assert.equal(isValidQuizPayload(makeQuiz(5)), true);
  assert.equal(isValidQuizPayload(makeQuiz(20)), true);
  assert.equal(isValidQuizPayload(makeQuiz(4)), false);
  assert.equal(isValidQuizPayload(makeQuiz(21)), false);
});

test('rejects malformed quiz question data before rendering', () => {
  const noOptions = makeQuiz();
  noOptions.questions[0].options = ['Only one'];
  assert.equal(isValidQuizPayload(noOptions), false);

  const nonStringOption = makeQuiz();
  nonStringOption.questions[0].options[2] = null;
  assert.equal(isValidQuizPayload(nonStringOption), false);

  assert.equal(isValidQuizPayload(null), false);
});

test('does not resume stale progress when the required player name is missing', () => {
  assert.equal(shouldResumeProgress({ started: true, name: '' }), false);
  assert.equal(shouldResumeProgress({ started: true }), false);
  assert.equal(shouldResumeProgress({ started: true, name: '   ' }), false);
  assert.equal(shouldResumeProgress({ started: true, name: 'Alex' }), true);
  assert.equal(shouldResumeProgress({ started: false, name: 'Alex' }), false);
});

test('accepts only valid score and total values from a submission', () => {
  assert.equal(isValidSubmissionResult({ score: 4, total: 5 }), true);
  assert.equal(isValidSubmissionResult({ score: 5, total: 5 }), true);
  assert.equal(isValidSubmissionResult({ score: -1, total: 5 }), false);
  assert.equal(isValidSubmissionResult({ score: 6, total: 5 }), false);
  assert.equal(isValidSubmissionResult({ score: 0, total: 0 }), false);
  assert.equal(isValidSubmissionResult({ score: '4', total: 5 }), false);
  assert.equal(isValidSubmissionResult(null), false);
});

test('accepts a valid creator results payload and rejects malformed questions', () => {
  assert.equal(
    isValidResultsPayload({ quiz: makeQuiz(5, true), attempts: [] }),
    true,
  );
  assert.equal(
    isValidResultsPayload({ quiz: makeQuiz(5, true), attempts: null }),
    true,
  );
  assert.equal(
    isValidResultsPayload({ quiz: makeQuiz(5, false), attempts: [] }),
    false,
  );
  assert.equal(
    isValidResultsPayload({ quiz: makeQuiz(4, true), attempts: [] }),
    false,
  );
  assert.equal(
    isValidResultsPayload({ quiz: makeQuiz(5, true), attempts: {} }),
    false,
  );
});

test('score tiers use percentages for 5-, 10-, and 20-question quizzes', () => {
  assert.equal(scoreTier(5, 5), 'perfect');
  assert.equal(scoreTier(4, 5), 'high');
  assert.equal(scoreTier(3, 5), 'medium');
  assert.equal(scoreTier(2, 5), 'low');

  assert.equal(scoreTier(8, 10), 'high');
  assert.equal(scoreTier(5, 10), 'medium');
  assert.equal(scoreTier(16, 20), 'high');
  assert.equal(scoreTier(10, 20), 'medium');
  assert.equal(scoreTier(20, 20), 'perfect');

  assert.equal(scoreTier(21, 20), 'invalid');
});
