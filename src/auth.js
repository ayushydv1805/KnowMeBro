const SUPABASE_URL = 'https://gnujgajomorbwpadgeay.supabase.co';
const SUPABASE_KEY = 'sb_publishable_9gcS-1_Ei0YFZ6iqM1xyGQ_Hz6-Ztsx';
export const AUTH_SESSION_KEY = 'knowmebro-auth-session-v1';

function explainAuthError(data, fallback) {
  const message = data?.msg || data?.message || data?.error_description || data?.error;
  if (typeof message !== 'string') return fallback;
  if (/invalid login credentials/i.test(message)) return 'Email or password is incorrect.';
  if (/email not confirmed/i.test(message)) return 'Please verify your email from the confirmation link before logging in.';
  if (/user already registered/i.test(message)) return 'An account with this email already exists. Try logging in instead.';
  if (/password should be at least/i.test(message)) return 'Choose a stronger password with at least 6 characters.';
  if (/rate limit/i.test(message)) return 'Too many attempts. Please wait a little and try again.';
  return message;
}

async function requestAuth(path, { method = 'POST', body, accessToken } = {}) {
  let response;
  try {
    response = await fetch(SUPABASE_URL + '/auth/v1/' + path, {
      method,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: 'Bearer ' + (accessToken || SUPABASE_KEY),
        'Content-Type': 'application/json'
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) })
    });
  } catch {
    throw new Error('Cannot reach the account service right now. Please check your connection and try again.');
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(explainAuthError(data, 'Account request failed. Please try again.'));
  return data;
}

export function normalizeSession(data) {
  if (!data?.access_token) return null;
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    token_type: data.token_type || 'bearer',
    expires_at: Number(data.expires_at) || Math.floor(Date.now() / 1000) + (Number(data.expires_in) || 3600),
    user: data.user || null
  };
}

export function readStoredSession() {
  try {
    const session = normalizeSession(JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || 'null'));
    return session;
  } catch {
    return null;
  }
}

export function storeSession(session) {
  const normalized = normalizeSession(session);
  if (!normalized) throw new Error('The account service returned an incomplete session. Please log in again.');
  try {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(normalized));
  } catch {
    throw new Error('This browser could not save your session. Enable site storage and try again.');
  }
  return normalized;
}

export function clearStoredSession() {
  try { localStorage.removeItem(AUTH_SESSION_KEY); } catch {}
}

export async function signUp(email, password, displayName) {
  const redirectTo = window.location.origin + '/';
  const data = await requestAuth('signup?redirect_to=' + encodeURIComponent(redirectTo), { body: { email, password, data: { display_name: displayName } } });
  return normalizeSession(data);
}

export async function signIn(email, password) {
  return normalizeSession(await requestAuth('token?grant_type=password', { body: { email, password } }));
}

export async function refreshSession(session) {
  if (!session?.refresh_token) throw new Error('Your session has expired. Please log in again.');
  const refreshed = normalizeSession(await requestAuth('token?grant_type=refresh_token', { body: { refresh_token: session.refresh_token } }));
  if (!refreshed) throw new Error('Your session has expired. Please log in again.');
  return refreshed;
}

export async function restoreSession() {
  const saved = readStoredSession();
  if (!saved) return null;
  if (saved.expires_at * 1000 > Date.now() + 60000) return saved;
  try {
    return storeSession(await refreshSession(saved));
  } catch {
    clearStoredSession();
    return null;
  }
}

export async function sendPasswordReset(email) {
  const redirectTo = window.location.origin + '/?auth=recovery';
  await requestAuth('recover?redirect_to=' + encodeURIComponent(redirectTo), { body: { email } });
}

export async function updatePassword(session, password) {
  const user = await requestAuth('user', { method: 'PUT', accessToken: session.access_token, body: { password } });
  return storeSession({ ...session, user });
}

export async function updateUserMetadata(session, metadata) {
  const user = await requestAuth('user', {
    method: 'PUT',
    accessToken: session.access_token,
    body: { data: metadata }
  });
  return storeSession({ ...session, user });
}

export async function signOut(session) {
  try {
    if (session?.access_token) await requestAuth('logout', { accessToken: session.access_token });
  } finally {
    clearStoredSession();
  }
}

export function getLinkedQuizzes(session) {
  const quizzes = session?.user?.user_metadata?.knowmebro_quizzes;
  if (!Array.isArray(quizzes)) return [];
  return quizzes.filter(q =>
    q && typeof q.share_code === 'string' &&
    typeof q.creator_token === 'string' &&
    typeof q.title === 'string'
  ).slice(0, 50);
}

export async function linkQuizToAccount(session, quiz) {
  if (!session?.access_token || !session.user) return session;
  const existing = getLinkedQuizzes(session).filter(q => q.share_code !== quiz.share_code);
  const linked = [{
    share_code: quiz.share_code,
    creator_token: quiz.creator_token,
    title: quiz.title,
    created_at: new Date().toISOString()
  }, ...existing].slice(0, 50);
  return updateUserMetadata(session, {
    ...(session.user.user_metadata || {}),
    knowmebro_quizzes: linked
  });
}

export function restoreLinkedCreatorTokens(session) {
  const quizzes = getLinkedQuizzes(session);
  try {
    for (const quiz of quizzes) {
      localStorage.setItem('knowmebro-owner-' + quiz.share_code, quiz.creator_token);
    }
  } catch {}
  return quizzes;
}
