import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Building,
  Globe,
  CheckCircle,
  AlertCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { HEALTH_IMAGES } from "../assets/healthImages";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Message sent successfully! We'll get back to you within 24 hours.", {
      style: { borderRadius: "16px", background: "#1e293b", color: "#fff" },
    });
    
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    { icon: MapPin, title: "Head Office", lines: ["SETV Health Center", "Vijayawada, Andhra Pradesh 520001"] },
    { icon: Phone, title: "Phone", lines: ["+91 866 123 4567", "+91 866 123 4568 (Helpline)"] },
    { icon: Mail, title: "Email", lines: ["support@setv-health.gov.in", "appointments@setv-health.gov.in"] },
    { icon: Clock, title: "Working Hours", lines: ["Mon - Sat: 8:00 AM - 8:00 PM", "Sunday: 9:00 AM - 2:00 PM"] },
  ];

  const districtOffices = [
    { district: "Visakhapatnam", phone: "+91 891 123 4567", address: "MVR Complex, Beach Road" },
    { district: "Vijayawada", phone: "+91 866 123 4567", address: "Benz Circle, MG Road" },
    { district: "Guntur", phone: "+91 863 123 4567", address: "Brodipet, Main Road" },
    { district: "Tirupati", phone: "+91 877 123 4567", address: "Tiruchanoor Road" },
    { district: "Rajahmundry", phone: "+91 883 123 4567", address: "Morampudi Ring Road" },
    { district: "Kurnool", phone: "+91 851 123 4567", address: "Station Road" },
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "#", color: "hover:bg-blue-600" },
    { icon: Twitter, label: "Twitter", href: "#", color: "hover:bg-sky-500" },
    { icon: Instagram, label: "Instagram", href: "#", color: "hover:bg-pink-600" },
    { icon: Linkedin, label: "LinkedIn", href: "#", color: "hover:bg-blue-700" },
    { icon: Youtube, label: "YouTube", href: "#", color: "hover:bg-red-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Toaster position="top-right" />
      
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: `url(${HEALTH_IMAGES.hospital})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
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

      {/* Hero */}
      <section className="relative z-10 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-6">
              <MessageSquare size={16} />
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                We're Here to
              </span>
              <br />
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Help You
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Have questions about our services? Need to schedule an appointment? 
              Our team is ready to assist you 24/7.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-24">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800">
                <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none transition-colors text-white placeholder-slate-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none transition-colors text-white placeholder-slate-500"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none transition-colors text-white placeholder-slate-500"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Subject</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none transition-colors text-white"
                      >
                        <option value="">Select subject</option>
                        <option value="appointment">Book Appointment</option>
                        <option value="inquiry">General Inquiry</option>
                        <option value="feedback">Feedback</option>
                        <option value="complaint">Complaint</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none transition-colors text-white placeholder-slate-500 resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-teal-500/25 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {contactInfo.map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-teal-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    {item.lines.map((line, j) => (
                      <p key={j} className="text-slate-400 text-sm">{line}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Social Links */}
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                <h3 className="font-bold text-white mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {socialLinks.map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center transition-all ${social.color}`}
                      title={social.label}
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Emergency */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 to-pink-600/10 border border-rose-500/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="text-rose-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Emergency Helpline</h3>
                    <p className="text-rose-400 text-xl font-bold">1800-123-SETV</p>
                    <p className="text-slate-400 text-sm mt-1">24/7 toll-free support</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* District Offices */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">Our Locations</span>
              <h2 className="text-3xl font-bold mt-4">District Offices</h2>
              <p className="text-slate-400 mt-2">Find a SETV center near you</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {districtOffices.map((office, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-teal-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Building size={18} className="text-teal-400" />
                      <h3 className="font-bold text-white">{office.district}</h3>
                    </div>
                    <a href={`tel:${office.phone}`} className="text-teal-400 text-sm hover:underline">{office.phone}</a>
                  </div>
                  <p className="text-slate-400 text-sm flex items-center gap-2">
                    <MapPin size={14} />
                    {office.address}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="rounded-3xl overflow-hidden border border-slate-800 h-[400px] relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d244573.0557089813!2d80.50065449999999!3d16.506173599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35eff9482d944b%3A0x939b7e84ab4a0265!2sVijayawada%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 pointer-events-none border-8 border-slate-950 rounded-3xl" />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-8 rounded-3xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Need Immediate Assistance?</h2>
              <p className="text-slate-400 mb-6">Our support team is available around the clock to help you.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/chat" className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all">
                  <MessageSquare size={18} />
                  Live Chat
                </Link>
                <Link to="/faq" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all">
                  View FAQ
                </Link>
                <a href="tel:+918661234567" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/10 transition-all">
                  <Phone size={18} />
                  Call Now
                </a>
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

export default ContactPage;
