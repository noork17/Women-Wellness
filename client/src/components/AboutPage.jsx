import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  Users,
  Award,
  Target,
  Globe,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Building,
  Calendar,
  TrendingUp,
  Shield,
  Zap,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Twitter,
} from "lucide-react";
import { HEALTH_IMAGES } from "../assets/healthImages";

const AboutPage = () => {
  const team = [
    {
      name: "Dr. Priya Sharma",
      role: "Chief Medical Officer",
      image: HEALTH_IMAGES.teamDoctor,
      specialty: "Oncology & Breast Health",
      experience: "18+ years",
    },
    {
      name: "Dr. Anitha Reddy",
      role: "Head of PCOS Research",
      image: HEALTH_IMAGES.teamNurse,
      specialty: "Gynecology & Endocrinology",
      experience: "15+ years",
    },
    {
      name: "Dr. Lakshmi Rao",
      role: "Lead Radiologist",
      image: HEALTH_IMAGES.teamResearch,
      specialty: "Diagnostic Imaging",
      experience: "12+ years",
    },
    {
      name: "Rajesh Kumar",
      role: "AI Technology Director",
      image: HEALTH_IMAGES.darkDoctor,
      specialty: "Machine Learning",
      experience: "10+ years",
    },
  ];

  const milestones = [
    { year: "2021", title: "SETV Founded", desc: "Initiative launched by AP Government" },
    { year: "2022", title: "AI Integration", desc: "Deployed AI-powered screening across 5 districts" },
    { year: "2023", title: "Mobile Vans", desc: "Launched 5 mobile screening units" },
    { year: "2024", title: "Full Coverage", desc: "Expanded to all 13 AP districts" },
    { year: "2025", title: "89,500+ Screenings", desc: "Milestone achievement in women's health" },
    { year: "2026", title: "Future Goals", desc: "Target: 200,000 screenings annually" },
  ];

  const values = [
    { icon: Heart, title: "Compassionate Care", desc: "Every woman deserves access to quality healthcare regardless of location or economic status" },
    { icon: Target, title: "Early Detection", desc: "Our mission is to catch diseases at the earliest stages when treatment is most effective" },
    { icon: Zap, title: "Innovation", desc: "Leveraging cutting-edge AI technology to improve diagnostic accuracy and speed" },
    { icon: Globe, title: "Accessibility", desc: "Bringing advanced healthcare to rural and underserved communities across AP" },
    { icon: Shield, title: "Trust & Privacy", desc: "Maintaining the highest standards of patient confidentiality and data security" },
    { icon: Users, title: "Community Focus", desc: "Working with local communities to build awareness and promote women's health" },
  ];

  const achievements = [
    { number: "89,500+", label: "Screenings Completed", icon: CheckCircle },
    { number: "94.3%", label: "AI Accuracy Rate", icon: Target },
    { number: "13", label: "Districts Covered", icon: MapPin },
    { number: "150+", label: "Expert Doctors", icon: Users },
    { number: "5", label: "Mobile Vans", icon: Building },
    { number: "2.4M+", label: "Women Served", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: `url(${HEALTH_IMAGES.darkHospital})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
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
      <section className="relative z-10 pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-6">
              <Sparkles size={16} />
              About SETV Health
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Transforming Women's Healthcare
              </span>
              <br />
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Across Andhra Pradesh
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              SETV (Smart Early Detection Technology for Women) is a government initiative combining 
              artificial intelligence with expert medical care to provide accessible, accurate, and 
              affordable health screenings for all women.
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl shadow-teal-500/10 mb-24"
          >
            <img src={HEALTH_IMAGES.landingTeam} alt="Our Team" className="w-full h-[400px] md:h-[500px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {achievements.slice(0, 4).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-2xl md:text-3xl font-bold text-teal-400">{item.number}</p>
                    <p className="text-sm text-slate-400">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-gradient-to-br from-teal-500/10 to-emerald-500/5 border border-teal-500/20"
            >
              <div className="w-14 h-14 rounded-2xl bg-teal-500/20 flex items-center justify-center mb-4">
                <Target className="text-teal-400" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-slate-400 leading-relaxed">
                To revolutionize women's healthcare in Andhra Pradesh by making early detection of 
                breast cancer, PCOS, and fibroids accessible to every woman, regardless of their 
                location or economic background. We believe that early detection saves lives, and 
                no woman should be denied this opportunity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/20"
            >
              <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-4">
                <Sparkles className="text-violet-400" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-slate-400 leading-relaxed">
                To become the gold standard in AI-powered women's health screening, expanding our 
                reach beyond Andhra Pradesh to serve women across India. We envision a future where 
                every woman has access to world-class diagnostic technology and expert medical care 
                within her community.
              </p>
            </motion.div>
          </div>

          {/* Core Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">Our Values</span>
              <h2 className="text-3xl font-bold mt-4">What Drives Us</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400/20 to-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <value.icon className="text-teal-400" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-slate-400 text-sm">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">Our Journey</span>
              <h2 className="text-3xl font-bold mt-4">Key Milestones</h2>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500 via-emerald-500 to-violet-500 hidden md:block" />
              <div className="space-y-8">
                {milestones.map((milestone, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      <div className={`inline-block p-6 rounded-2xl bg-slate-900/50 border border-slate-800 ${i % 2 === 0 ? "md:ml-auto" : "md:mr-auto"}`}>
                        <span className="text-teal-400 font-bold text-lg">{milestone.year}</span>
                        <h3 className="text-white font-bold mt-1">{milestone.title}</h3>
                        <p className="text-slate-400 text-sm mt-1">{milestone.desc}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex w-12 h-12 rounded-full bg-slate-900 border-4 border-teal-500 items-center justify-center z-10">
                      <Calendar size={18} className="text-teal-400" />
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">Our Team</span>
              <h2 className="text-3xl font-bold mt-4">Meet the Experts</h2>
              <p className="text-slate-400 mt-2">Dedicated professionals committed to women's health</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="relative rounded-2xl overflow-hidden mb-4">
                    <img src={member.image} alt={member.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      <button className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-teal-500 transition-colors">
                        <Linkedin size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-teal-500 transition-colors">
                        <Twitter size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-white">{member.name}</h3>
                  <p className="text-teal-400 text-sm">{member.role}</p>
                  <p className="text-slate-500 text-xs mt-1">{member.specialty} • {member.experience}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="p-12 rounded-3xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20">
              <h2 className="text-3xl font-bold mb-4">Ready to Take the First Step?</h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Join thousands of women who have taken control of their health with SETV's 
                AI-powered screening services.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/signup" className="px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-teal-500/25 transition-all">
                  Get Started
                  <ArrowRight size={18} />
                </Link>
                <Link to="/chat" className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-semibold hover:bg-white/10 transition-all">
                  Talk to Us
                </Link>
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

export default AboutPage;
