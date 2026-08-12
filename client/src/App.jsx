import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HealthDashboard from "./components/HealthDashboard";
import BreastCancerDetection from "./components/Breastcancer";
import SignupForm from "./components/Register";
import Login from "./components/Login";
import AllReports from "@/components/kunal_components/AllReports";
import PatientDetails from "./components/kunal_components/PatientDetails";
import SideBar from "./components/kunal_components/SideBar";
import ForgotPassword from "./components/forgotpassword";
import ResetPassword from "./components/restpassword";
import { AuthProvider, useAuth } from "./components/auth";
import FibroidDetection from "./components/FibroidDetection";
import DetectionSelection from "./components/Selction";
import FAQ from "./components/Faq";
import ResultFrames from "./components/ResultFrames";
import PCOSDETECTION from "./components/PCOSdetection";
import LandingPage from "./components/LandingPage";
import ServiceLearnPage from "./components/ServiceLearnPage";
import ChatPage from "./components/ChatPage";
import AboutPage from "./components/AboutPage";
import ServicesPage from "./components/ServicesPage";
import ContactPage from "./components/ContactPage";
import PatientProfile from "./components/PatientProfile";
import AppointmentBooking from "./components/AppointmentBooking";
import MyAppointments from "./components/MyAppointments";
import HealthRecords from "./components/HealthRecords";
import Notifications from "./components/Notifications";
import SymptomChecker from "./components/SymptomChecker";
import RiskCalculator from "./components/RiskCalculator";
import HealthTracker from "./components/HealthTracker";
import HealthBlog from "./components/HealthBlog";
import HealthBlogArticle from "./components/HealthBlogArticle";
import CampRegistration from "./components/CampRegistration";
import FeedbackPage from "./components/FeedbackPage";
import DoctorDashboard from "./components/DoctorDashboard";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const name = sessionStorage.getItem('loggedInuser')


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 gap-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium">Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn || !name) {
    return <Navigate to="/login" replace />;
  }


  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen min-w-full flex flex-col bg-slate-50 text-slate-900">
          <Routes>
            {/* Public Pages */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/learn/:slug" element={<ServiceLearnPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <HealthDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/breast-cancer"
              element={
                <ProtectedRoute>
                  <BreastCancerDetection />
                </ProtectedRoute>
              }
            />
              <Route
              path="/fibroids-detection"
              element={
                <ProtectedRoute>
                  <FibroidDetection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pcos-detection"
              element={
                <ProtectedRoute>
                  <PCOSDETECTION />
                </ProtectedRoute>
              }
            />
              <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DetectionSelection/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-reports"
              element={
                <ProtectedRoute>
                  <AllReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/details"
              element={
                <ProtectedRoute>
                  <PatientDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faq"
              element={
                <ProtectedRoute>
                  <FAQ/>
                </ProtectedRoute>
              }
            />
              <Route
              path="/analyze-frames"
              element={
                <ProtectedRoute>
                  <ResultFrames/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PatientProfile/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-appointment"
              element={
                <ProtectedRoute>
                  <AppointmentBooking/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-appointments"
              element={
                <ProtectedRoute>
                  <MyAppointments/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/health-records"
              element={
                <ProtectedRoute>
                  <HealthRecords/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/symptom-checker"
              element={
                <ProtectedRoute>
                  <SymptomChecker/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/risk-calculator"
              element={
                <ProtectedRoute>
                  <RiskCalculator/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/health-tracker"
              element={
                <ProtectedRoute>
                  <HealthTracker/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <ProtectedRoute>
                  <HealthBlogArticle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog"
              element={
                <ProtectedRoute>
                  <HealthBlog/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/camps"
              element={
                <ProtectedRoute>
                  <CampRegistration/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute>
                  <FeedbackPage/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute>
                  <DoctorDashboard/>
                </ProtectedRoute>
              }
            />
           
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;