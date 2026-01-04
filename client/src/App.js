import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import RejectedDashboard from "./components/Dashboard/RejectedDashboard.jsx";
import UserDashboard from "./components/Dashboard/UserDashboard.jsx";
import Login from "./components/Login/Login";
import HomeProgram from "./components/Pages/HomeProgram";
import SignUp from "./components/Signup/Signup";
import MyPlans from "./components/User/MyPlans";
import NotificationList from "./components/User/NotificationList";
import RegistrationForm from "./components/User/RegistrationForm";
import UserDietView from "./components/User/UserDietView";
import UserHome from "./components/User/UserHome";
import UserWorkoutView from "./components/User/UserWorkoutView";
import CreateWorkout from "./components/Workout/CreateWorkout.jsx";

import { GlobalProvider } from "./contexts/GlobalContext.jsx";

import AdminRoute from "./components/common/AdminRoute";
import ProtectedRoute from "./components/common/ProtectedRoute";

import CustomizedSnackbar from "./ui-components/CustomSnackBar";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeProgram />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/registration"
          element={
            <ProtectedRoute>
              <RegistrationForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/diet"
          element={
            <ProtectedRoute>
              <UserDietView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workout"
          element={
            <ProtectedRoute>
              <UserWorkoutView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-plans"
          element={
            <ProtectedRoute>
              <MyPlans />
            </ProtectedRoute>
          }
        />

        <Route path="/UserDashboard" element={<UserDashboard />} />

        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <GlobalProvider>
                <Dashboard />
              </GlobalProvider>
            </AdminRoute>
          }
        />

        <Route
          path="/dashboard/rejected"
          element={
            <AdminRoute>
              <GlobalProvider>
                <RejectedDashboard />
              </GlobalProvider>
            </AdminRoute>
          }
        />

        <Route
          path="/workout-dashboard"
          element={
            <AdminRoute>
              <GlobalProvider>
                <Dashboard />
              </GlobalProvider>
            </AdminRoute>
          }
        />

        <Route
          path="/createworkout/:id"
          element={
            <AdminRoute>
              <GlobalProvider>
                <CreateWorkout />
              </GlobalProvider>
            </AdminRoute>
          }
        />
      </Routes>

      <CustomizedSnackbar />
    </div>
  );
}

export default App;
