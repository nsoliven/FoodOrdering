# Food Ordering App

This project is based on a comprehensive YouTube tutorial on Full Stack Mobile Development using React Native and Supabase. The original tutorial guides you through building a complete food ordering application with both frontend and backend functionality which can be found [here](https://www.youtube.com/watch?v=rIYzLhkG9TA)

## Project Overview

## Major Enhancements

**Password Reset System**
- Complete password reset flow with verification codes
- Custom Supabase integration with secure reset process
- Implementation includes:
  
  **Client-Side Components:**
  - `src/api/auth/index.ts`
  - `src/app/(auth)/forgot-password`
  - `src/app/(auth)/new-password`
  - `src/app/(auth)/verify-reset-code`
  
  **Server-Side Components:**
  - `src/app/api/auth/reset+api.ts`

**User Profile Improvements**
- Revamped profile page with enhanced user information display
- Improved user interface and experience

**API Architecture Upgrade**
- Products now managed through dedicated Expo API Route
- API endpoints located at `/src/app/api/products`
- Improved data flow and separation of concerns


## Enhanced Features

**Core Improvements:**
- Loading indicators for all asynchronous operations
- Error handling with try-catch blocks for image selection
- Fixed image display issues with the image picker
- Added validation for minimum cart items
- Empty state for "No orders found"
- Enhanced checkout process with safeguards
- Consistent loading indicators throughout the application

The base application from the tutorial includes:
- User interface for browsing and ordering food
- Admin dashboard for managing products and orders
- Supabase integration for backend functionality
- Authentication and user management
- Real-time data updates with subscriptions
