# Food Ordering App

This project is based on a comprehensive YouTube tutorial on Full Stack Mobile Development using React Native and Supabase. The original tutorial guides you through building a complete food ordering application with both frontend and backend functionality which can be found [here](https://www.youtube.com/watch?v=rIYzLhkG9TA)

## Major Enhancements

### Password Reset System

![reset-password-desk](https://github.com/user-attachments/assets/c13b3ed1-64af-4b10-883c-61eb4c36764b)
- Complete password reset flow with verification codes
- Custom Supabase integration with secure EXPO API ROUTE reset process
- Implementation Files:

  **Client-Side Components:**
  - `src/api/auth/index.ts`
  - `src/app/(auth)/forgot-password`
  - `src/app/(auth)/new-password`
  - `src/app/(auth)/verify-reset-code`
  
  **Server-Side Components:**
  - `src/app/api/auth/reset+api.ts`

### User Profile Improvements
- Revamped profile page with enhanced user information display
- Improved user interface on many pages


<div align="center">
  <img width="250" alt="image" src="https://github.com/user-attachments/assets/687cd06c-93d6-4120-9ca4-fa77005ea154" />
  <img width="250" alt="image" src="https://github.com/user-attachments/assets/abd1607a-932a-4cc9-b196-9b8880367ab4" />
  <img width="250" alt="image" src="https://github.com/user-attachments/assets/7e44d1ec-337b-47fc-8c82-8b840010b5be" />
  <img width="250" alt="image" src="https://github.com/user-attachments/assets/1f45a6ef-5791-4ef6-aaf3-592a426640b3" />
  <img width="250" alt="image" src="https://github.com/user-attachments/assets/1924f9bd-7f70-4d81-817c-b406e7973381" />
</div>


### PRODUCTS EXPO API ROUTES Architecture Upgrade
- Products now managed through dedicated Expo API Route
- API endpoints located at `/src/app/api/products`
- Improved data flow and separation of concerns


```zsh
nevryks@m1p-nv ~ % curl http://localhost:8081/api/products | jq   
  {
    "id": 20,
    "created_at": "2025-03-19T00:30:04.653321+00:00",
    "name": "Pepperoni",
    "image": "0d357d85-d5e6-4e0a-9acc-069452ec67c7.png",
    "price": 10.99
  },
  {
    "id": 22,
    "created_at": "2025-03-19T00:31:32.286456+00:00",
    "name": "Six Cheese",
    "image": "79624e45-8093-450c-89ed-01bf2a9ca921.png",
    "price": 12.99
  },
  {
    "id": 23,
    "created_at": "2025-03-19T00:31:58.921223+00:00",
    "name": "Deluxe",
    "image": "3c8a32ad-f9a1-47bd-a981-3ee1802d2075.png",
    "price": 13.99
  }
# and continuing on........
```


## Enhanced Features

**Core Improvements:**
- Loading indicators for all asynchronous operations
- Error handling with try-catch blocks for many files
  - `/src/providers`
- Added validation for minimum cart items
- Empty state for "No orders found"
- Enhanced checkout process with safeguards
- Consistent loading indicators throughout the application
- Improved notification system for order updates
  - `/src/lib/client/notifications.tsx

The base application from the tutorial includes:
- User interface for browsing and ordering food
- Admin dashboard for managing products and orders
- Supabase integration for backend functionality
- Authentication and user management
- Real-time data updates with subscriptions


## Table Visualizer
<img width="1242" alt="image" src="https://github.com/user-attachments/assets/749b24dc-f0a4-4760-bb08-b1279f1e6932" />
