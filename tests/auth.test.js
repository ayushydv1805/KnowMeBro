import test from 'node:test';
import assert from 'node:assert/strict';
import { getLinkedQuizzes, normalizeSession } from '../src/auth.js';

test('normalizes a Supabase session and calculates its expiry', () => {
  const session = normalizeSession({
    access_token: 'access',
    refresh_token: 'refresh',
    expires_in: 3600,
    user: { id: 'user-1', email: 'friend@example.com' }
  });
  assert.equal(session.access_token, 'access');
  assert.equal(session.refresh_token, 'refresh');
  assert.equal(session.user.email, 'friend@example.com');
  assert.ok(session.expires_at > Math.floor(Date.now() / 1000));
});

test('accepts recovery sessions that contain only an access token', () => {
  const session = normalizeSession({ access_token: 'recovery-access', expires_in: 900 });
  assert.equal(session.access_token, 'recovery-access');
  assert.equal(session.refresh_token, undefined);
  assert.ok(session.expires_at > Math.floor(Date.now() / 1000));
});

test('rejects missing or malformed session objects', () => {
  assert.equal(normalizeSession(null), null);
  assert.equal(normalizeSession({ refresh_token: 'refresh' }), null);
});

test('returns only valid linked quizzes from account metadata', () => {
  const session = {
    user: { user_metadata: { knowmebro_quizzes: [
      { share_code: 'AB12CD', creator_token: 'secret-token', title: 'Best friends quiz' },
      { share_code: 'INVALID' },
      null
    ] } }
  };
  assert.deepEqual(getLinkedQuizzes(session), [
    { share_code: 'AB12CD', creator_token: 'secret-token', title: 'Best friends quiz' }
  ]);
});

test('handles empty or unexpected quiz metadata safely', () => {
  assert.deepEqual(getLinkedQuizzes(null), []);
  assert.deepEqual(getLinkedQuizzes({ user: { user_metadata: { knowmebro_quizzes: 'not-an-array' } } }), []);
});

test('limits the saved quiz library to fifty entries', () => {
  const quizzes = Array.from({ length: 60 }, (_, i) => ({
    share_code: 'CODE' + i, creator_token: 'token' + i, title: 'Quiz ' + i
  }));
  assert.equal(getLinkedQuizzes({ user: { user_metadata: { knowmebro_quizzes: quizzes } } }).length, 50);
});
