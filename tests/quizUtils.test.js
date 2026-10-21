import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isValidQuizPayload,
  isValidSubmissionResult,
  isValidResultsPayload,
  shouldResumeProgress,
  scoreTier,
  toSafeCsvCell,
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


import { getCreatorAchievements, getCreatorRecap } from '../src/quizUtils.js';

test('creator recap calculates attempts, average, perfect scores, and top friend', () => {
  const recap = getCreatorRecap([
    { friend_name: 'Asha', score: 10 },
    { friend_name: 'Ravi', score: 8 },
    { friend_name: 'Meera', score: 10 },
    { friend_name: 'Invalid', score: 15 },
    null,
  ], 10);

  assert.deepEqual(recap, {
    totalAttempts: 3,
    averageScore: 9.3,
    averagePercent: 93,
    perfectScores: 2,
    topFriend: 'Asha',
    topScore: 10,
    totalQuestions: 10,
  });
});

test('creator recap handles empty or malformed input safely', () => {
  assert.deepEqual(getCreatorRecap(null, 10), {
    totalAttempts: 0,
    averageScore: 0,
    averagePercent: 0,
    perfectScores: 0,
    topFriend: '',
    topScore: 0,
    totalQuestions: 10,
  });
  assert.equal(getCreatorRecap([{ score: 3 }], 0).totalAttempts, 0);
});

test('achievement milestones unlock at their stated thresholds', () => {
  const attempts = [
    { friend_name: 'Asha', score: 10 },
    { friend_name: 'Ravi', score: 8 },
    { friend_name: 'Meera', score: 10 },
  ];
  const badges = getCreatorAchievements(attempts, 10);
  const byId = Object.fromEntries(badges.map((badge) => [badge.id, badge]));

  assert.equal(byId['first-player'].unlocked, true);
  assert.equal(byId['party-starter'].unlocked, false);
  assert.equal(byId['perfect-score'].unlocked, true);
  assert.equal(byId['mind-reader'].unlocked, true);
  assert.equal(byId['quiz-architect'].unlocked, false);
  assert.equal(byId['party-starter'].progressText, '3 / 5');
});

test('achievement progress stays bounded and does not unlock mind reader too early', () => {
  const badges = getCreatorAchievements([
    { friend_name: 'Asha', score: 5 },
    { friend_name: 'Ravi', score: 5 },
  ], 5);
  const byId = Object.fromEntries(badges.map((badge) => [badge.id, badge]));

  assert.equal(byId['mind-reader'].unlocked, false);
  assert.ok(badges.every((badge) => badge.progress >= 0 && badge.progress <= 1));
  assert.equal(byId['first-player'].progress, 1);
  assert.equal(getCreatorAchievements([], 20).find((badge) => badge.id === 'quiz-architect').unlocked, true);
});


test('CSV cells quote delimiters and escape spreadsheet formula injection', () => {
  assert.equal(toSafeCsvCell('=1+1'), '"\'=1+1"');
  assert.equal(toSafeCsvCell('  @SUM(A1:A2)'), '"\'  @SUM(A1:A2)"');
  assert.equal(toSafeCsvCell('\\t-1+1'), '"\'\\t-1+1"');
  assert.equal(toSafeCsvCell('+cmd|\'/C calc\'!A0'), '"\'+cmd|\'/C calc\'!A0"');
  assert.equal(toSafeCsvCell('Alex, "Ace"'), '"Alex, ""Ace"""');
  assert.equal(toSafeCsvCell(12), '"12"');
  assert.equal(toSafeCsvCell(null), '""');
});
