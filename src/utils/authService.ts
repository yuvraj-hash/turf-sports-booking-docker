// Minimal local storage auth service for App.tsx compatibility
export const authService = {
  getStoredToken: () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;
      return JSON.parse(token);
    } catch {
      return null;
    }
  },
  clearToken: () => {
    localStorage.removeItem('authToken');
  }
};
import bcrypt from "bcryptjs"
import { supabase } from "../lib/supabase"

// Generate a random token for email verification or password reset
export const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Hash password using bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Verify password against hash
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash)
}

// Create a new user in database
export const createUser = async (userData: {
  email: string
  password: string
  fullName: string
}) => {
  const { email, password, fullName } = userData

  // Check if user already exists
  const { data: existingUser } = await supabase.from("users").select("id").eq("email", email.toLowerCase()).single()

  if (existingUser) {
    throw new Error("User already exists with this email")
  }

  // Hash password and generate verification token
  const passwordHash = await hashPassword(password)
  const verificationToken = generateToken()

  // Insert user into database
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        email: email.toLowerCase(),
        password_hash: passwordHash,
        full_name: fullName,
        verification_token: verificationToken,
        is_verified: false,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`)
  }

  return { user: data, verificationToken }
}

// Verify user email
export const verifyUserEmail = async (token: string) => {
  const { data, error } = await supabase
    .from("users")
    .update({
      is_verified: true,
      verification_token: null,
      updated_at: new Date().toISOString(),
    })
    .eq("verification_token", token)
    .select()
    .single()

  if (error || !data) {
    throw new Error("Invalid or expired verification token")
  }

  return data
}

// Login user
export const loginUser = async (email: string, password: string) => {
  const { data: user, error } = await supabase.from("users").select("*").eq("email", email.toLowerCase()).single()

  if (error || !user) {
    throw new Error("Invalid email or password")
  }

  if (!user.is_verified) {
    throw new Error("Please verify your email before logging in")
  }

  const isValidPassword = await verifyPassword(password, user.password_hash)
  if (!isValidPassword) {
    throw new Error("Invalid email or password")
  }

  // Remove sensitive data before returning
  const { password_hash, verification_token, reset_token, ...safeUser } = user
  return safeUser
}

// Generate password reset token
export const generatePasswordResetToken = async (email: string) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, full_name")
    .eq("email", email.toLowerCase())
    .single()

  if (error || !user) {
    throw new Error("No user found with this email address")
  }

  const resetToken = generateToken()
  const resetTokenExpires = new Date(Date.now() + 3600000) // 1 hour from now

  const { error: updateError } = await supabase
    .from("users")
    .update({
      reset_token: resetToken,
      reset_token_expires: resetTokenExpires.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("email", email.toLowerCase())

  if (updateError) {
    throw new Error("Failed to generate reset token")
  }

  return { resetToken, user }
}

// Reset password with token
export const resetPassword = async (token: string, newPassword: string) => {
  const { data: user, error } = await supabase.from("users").select("*").eq("reset_token", token).single()

  if (error || !user) {
    throw new Error("Invalid or expired reset token")
  }

  // Check if token is expired
  if (new Date() > new Date(user.reset_token_expires)) {
    throw new Error("Reset token has expired")
  }

  const passwordHash = await hashPassword(newPassword)

  const { error: updateError } = await supabase
    .from("users")
    .update({
      password_hash: passwordHash,
      reset_token: null,
      reset_token_expires: null,
      updated_at: new Date().toISOString(),
    })
    .eq("reset_token", token)

  if (updateError) {
    throw new Error("Failed to reset password")
  }

  return true
}
