import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const LandingPage = lazy(() => { return import('./pages/home/LandingPage') })
const Home = lazy(() => { return import('./pages/home/Home') })
const Signup = lazy(() => { return import('./pages/auth/Signup') })
const Login = lazy(() => { return import('./pages/auth/Login') })
const Dashboard = lazy(() => { return import('./pages/dashboard/Dashoard') })
const Profile = lazy(() => { return import('./pages/profile/Profile') })
const AllFiles = lazy(() => { return import('./pages/files/AllFiles') })
const AddFile = lazy(() => { return import('./pages/files/AddFile') })
const SingleFile = lazy(() => { return import('./pages/files/SingleFile') })
const NotFound = lazy(() => { return import('./pages/NotFound') })

import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/profile/Profile";
// import NotFound from "./pages/NotFound";

function App() {

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" ></div>
      </div>
    }>
      <Routes>

        {/* Public Routes  */}
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />


        {/* Protected Route  */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/files/add-file" element={<AddFile />} />
          <Route path="/files/all-files" element={<AllFiles />} />
          <Route path="/files/:fileId" element={<SingleFile />} />
        </Route >

        {/* 404  */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App;


