# Fitness App - Implementation Plan

## 📋 Project Overview

**Application:** Fitness/Gym Management App  
**Tech Stack:**

- **Frontend:** React.js with React Router
- **Backend:** Node.js with Express.js
- **Database:** MongoDB with Mongoose
- **File Storage:** Cloudinary (for images)
- **Authentication:** JWT + bcryptjs

---

## 🔍 Current State Analysis

### ✅ What Already Exists

| Feature                            | Status     | Notes                                           |
| ---------------------------------- | ---------- | ----------------------------------------------- |
| User Authentication (Login/Signup) | ✅ Done    | JWT-based with role support (admin/user)        |
| User Registration Form             | ✅ Done    | Collects personal info + 3 images               |
| Cloudinary Image Upload            | ✅ Done    | Payment slip, front/back body pictures          |
| Admin Dashboard (Basic)            | ✅ Partial | Shows user list table                           |
| Workout Schema                     | ✅ Partial | Basic structure exists but not fully integrated |
| Role-based Routing                 | ✅ Partial | Admin routes protected                          |

### ❌ What's Missing

| Feature                             | Priority  | Notes                                       |
| ----------------------------------- | --------- | ------------------------------------------- |
| Link User Account with Registration | 🔴 High   | No userId reference in registration         |
| User Profile Dashboard              | 🔴 High   | User can't view their own data              |
| Diet Plan Model & CRUD              | 🔴 High   | Doesn't exist                               |
| Registration Status Tracking        | 🔴 High   | No status field (pending/approved/rejected) |
| Admin Review Workflow               | 🔴 High   | No approval system                          |
| User-Workout Linking                | 🟡 Medium | Partially exists but broken                 |
| Notification System                 | 🟡 Medium | User doesn't know plan is ready             |
| User viewing assigned plans         | 🔴 High   | User can't see workout/diet                 |
| Height Field                        | 🟢 Low    | Missing for BMI calculation                 |
| Medical Conditions                  | 🟢 Low    | Important for diet planning                 |

---

## 📊 New Database Models Needed

### 1. Enhanced User Profile Schema (Update signupSchema.js)

```javascript
// Additional fields needed in signupSchema:
{
  // ... existing fields
  profileCompleted: Boolean,        // Has user submitted registration?
  registrationId: ObjectId,         // Link to their registration
  fullName: String,                 // User's full name
  phone: String,                    // Contact number
}
```

### 2. Enhanced Registration Schema (Update registerSchema.js)

```javascript
// Additional fields needed in registerSchema:
{
  // ... existing fields
  userId: ObjectId,                 // Reference to User account
  height: Number,                   // For BMI calculation (cm)
  fitnessGoal: String,              // Specific goal description
  medicalConditions: String,        // Any health issues
  dietaryRestrictions: String,      // Vegetarian, allergies, etc.
  experienceLevel: String,          // Beginner/Intermediate/Advanced

  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: String,               // Admin comments
  reviewedBy: ObjectId,             // Admin who reviewed
  reviewedAt: Date,                 // Review timestamp

  // Assigned plans
  dietPlan: ObjectId,               // Reference to DietPlan
  workoutPlan: ObjectId,            // Reference to WorkoutPlan (single)
}
```

### 3. NEW: Diet Plan Schema (Create dietPlanSchema.js)

```javascript
const dietPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signup",
      required: true,
    },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signup", // Admin who created
      required: true,
    },

    // Diet Details
    dailyCalories: Number,
    mealsPerDay: Number,

    meals: [
      {
        mealType: {
          type: String,
          enum: [
            "Breakfast",
            "Morning Snack",
            "Lunch",
            "Evening Snack",
            "Dinner",
            "Pre-Workout",
            "Post-Workout",
          ],
        },
        time: String, // "7:00 AM"
        foods: [
          {
            name: String,
            quantity: String,
            calories: Number,
            protein: Number,
            carbs: Number,
            fats: Number,
          },
        ],
        notes: String,
      },
    ],

    // Weekly variation (optional)
    weeklyPlan: [
      {
        day: String, // Monday, Tuesday, etc.
        meals: [
          /* same as above */
        ],
      },
    ],

    supplements: [
      {
        name: String,
        dosage: String,
        timing: String,
      },
    ],

    hydration: {
      dailyWaterLiters: Number,
      notes: String,
    },

    restrictions: [String], // Foods to avoid
    generalNotes: String,

    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
);
```

### 4. Enhanced Workout Plan Schema (Update workoutSchema.js)

```javascript
const workoutPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signup",
      required: true,
    },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signup",
      required: true,
    },

    planName: String,
    scheduleType: {
      type: String,
      enum: ["Body Building", "Fat Burning", "Ladies", "General Fitness"],
    },
    durationWeeks: Number,

    workoutDays: [
      {
        dayNumber: Number, // 1, 2, 3, etc.
        dayName: String, // "Day 1 - Chest & Triceps"
        targetMuscles: [String], // ['Chest', 'Triceps']
        exercises: [
          {
            name: String,
            sets: Number,
            reps: String, // "10-12" or "To Failure"
            restSeconds: Number,
            notes: String,
            videoUrl: String, // Optional tutorial link
          },
        ],
        cardio: {
          type: String,
          duration: Number, // minutes
          intensity: String,
        },
        notes: String,
      },
    ],

    restDays: [Number], // Which days are rest days
    generalInstructions: String,
    warmupRoutine: String,
    cooldownRoutine: String,

    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
);
```

### 5. NEW: Notification Schema (Create notificationSchema.js)

```javascript
const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signup",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "registration_approved",
        "registration_rejected",
        "plan_assigned",
        "plan_updated",
        "reminder",
      ],
    },
    title: String,
    message: String,
    isRead: {
      type: Boolean,
      default: false,
    },
    link: String, // Where to navigate on click
  },
  { timestamps: true }
);
```

---

## 📝 Implementation Todo List

### Phase 1: Database & Backend Foundation (Priority: HIGH)

#### 1.1 Update Existing Models

- [x] **Update `signupSchema.js`**
  - Add `profileCompleted`, `registrationId`, `fullName`, `phone` fields
- [x] **Update `registerSchema.js`**
  - Add `userId` field (reference to User)
  - Add `height`, `fitnessGoal`, `medicalConditions`, `dietaryRestrictions`, `experienceLevel`
  - Add `status` field with enum values
  - Add `adminNotes`, `reviewedBy`, `reviewedAt`
  - Add `dietPlan`, `workoutPlan` references

#### 1.2 Create New Models

- [x] **Create `dietPlanSchema.js`**
  - Full diet plan structure with meals, supplements, hydration
- [x] **Create `notificationSchema.js`**

  - Notification tracking for users

- [ ] **Update `workoutSchema.js`**
- [x] **Update `workoutSchema.js`**
  - Restructure to match new design with proper references (implemented as new `workoutPlanSchema.js` + `/workout-plan` routes)

#### 1.3 Create/Update API Controllers

- [x] **Create `dietPlanController.js`**

  - `createDietPlan` - Admin creates diet plan for user
  - `getDietPlan` - Get diet plan by ID
  - `getUserDietPlan` - Get diet plan for logged-in user
  - `updateDietPlan` - Admin updates diet plan
  - `deleteDietPlan` - Admin deletes diet plan

- [x] **Create `notificationController.js`**

  - `createNotification` - System creates notification
  - `getUserNotifications` - Get all notifications for user
  - `markAsRead` - Mark notification as read
  - `markAllAsRead` - Mark all as read
  - `deleteNotification` - Delete notification

- [x] **Update `registerController.js`**

  - Add `userId` when creating registration
  - Add `updateStatus` - Admin approves/rejects registration
  - Add `getMyRegistration` - User gets their own registration
  - Add `getPendingRegistrations` - Admin gets all pending

- [x] **Update `workoutController.js`**
  - Restructure to work with new schema (implemented as `workoutPlanController.js`)
  - Add proper user/registration references

#### 1.4 Create/Update API Routes

- [x] **Create `dietPlanRoute.js`**

  - POST `/diet-plan/create/:registrationId`
  - GET `/diet-plan/:id`
  - GET `/diet-plan/user/:userId`
  - PUT `/diet-plan/update/:id`
  - DELETE `/diet-plan/:id`

- [x] **Create `notificationRoute.js`**

  - GET `/notifications`
  - PUT `/notifications/read/:id`
  - PUT `/notifications/read-all`

- [x] **Update `registerRoute.js`**

  - Add status update endpoint
  - Add pending registrations endpoint

- [ ] **Create Middleware**
  - [x] `authMiddleware.js` - Verify JWT token
  - [x] `adminMiddleware.js` - Check if user is admin

---

### Phase 2: Frontend - User Features (Priority: HIGH)

#### 2.1 Update Registration Flow

- [ ] **Update `RegistrationForm.jsx`**
  - Add height field
  - Add fitness goal text area
  - Add medical conditions field
  - Add dietary restrictions dropdown/multi-select
  - Add experience level radio buttons
  - Link registration to logged-in user's account
  - Show success message with status info

#### 2.2 Create User Dashboard

- [x] **Create/Update `UserDashboard.jsx`** (implemented as `/me` using `UserHome.jsx`)

  - Show registration status (pending/approved/rejected)
  - Show assigned workout plan (if approved)
  - Show assigned diet plan (if approved)
  - Show notifications
  - Profile summary section

- [x] **Create `UserWorkoutView.jsx`**

  - Display assigned workout plan in readable format
  - Day-by-day workout breakdown
  - Exercise details with sets/reps

- [x] **Create `UserDietView.jsx`**

  - Display assigned diet plan
  - Meal-by-meal breakdown
  - Daily macros summary
  - Supplements list

- [x] **Create `NotificationList.jsx`**

  - Show all notifications
  - Mark as read functionality
  - Navigation on click

- [ ] **Create `UserProfile.jsx`**
  - View submitted registration details
  - View body pictures
  - Edit contact info (phone, email)

---

### Phase 3: Frontend - Admin Features (Priority: HIGH)

#### 3.1 Update Admin Dashboard

- [ ] **Update `AdminDashTable.jsx`**

  - [x] Load pending registrations from admin endpoint (`/register/pending`)
  - [x] Show status column
  - [x] Quick status actions (under_review / approve / reject)
  - [ ] Add status filter (All/Pending/Approved/Rejected)
  - [ ] Add status badge display
  - [ ] Improve table styling

- [ ] **Create `AdminSidebar.jsx`**
  - Dashboard overview
  - Pending registrations
  - All users
  - Workout plans
  - Diet plans

#### 3.2 User Review & Plan Creation

- [ ] **Update `CreateWorkout.jsx`**

  - [x] Fix Cloudinary image display (use `url` instead of Buffer decode)
  - [x] Link plan creation to registration (POST `/workout-plan/create/:registrationId`)
  - [x] Create diet plan in same flow (POST `/diet-plan/create/:registrationId`)
  - [x] Approve registration after assigning plans
  - [ ] Show user's submitted info clearly (all profile fields)
  - [ ] Add explicit reject flow in this screen (optional; admin can reject from dashboard)

- [ ] **Create `CreateDietPlan.jsx`**

  - Form to create diet plan for user
  - Add meals dynamically
  - Set calories, macros
  - Add supplements
  - Save as draft or publish

- [ ] **Create `ViewRegistrationDetails.jsx`**

  - Full page view of user registration
  - Display all photos properly
  - Admin notes section
  - Status update buttons
  - Link to create workout/diet

- [ ] **Create `AdminUserList.jsx`**
  - List all users with their status
  - Search and filter
  - View details action

---

### Phase 4: Integration & Polish (Priority: MEDIUM)

#### 4.1 Context & State Management

- [ ] **Update `GlobalContext.jsx`**

  - [x] Admin data wiring: pending registrations + status update actions
  - [ ] Add user authentication state
  - [ ] Add current user data
  - [ ] Add notifications state
  - [ ] Add registration status

- [ ] **Create `AuthContext.jsx`** (optional, can merge with Global)
  - Login/logout functions
  - Token management
  - User role access

#### 4.2 Protected Routes

- [x] **Update `App.js`**
  - Fix role-based routing (currently checked once at load)
  - Create ProtectedRoute component
  - Create AdminRoute component
  - Add proper redirects

#### 4.3 API Integration

- [x] **Create `api.js` service file**

  - Axios instance with base URL
  - Interceptors for auth tokens
  - Error handling

- [ ] **Update all components**
  - Use centralized API service
  - Add loading states
  - Add error handling
  - Add success/error toasts

---

### Phase 5: Enhancements (Priority: LOW)

#### 5.1 UX Improvements

- [ ] Add loading spinners
- [ ] Add toast notifications (react-toastify)
- [ ] Form validation (client-side)
- [ ] Confirm dialogs for destructive actions

#### 5.2 Additional Features

- [ ] Progress tracking for users
- [ ] Workout completion checkboxes
- [ ] Weight tracking over time
- [ ] Before/after photo comparison
- [ ] PDF export of plans
- [ ] Email notifications (optional)

---

## 📁 New File Structure

```
api/
├── Controllers/
│   ├── authController.js       (update)
│   ├── registerController.js   (update)
│   ├── dietPlanController.js   (NEW)
│   ├── workoutController.js    (update)
│   └── notificationController.js (NEW)
├── models/
│   ├── signupSchema.js         (update)
│   ├── registerSchema.js       (update)
│   ├── workoutSchema.js        (update)
│   ├── dietPlanSchema.js       (NEW)
│   └── notificationSchema.js   (NEW)
├── Routes/
│   ├── auth.js                 (update)
│   ├── registerRoute.js        (update)
│   ├── workoutRoute.js         (update)
│   ├── dietPlanRoute.js        (NEW)
│   └── notificationRoute.js    (NEW)
├── middleware/
│   ├── authMiddleware.js       (NEW)
│   └── adminMiddleware.js      (NEW)

client/src/
├── components/
│   ├── Dashboard/
│   │   ├── UserDashboard.jsx   (update)
│   │   ├── AdminDashboard.jsx  (NEW - rename from Dashboard.jsx)
│   │   └── AdminSidebar.jsx    (NEW)
│   ├── User/
│   │   ├── RegistrationForm.jsx (update)
│   │   ├── UserProfile.jsx     (NEW)
│   │   ├── UserWorkoutView.jsx (NEW)
│   │   └── UserDietView.jsx    (NEW)
│   ├── Admin/
│   │   ├── ViewRegistrationDetails.jsx (NEW)
│   │   ├── CreateDietPlan.jsx  (NEW)
│   │   └── AdminUserList.jsx   (NEW)
│   ├── Workout/
│   │   └── CreateWorkout.jsx   (update)
│   ├── Notifications/
│   │   └── NotificationList.jsx (NEW)
│   └── common/
│       ├── ProtectedRoute.jsx  (NEW)
│       ├── LoadingSpinner.jsx  (NEW)
│       └── Toast.jsx           (NEW)
├── contexts/
│   └── GlobalContext.jsx       (update)
├── services/
│   └── api.js                  (NEW)
```

---

## 🔄 User Flow Summary

### User Journey:

1. **Signup** → Create account (email, password)
2. **Login** → Access user area
3. **Registration** → Submit details + photos
4. **Wait** → Status shows "Pending"
5. **Notification** → Get notified when approved
6. **View Plans** → Access workout & diet plans

### Admin Journey:

1. **Login** → Access admin dashboard
2. **View Pending** → See new registrations
3. **Review** → Check user details & photos
4. **Create Plans** → Build workout + diet plan
5. **Approve** → Mark registration as approved
6. **User Notified** → User can now see their plans

---

## ⚠️ Known Issues to Fix

1. **CreateWorkout.jsx** - Using Buffer for images, should use Cloudinary URLs
2. **App.js** - `isAdmin` checked once at load, won't update on login/logout
3. **workoutSchema.js** - Uses CommonJS (`require`), should use ES modules
4. **GlobalContext.jsx** - Missing error handling for API calls
5. **Registration** - Not linked to user account

---

## 🚀 Getting Started

### Step 1: Start with Phase 1.1 - Update existing schemas

### Step 2: Create new schemas (Phase 1.2)

### Step 3: Update/Create controllers (Phase 1.3)

### Step 4: Update/Create routes (Phase 1.4)

### Step 5: Move to frontend updates

---

## 📅 Estimated Timeline

| Phase     | Tasks              | Estimated Time |
| --------- | ------------------ | -------------- |
| Phase 1   | Backend Foundation | 2-3 days       |
| Phase 2   | User Frontend      | 2-3 days       |
| Phase 3   | Admin Frontend     | 2-3 days       |
| Phase 4   | Integration        | 1-2 days       |
| Phase 5   | Enhancements       | 1-2 days       |
| **Total** |                    | **8-13 days**  |

---

_Document created: January 4, 2026_  
_Project: Fitness Master App_
