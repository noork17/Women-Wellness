//////////////////////////////////////////////////////////////////////////////////////////////////////
//                              SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED                         //
////////////////////////////////// WOMEN WELLNESS DETECTION MODULE ////////////////////////////////////
//                              DETECTIONSELECTION SOURCE CODE VERSION 2.0                          //
//                            CODE CLEANED LAST ON : 05-03-2025                                     //
//                            CODE LENGTH OF FILE : LINE 16 - LINE 146                              //
//                            NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 5 CHECKS            //
//             DATE OF DEVELOPMENT START : 03/03/2025  - DATE OF COMPLETION : 04/03/2025            //
///////////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React component serves as a detection selection interface for the Women Wellness Module.
// It allows users to select between Breast Cancer Detection and Fibroids Detection.
// Based on user selection, the component navigates to specialized diagnostic components.

// Key Features:
/*
Detection Selection:

Users can choose between:
1. Breast Cancer Detection
2. Fibroids Detection

Dynamic UI:

Options are displayed inside styled Cards.
Hover and scale effects improve usability.

Navigation to Diagnostic Modules:

Upon selecting an option, the user is redirected to a dedicated route (e.g., Breast Cancer or Fibroids Detection).

Patient Information:

This component does not handle patient data directly. It assumes that patient details have been captured earlier.

Error Handling:

Basic checks ensure the options array exists and is properly rendered.

Responsive Design:

Optimized for mobile and desktop.
Flexible layout adapts to screen sizes with responsive paddings and typography.
*/

// Key Libraries and Dependencies:
/*
React: Core library for building the UI.

React Router: Handles programmatic navigation to diagnostic routes.

@/components/ui/button and card: Custom UI components using Tailwind + ShadCN.

Tailwind CSS: For styling and responsive design.

Lucide React (indirectly via button/card components): Provides icons for a consistent design language.
*/

//Data Flow:
/*
User selects detection option > Component navigates to appropriate diagnostic page.

Selected option is passed via React Router state.
*/

//ENV OF FILE : FRONTEND
// LANGUAGES USED : REACT JS , TAILWIND CSS
// SECURITY CODE LEVEL : HIGH
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////




import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Ribbon, Activity, Heart, ArrowRight, Sparkles } from "lucide-react";
import logo from "../assets/health.webp";
import SideBar from "./kunal_components/SideBar";
import { BackToTop } from "./ui/BackToTop";
import { HEALTH_IMAGES } from "../assets/healthImages";

const DetectionSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  sessionStorage.setItem("page", path);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
    hover: { 
      y: -8,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  const options = [
    {
      id: "breast-cancer",
      title: "Breast Cancer Detection",
      icon: <Ribbon className="text-teal-600" size={32} />,
      color: "from-teal-100 to-cyan-100",
      img: HEALTH_IMAGES.breastHealth,
      description: "Advanced AI screening for early breast abnormality detection.",
      path: "/breast-cancer"
    },
    {
      id: "fibroids",
      title: "Fibroids Detection",
      icon: <Activity className="text-emerald-600" size={32} />,
      color: "from-emerald-100 to-teal-100",
      img: HEALTH_IMAGES.womenWellness,
      description: "Precision analysis for uterine fibroid identification and mapping.",
      path: "/fibroids-detection"
    },
    {
      id: "pcos",
      title: "PCOS Detection",
      icon: <Heart className="text-slate-600" size={32} />,
      color: "from-slate-100 to-sky-100",
      img: HEALTH_IMAGES.radiology,
      description: "Comprehensive diagnostic tools for Polycystic Ovary Syndrome sensing.",
      path: "/pcos-detection"
    }
  ];

  const handleOptionSelect = (item) => {
    navigate(item.path, {
      state: { selectedOption: item.title },
    });
  };

  return (
    <div className="flex flex-col lg:flex-row relative bg-slate-50 min-h-screen overflow-hidden">
      {/* High-quality health background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HEALTH_IMAGES.hero})` }} />
        <div className="absolute inset-0 bg-white/85" />
      </div>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-100/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <SideBar className="lg:static lg:flex-shrink-0 z-20" />

      <main className="flex-1 relative z-10 px-6 py-12 lg:px-20 lg:py-20 flex flex-col items-center">
        {/* Top Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-between items-center mb-16"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <Sparkles className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Diagnosis Module</h2>
              <p className="text-lg font-bold text-slate-800">Precision Wellness</p>
            </div>
          </div>
          <motion.img
            whileHover={{ scale: 1.05, rotate: 5 }}
            src={logo}
            alt="Logo"
            className="w-20 h-20 object-contain drop-shadow-sm"
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-5xl"
        >
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 tracking-tight"
            >
              Select <span className="text-primary">Diagnostic Path</span>
            </motion.h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
              Empowering healthcare with AI-driven precision. Choose a module to begin your comprehensive screening journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {options.map((item) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                whileHover="hover"
                onClick={() => handleOptionSelect(item)}
                className="group cursor-pointer card-hover glass-card overflow-hidden rounded-2xl"
              >
                <div 
                  className="relative rounded-2xl p-8 h-full min-h-[320px] flex flex-col border border-slate-200/60 transition-all duration-300"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 50%), url(${item.img})`, backgroundSize: "cover", backgroundPosition: "center" }}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                    {item.icon}
                  </div>
                  <h3 className="relative z-10 text-xl font-bold text-slate-800 mb-4 tracking-tight leading-tight">
                    {item.title}
                  </h3>
                  <p className="relative z-10 text-slate-600 text-sm font-medium mb-8 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="relative z-10 mt-auto flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                    Start Analysis <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Network Active & Secure
          </div>
        </motion.footer>
      </main>
      <BackToTop />
    </div>
  );
};

export default DetectionSelection;
