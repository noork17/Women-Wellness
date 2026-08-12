import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, User, Mail, Activity, Hospital, Award, History, Lock, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import logo from "../assets/health.webp";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const PasswordStrength = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("bg-gray-200");

  useEffect(() => {
    let s = 0;
    if (password.length > 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    setStrength(s);

    if (s === 0) { setLabel("Weak"); setColor("bg-red-400"); }
    else if (s <= 2) { setLabel("Medium"); setColor("bg-yellow-400"); }
    else if (s === 3) { setLabel("Strong"); setColor("bg-green-400"); }
    else { setLabel("Excellent"); setColor("bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"); }
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5 px-1">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
        <span>Security Level</span>
        <span className={s > 2 ? "text-emerald-500" : "text-gray-400"}>{label}</span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex gap-1">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full flex-1 transition-all duration-500 rounded-full ${
              step <= strength ? color : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  
  const navigate = useNavigate();
  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!captchaValue) {
      toast.error("Please verify reCAPTCHA");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, recaptcha: captchaValue }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Welcome aboard! Redirecting...", {
          icon: '🎉',
          style: { borderRadius: '16px', background: '#333', color: '#fff' }
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Connection error. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

  const HEALTH_IMG = "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1920&q=90";

  return (
    <div className="min-h-screen w-full flex bg-slate-50 overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Left Side: Health imagery */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="hidden lg:flex flex-col flex-1 relative overflow-hidden"
        style={{ backgroundImage: `linear-gradient(135deg, rgba(248,250,252,0.95) 0%, rgba(240,253,250,0.9) 100%), url(${HEALTH_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 opacity-30 animate-pulse">
          <div className="absolute top-[10%] left-[10%] w-64 h-64 rounded-full bg-white blur-3xl animate-float" />
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-secondary blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full p-20 text-center">
          <motion.img 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            src={logo} 
            alt="Logo" 
            className="w-64 h-auto drop-shadow-2xl mb-12"
          />
          <h1 className="text-5xl font-bold text-slate-800 tracking-tight mb-6">
            Pioneering <br /> 
            <span className="text-primary">Precision</span> Wellness
          </h1>
          <p className="text-xl text-gray-600 max-w-md font-medium leading-relaxed">
            Join the next generation of healthcare technology. Dedicated tools for exceptional women's care.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-16 w-full max-w-md">
            {[ 
              { icon: Activity, label: "Smart Analytics" },
              { icon: Sparkles, label: "AI Diagnosis" },
              { icon: CheckCircle2, label: "Patient First" },
              { icon: Lock, label: "Secure Data" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5, scale: 1.05 }}
                className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                  <feature.icon size={24} />
                </div>
                <span className="text-sm font-bold text-gray-700">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Side: Form */}
      <div className="flex-[1.2] flex items-center justify-center p-6 md:p-12 overflow-y-auto bg-slate-50">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl glass-card rounded-2xl p-8 md:p-12"
        >
          <div className="mb-10 lg:hidden flex flex-col items-center">
            <img src={logo} alt="Logo" className="w-32 mb-4" />
          </div>
          
          <div className="mb-12">
            <h2 className="text-4xl font-black text-gray-800 tracking-tight">Create Professional Account</h2>
            <p className="text-gray-500 mt-2 font-semibold">Step into the future of healthcare management.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Full Name */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-primary/80 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    {...register("fullName", { required: "Name is required" })}
                    className="premium-input w-full pl-12 text-slate-800 font-medium"
                    placeholder="Dr. Jane Doe"
                  />
                  {errors.fullName && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" size={18} />}
                </div>
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-primary/80 ml-1">Work Email</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    {...register("email", { required: "Valid email required" })}
                    className="premium-input w-full pl-12 text-slate-800 font-medium"
                    placeholder="jane@hospital.com"
                  />
                  {errors.email && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" size={18} />}
                </div>
              </motion.div>

              {/* Specialization */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-primary/80 ml-1">Specialization</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Award size={18} />
                  </div>
                  <select
                    {...register("specialization", { required: "Specialization required" })}
                    onChange={(e) => setIsOtherSelected(e.target.value === "Other")}
                    className="premium-input w-full pl-12 appearance-none text-slate-800 font-medium bg-white/40"
                  >
                    <option value="" className="text-gray-400">Select Field</option>
                    <option value="Gynaecology" className="text-slate-800">Gynaecology</option>
                    <option value="Pediatrics" className="text-slate-800">Pediatrics</option>
                    <option value="Oncology" className="text-slate-800">Oncology</option>
                    <option value="Other" className="text-slate-800">Other (Type below)</option>
                  </select>
                </div>
                <AnimatePresence>
                  {isOtherSelected && (
                    <motion.input
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="premium-input w-full mt-2"
                      placeholder="Specify specialization"
                      {...register("otherSpecialization")}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Hospital */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-primary/80 ml-1">Hospital / Clinic</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Hospital size={18} />
                  </div>
                  <input
                    {...register("hospitalName", { required: "Required" })}
                    className="premium-input w-full pl-12 text-slate-800 font-medium"
                    placeholder="Medical Center"
                  />
                </div>
              </motion.div>

              {/* Medical ID */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-primary/80 ml-1">Medical License ID</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Activity size={18} />
                  </div>
                  <input
                    {...register("medicalId", { required: "Required" })}
                    className="premium-input w-full pl-12 text-slate-800 font-medium"
                    placeholder="ML-9988-XY"
                  />
                </div>
              </motion.div>

              {/* Experience */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-primary/80 ml-1">Experience (Years)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <History size={18} />
                  </div>
                  <input
                    type="number"
                    {...register("yearsOfExperience", { required: "Required" })}
                    className="premium-input w-full pl-12 text-slate-800 font-medium"
                    placeholder="5"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-primary/80 ml-1">Create Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: true, minLength: 8 })}
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
                <PasswordStrength password={password} />
              </motion.div>

              {/* Confirm Password */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-primary/80 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword", { required: true })}
                    className={`premium-input w-full pl-12 pr-12 text-slate-800 font-medium ${
                      confirmPassword && password !== confirmPassword ? "border-red-300 bg-red-50/10" : ""
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[10px] font-bold text-red-400 mt-1 ml-1 uppercase tracking-wider">Passwords match error</p>
                )}
              </motion.div>
            </div>

            <div className="flex justify-center py-4">
              <ReCAPTCHA
                sitekey="6LcYbOMqAAAAABnhImukf_SpFrE6w7e_y2vdACr3"
                onChange={(v) => setCaptchaValue(v)}
              />
            </div>

            <div className="flex flex-col gap-6 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="premium-button w-full flex items-center justify-center gap-3 text-lg"
              >
                {isSubmitting ? "Processing..." : "Create Account"}
                {!isSubmitting && <ArrowRight size={20} />}
              </motion.button>
              
              <p className="text-center text-sm font-semibold text-gray-500">
                Already part of the network?{" "}
                <Link to="/login" className="text-primary font-black hover:underline underline-offset-4">
                  Log in here
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default SignupForm;
