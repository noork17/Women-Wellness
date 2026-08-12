//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED///////////////////////
////////////////////PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR DEVELOPMENT)
//CODE CLEANED LAST ON : 27-02-2025//
//CODE LENGTH OF FILE FAQ.JSX LINE 1 - LINE 152//
//NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 5 CHECKS//
// DATE OF DEVELOPMENT START OF FAQ.JSX 20/2/2025 - 27/2/2025
///////////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React component displays the FAQ (Frequently Asked Questions) section of the Pregnancy Tracker application. 
// It provides users with essential information about the app's features, such as tracking pregnancy stages, 
// reminders, and more. 
// The FAQ component also includes a contact section with email, phone, and address details for further assistance.
/*FAQ Display System:

Dynamic accordion-based FAQ system.

Users can expand and collapse each question to view the answer.

Contact Information:

Displays official email, phone number, and office address.

Provides direct clickable links for email and phone calls.

Dynamic UI Components:

Collapsible panels for each FAQ entry.

Icons for contact information.

Top fixed navigation bar with company logo and sidebar integration.

Error Handling and Validation:

Ensures all FAQ entries are correctly rendered.
*/

// Key Libraries and Dependencies
/*
React: Core library for building the UI.

React Router: Navigation handled via react-router.

Tailwind CSS: Provides styling for layout and components.

React Icons: Used for email, phone, and location icons.

Custom Components: Uses the SideBar component for consistent navigation.
*/

//Data Flow:
/*
Static data for FAQs is mapped to render UI.

Contact details are statically coded but can be easily fetched from a config file if needed.
*/

//ENV OF FILE : FRONTEND
// LANGUAGES USED : REACT JS , TAILWIND CSS
//SECURITY CODE LEVEL : LOW (Read-Only Informational Component)
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, ChevronDown, HelpCircle, MessageCircle, Sparkles } from 'lucide-react';
import SideBar from './kunal_components/SideBar';
import logo from "../assets/health.webp";
import { BackToTop } from "./ui/BackToTop";
import { HEALTH_IMAGES } from "../assets/healthImages";

const FAQ = ({ logoutFunction }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'What is a pregnancy tracker?',
      answer: 'A pregnancy tracker helps you monitor your pregnancy week-by-week, providing updates on your baby’s development and your body’s changes.'
    },
    {
      question: 'How accurate is a pregnancy tracker?',
      answer: 'Pregnancy trackers are generally accurate based on standard development milestones, but individual experiences may vary. Always consult your healthcare provider.'
    },
    {
      question: 'Can I track my baby’s growth with this app?',
      answer: 'Yes, the app provides updates on your baby’s growth and what to expect each week.'
    },
    {
      question: 'Is the pregnancy tracker free to use?',
      answer: 'Yes, our basic pregnancy tracker features are free to use. Some advanced features may require a subscription.'
    },
    {
      question: 'Can I get reminders for doctor appointments?',
      answer: 'Yes, you can set up reminders for appointments, vitamins, and other important tasks.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.06] z-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HEALTH_IMAGES.medicalLab})` }} />
      </div>
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <nav className='h-20 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 fixed top-0 z-30 flex items-center px-6 lg:px-12 justify-between'>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <HelpCircle className="text-primary" size={20} />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Support Center</h1>
        </div>
        <motion.img
          whileHover={{ scale: 1.1 }}
          src={logo}
          alt="Logo"
          className="w-16 h-16 object-contain"
        />
      </nav>

      <SideBar logoutFunction={logoutFunction} className="z-40" />

      <main className="flex-1 pt-32 pb-20 px-6 lg:px-20 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* FAQ Accordion Section */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                <Sparkles size={12} /> common inquiries
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Frequently Asked <span className="text-primary">Questions</span></h2>
              <p className="text-slate-500 font-medium">Find quick answers to common questions about our wellness modules and tracking features.</p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`glass-card overflow-hidden transition-all duration-300 ${openIndex === index ? 'ring-2 ring-primary/20' : ''}`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left p-6 flex justify-between items-center group"
                  >
                    <span className={`text-lg font-bold transition-colors duration-300 ${openIndex === index ? 'text-primary' : 'text-slate-700 group-hover:text-primary'}`}>
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Contact & Support Section */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-32"
            >
              <div className="glass-card p-8 bg-gradient-to-br from-white/80 to-slate-50/50">
                <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6">
                  <MessageCircle className="text-secondary" size={28} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Need more help?</h3>
                <p className="text-slate-500 font-medium mb-8">Our dedicated support team is here to assist you with any technical or medical inquiries.</p>
                
                <div className="space-y-6">
                  {[
                    { icon: <Mail size={20} />, label: 'Email Support', value: 'support@setv.health', link: 'mailto:support@setv.health', color: 'bg-blue-100 text-blue-600' },
                    { icon: <Phone size={20} />, label: 'Call Us', value: '+1 (234) 567-890', link: 'tel:+1234567890', color: 'bg-green-100 text-green-600' },
                    { icon: <MapPin size={20} />, label: 'Headquarters', value: '123 Wellness Blvd, Tech City', link: '#', color: 'bg-purple-100 text-purple-600' }
                  ].map((item, idx) => (
                    <a 
                      key={idx}
                      href={item.link}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white transition-all duration-300 border border-transparent hover:border-slate-100 group"
                    >
                      <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-0.5">{item.label}</p>
                        <p className="text-slate-700 font-bold group-hover:text-primary transition-colors">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </div>

                <button className="premium-button w-full mt-10 py-4 flex items-center justify-center gap-2">
                  <MessageCircle size={18} /> Live Chat Support
                </button>
              </div>

              {/* Patient Resources Card */}
              <div className="mt-8 p-6 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-lg font-bold mb-2">Patient Resources</h4>
                  <p className="text-slate-400 text-sm mb-4">Download our comprehensive guide on using the detection modules effectively.</p>
                  <button className="text-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-1 hover:gap-2 transition-all">
                    Download Guide <ChevronDown size={14} className="-rotate-90" />
                  </button>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/20 rounded-full blur-[40px]" />
              </div>
            </motion.div>
          </div>

        </div>
      </main>
      <BackToTop />
    </div>
  );
};

export default FAQ;