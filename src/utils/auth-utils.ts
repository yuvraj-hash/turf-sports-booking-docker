import { supabase } from '../lib/supabase';

// Function to create user without email verification
export const createUser = async (userData: { email: string; password: string; fullName: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        full_name: userData.fullName,
      },
      emailRedirectTo: null, // Disable email verification
    },
  });

  if (error) {
    console.error('Sign-up error:', error);
    throw new Error(error.message || 'Failed to create account');
  }

  if (!data.user) {
    throw new Error('No user data returned');
  }

  return {
    id: data.user.id,
    email: data.user.email || '',
    full_name: data.user.user_metadata?.full_name || '',
  };
};

// Function to login user with email and password
export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Failed to login');
  }

  if (!data.user) {
    throw new Error('No user data returned');
  }

  return {
    id: data.user.id,
    email: data.user.email || '',
    full_name: data.user.user_metadata?.full_name || '',
  };
};

// Function to login with Google OAuth
export const loginWithOAuth = async (provider: 'google') => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const redirectTo = isLocalhost ? 'http://localhost:5173/auth/callback' : `${window.location.origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error(`OAuth ${provider} login error:`, {
      code: error.code,
      error_code: error.error_code,
      message: error.message,
      status: error.status,
    });
    throw new Error(error.message || `Failed to login with ${provider}`);
  }

  if (!data) {
    throw new Error('No data returned from OAuth login');
  }

  const { user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('No user data available after OAuth login');
  }

  return {
    id: user.id,
    email: user.email || '',
    full_name: user.user_metadata?.full_name || '',
  };
};

// Function to persist session
export const persistSession = async (rememberMe: boolean) => {
  const { data: sessionData, error } = await supabase.auth.getSession();
  if (error || !sessionData?.session) {
    console.error('No session available for persistence:', error);
    throw new Error('No active session to persist.');
  }

  localStorage.removeItem('auth_session');
  sessionStorage.removeItem('auth_session');

  const sessionDataToStore = {
    user: {
      id: sessionData.session.user.id,
      email: sessionData.session.user.email,
      name: sessionData.session.user.user_metadata?.full_name || '',
    },
    timestamp: Date.now(),
  };

  if (rememberMe) {
    localStorage.setItem('auth_session', JSON.stringify(sessionDataToStore));
  } else {
    sessionStorage.setItem('auth_session', JSON.stringify(sessionDataToStore));
  }
};

// Function to generate password reset token
export const generatePasswordResetToken = async (email: string) => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const redirectTo = isLocalhost ? 'http://localhost:5173/reset-password' : `${window.location.origin}/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    console.error('Password reset error:', error);
    throw new Error(error.message || 'Failed to send password reset email');
  }

  return 'Password reset email sent successfully';
};

// Function to get current user session
export const getUserSession = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.warn('No active user session found');
    return null;
  }
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name || '',
    avatar: user.user_metadata?.avatar || null,
  };
};