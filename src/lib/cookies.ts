'use server'

import { cookies } from 'next/headers';

// Function to set JWT token and user details in cookies (Server-side only)
export const setAuthDetails = (token: string, user: any) => {
  const cookieStore = cookies();
  
  // Set token with an expiry of 10 minutes
  cookieStore.set('token', token, { expires: new Date(Date.now() + 30 * 60 * 1000), path: '/' }); // 30 minutes from now
  // Store user details
  cookieStore.set('user', JSON.stringify(user), { expires: new Date(Date.now() + 30 * 60 * 1000), path: '/' }); // 30 minutes from now
};

// Function to get JWT token from cookies (Server-side only)
export const getAuthToken = () => {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  return token ? token.value : null;
};

// Function to get user details from cookies (Server-side only)
export const getUserDetails = () => {
  const cookieStore = cookies();
  const userCookie = cookieStore.get('user');
  return userCookie ? JSON.parse(userCookie.value) : null;
};

// Function to remove authentication details (Server-side only)
export const removeAuthDetails = () => {
  const cookieStore = cookies();
  cookieStore.set('token', '', { expires: new Date(0), path: '/' }); // Expire the token
  cookieStore.set('user', '', { expires: new Date(0), path: '/' }); // Expire the user details
};