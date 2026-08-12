import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  ArrowLeft,
  ArrowRight,
  Shield,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  Sparkles,
  Brain,
  Activity,
  Stethoscope,
  Microscope,
  Scan,
  FileCheck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  Truck,
  Award,
  Star,
  Zap,
} from "lucide-react";
import { HEALTH_IMAGES } from "../assets/healthImages";

const ServicesPage = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      id: "breast",
      title: "Breast Cancer Screening",
      subtitle: "AI-Enhanced Mammography & Ultrasound",
      image: HEALTH_IMAGES.breastScreening,
      icon: Heart,
      color: "from-rose-500 to-pink-600",
      bgColor: "from-rose-500/10 to-pink-600/10",
      borderColor: "border-rose-500/30",
      description: "Our comprehensive breast cancer screening combines traditional mammography with cutting-edge AI analysis to detect abnormalities at the earliest possible stage.",
      features: [
        "Digital mammography with AI-assisted analysis",
        "3D breast tomosynthesis available",
        "Ultrasound for dense breast tissue",
        "Same-day results for urgent cases",
        "Follow-up consultation included",
      ],
      process: [
        { step: 1, title: "Registration", desc: "Quick online or walk-in registration" },
        { step: 2, title: "Screening", desc: "15-20 minute painless procedure" },
        { step: 3, title: "AI Analysis", desc: "Immediate AI-powered image analysis" },
        { step: 4, title: "Expert Review", desc: "Radiologist verification of results" },
        { step: 5, title: "Results", desc: "Report within 24-48 hours" },
      ],
      stats: { accuracy: "94.5%", time: "24-48 hrs", price: "₹500-1500" },
      link: "/learn/breast-cancer",
    },
    {
      id: "pcos",
      title: "PCOS Detection",
      subtitle: "Comprehensive Hormonal & Ultrasound Analysis",
      image: HEALTH_IMAGES.pcosService,
      icon: Activity,
      color: "from-violet-500 to-purple-600",
      bgColor: "from-violet-500/10 to-purple-600/10",
      borderColor: "border-violet-500/30",
      description: "Polycystic Ovary Syndrome affects millions of women. Our integrated screening combines ultrasound imaging with hormonal analysis for accurate diagnosis.",
      features: [
        "Transvaginal/abdominal ultrasound",
        "Complete hormonal panel testing",
        "AI-assisted ovarian morphology analysis",
        "Metabolic health assessment",
        "Personalized treatment recommendations",
      ],
      process: [
        { step: 1, title: "Consultation", desc: "Initial symptom assessment" },
        { step: 2, title: "Blood Tests", desc: "Hormone level analysis" },
        { step: 3, title: "Ultrasound", desc: "Detailed ovarian imaging" },
        { step: 4, title: "AI Analysis", desc: "Pattern recognition for PCOS markers" },
        { step: 5, title: "Diagnosis", desc: "Comprehensive report & care plan" },
      ],
      stats: { accuracy: "93.8%", time: "48-72 hrs", price: "₹800-2000" },
      link: "/learn/pcos",
    },
    {
      id: "fibroid",
      title: "Fibroid Detection",
      subtitle: "Advanced Ultrasound Screening",
      image: HEALTH_IMAGES.fibroidService,
      icon: Scan,
      color: "from-amber-500 to-orange-600",
      bgColor: "from-amber-500/10 to-orange-600/10",
      borderColor: "border-amber-500/30",
      description: "Uterine fibroids are common but often undiagnosed. Our advanced ultrasound screening accurately identifies fibroid location, size, and characteristics.",
      features: [
        "High-resolution pelvic ultrasound",
        "3D fibroid mapping technology",
        "Size and growth tracking",
        "AI-assisted classification",
        "Treatment option counseling",
      ],
      process: [
        { step: 1, title: "Booking", desc: "Schedule at convenient time" },
        { step: 2, title: "Preparation", desc: "Simple pre-scan instructions" },
        { step: 3, title: "Scanning", desc: "20-30 minute ultrasound" },
        { step: 4, title: "Analysis", desc: "AI-enhanced fibroid detection" },
        { step: 5, title: "Report", desc: "Detailed findings & recommendations" },
      ],
      stats: { accuracy: "92.7%", time: "24-48 hrs", price: "₹600-1500" },
      link: "/learn/fibroids",
    },
  ];

  const packages = [
    {
      name: "Basic Screening",
      price: "₹500",
      period: "per visit",
      features: ["Single disease screening", "AI analysis included", "Digital report", "Email delivery"],
      popular: false,
    },
    {
      name: "Comprehensive",
      price: "₹1,500",
      period: "per visit",
      features: ["All three screenings", "Priority processing", "Expert consultation", "Follow-up included", "Physical report"],
      popular: true,
    },
    {
      name: "Annual Plan",
      price: "₹4,000",
      period: "per year",
      features: ["4 comprehensive screenings", "24/7 support access", "Home sample collection", "Specialist referrals", "Health tracking app"],
      popular: false,
    },
  ];

  const faqs = [
    { q: "How often should I get screened?", a: "For breast cancer, annual mammograms are recommended for women 40+. For PCOS and fibroids, screening frequency depends on symptoms and risk factors. Consult our specialists for personalized recommendations." },
    { q: "Is the AI screening as accurate as traditional methods?", a: "Our AI-enhanced screening achieves 93-95% accuracy, often surpassing traditional methods. The AI assists our expert radiologists, combining the best of both technology and human expertise." },
    { q: "What should I expect during the screening?", a: "Most screenings take 15-30 minutes and are non-invasive. Our staff will guide you through the process, ensuring your comfort throughout." },
    { q: "How long until I receive my results?", a: "Standard results are delivered within 24-48 hours. Urgent cases can receive same-day results. You'll receive results via email and our patient portal." },
    { q: "Are the screenings covered by insurance?", a: "Many insurance plans cover preventive screenings. We also offer government-subsidized rates and free camps for eligible patients. Contact us for details." },
  ];

  const mobileVans = [
    { id: "MV001", location: "Visakhapatnam District", status: "Active", screenings: 156 },
    { id: "MV002", location: "Krishna District", status: "Active", screenings: 142 },
    { id: "MV003", location: "Guntur District", status: "En Route", screenings: 128 },
    { id: "MV004", location: "East Godavari", status: "Active", screenings: 167 },
    { id: "MV005", location: "West Godavari", status: "Maintenance", screenings: 89 },
  ];

  const currentService = services[activeService];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: `url(${HEALTH_IMAGES.darkLab})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <Heart className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg">SETV Health</span>
          </Link>
          <Link to="/landing" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-6">
              <Stethoscope size={16} />
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Comprehensive Women's
              </span>
              <br />
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Health Screening Services
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              AI-powered diagnostic services for early detection of breast cancer, PCOS, and fibroids. 
              Accurate, accessible, and affordable healthcare for every woman.
            </p>
          </motion.div>

          {/* Service Tabs */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {services.map((service, i) => (
              <button
                key={service.id}
                onClick={() => setActiveService(i)}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  activeService === i
                    ? `bg-gradient-to-r ${service.color} text-white shadow-lg`
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <service.icon size={18} />
                {service.title}
              </button>
            ))}
          </div>

          {/* Service Detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-8 mb-24"
            >
              {/* Image Side */}
              <div className="relative">
                <div className="rounded-3xl overflow-hidden">
                  <img src={currentService.image} alt={currentService.title} className="w-full h-[400px] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                </div>
                
                {/* Stats Overlay */}
                <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-4">
                  {[
                    { label: "Accuracy", value: currentService.stats.accuracy },
                    { label: "Results", value: currentService.stats.time },
                    { label: "Starting", value: currentService.stats.price },
                  ].map((stat, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-center">
                      <p className="text-lg font-bold text-teal-400">{stat.value}</p>
                      <p className="text-xs text-slate-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Side */}
              <div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${currentService.bgColor} ${currentService.borderColor} border mb-4`}>
                  <currentService.icon size={16} className="text-white" />
                  <span className="text-sm font-medium">{currentService.subtitle}</span>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4">{currentService.title}</h2>
                <p className="text-slate-400 mb-6">{currentService.description}</p>

                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Key Features</h3>
                <ul className="space-y-2 mb-6">
                  {currentService.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle size={16} className="text-teal-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={currentService.link}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${currentService.color} font-semibold hover:shadow-lg transition-all`}
                  >
                    Learn more
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-600 text-slate-200 font-semibold hover:bg-slate-800/80 transition-all"
                  >
                    Start screening
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Process Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">How It Works</span>
              <h2 className="text-3xl font-bold mt-4">Simple 5-Step Process</h2>
            </div>
            <div className="grid md:grid-cols-5 gap-4">
              {currentService.process.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center h-full">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentService.color} flex items-center justify-center mx-auto mb-4 text-lg font-bold`}>
                      {step.step}
                    </div>
                    <h3 className="font-bold text-white mb-1">{step.title}</h3>
                    <p className="text-slate-400 text-sm">{step.desc}</p>
                  </div>
                  {i < currentService.process.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 w-4 text-slate-600">
                      <ArrowRight size={16} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pricing Packages */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">Pricing</span>
              <h2 className="text-3xl font-bold mt-4">Affordable Care Packages</h2>
              <p className="text-slate-400 mt-2">Government-subsidized rates for all women</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {packages.map((pkg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative p-6 rounded-2xl ${
                    pkg.popular 
                      ? "bg-gradient-to-b from-teal-500/20 to-emerald-500/10 border-2 border-teal-500" 
                      : "bg-slate-900/50 border border-slate-800"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full text-xs font-bold">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-teal-400">{pkg.price}</span>
                    <span className="text-slate-500 text-sm">{pkg.period}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle size={14} className="text-teal-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signup"
                    className={`block text-center py-3 rounded-xl font-semibold transition-all ${
                      pkg.popular
                        ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:shadow-lg hover:shadow-teal-500/25"
                        : "bg-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    Get Started
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mobile Vans */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">Mobile Screening</span>
              <h2 className="text-3xl font-bold mt-4">Screening Vans in Your Area</h2>
              <p className="text-slate-400 mt-2">Bringing healthcare to rural and remote communities</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mobileVans.map((van, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    van.status === "Active" ? "bg-emerald-500/20" : van.status === "En Route" ? "bg-amber-500/20" : "bg-slate-700"
                  }`}>
                    <Truck size={20} className={
                      van.status === "Active" ? "text-emerald-400" : van.status === "En Route" ? "text-amber-400" : "text-slate-500"
                    } />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{van.id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        van.status === "Active" ? "bg-emerald-500/20 text-emerald-400" : 
                        van.status === "En Route" ? "bg-amber-500/20 text-amber-400" : 
                        "bg-slate-700 text-slate-400"
                      }`}>
                        {van.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin size={12} />
                      {van.location}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{van.screenings} screenings this month</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">FAQ</span>
              <h2 className="text-3xl font-bold mt-4">Common Questions</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-xl bg-slate-900/50 border border-slate-800 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <span className="font-medium text-white">{faq.q}</span>
                    {expandedFaq === i ? <ChevronUp size={18} className="text-teal-400" /> : <ChevronDown size={18} className="text-slate-500" />}
                  </button>
                  <AnimatePresence>
                    {expandedFaq === i && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-4 text-slate-400">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-3xl overflow-hidden">
              <img src={HEALTH_IMAGES.patientCare} alt="Patient Care" className="w-full h-[300px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="px-8 md:px-12 max-w-xl">
                  <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Screened?</h2>
                  <p className="text-slate-300 mb-6">Book your appointment today and take the first step towards better health.</p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/signup" className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all">
                      <Calendar size={18} />
                      Book Now
                    </Link>
                    <a href="tel:+918661234567" className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/20 transition-all">
                      <Phone size={18} />
                      Call Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          © 2026 SETV Health. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ServicesPage;
