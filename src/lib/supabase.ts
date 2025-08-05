import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import type { AuthResponse } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

if (!resendApiKey) {
  console.warn('Missing Resend API key. Email functionality may not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
});
console.log('Supabase client initialized:', supabase); // Debug log

const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Existing Types
export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface Booking {
  id: string;
  booking_type: string;
  created_at: string;
  sport: string;
  location: string;
  time_slot: string;
  date: string;
  players: number;
  duration: number;
  name: string;
  email: string;
  phone: string;
  total_amount: number;
  payment_mode: 'online' | 'pay_on_spot';
  razorpay_payment_id?: string | null;
}

export interface Registration {
  id: string;
  created_at: string;
  type: 'participant' | 'spectator';
  event_name: string;
  name: string;
  email: string;
  phone: string;
  number: number;
  spl_requirements: string | null;
  seat_no: string | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      newsletter: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          booking_type: string;
          created_at: string;
          sport: string;
          location: string;
          time_slot: string;
          date: string;
          players: number;
          duration: number;
          name: string;
          email: string;
          phone: string;
          total_amount: number;
          payment_mode: 'online' | 'pay_on_spot';
          razorpay_payment_id?: string | null;
        };
        Insert: {
          id?: string;
          booking_type: string;
          created_at?: string;
          sport: string;
          location: string;
          time_slot: string;
          date: string;
          players: number;
          duration: number;
          name: string;
          email: string;
          phone: string;
          total_amount: number;
          payment_mode: 'online' | 'pay_on_spot';
          razorpay_payment_id?: string | null;
        };
        Update: {
          id?: string;
          booking_type?: string;
          created_at?: string;
          sport?: string;
          location?: string;
          time_slot?: string;
          date?: string;
          players?: number;
          duration?: number;
          name?: string;
          email?: string;
          phone?: string;
          total_amount?: number;
          payment_mode?: 'online' | 'pay_on_spot';
          razorpay_payment_id?: string | null;
        };
      };
      registrations: {
        Row: {
          id: string;
          created_at: string;
          type: 'participant' | 'spectator';
          event_name: string;
          name: string;
          email: string;
          phone: string;
          number: number;
          spl_requirements: string | null;
          seat_no: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          type: 'participant' | 'spectator';
          event_name: string;
          name: string;
          email: string;
          phone: string;
          number: number;
          spl_requirements?: string | null;
          seat_no?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          type?: 'participant' | 'spectator';
          event_name?: string;
          name?: string;
          email?: string;
          phone?: string;
          number?: number;
          spl_requirements?: string | null;
          seat_no?: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          password_hash: string;
          verification_token: string | null;
          is_verified: boolean;
          reset_token: string | null;
          reset_token_expires: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          password_hash: string;
          verification_token?: string | null;
          is_verified?: boolean;
          reset_token?: string | null;
          reset_token_expires?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          password_hash?: string;
          verification_token?: string | null;
          is_verified?: boolean;
          reset_token?: string | null;
          reset_token_expires?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
  };
};

// Function to generate a random token
export const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Function to insert booking data
export const insertBooking = async (bookingData: {
  booking_type: string;
  sport: string;
  location: string;
  time_slot: string;
  date: string;
  players: number;
  duration: number;
  name: string;
  email: string;
  phone: string;
  total_amount: number;
  payment_mode: 'online' | 'pay_on_spot';
  razorpay_payment_id?: string | null;
}) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single();

  if (error) {
    console.error('Error inserting booking:', error);
    throw error;
  }

  return data;
};

// Function to insert registration data
export const insertRegistration = async (registrationData: {
  type: 'participant' | 'spectator';
  event_name: string;
  name: string;
  email: string;
  phone: string;
  number: number;
  spl_requirements?: string | null;
  seat_no?: string | null;
}) => {
  const { data, error } = await supabase
    .from('registrations')
    .insert([registrationData])
    .select()
    .single();

  if (error) {
    console.error('Error inserting registration:', error);
    throw error;
  }

  return data;
};

// Function to get all registrations
export const getRegistrations = async () => {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching registrations:', error);
    throw error;
  }

  return data;
};

// Function to get registrations by event
export const getRegistrationsByEvent = async (eventName: string) => {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('event_name', eventName)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching registrations by event:', error);
    throw error;
  }

  return data;
};

// Function to create a new user
export const signUp = async (userData: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        full_name: userData.name,
      },
      emailRedirectTo: `${window.location.origin}/confirm`,
    },
  });

  if (error) {
    console.error('Sign-up error:', error);
    throw error;
  }

  console.log('Sign-up response:', data);
  return { data, error };
};

// Function to sign in a user
export const signIn = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    console.error('Sign-in error:', error);
    throw error;
  }

  return { data, error };
};

// Function to sign in with OAuth provider
export const signInWithOAuth = async (provider: 'google' | 'twitter') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) {
    console.error(`OAuth ${provider} sign-in error:`, error);
    throw error;
  }

  return data;
};

// Function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }

  localStorage.removeItem('auth_session');
  sessionStorage.removeItem('auth_session');
};

// Function to get the current user
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Get current user error:', error);
    throw error;
  }

  return data.user;
};

// Function to persist session based on rememberMe
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

// Function to send confirmation email using Resend
export const sendConfirmationEmailWithResend = async (
  email: string,
  fullName: string,
  verificationToken: string,
  emailType: 'confirmation' | 'password-reset' = 'confirmation'
) => {
  if (!resend) {
    throw new Error('Resend client not initialized. Missing VITE_RESEND_API_KEY.');
  }

  const link = emailType === 'confirmation'
    ? `${window.location.origin}/confirm?token=${verificationToken}`
    : `${window.location.origin}/reset-password?token=${verificationToken}`;

  const subject = emailType === 'confirmation'
    ? 'Confirm Your ArenaHub Account'
    : 'Reset Your ArenaHub Password';

  const html = emailType === 'confirmation'
    ? `
        <h1>Hello, ${fullName}!</h1>
        <p>Thanks for signing up with ArenaHub! Please confirm your email by clicking the link below:</p>
        <a href="${link}" style="background-color: #ff5e14; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirm Email</a>
        <p>If you didn’t sign up, please ignore this email.</p>
        <p>Best,<br/>The ArenaHub Team</p>
      `
    : `
        <h1>Hello, ${fullName}!</h1>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <a href="${link}" style="background-color: #ff5e14; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour. If you didn’t request a reset, please ignore this email.</p>
        <p>Best,<br/>The ArenaHub Team</p>
      `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'ArenaHub <onboarding@resend.dev>',
      to: email,
      subject,
      html,
    });

    if (error) {
      console.error(`Error sending ${emailType} email:`, error);
      throw new Error(`Failed to send ${emailType} email: ${error.message}`);
    }

    console.log(`${emailType} email sent:`, data);
    return data;
  } catch (err) {
    console.error('Resend error:', err);
    throw err;
  }
};

// Function to reset password with token
export const resetPassword = async (token: string, newPassword: string) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('reset_token', token)
    .single();

  if (error || !user) {
    throw new Error('Invalid or expired reset token');
  }

  if (new Date() > new Date(user.reset_token_expires)) {
    throw new Error('Reset token has expired');
  }

  const { data, error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    throw new Error('Failed to reset password');
  }

  await supabase
    .from('users')
    .update({
      reset_token: null,
      reset_token_expires: null,
      updated_at: new Date().toISOString(),
    })
    .eq('reset_token', token);

  return data;
};

// Function to insert contact message
export const insertContactMessage = async (contactData: {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at?: string;
}) => {
  console.log('Attempting to insert contact data:', contactData); // Debug log
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([contactData])
    .select()
    .single();

  if (error) {
    console.error('Error inserting contact message:', error); // Detailed error log
    throw error;
  }

  console.log('Successfully inserted contact data:', data); // Debug log
  return data;
};