import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Search,
  Clock,
  User,
  Heart,
  MessageSquare,
  Bookmark,
  TrendingUp,
  ChevronRight,
  Tag,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getFeaturedArticle, getListPosts, articleSearchBlob } from "../data/blogArticles";

const BOOKMARK_KEY = "setv_blog_bookmarks";

const HealthBlog = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");

  const [bookmarkedIds] = useState(() => {
    try {
      const raw = localStorage.getItem(BOOKMARK_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  });

  const featuredPost = useMemo(() => getFeaturedArticle(), []);
  const posts = useMemo(() => getListPosts(), []);

  const categories = [
    { id: "all", label: "All" },
    { id: "breast", label: "Breast Health" },
    { id: "pcos", label: "PCOS" },
    { id: "fibroid", label: "Fibroids" },
    { id: "wellness", label: "Wellness" },
    { id: "nutrition", label: "Nutrition" },
  ];

  const trendingTopics = [
    { label: "Breast Cancer Awareness", category: "breast", q: "breast", slug: "early-detection-breast-cancer" },
    { label: "PCOS Management", category: "pcos", q: "PCOS", slug: "pcos-diet-foods" },
    { label: "Healthy Eating", category: "nutrition", q: "diet", slug: "mediterranean-meal-ideas" },
    { label: "Mental Wellness", category: "wellness", q: "mental", slug: "sleep-stress-hormones" },
    { label: "Fertility Tips", category: "wellness", q: "fertility", slug: "pcos-fertility-pathways" },
  ];

  const tagMap = {
    "Breast Cancer": { category: "breast", q: "", slug: "early-detection-breast-cancer" },
    PCOS: { category: "pcos", q: "", slug: "pcos-diet-foods" },
    Fibroids: { category: "fibroid", q: "", slug: "living-with-fibroids" },
    Wellness: { category: "wellness", q: "", slug: "exercise-womens-health" },
    Nutrition: { category: "nutrition", q: "", slug: "nutrition-hormonal-balance" },
    Exercise: { category: "wellness", q: "exercise", slug: "exercise-womens-health" },
    "Mental Health": { category: "wellness", q: "mental", slug: "sleep-stress-hormones" },
    Screening: { category: "breast", q: "screening", slug: "mammography-what-to-expect" },
    Prevention: { category: "all", q: "prevention", slug: "early-detection-breast-cancer" },
    "Self-Care": { category: "wellness", q: "self", slug: "postpartum-recovery" },
  };

  const q = searchQuery.toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const catOk = activeCategory === "all" || post.category === activeCategory;
    if (!catOk) return false;
    if (!q) return true;
    return articleSearchBlob(post).includes(q);
  });

  const featuredVisible = useMemo(() => {
    if (activeCategory !== "all" && featuredPost.category !== activeCategory) return false;
    if (!q) return true;
    return articleSearchBlob(featuredPost).includes(q);
  }, [activeCategory, q, featuredPost]);

  const applyTrending = useCallback((t) => {
    if (t.slug) {
      navigate(`/blog/${t.slug}`);
      return;
    }
    setActiveCategory(t.category);
    setSearchQuery(t.q);
    toast.success(`Filtered: ${t.label}`);
  }, [navigate]);

  const applyTag = useCallback(
    (tag) => {
      const cfg = tagMap[tag];
      if (!cfg) return;
      if (cfg.slug) {
        navigate(`/blog/${cfg.slug}`);
        return;
      }
      setActiveCategory(cfg.category);
      setSearchQuery(cfg.q);
      toast.success(`Tag: ${tag}`);
    },
    [navigate]
  );

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Enter a valid email");
      return;
    }
    toast.success("Thanks — demo only (no email sent)");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative">
      <Toaster position="top-right" />
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 isolate">
        <header className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={18} />
              <span className="text-sm">Back</span>
            </Link>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <BookOpen size={20} className="text-teal-400" />
              Health Blog
            </h1>
            <button
              type="button"
              onClick={() =>
                toast(
                  bookmarkedIds.size
                    ? `${bookmarkedIds.size} saved — open any article and tap the bookmark icon`
                    : "Open an article and save it with the bookmark icon"
                )
              }
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
              aria-label="Reading list"
            >
              <Bookmark size={18} className={bookmarkedIds.size ? "text-teal-400" : "text-slate-400"} />
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-xs text-slate-500 mb-4 text-center sm:text-left">
            {posts.length + 1} articles — tap any card to read the full page.
          </p>

          <div className="mb-8">
            <div className="relative mb-4">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 focus:border-teal-500 focus:outline-none text-white placeholder:text-slate-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scroll-smooth">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                    activeCategory === cat.id
                      ? "bg-teal-500 text-white"
                      : "bg-slate-900/50 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {featuredVisible && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="relative rounded-3xl overflow-hidden group block border border-slate-800/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60"
                  >
                    <img
                      src={featuredPost.image}
                      alt=""
                      className="w-full h-[350px] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                      <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs font-medium mb-3 inline-block">
                        Featured
                      </span>
                      <h2 className="text-2xl font-bold mb-2 group-hover:text-teal-400 transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{featuredPost.excerpt}</p>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <User size={14} /> {featuredPost.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> {featuredPost.readTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Heart size={14} /> {featuredPost.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={14} /> {featuredPost.comments}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-teal-400/90 mt-3 font-medium">Read full article →</p>
                    </div>
                  </Link>
                </motion.div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {filteredPosts.map((post, i) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.25) }}
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden group block hover:border-teal-500/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={post.image}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 rounded-full bg-slate-900/80 text-xs font-medium capitalize">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-2 group-hover:text-teal-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{post.author}</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {filteredPosts.length === 0 && !featuredVisible && (
                <p className="text-center text-slate-500 py-12">No articles match your search. Try another category or keyword.</p>
              )}
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5"
              >
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-teal-400" />
                  Trending topics
                </h3>
                <p className="text-xs text-slate-500 mb-3">Opens the full article page</p>
                <div className="space-y-2">
                  {trendingTopics.map((topic, i) => (
                    <button
                      key={topic.label}
                      type="button"
                      onClick={() => applyTrending(topic)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 transition-colors text-left border border-transparent hover:border-slate-700"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-teal-400 font-bold">#{i + 1}</span>
                        <span className="text-sm">{topic.label}</span>
                      </span>
                      <ChevronRight size={16} className="text-slate-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5"
              >
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Tag size={18} className="text-teal-400" />
                  Popular tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(tagMap).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => applyTag(tag)}
                      className="px-3 py-1.5 rounded-full bg-slate-800 text-sm text-slate-400 hover:bg-teal-500/20 hover:text-teal-400 border border-slate-700 hover:border-teal-500/40 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-2xl border border-teal-500/30 p-5"
              >
                <h3 className="font-bold mb-2">Stay updated</h3>
                <p className="text-sm text-slate-400 mb-4">Get the latest health tips (demo — no emails sent).</p>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700 focus:border-teal-500 focus:outline-none text-sm text-white placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 font-medium text-sm transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthBlog;
