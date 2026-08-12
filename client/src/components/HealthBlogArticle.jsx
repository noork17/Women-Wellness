import React, { useState, useCallback, useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  User,
  Calendar,
  Share2,
  Bookmark,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getArticleBySlug, getRelatedArticles, blogArticles } from "../data/blogArticles";

const BOOKMARK_KEY = "setv_blog_bookmarks";

export default function HealthBlogArticle() {
  const { slug } = useParams();
  const article = slug ? getArticleBySlug(slug) : null;

  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const raw = localStorage.getItem(BOOKMARK_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  });

  const relatedFinal = useMemo(() => {
    if (!article) return [];
    const r = getRelatedArticles(article.slug, article.category, 4);
    if (r.length >= 2) return r;
    return blogArticles.filter((a) => a.slug !== article.slug).slice(0, 4);
  }, [article]);

  const toggleBookmark = useCallback((id) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(BOOKMARK_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      toast(next.has(id) ? "Saved to reading list" : "Removed from reading list");
      return next;
    });
  }, []);

  const copyLink = useCallback(() => {
    const url = `${window.location.origin}/blog/${slug}`;
    navigator.clipboard?.writeText(url).then(
      () => toast.success("Link copied"),
      () => toast.error("Could not copy")
    );
  }, [slug]);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const isSaved = bookmarkedIds.has(article.id);

  return (
    <div className="min-h-screen bg-slate-950 text-white relative">
      <Toaster position="top-right" />
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 isolate">
        <header className="sticky top-0 z-20 px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            <Link
              to="/blog"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm shrink-0"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Blog</span>
            </Link>
            <span className="text-xs text-slate-500 truncate text-center flex items-center gap-1 justify-center">
              <BookOpen size={14} className="text-teal-400 shrink-0" />
              <span className="truncate max-w-[40vw] sm:max-w-none">{article.title}</span>
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => toggleBookmark(article.id)}
                className={`p-2 rounded-xl transition-colors ${isSaved ? "bg-teal-500/20 text-teal-400" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
                aria-label={isSaved ? "Remove bookmark" : "Bookmark"}
              >
                <Bookmark size={18} className={isSaved ? "fill-current" : ""} />
              </button>
              <button
                type="button"
                onClick={copyLink}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400"
                aria-label="Copy link"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </header>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-20">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-2xl overflow-hidden border border-slate-800 mb-8">
              <img src={article.image} alt="" className="w-full h-56 sm:h-72 object-cover" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-teal-500/15 text-teal-400 text-xs font-medium capitalize mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">{article.title}</h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">{article.excerpt}</p>

            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-800">
              <span className="flex items-center gap-2">
                <User size={16} className="text-slate-600" />
                {article.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-600" />
                {article.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} className="text-slate-600" />
                {article.readTime}
              </span>
            </div>

            <div className="prose prose-invert prose-slate max-w-none">
              {article.sections?.map((section, idx) => (
                <section key={idx} className="mb-10">
                  <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-teal-500 pl-3">
                    {section.title}
                  </h2>
                  <div className="space-y-4 text-slate-300 leading-relaxed text-[15px] sm:text-base">
                    {(section.paragraphs || []).map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {article.takeaways?.length > 0 && (
              <div className="mt-10 p-5 rounded-2xl bg-teal-500/10 border border-teal-500/25">
                <h3 className="font-bold text-teal-200 mb-3 flex items-center gap-2">
                  <CheckCircle size={18} />
                  Key takeaways
                </h3>
                <ul className="space-y-2 text-sm text-slate-200">
                  {article.takeaways.map((t, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-teal-400 shrink-0">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex gap-3 text-sm text-amber-100/90">
              <AlertCircle className="shrink-0 text-amber-400" size={20} />
              <p>
                This article is for education only and does not replace advice from your doctor or national screening
                guidelines. If you have symptoms, book an in-person evaluation.
              </p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                to="/book-appointment"
                className="flex-1 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-center font-semibold transition-colors"
              >
                Book an appointment
              </Link>
              <Link
                to="/symptom-checker"
                className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-center font-medium transition-colors"
              >
                Symptom checker
              </Link>
            </div>
          </motion.div>

          {relatedFinal.length > 0 && (
            <div className="mt-16 pt-12 border-t border-slate-800">
              <h3 className="text-lg font-bold text-white mb-6">Related articles</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedFinal.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/blog/${p.slug}`}
                    className="group rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden hover:border-teal-500/40 transition-colors"
                  >
                    <div className="h-28 overflow-hidden">
                      <img
                        src={p.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-teal-400 capitalize mb-1">{p.category}</p>
                      <p className="font-semibold text-white text-sm line-clamp-2 group-hover:text-teal-400 transition-colors">
                        {p.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
