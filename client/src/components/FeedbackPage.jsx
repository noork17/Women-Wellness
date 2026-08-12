import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MessageSquare,
  Send,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Meh,
  Frown,
  CheckCircle,
  User,
  Calendar,
  Heart,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { HEALTH_IMAGES } from "../assets/healthImages";

const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [feedback, setFeedback] = useState("");
  const [recommend, setRecommend] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    "Screening Experience",
    "Doctor Consultation",
    "Staff Behavior",
    "Facility Cleanliness",
    "Wait Time",
    "Overall Service",
  ];

  const recentReviews = [
    {
      id: 1,
      name: "Lakshmi P.",
      rating: 5,
      comment: "Excellent service! The staff was very caring and the AI screening was quick and accurate.",
      date: "Mar 8, 2026",
      avatar: HEALTH_IMAGES.patientCare,
    },
    {
      id: 2,
      name: "Sunita R.",
      rating: 4,
      comment: "Very professional doctors. Wait time was a bit long but overall a great experience.",
      date: "Mar 7, 2026",
      avatar: HEALTH_IMAGES.womenWellness,
    },
    {
      id: 3,
      name: "Anita K.",
      rating: 5,
      comment: "The mobile van service is amazing! They came to our village and provided free screening.",
      date: "Mar 5, 2026",
      avatar: HEALTH_IMAGES.healthcare,
    },
  ];

  const stats = [
    { label: "Total Reviews", value: "2,847" },
    { label: "Average Rating", value: "4.8" },
    { label: "Satisfied", value: "96%" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating", {
        style: { borderRadius: "16px", background: "#1e293b", color: "#fff" },
      });
      return;
    }
    setSubmitted(true);
    toast.success("Thank you for your feedback!", {
      style: { borderRadius: "16px", background: "#1e293b", color: "#fff" },
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8"
        >
          <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-slate-400 mb-6">Your feedback helps us improve our services.</p>
          <Link to="/" className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 font-medium inline-flex items-center gap-2 transition-colors">
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Toaster position="top-right" />
      
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 px-6 py-4 border-b border-slate-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <MessageSquare size={20} className="text-amber-400" />
            Feedback
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-6">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
              <p className="text-2xl font-bold text-amber-400">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6">
              <h2 className="text-xl font-bold mb-6">Share Your Experience</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm text-slate-400 mb-3">How would you rate your experience?</label>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-2 transition-transform hover:scale-110"
                      >
                        <Star
                          size={36}
                          className={`transition-colors ${
                            star <= (hoverRating || rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-sm text-slate-400 mt-2">
                    {rating === 0 ? "Select a rating" :
                     rating === 1 ? "Poor" :
                     rating === 2 ? "Fair" :
                     rating === 3 ? "Good" :
                     rating === 4 ? "Very Good" : "Excellent!"}
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm text-slate-400 mb-3">What are you reviewing?</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${
                          selectedCategory === cat
                            ? "bg-amber-500/20 border border-amber-500 text-amber-400"
                            : "bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Your feedback</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-amber-500 focus:outline-none resize-none"
                    placeholder="Tell us about your experience..."
                  />
                </div>

                {/* Recommend */}
                <div>
                  <label className="block text-sm text-slate-400 mb-3">Would you recommend us to others?</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setRecommend(true)}
                      className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                        recommend === true
                          ? "bg-emerald-500/20 border border-emerald-500 text-emerald-400"
                          : "bg-slate-800 border border-slate-700 text-slate-400"
                      }`}
                    >
                      <ThumbsUp size={20} /> Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecommend(false)}
                      className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                        recommend === false
                          ? "bg-rose-500/20 border border-rose-500 text-rose-400"
                          : "bg-slate-800 border border-slate-700 text-slate-400"
                      }`}
                    >
                      <ThumbsDown size={20} /> No
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                >
                  <Send size={18} /> Submit Feedback
                </button>
              </form>
            </div>
          </motion.div>

          {/* Recent Reviews */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Heart size={18} className="text-rose-400" />
              Recent Reviews
            </h3>
            <div className="space-y-4">
              {recentReviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800"
                >
                  <div className="flex items-start gap-3">
                    <img src={review.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{review.name}</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              size={12}
                              className={j < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{review.comment}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar size={10} /> {review.date}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Satisfaction Emoji */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-center"
            >
              <div className="flex justify-center gap-6 mb-4">
                <div className="flex flex-col items-center">
                  <Smile size={32} className="text-emerald-400 mb-1" />
                  <span className="text-2xl font-bold">92%</span>
                  <span className="text-xs text-slate-400">Satisfied</span>
                </div>
                <div className="flex flex-col items-center">
                  <Meh size={32} className="text-amber-400 mb-1" />
                  <span className="text-2xl font-bold">6%</span>
                  <span className="text-xs text-slate-400">Neutral</span>
                </div>
                <div className="flex flex-col items-center">
                  <Frown size={32} className="text-rose-400 mb-1" />
                  <span className="text-2xl font-bold">2%</span>
                  <span className="text-xs text-slate-400">Unsatisfied</span>
                </div>
              </div>
              <p className="text-sm text-slate-400">Based on 2,847 reviews</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
