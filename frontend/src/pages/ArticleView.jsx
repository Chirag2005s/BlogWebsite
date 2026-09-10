import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import {
  ArrowLeft, Clock, Calendar, Eye, Heart, Bookmark,
  Share2, Tag as TagIcon, ChevronUp, Copy, Check, Users, Sparkles
} from 'lucide-react';
import api from '../services/api';

/* ─── Reading Progress Bar ─── */
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5">
      <div
        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

/* ─── Code Block with Copy ─── */
const CodeBlock = ({ children, className }) => {
  const [copied, setCopied] = useState(false);
  const language = className?.replace('language-', '') || '';
  const code = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className="relative group my-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-800 border border-white/6 border-b-0 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          {language && (
            <span className="text-xs text-text-muted font-medium ml-2 uppercase">{language}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/5"
        >
          {copied ? (
            <>
              <Check size={13} className="text-success" />
              <span className="text-success">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code */}
      <pre className="!mt-0 !rounded-t-none !border-t-0 bg-surface-800 border border-white/6 rounded-b-xl overflow-x-auto p-4">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};

/* ─── Scroll to Top ─── */
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisible, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 z-50 w-10 h-10 rounded-xl glass-strong flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-all shadow-lg animate-fade-in"
      aria-label="Scroll to top"
    >
      <ChevronUp size={18} />
    </button>
  );
};

/* ═══════════════════════════════════════════
   ARTICLE VIEW PAGE
   ═══════════════════════════════════════════ */

const ArticleView = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await api.get(`/articles/${slug}`);
        setArticle(data.data);
        setLikesCount(data.data.likes || 0);

        if (userInfo && data.data.likedBy && (userInfo._id || userInfo.id)) {
          const currentUserId = (userInfo._id || userInfo.id).toString();
          const userLiked = data.data.likedBy.some(
            (u) => u && (u._id ? u._id.toString() : u.toString()) === currentUserId
          );
          setIsLiked(userLiked);
        }
      } catch (error) {
        console.error('Failed to fetch article', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleLike = async () => {
    if (!userInfo) {
      alert('Please sign in to like this post!');
      return;
    }
    if (likeLoading || !article) return;
    setLikeLoading(true);

    // Optimistic toggle
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const { data } = await api.post(`/articles/${article._id}/like`);
      if (data.success) {
        setIsLiked(data.liked);
        setLikesCount(data.likes);
      }
    } catch (err) {
      console.error('Failed to like post', err);
      // Revert optimistic update
      setIsLiked(!nextLiked);
      setLikesCount((prev) => (nextLiked ? Math.max(0, prev - 1) : prev + 1));
    } finally {
      setLikeLoading(false);
    }
  };

  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share dialog dismissed or unsupported
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch (err) {
      alert('URL copied to clipboard: ' + window.location.href);
    }
  };

  const backLink = article?.type === 'article' ? '/articles' : '/blog';
  const backLabel = article?.type === 'article' ? 'Back to articles' : 'Back to blog';

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 py-12">
        <div className="skeleton h-4 w-24 rounded-full" />
        <div className="skeleton h-10 w-full rounded-lg" />
        <div className="skeleton h-10 w-3/4 rounded-lg" />
        <div className="skeleton h-5 w-1/2 rounded-lg" />
        <div className="skeleton aspect-video w-full rounded-2xl" />
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton h-4 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <div className="glass-card rounded-2xl p-16">
          <h2 className="text-2xl font-bold text-white mb-3">Post not found</h2>
          <p className="text-text-secondary mb-6">This blog or article may have been removed or the URL is incorrect.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ReadingProgress />
      <ScrollToTop />

      <article className="max-w-3xl mx-auto space-y-10 pb-16">
        {/* Back Link */}
        <Link
          to={backLink}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {backLabel}
        </Link>

        {/* ═══ Article Header ═══ */}
        <header className="space-y-6">
          {/* Category & Type */}
          <div className="flex items-center gap-2">
            <span className="tech-tag font-semibold">
              <TagIcon size={11} />
              {article.type === 'article' ? '📚 Article' : '📝 Blog'}
            </span>
            {article.category?.name && (
              <span className="tech-tag">
                {article.category.name}
              </span>
            )}
            {article.difficulty && (
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                article.difficulty === 'Beginner'
                  ? 'bg-success/10 text-green-400'
                  : article.difficulty === 'Intermediate'
                  ? 'bg-warning/10 text-yellow-400'
                  : 'bg-error/10 text-red-400'
              }`}>
                {article.difficulty}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-lg text-text-secondary leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-text-muted">
            {/* Author */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs font-bold text-white">
                {article.author?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <span className="text-text-secondary font-medium">{article.author?.name || 'Author'}</span>
            </div>
            <span className="w-px h-4 bg-white/10 hidden sm:block" />
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {article.readingTime || 3} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={14} />
              {article.views || 0} views
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isLiked
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/10'
                  : 'glass text-text-secondary hover:text-red-400 hover:bg-red-500/10'
              }`}
              title={isLiked ? 'Unlike this post' : 'Like this post'}
            >
              <Heart size={16} className={isLiked ? 'fill-current text-red-400' : ''} />
              <span>{likesCount}</span>
            </button>
            <button
              onClick={() => navigator.share?.({ title: article.title, url: window.location.href }).catch(() => {})}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-text-secondary hover:text-white hover:bg-white/10 text-sm transition-all"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </header>

        {/* ═══ Cover Image ═══ */}
        {article.coverImage && (
          <div className="rounded-2xl overflow-hidden border border-white/6 shadow-2xl shadow-black/30">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* ═══ Article Content ═══ */}
        <div className="article-content">
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ node, inline, className, children, ...props }) {
                if (!inline && className) {
                  return <CodeBlock className={className}>{children}</CodeBlock>;
                }
                return <code className={className} {...props}>{children}</code>;
              },
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* ═══ Tags ═══ */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-white/5">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag._id || tag} className="tech-tag">
                  {tag.name || tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ═══ Who Reached This Blog (Readers & Views) ═══ */}
        <div className="glass-card rounded-2xl p-6 space-y-4 border border-white/6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  Who Reached This {article.type === 'article' ? 'Article' : 'Blog'}
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-500/15 text-primary-300 font-normal">
                    {article.readers?.length || 0} reader{article.readers?.length !== 1 ? 's' : ''}
                  </span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Community members and signed-in developers who reached this post.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-text-muted sm:text-right">
              <div>
                <span className="block text-sm font-bold text-white">{article.views || 0}</span>
                <span>Total Reach</span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div>
                <span className="block text-sm font-bold text-white">{likesCount}</span>
                <span>Likes</span>
              </div>
            </div>
          </div>

          {article.readers && article.readers.filter(Boolean).length > 0 ? (
            <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-2.5">
              {article.readers.filter(Boolean).map((reader, idx) => (
                <div
                  key={reader?._id || idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-800/80 border border-white/5 hover:border-primary-500/30 transition-all text-xs text-text-secondary hover:text-white group"
                  title={reader?.name || 'Reader'}
                >
                  {reader?.profileImage ? (
                    <img
                      src={reader.profileImage}
                      alt={reader.name || 'Reader'}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                      {reader?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="font-medium">{reader?.name || 'Community Member'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="pt-3 border-t border-white/5 text-xs text-text-muted flex items-center gap-2">
              <Sparkles size={14} className="text-primary-400" />
              <span>Signed-in reader visits will be showcased here. Enjoy reading!</span>
            </div>
          )}
        </div>

        {/* ═══ Bottom Actions ═══ */}
        <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white">
              Enjoyed this {article.type === 'article' ? 'article' : 'blog post'}?
            </p>
            <p className="text-xs text-text-muted mt-0.5">Show some appreciation with a like or share it with others.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isLiked
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                  : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
              }`}
            >
              <Heart size={16} className={isLiked ? 'fill-current' : ''} />
              <span>{isLiked ? 'Liked' : 'Like'} ({likesCount})</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-text-secondary hover:text-white hover:bg-white/10 text-sm font-medium transition-all cursor-pointer"
              title="Share or copy article link"
            >
              {copiedShare ? (
                <>
                  <Check size={16} className="text-green-400" />
                  <span className="text-green-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={16} />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ═══ Back Link at bottom ═══ */}
        <div className="text-center pt-4">
          <Link
            to={backLink}
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary-400 transition-colors"
          >
            <ArrowLeft size={14} />
            {backLabel}
          </Link>
        </div>
      </article>
    </>
  );
};

export default ArticleView;
