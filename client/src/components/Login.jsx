import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import logo from "../assets/health.webp";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./auth";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, recaptcha: captchaValue }),
      });

      const result = await response.json();
      const { success, jwttoken, fullName, medicalId, specialization, role } = result;

      if (success) {
        toast.success(role === "admin" ? "Welcome, Admin" : "Welcome back!", {
          icon: '✨',
          style: {
            borderRadius: '16px',
            background: '#333',
            color: '#fff',
          },
        });
        const userRole = role === "admin" ? "admin" : "user";
        login(fullName, jwttoken, userRole);
        sessionStorage.setItem("sp", specialization || "");
        sessionStorage.setItem("medicalId", medicalId || "");

        setTimeout(() => {
          navigate(userRole === "admin" ? "/dashboard" : "/");
        }, 1500);
      } else {
        toast.error(result.message || "Login failed.");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const HEALTH_HERO = "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&q=90";

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HEALTH_HERO})` }} />
        <div className="absolute inset-0 bg-slate-50/90" />
      </div>
      <Toaster position="top-right" />
      
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[440px] p-1 shadow-xl rounded-2xl glass-card"
      >
        <div className="glass-card p-10 rounded-[30px] flex flex-col items-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8"
          >
            <img src={logo} alt="Logo" className="w-48 h-auto drop-shadow-md" />
          </motion.div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
            <p className="text-slate-600 mt-2 font-medium">Empowering Women's Health</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary/80 ml-1">Medical ID / Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="text"
                  {...register("email", { required: "Identity is required" })}
                  className="premium-input w-full pl-12 text-slate-800 font-medium"
                  placeholder="Enter your credentials"
                />
              </div>
              {errors.email && (
                <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-xs text-red-500 mt-1 ml-1">
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-primary/80">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-primary hover:text-primary/70 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  className="premium-input w-full pl-12 pr-12 text-slate-800 font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-xs text-red-500 mt-1 ml-1">
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            <div className="flex justify-center scale-90 sm:scale-100">
              <ReCAPTCHA
                sitekey="6LcYbOMqAAAAABnhImukf_SpFrE6w7e_y2vdACr3"
                onChange={(value) => setCaptchaValue(value)}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="premium-button w-full flex items-center justify-center gap-2 group"
            >
              <span className="text-lg">
                {isSubmitting ? "Authenticating..." : "Sign In"}
              </span>
              {!isSubmitting && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              
              {/* Ripple Effect Placeholder */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity" />
            </motion.button>
          </form>

          <p className="mt-8 text-sm text-gray-500 font-medium">
            New to the platform?{" "}
            <Link to="/signup" className="text-primary font-bold hover:underline">
              Create Account
            </Link>
          </p>
          <p className="mt-4 text-[11px] text-slate-400 text-center leading-relaxed max-w-sm mx-auto">
            Dashboard administrators sign in with the <span className="font-semibold text-slate-500">ADMIN_EMAIL</span> and{" "}
            <span className="font-semibold text-slate-500">ADMIN_PASSWORD</span> values set in the backend{" "}
            <code className="text-[10px] bg-slate-100 px-1 rounded">.env</code> file.
          </p>
        </div>
      </motion.div>

      {/* Floating Particles/Shapes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          className="absolute w-2 h-2 rounded-full bg-white opacity-20 pointer-events-none"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

export default Login;

