import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User,
  Heart,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit3,
  Camera,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  FileText,
  Activity,
  Droplet,
  Scale,
  Ruler,
  Users,
  Briefcase,
  CreditCard,
  Bell,
  Lock,
  Trash2,
  Download,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { HEALTH_IMAGES } from "../assets/healthImages";

const PatientProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  
  const [profile, setProfile] = useState({
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    dob: "1990-05-15",
    gender: "Female",
    bloodGroup: "B+",
    height: "165",
    weight: "58",
    address: "123 MG Road, Vijayawada",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    pincode: "520001",
    emergencyName: "Rajesh Sharma",
    emergencyRelation: "Spouse",
    emergencyPhone: "+91 98765 43211",
    allergies: "Penicillin",
    conditions: "None",
    medications: "Multivitamins",
    insuranceProvider: "Star Health Insurance",
    policyNumber: "SHI123456789",
    validTill: "2027-03-15",
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!", {
      style: { borderRadius: "16px", background: "#1e293b", color: "#fff" },
    });
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "medical", label: "Medical History", icon: Activity },
    { id: "emergency", label: "Emergency Contact", icon: AlertCircle },
    { id: "insurance", label: "Insurance", icon: Shield },
    { id: "settings", label: "Settings", icon: Lock },
  ];

  const stats = [
    { label: "Total Screenings", value: "12", icon: FileText, color: "text-teal-400" },
    { label: "Last Visit", value: "Mar 5, 2026", icon: Calendar, color: "text-violet-400" },
    { label: "Health Score", value: "92/100", icon: Heart, color: "text-rose-400" },
    { label: "Next Appointment", value: "Mar 20", icon: Bell, color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Toaster position="top-right" />
      
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 px-6 py-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-lg font-bold">My Profile</h1>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
              isEditing
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            {isEditing ? <><Save size={16} /> Save</> : <><Edit3 size={16} /> Edit</>}
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-4xl font-bold">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <Camera size={18} />
                </button>
              )}
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold text-white">{profile.firstName} {profile.lastName}</h2>
              <p className="text-slate-400">{profile.email}</p>
              <p className="text-slate-500 text-sm mt-1">Patient ID: SETV-2024-00156</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-medium">Verified</span>
                <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-medium">Premium Member</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-slate-800/50">
                  <stat.icon size={20} className={`mx-auto mb-1 ${stat.color}`} />
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-teal-500 text-white"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6"
        >
          {activeTab === "personal" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <User size={20} className="text-teal-400" />
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={profile.dob}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors"
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              
              <h4 className="text-md font-semibold text-slate-300 mt-6 flex items-center gap-2">
                <MapPin size={16} className="text-teal-400" />
                Address
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-400 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={profile.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">PIN Code</label>
                  <input
                    type="text"
                    name="pincode"
                    value={profile.pincode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "medical" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Activity size={20} className="text-teal-400" />
                Medical Information
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center gap-3 mb-2">
                    <Droplet size={20} className="text-rose-400" />
                    <span className="text-sm text-slate-400">Blood Group</span>
                  </div>
                  {isEditing ? (
                    <select
                      name="bloodGroup"
                      value={profile.bloodGroup}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-lg font-bold"
                    >
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                        <option key={bg}>{bg}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-2xl font-bold text-white">{profile.bloodGroup}</p>
                  )}
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center gap-3 mb-2">
                    <Ruler size={20} className="text-blue-400" />
                    <span className="text-sm text-slate-400">Height</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="number"
                      name="height"
                      value={profile.height}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-lg font-bold"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-white">{profile.height} cm</p>
                  )}
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center gap-3 mb-2">
                    <Scale size={20} className="text-amber-400" />
                    <span className="text-sm text-slate-400">Weight</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="number"
                      name="weight"
                      value={profile.weight}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-lg font-bold"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-white">{profile.weight} kg</p>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Known Allergies</label>
                  <textarea
                    name="allergies"
                    value={profile.allergies}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Existing Conditions</label>
                  <textarea
                    name="conditions"
                    value={profile.conditions}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors resize-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-400 mb-2">Current Medications</label>
                  <textarea
                    name="medications"
                    value={profile.medications}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "emergency" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <AlertCircle size={20} className="text-rose-400" />
                Emergency Contact
              </h3>
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 mb-4">
                <p className="text-sm text-rose-300">This contact will be notified in case of medical emergencies.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Contact Name</label>
                  <input
                    type="text"
                    name="emergencyName"
                    value={profile.emergencyName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Relationship</label>
                  <select
                    name="emergencyRelation"
                    value={profile.emergencyRelation}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors"
                  >
                    <option>Spouse</option>
                    <option>Parent</option>
                    <option>Sibling</option>
                    <option>Child</option>
                    <option>Friend</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={profile.emergencyPhone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "insurance" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Shield size={20} className="text-teal-400" />
                Insurance Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Insurance Provider</label>
                  <input
                    type="text"
                    name="insuranceProvider"
                    value={profile.insuranceProvider}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Policy Number</label>
                  <input
                    type="text"
                    name="policyNumber"
                    value={profile.policyNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Valid Until</label>
                  <input
                    type="date"
                    name="validTill"
                    value={profile.validTill}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none disabled:opacity-60 transition-colors"
                  />
                </div>
              </div>
              <button className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center gap-2 text-sm transition-colors">
                <Download size={16} />
                Download Insurance Card
              </button>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Lock size={20} className="text-teal-400" />
                Account Settings
              </h3>
              <div className="space-y-4">
                <button className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-teal-500/50 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock size={20} className="text-slate-400" />
                    <span>Change Password</span>
                  </div>
                  <ArrowLeft size={16} className="rotate-180 text-slate-500" />
                </button>
                <button className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-teal-500/50 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell size={20} className="text-slate-400" />
                    <span>Notification Preferences</span>
                  </div>
                  <ArrowLeft size={16} className="rotate-180 text-slate-500" />
                </button>
                <button className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-teal-500/50 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    <Download size={20} className="text-slate-400" />
                    <span>Download My Data</span>
                  </div>
                  <ArrowLeft size={16} className="rotate-180 text-slate-500" />
                </button>
                <button className="w-full p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 flex items-center justify-between transition-colors text-rose-400">
                  <div className="flex items-center gap-3">
                    <Trash2 size={20} />
                    <span>Delete Account</span>
                  </div>
                  <ArrowLeft size={16} className="rotate-180" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PatientProfile;
