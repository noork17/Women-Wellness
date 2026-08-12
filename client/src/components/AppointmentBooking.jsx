import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Star,
  Phone,
  Heart,
  Stethoscope,
  Building,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { HEALTH_IMAGES } from "../assets/healthImages";
import {
  appendAppointment,
  combineDateAndTimeSlot,
} from "../utils/appointmentLocalStorage";

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchDoctor, setSearchDoctor] = useState("");

  const services = [
    { id: "breast", name: "Breast Cancer Screening", icon: Heart, color: "from-rose-500 to-pink-600", duration: "30 mins", price: "₹500" },
    { id: "pcos", name: "PCOS Detection", icon: Stethoscope, color: "from-violet-500 to-purple-600", duration: "45 mins", price: "₹800" },
    { id: "fibroid", name: "Fibroid Detection", icon: Stethoscope, color: "from-amber-500 to-orange-600", duration: "30 mins", price: "₹600" },
    { id: "comprehensive", name: "Comprehensive Checkup", icon: CheckCircle, color: "from-teal-500 to-emerald-600", duration: "90 mins", price: "₹1,500" },
  ];

  const doctors = [
    { id: 1, name: "Dr. Priya Sharma", specialty: "Oncologist", rating: 4.9, reviews: 234, experience: "18 yrs", image: HEALTH_IMAGES.teamDoctor, available: true },
    { id: 2, name: "Dr. Anitha Reddy", specialty: "Gynecologist", rating: 4.8, reviews: 189, experience: "15 yrs", image: HEALTH_IMAGES.teamNurse, available: true },
    { id: 3, name: "Dr. Lakshmi Rao", specialty: "Radiologist", rating: 4.7, reviews: 156, experience: "12 yrs", image: HEALTH_IMAGES.teamResearch, available: true },
    { id: 4, name: "Dr. Sunita Devi", specialty: "PCOS Specialist", rating: 4.9, reviews: 201, experience: "14 yrs", image: HEALTH_IMAGES.landingDoctor, available: false },
  ];

  const locations = [
    { id: 1, name: "SETV Main Center", address: "Benz Circle, Vijayawada", distance: "2.5 km" },
    { id: 2, name: "SETV Guntur Branch", address: "Brodipet, Guntur", distance: "35 km" },
    { id: 3, name: "Mobile Van - MV001", address: "Currently at Mangalagiri", distance: "8 km" },
  ];

  const timeSlots = [
    { time: "09:00 AM", available: true },
    { time: "09:30 AM", available: true },
    { time: "10:00 AM", available: false },
    { time: "10:30 AM", available: true },
    { time: "11:00 AM", available: true },
    { time: "11:30 AM", available: false },
    { time: "02:00 PM", available: true },
    { time: "02:30 PM", available: true },
    { time: "03:00 PM", available: true },
    { time: "03:30 PM", available: false },
    { time: "04:00 PM", available: true },
    { time: "04:30 PM", available: true },
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isDateAvailable = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && date.getDay() !== 0;
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const handleBooking = () => {
    if (selectedService && selectedDoctor && selectedDate && selectedTime && selectedLocation) {
      const scheduledAt = combineDateAndTimeSlot(selectedDate, selectedTime);
      appendAppointment({
        service: selectedService.name,
        doctor: selectedDoctor.name,
        doctorImage: selectedDoctor.image,
        specialty: selectedDoctor.specialty,
        scheduledAt,
        location: `${selectedLocation.name}, ${selectedLocation.address}`,
        status: "confirmed",
        canReschedule: true,
        hasReport: false,
      });
    }
    toast.success("Appointment booked successfully! Check your email for confirmation.", {
      style: { borderRadius: "16px", background: "#1e293b", color: "#fff" },
      duration: 4000,
    });
    setTimeout(() => navigate("/my-appointments"), 2000);
  };

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchDoctor.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchDoctor.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Toaster position="top-right" />
      
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 px-6 py-4 border-b border-slate-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-lg font-bold">Book Appointment</h1>
          <div className="w-16" />
        </div>
      </header>

      {/* Progress Steps */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-8">
          {["Service", "Doctor", "Date & Time", "Confirm"].map((label, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step > i + 1 ? "bg-emerald-500" : step === i + 1 ? "bg-teal-500" : "bg-slate-800"
              }`}>
                {step > i + 1 ? <CheckCircle size={20} /> : i + 1}
              </div>
              <span className={`ml-2 text-sm hidden sm:block ${step >= i + 1 ? "text-white" : "text-slate-500"}`}>{label}</span>
              {i < 3 && <div className={`w-12 sm:w-24 h-1 mx-2 rounded ${step > i + 1 ? "bg-emerald-500" : "bg-slate-800"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-6 rounded-2xl border text-left transition-all ${
                      selectedService?.id === service.id
                        ? "bg-teal-500/10 border-teal-500"
                        : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}>
                      <service.icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{service.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><Clock size={14} /> {service.duration}</span>
                      <span className="text-teal-400 font-semibold">{service.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Doctor */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold mb-4">Choose a Doctor</h2>
              <div className="relative mb-6">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchDoctor}
                  onChange={(e) => setSearchDoctor(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div className="space-y-4">
                {filteredDoctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => doctor.available && setSelectedDoctor(doctor)}
                    disabled={!doctor.available}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex gap-4 ${
                      selectedDoctor?.id === doctor.id
                        ? "bg-teal-500/10 border-teal-500"
                        : doctor.available
                        ? "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                        : "bg-slate-900/30 border-slate-800 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <img src={doctor.image} alt={doctor.name} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white">{doctor.name}</h3>
                        {!doctor.available && <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-400">Unavailable</span>}
                      </div>
                      <p className="text-sm text-teal-400">{doctor.specialty}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                        <span className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" /> {doctor.rating} ({doctor.reviews})</span>
                        <span>{doctor.experience} exp</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold mb-6">Select Date & Time</h2>
              
              {/* Location Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Select Location</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  {locations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setSelectedLocation(loc)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedLocation?.id === loc.id
                          ? "bg-teal-500/10 border-teal-500"
                          : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Building size={16} className="text-teal-400" />
                        <span className="font-medium text-white text-sm">{loc.name}</span>
                      </div>
                      <p className="text-xs text-slate-500">{loc.address}</p>
                      <p className="text-xs text-slate-400 mt-1">{loc.distance}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar */}
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 hover:bg-slate-800 rounded-lg">
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="font-bold">{currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 hover:bg-slate-800 rounded-lg">
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="py-2 text-slate-500 font-medium">{day}</div>
                  ))}
                  {getDaysInMonth(currentMonth).map((date, i) => (
                    <button
                      key={i}
                      onClick={() => isDateAvailable(date) && setSelectedDate(date)}
                      disabled={!isDateAvailable(date)}
                      className={`py-2 rounded-lg transition-all ${
                        !date ? "" :
                        selectedDate?.toDateString() === date.toDateString()
                          ? "bg-teal-500 text-white font-bold"
                          : isDateAvailable(date)
                          ? "hover:bg-slate-800 text-white"
                          : "text-slate-600 cursor-not-allowed"
                      }`}
                    >
                      {date?.getDate()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Available Slots for {formatDate(selectedDate)}
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {timeSlots.map((slot, i) => (
                      <button
                        key={i}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                          selectedTime === slot.time
                            ? "bg-teal-500 text-white"
                            : slot.available
                            ? "bg-slate-800/50 border border-slate-700 hover:border-teal-500/50"
                            : "bg-slate-900/30 text-slate-600 cursor-not-allowed line-through"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold mb-6">Confirm Booking</h2>
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedService?.color} flex items-center justify-center`}>
                    {selectedService && <selectedService.icon size={28} className="text-white" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{selectedService?.name}</h3>
                    <p className="text-sm text-slate-400">{selectedService?.duration} • {selectedService?.price}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
                  <img src={selectedDoctor?.image} alt="" className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-white">{selectedDoctor?.name}</h3>
                    <p className="text-sm text-teal-400">{selectedDoctor?.specialty}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="font-medium">{formatDate(selectedDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Time</p>
                      <p className="font-medium">{selectedTime}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="font-medium">{selectedLocation?.name}</p>
                    <p className="text-sm text-slate-400">{selectedLocation?.address}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400">Total Amount</span>
                    <span className="text-2xl font-bold text-teal-400">{selectedService?.price}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">* Payment can be made at the center. Insurance accepted.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </button>
          
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !selectedService) ||
                (step === 2 && !selectedDoctor) ||
                (step === 3 && (!selectedDate || !selectedTime || !selectedLocation))
              }
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleBooking}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:shadow-lg hover:shadow-teal-500/25 flex items-center gap-2 font-semibold transition-all"
            >
              <CheckCircle size={18} /> Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
