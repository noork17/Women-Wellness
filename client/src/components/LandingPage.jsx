import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  Shield,
  Activity,
  Users,
  Award,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ChevronDown,
  Play,
  Star,
  CheckCircle,
  Zap,
  Brain,
  Stethoscope,
  Calendar,
  Clock,
  MessageCircle,
  Menu,
  X,
  ChevronUp,
  Sparkles,
  Target,
  TrendingUp,
  Globe,
  Truck,
  AlertTriangle,
} from "lucide-react";
import { HEALTH_IMAGES } from "../assets/healthImages";

/** Default: https://youtu.be/hMzfGZnaPN8 — override with VITE_LANDING_DEMO_VIDEO_ID if needed */
const DEMO_VIDEO_EMBED =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_LANDING_DEMO_VIDEO_ID
    ? `https://www.youtube-nocookie.com/embed/${import.meta.env.VITE_LANDING_DEMO_VIDEO_ID}?rel=0`
    : "https://www.youtube-nocookie.com/embed/hMzfGZnaPN8?rel=0";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!demoOpen) return;
    const onKey = (e) => e.key === "Escape" && setDemoOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [demoOpen]);

  const features = [
    { icon: Brain, title: "AI-Powered Diagnosis", desc: "Advanced machine learning algorithms for accurate early detection", color: "from-violet-500 to-purple-600" },
    { icon: Shield, title: "99.2% Accuracy", desc: "Industry-leading precision in breast cancer, PCOS, and fibroid detection", color: "from-emerald-500 to-teal-600" },
    { icon: Stethoscope, title: "Expert Doctors", desc: "Network of 150+ specialized gynecologists across Andhra Pradesh", color: "from-rose-500 to-pink-600" },
    { icon: Truck, title: "Mobile Vans", desc: "5 fully equipped screening vans reaching rural communities", color: "from-amber-500 to-orange-600" },
    { icon: Clock, title: "Quick Results", desc: "Get your screening results within 24-48 hours", color: "from-cyan-500 to-blue-600" },
    { icon: Globe, title: "13 Districts", desc: "Comprehensive coverage across all AP districts", color: "from-indigo-500 to-violet-600" },
  ];

  const stats = [
    { value: "89,500+", label: "Screenings Completed" },
    { value: "94.3%", label: "AI Confidence Score" },
    { value: "13", label: "Districts Covered" },
    { value: "150+", label: "Expert Doctors" },
  ];

  const services = [
    { title: "Breast Cancer Screening", desc: "Early detection through mammography and AI analysis", image: HEALTH_IMAGES.breastScreening, link: "/learn/breast-cancer" },
    { title: "PCOS Detection", desc: "Comprehensive polycystic ovary syndrome screening", image: HEALTH_IMAGES.pcosService, link: "/learn/pcos" },
    { title: "Fibroid Detection", desc: "Ultrasound-based uterine fibroid identification", image: HEALTH_IMAGES.fibroidService, link: "/learn/fibroids" },
  ];

  const testimonials = [
    { name: "Dr. Lakshmi Rao", role: "Gynecologist, Visakhapatnam", text: "SETV's AI-powered screening has revolutionized our early detection rates. We've seen a 40% improvement in identifying Stage 1 cases.", avatar: HEALTH_IMAGES.teamDoctor },
    { name: "Sunita Devi", role: "Patient, Guntur", text: "The mobile van came to our village. I never thought I'd have access to such advanced screening. Thank you for potentially saving my life.", avatar: HEALTH_IMAGES.patientCare },
    { name: "Dr. Anitha Kumar", role: "PCOS Specialist, Krishna", text: "The comprehensive dashboard and real-time analytics help us serve patients better. It's a game-changer for women's healthcare in AP.", avatar: HEALTH_IMAGES.teamNurse },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const demoSteps = [
    { title: "Register & book", text: "Create your SETV account or walk into a mobile camp in your district." },
    { title: "Guided capture", text: "Staff help you upload imaging or video using standardized clinical protocols." },
    { title: "AI + specialist review", text: "Models surface suspicious patterns; licensed doctors sign off every report." },
    { title: "Actionable report", text: "Download or share results with your gynecologist within 24–48 hours." },
  ];

  const impactStats = [
    {
      headline: "#1 cancer women hear about first",
      body: "Breast cancer is the most commonly diagnosed cancer in women globally. Screening shifts the story from crisis to control.",
      icon: AlertTriangle,
    },
    {
      headline: "Early vs. late changes everything",
      body: "When breast cancer is found while it is still localized, modern treatment outcomes are far stronger than after it has spread—timing is not luck; it is access.",
      icon: Target,
    },
    {
      headline: "Years lost to “maybe next month”",
      body: "PCOS and fibroids often hide behind irregular periods and pain. Structured screening closes the gap between symptoms and a named diagnosis.",
      icon: Clock,
    },
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-slate-900/50" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
                <Heart className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">SETV</h1>
                <p className="text-[10px] text-slate-400 -mt-1">Women Wellness</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {["Home", "Features", "Services", "About", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Link to="/login" className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all">
                Get Started
              </Link>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-slate-400">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800"
            >
              <div className="px-6 py-4 space-y-4">
                {["Home", "Features", "Services", "About", "Contact"].map((item) => (
                  <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="block w-full text-left text-slate-300 hover:text-teal-400 py-2">
                    {item}
                  </button>
                ))}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <Link to="/login" className="block text-center py-2 text-slate-300">Sign In</Link>
                  <Link to="/signup" className="block text-center py-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl font-semibold">Get Started</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${HEALTH_IMAGES.darkMedical})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
                <Sparkles size={16} className="text-teal-400" />
                <span className="text-sm text-teal-400 font-medium">AI-Powered Women's Healthcare</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Early Detection
                </span>
                <br />
                <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  Saves Lives
                </span>
              </h1>
              
              <p className="text-lg text-slate-400 mb-8 max-w-xl">
                Advanced AI-powered screening for breast cancer, PCOS, and fibroids. 
                Serving 2.4M+ women across 13 districts in Andhra Pradesh with 94.3% accuracy.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/signup" className="group px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl font-semibold text-lg shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 transition-all flex items-center gap-2">
                  Start Screening
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <button
                  type="button"
                  onClick={() => setDemoOpen(true)}
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <Play size={20} className="text-teal-400" />
                  Watch Demo
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-teal-500/10">
                <img src={HEALTH_IMAGES.landingDoctor} alt="Healthcare" className="w-full h-[500px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 border border-slate-800 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="text-emerald-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">89,500+</p>
                    <p className="text-xs text-slate-400">Successful Screenings</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute -top-4 -right-4 bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 border border-slate-800 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                    <Brain className="text-teal-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">94.3%</p>
                    <p className="text-xs text-slate-400">AI Accuracy</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <button onClick={() => scrollToSection("features")} className="flex flex-col items-center text-slate-500 hover:text-teal-400 transition-colors">
            <span className="text-xs mb-2">Scroll to explore</span>
            <ChevronDown className="animate-bounce" size={24} />
          </button>
        </motion.div>
      </section>

      {/* Impact — high-attention awareness */}
      <section id="impact" className="relative py-20 md:py-28 border-y border-red-500/20 bg-gradient-to-b from-red-950/40 via-slate-950 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(100%,48rem)] h-32 bg-red-500/10 blur-3xl rounded-full" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-14"
          >
            <span className="text-red-400/90 font-semibold text-sm uppercase tracking-widest">The reality gap</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-4 leading-tight">
              Most “late” diagnoses were never late—
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-300">
                {" "}
                they were never screened.
              </span>
            </h2>
            <p className="text-slate-400 mt-5 text-lg">
              SETV exists to collapse the distance between a woman in a village and the same standard of triage she would expect in a metro hospital.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {impactStats.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="p-6 md:p-8 rounded-2xl bg-slate-900/70 border border-red-500/20 hover:border-red-500/35 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center mb-5">
                  <item.icon className="text-red-400" size={26} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.headline}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-600 mt-10 max-w-2xl mx-auto">
            Educational framing based on global public-health literature; individual risk varies. SETV supports screening and triage—it is not a substitute for in-person medical diagnosis.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Cutting-Edge Healthcare Technology
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Combining artificial intelligence with expert medical care to provide the most accurate and accessible women's health screenings.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="text-white" size={26} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: `url(${HEALTH_IMAGES.darkLab})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Comprehensive Women's Health Screening
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative rounded-3xl overflow-hidden"
              >
                <div className="absolute inset-0">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                </div>
                <div className="relative p-8 pt-48">
                  <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{service.desc}</p>
                  <Link to={service.link} className="inline-flex items-center gap-2 text-teal-400 font-semibold text-sm group-hover:gap-3 transition-all">
                    Learn More <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                What People Say
              </span>
            </h2>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-slate-800 text-center"
              >
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={24} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-lg md:text-xl text-slate-300 italic mb-8">"{testimonials[activeTestimonial].text}"</p>
                <div className="flex items-center justify-center gap-4">
                  <img src={testimonials[activeTestimonial].avatar} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-teal-500" />
                  <div className="text-left">
                    <p className="font-bold text-white">{testimonials[activeTestimonial].name}</p>
                    <p className="text-sm text-slate-400">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeTestimonial ? "w-8 bg-teal-500" : "bg-slate-700"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">About SETV</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
                <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Empowering Women's Health Across Andhra Pradesh
                </span>
              </h2>
              <p className="text-slate-400 mb-6">
                SETV (Smart Early Detection Technology for Women) is a government-backed initiative combining 
                AI technology with healthcare expertise to provide accessible, accurate, and affordable 
                health screenings for women across all 13 districts of Andhra Pradesh.
              </p>
              <p className="text-slate-400 mb-8">
                Our mission is to detect breast cancer, PCOS, and fibroids at their earliest stages, 
                when treatment is most effective and outcomes are best.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Target, text: "Early Detection Focus" },
                  { icon: Users, text: "Community Outreach" },
                  { icon: Award, text: "Certified Experts" },
                  { icon: TrendingUp, text: "Proven Results" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                    <item.icon size={20} className="text-teal-400" />
                    <span className="text-sm text-slate-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden">
                <img src={HEALTH_IMAGES.landingTeam} alt="Our Team" className="w-full h-[400px] object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
                <p className="text-3xl font-bold text-teal-400">5+</p>
                <p className="text-sm text-slate-400">Years of Service</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${HEALTH_IMAGES.darkDoctor})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-emerald-900/90" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-teal-100/80 text-lg mb-8 max-w-2xl mx-auto">
              Schedule your screening today and join thousands of women who have taken the first step towards better health.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup" className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-semibold text-lg hover:bg-slate-100 transition-all flex items-center gap-2">
                Book Appointment
                <Calendar size={20} />
              </Link>
              <Link to="/chat" className="px-8 py-4 bg-white/10 border border-white/20 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all flex items-center gap-2">
                Chat with Expert
                <MessageCircle size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">Contact Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: "Address", text: "SETV Health Center, Vijayawada, Andhra Pradesh 520001" },
              { icon: Phone, title: "Phone", text: "+91 866 123 4567" },
              { icon: Mail, title: "Email", text: "support@setv-health.gov.in" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center hover:border-teal-500/30 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-teal-400" size={24} />
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                <Heart className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">SETV Health</h3>
                <p className="text-xs text-slate-500">Women Wellness Initiative</p>
              </div>
            </div>
            <p className="text-slate-500 text-sm">© 2026 SETV Health. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo modal */}
      <AnimatePresence>
        {demoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-modal-title"
            onClick={() => setDemoOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl shadow-teal-500/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setDemoOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Close demo"
              >
                <X size={20} />
              </button>
              <div className="p-6 md:p-8 pt-14 md:pt-8">
                <h2 id="demo-modal-title" className="text-2xl font-bold text-white mb-2">
                  See how SETV works
                </h2>
                <p className="text-slate-400 text-sm mb-6">
                  Short educational video, then the four steps our patients experience inside the platform.
                </p>
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-800 bg-black mb-8">
                  <iframe
                    title="SETV demo — educational video"
                    src={DEMO_VIDEO_EMBED}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h3 className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-4">Your journey</h3>
                <ol className="space-y-4">
                  {demoSteps.map((step, i) => (
                    <li
                      key={i}
                      className="flex gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800"
                    >
                      <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-sm">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-white">{step.title}</p>
                        <p className="text-sm text-slate-400 mt-1">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/signup"
                    onClick={() => setDemoOpen(false)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 font-semibold text-white"
                  >
                    Start screening
                    <ArrowRight size={18} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDemoOpen(false)}
                    className="px-6 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/25 hover:bg-teal-600 transition-colors z-40"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
