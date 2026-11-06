import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Newspaper,
  Clock,
  ExternalLink,
  Search,
  Sparkles,
  ArrowRight,
  Flame,
  ShieldAlert,
  Cpu,
  Globe,
  Terminal,
  X,
  RefreshCw,
  Bookmark,
  Heart,
  Share2,
  Check,
  Plus,
  Upload,
  Link2,
  Trash2,
  TrendingUp,
  Radio,
  Layers,
  LayoutGrid,
  List,
  CheckCircle2,
  ChevronLeft,
  Loader2,
} from 'lucide-react';
import { TECH_NEWS } from '../data/mockData';

const NEWS_CATEGORIES = [
  'All',
  'AI',
  'Cloud Computing',
  'Web Development',
  'Cybersecurity',
  'Developer Tools',
  'Open Source',
  'Internet Of Things',
  'Hardware',
];

// const CATEGORY_BADGE_MAP = {
//   AI: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
//   'Cloud Computing': 'text-blue-400 bg-blue-500/10 border-blue-500/25',
//   'Web Development': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25',
//   Cybersecurity: 'text-rose-400 bg-rose-500/10 border-rose-500/25',
//   'Developer Tools': 'text-amber-400 bg-amber-500/10 border-amber-500/25',
//   'Open Source': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
//   'Internet Of Things': 'text-teal-400 bg-teal-500/10 border-teal-500/25',
//   Hardware: 'text-orange-400 bg-orange-500/10 border-orange-500/25',
// };

const LATEST_2026_UPDATES = [
  {
    id: 'news-2026-mcp-agents',
    category: 'AI',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
    title: 'Multi-Agent Model Context Protocol (MCP) Adopted Across Major Cloud IDEs',
    description:
      'Standardized context protocols now enable autonomous coding agents to query live databases, inspect CI/CD pipelines, and verify production telemetry with zero custom glue code.',
    fullContent: [
      'Engineering teams across the industry are converging on standardized Model Context Protocol (MCP) interfaces to connect frontier reasoning models directly to internal developer infrastructure.',
      'Unlike first-generation copilot plugins that only read open editor buffers, MCP-enabled agents securely query schema registries, run sandboxed integration suites, and cross-reference observability traces before proposing a pull request.',
      'Early enterprise benchmarks indicate a 42% reduction in mean-time-to-resolution (MTTR) for production incidents and significantly fewer regressions in microservice deployments.',
    ],
    takeaways: [
      'Unified JSON-RPC tool discovery between IDEs, databases, and cloud runtimes',
      'Fine-grained permission boundaries and read-only sandboxing by default',
      '42% faster incident triage across distributed microservice architectures',
    ],
    date: 'November 6, 2026',
    readTime: '4 min read',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&auto=format&fit=crop&q=80',
    source: 'AI Systems Dispatch',
    likes: 128,
    isBreaking: true,
  },
  {
    id: 'news-2026-iot-matter',
    category: 'Internet Of Things',
    badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/25',
    title: 'Edge AI Microcontrollers Bring Sub-10mW Neural Inference to Industrial IoT Sensors',
    description:
      'Next-generation RISC-V wireless SoCs with integrated neural processing units allow battery-powered IoT nodes to run anomaly detection and predictive maintenance locally.',
    fullContent: [
      'Ultra-low-power RISC-V microcontrollers equipped with dedicated TinyML matrix accelerators are transforming how industrial IoT fleets process sensor telemetry at the physical edge.',
      'Instead of streaming raw vibration and acoustic waveforms over cellular or LoRaWAN links, edge nodes now execute quantized neural models in under 10 milliwatts—transmitting only verified anomaly alerts.',
      'Combined with Thread mesh networking and Matter 2.0 security attestation, factories and smart-grid operators can deploy maintenance-free sensor meshes lasting up to 7 years on a single coin cell.',
    ],
    takeaways: [
      'Quantized INT4/INT8 inference directly on RISC-V edge microcontrollers',
      'Up to 90% bandwidth reduction by filtering telemetry at the sensor node',
      'Hardware root-of-trust attestation for industrial IoT fleet security',
    ],
    date: 'November 5, 2026',
    readTime: '4 min read',
    image:
      'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=1000&auto=format&fit=crop&q=80',
    source: 'Embedded & IoT Wire',
    likes: 94,
  },
  {
    id: 'news-2026-opensource-linux-rust',
    category: 'Open Source',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    title: 'Linux Kernel Expands Rust Driver Subsystems for High-Throughput NVMe & Network Cards',
    description:
      'Memory-safe kernel abstractions reach a major milestone as cloud hyperscalers deploy Rust-based storage and networking drivers across millions of production hosts.',
    fullContent: [
      'The open-source kernel community has finalized new safe abstraction layers for DMA buffers, PCIe device lifecycle management, and asynchronous network packet rings in Rust.',
      'Benchmarks comparing the new Rust NVMe and Ethernet drivers against legacy C implementations show identical P99 latency and throughput while eliminating entire classes of use-after-free and buffer overflow vulnerabilities.',
    ],
    takeaways: [
      'Zero-cost memory safety abstractions for PCIe, DMA, and network rings',
      'Parity with C driver throughput at P99 tail latencies',
      'Adopted in production Linux kernels across major cloud providers',
    ],
    date: 'November 3, 2026',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1000&auto=format&fit=crop&q=80',
    source: 'Open Source Kernel Watch',
    likes: 112,
  },
];

const CUSTOM_NEWS_STORAGE_KEY = 'tj_custom_tech_news_v1';
const LIKED_NEWS_STORAGE_KEY = 'tj_liked_tech_news_v1';
const BOOKMARKED_NEWS_STORAGE_KEY = 'tj_bookmarked_tech_news_v1';

export default function TechNews() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'popular' | 'saved'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'compact'
  const [selectedStory, setSelectedStory] = useState(null);
  const [loadingFullStory, setLoadingFullStory] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Live feed & custom news states
  const [liveArticles, setLiveArticles] = useState([]);
  const [syncingLive, setSyncingLive] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState('Just now');

  const [customNews, setCustomNews] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_NEWS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [likedIds, setLikedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(LIKED_NEWS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKED_NEWS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Publish News Modal state
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [coverMode, setCoverMode] = useState('link'); // 'link' | 'upload'
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef(null);

  const [newBulletin, setNewBulletin] = useState({
    title: '',
    category: 'AI',
    source: 'TechJourney Dispatch',
    readTime: '3 min read',
    image: '',
    description: '',
    keyTakeaways: '',
    externalUrl: '',
  });

  const currentUser = useMemo(() => {
    try {
      const raw = localStorage.getItem('userInfo');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  // Fetch live developer/tech news from public Dev.to API to enrich the feed
  const fetchLiveTechDispatches = async () => {
    setSyncingLive(true);
    try {
      const response = await fetch(
        'https://dev.to/api/articles?tag=technology&top=7&per_page=6'
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (Array.isArray(data)) {
        const mapped = data.map((art) => {
          const tags = Array.isArray(art.tag_list) ? art.tag_list : [];
          let cat = 'Developer Tools';
          if (tags.some((t) => /ai|ml|llm|gpt|machinelearning/i.test(t))) cat = 'AI';
          else if (tags.some((t) => /cloud|aws|docker|kubernetes|devops/i.test(t)))
            cat = 'Cloud Computing';
          else if (tags.some((t) => /webdev|react|javascript|typescript|css/i.test(t)))
            cat = 'Web Development';
          else if (tags.some((t) => /security|cybersecurity|infosec/i.test(t)))
            cat = 'Cybersecurity';
          else if (tags.some((t) => /opensource|linux|git|rust/i.test(t)))
            cat = 'Open Source';
          else if (tags.some((t) => /iot|hardware|embedded|robotics/i.test(t)))
            cat = 'Internet Of Things';

          return {
            id: `live-devto-${art.id}`,
            devtoId: art.id,
            category: cat,
            badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
            title: art.title,
            description:
              art.description ||
              'Live community engineering dispatch covering modern software architecture and developer tooling.',
            fullContent: [
              art.description || '',
              `Published by ${art.user?.name || 'Developer Contributor'} on the global developer wire. Click the external source link below to read the full technical breakdown and code benchmarks.`,
            ].filter(Boolean),
            takeaways: tags.slice(0, 4).map((t) => `Topic focus: #${t}`),
            date: new Date(art.published_at || Date.now()).toLocaleDateString(
              'en-US',
              {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }
            ),
            readTime: `${art.reading_time_minutes || 4} min read`,
            image:
              art.cover_image ||
              art.social_image ||
              'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
            source: art.user?.name ? `DEV • ${art.user.name}` : 'Global Dev Wire',
            externalUrl: art.url,
            likes: art.public_reactions_count || 24,
            isLiveWire: true,
          };
        });
        setLiveArticles(mapped);
        setLastSyncedAt(
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
      }
    } catch {
      // Keep existing curated feed silently if offline
    } finally {
      setSyncingLive(false);
    }
  };

  useEffect(() => {
    fetchLiveTechDispatches();
  }, []);

  // Combine custom published bulletins + latest 2026 updates + core TECH_NEWS + live API dispatches
  const allNews = useMemo(() => {
    const normalizedStatic = TECH_NEWS.map((item, idx) => ({
      ...item,
      likes: item.likes || 64 - idx * 5,
      fullContent: item.fullContent || [
        item.description,
        'Engineering teams worldwide are evaluating how this breakthrough impacts production latency, developer productivity, and long-term infrastructure maintainability.',
        'Industry analysts project widespread adoption across cloud-native organizations over the next two quarters as tooling and documentation mature.',
      ],
      takeaways: item.takeaways || [
        `High-impact advancement in ${item.category}`,
        'Production-validated benchmarks and open engineering specifications',
        'Immediate workflow improvements for full-stack and systems engineers',
      ],
    }));

    return [...customNews, ...LATEST_2026_UPDATES, ...normalizedStatic, ...liveArticles];
  }, [customNews, liveArticles]);

  const filteredNews = useMemo(() => {
    const list = allNews.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.source && item.source.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'All' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSaved =
        sortBy !== 'saved' || bookmarkedIds.includes(item.id);

      return matchesSearch && matchesCategory && matchesSaved;
    });

    if (sortBy === 'popular') {
      return [...list].sort((a, b) => {
        const aScore = (a.likes || 0) + (likedIds.includes(a.id) ? 1 : 0);
        const bScore = (b.likes || 0) + (likedIds.includes(b.id) ? 1 : 0);
        return bScore - aScore;
      });
    }

    return list;
  }, [allNews, searchQuery, selectedCategory, sortBy, bookmarkedIds, likedIds]);

  const breakingNews = useMemo(() => {
    return allNews[0] || TECH_NEWS[0];
  }, [allNews]);

  const categoryCounts = useMemo(() => {
    const counts = { All: allNews.length };
    NEWS_CATEGORIES.slice(1).forEach((cat) => {
      counts[cat] = allNews.filter(
        (n) => n.category.toLowerCase() === cat.toLowerCase()
      ).length;
    });
    return counts;
  }, [allNews]);

  const toggleLike = (id, e) => {
    if (e) e.stopPropagation();
    setLikedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem(LIKED_NEWS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const toggleBookmark = (id, e) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem(BOOKMARKED_NEWS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const handleShare = (story, e) => {
    if (e) e.stopPropagation();
    const shareUrl = story.externalUrl || window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${story.title} — ${shareUrl}`);
      setCopiedId(story.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCoverUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploadingCover(true);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 960;
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.78);
        setNewBulletin((prev) => ({ ...prev, image: compressed }));
        setUploadingCover(false);
      };
      img.onerror = () => setUploadingCover(false);
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };

  const handlePublishBulletin = (e) => {
    e.preventDefault();
    if (!newBulletin.title.trim() || !newBulletin.description.trim()) return;

    const takeawaysList = newBulletin.keyTakeaways
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const createdItem = {
      id: `custom-news-${Date.now()}`,
      category: newBulletin.category,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
      title: newBulletin.title.trim(),
      description: newBulletin.description.trim(),
      fullContent: newBulletin.description
        .trim()
        .split(/\n\n+/)
        .filter(Boolean),
      takeaways:
        takeawaysList.length > 0
          ? takeawaysList
          : [
            `Verified ${newBulletin.category} dispatch published on TechJourney`,
            `Reported by ${currentUser?.name || newBulletin.source}`,
          ],
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      readTime: newBulletin.readTime || '3 min read',
      image:
        newBulletin.image.trim() ||
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80',
      source: newBulletin.source.trim() || currentUser?.name || 'TechJourney Wire',
      externalUrl: newBulletin.externalUrl.trim() || '',
      likes: 1,
      isCustom: true,
      authorId: currentUser?._id || 'local',
    };

    const updated = [createdItem, ...customNews];
    setCustomNews(updated);
    try {
      localStorage.setItem(CUSTOM_NEWS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore quota errors
    }

    setNewBulletin({
      title: '',
      category: 'AI',
      source: 'TechJourney Dispatch',
      readTime: '3 min read',
      image: '',
      description: '',
      keyTakeaways: '',
      externalUrl: '',
    });
    setUploadedFileName('');
    setPublishModalOpen(false);
  };

  const handleDeleteCustomNews = (id, e) => {
    if (e) e.stopPropagation();
    const updated = customNews.filter((item) => item.id !== id);
    setCustomNews(updated);
    try {
      localStorage.setItem(CUSTOM_NEWS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage error
    }
    if (selectedStory?.id === id) {
      setSelectedStory(null);
    }
  };

  // Open a story in the dedicated full-page reader and fetch full body if from live wire
  const handleReadStory = async (story) => {
    if (!story) return;
    setSelectedStory(story);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    if (story.devtoId && !story.hasLoadedFullBody) {
      setLoadingFullStory(true);
      try {
        const res = await fetch(`https://dev.to/api/articles/${story.devtoId}`);
        if (res.ok) {
          const detail = await res.json();
          if (detail?.body_markdown) {
            const cleanParagraphs = detail.body_markdown
              .replace(/```[\s\S]*?```/g, '')
              .replace(/^#+\s+/gm, '')
              .replace(/!\[.*?\]\(.*?\)/g, '')
              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
              .split(/\n\s*\n/)
              .map((p) => p.trim())
              .filter((p) => p.length > 30);

            if (cleanParagraphs.length > 0) {
              const enriched = {
                ...story,
                fullContent: cleanParagraphs.slice(0, 14),
                hasLoadedFullBody: true,
              };
              setSelectedStory(enriched);
              setLiveArticles((prev) =>
                prev.map((a) => (a.id === story.id ? enriched : a))
              );
            }
          }
        }
      } catch {
        // Fallback to existing summary paragraphs
      } finally {
        setLoadingFullStory(false);
      }
    }
  };

  // ═══ DEDICATED FULL-PAGE TECH NEWS READER VIEW ═══
  if (selectedStory) {
    const isLiked = likedIds.includes(selectedStory.id);
    const isSaved = bookmarkedIds.includes(selectedStory.id);
    const totalLikes = (selectedStory.likes || 0) + (isLiked ? 1 : 0);
    const relatedStories = allNews
      .filter((n) => n.id !== selectedStory.id)
      .slice(0, 3);

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Top Back Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-line">
          <button
            type="button"
            onClick={() => {
              setSelectedStory(null);
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card hover:bg-soft text-heading border border-line text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm"
          >
            <ChevronLeft size={16} className="text-[#0F6B4F]" />
            <span>Back to All Tech News</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => toggleLike(selectedStory.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                isLiked
                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  : 'bg-card hover:bg-soft text-heading border-line'
              }`}
            >
              <Heart size={14} className={isLiked ? 'fill-current' : ''} />
              <span>{totalLikes}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleBookmark(selectedStory.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#0F6B4F] text-white border-transparent'
                  : 'bg-card hover:bg-soft text-heading border-line'
              }`}
            >
              <Bookmark size={14} className={isSaved ? 'fill-current' : ''} />
              <span>{isSaved ? 'Saved' : 'Save Story'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => handleShare(selectedStory, e)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card hover:bg-soft text-heading border border-line text-xs font-bold transition-colors cursor-pointer"
            >
              {copiedId === selectedStory.id ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Article Reader Card */}
        <article className="rounded-3xl bg-card border border-line overflow-hidden shadow-xl">
          {/* Hero Cover Image */}
          <div className="relative h-64 sm:h-96 w-full bg-soft border-b border-line overflow-hidden">
            <img
              src={selectedStory.image}
              alt={selectedStory.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute bottom-5 left-6 right-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0F6B4F] text-white shadow">
                  {selectedStory.category}
                </span>
                {selectedStory.isLiveWire && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/90 text-white">
                    LIVE DISPATCH
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-200 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <span>{selectedStory.source}</span>
                <span>•</span>
                <span>{selectedStory.date}</span>
                <span>•</span>
                <span>{selectedStory.readTime}</span>
              </div>
            </div>
          </div>

          {/* Article Body Container */}
          <div className="p-6 sm:p-10 space-y-8">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-4xl font-black text-heading leading-tight">
                {selectedStory.title}
              </h1>
              <p className="text-base sm:text-lg font-medium text-muted leading-relaxed border-l-4 border-[#0F6B4F] pl-4">
                {selectedStory.description}
              </p>
            </div>

            {/* Key Engineering Takeaways */}
            {Array.isArray(selectedStory.takeaways) &&
              selectedStory.takeaways.length > 0 && (
                <div className="p-5 sm:p-6 rounded-2xl bg-page border border-line space-y-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F6B4F] flex items-center gap-2">
                    <Sparkles size={15} />
                    <span>Key Engineering Takeaways</span>
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedStory.takeaways.map((point, idx) => (
                      <li
                        key={idx}
                        className="text-xs sm:text-sm text-heading flex items-start gap-2.5 bg-card p-3 rounded-xl border border-line"
                      >
                        <CheckCircle2
                          size={16}
                          className="text-[#0F6B4F] shrink-0 mt-0.5"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Full Story Paragraphs */}
            {loadingFullStory ? (
              <div className="py-10 flex flex-col items-center justify-center gap-3 text-muted">
                <Loader2 size={26} className="text-[#0F6B4F] animate-spin" />
                <span className="text-xs font-mono">
                  Loading full technical dispatch...
                </span>
              </div>
            ) : (
              <div className="space-y-5 text-sm sm:text-base text-heading/90 leading-relaxed">
                {(selectedStory.fullContent || [selectedStory.description]).map(
                  (para, index) => (
                    <p key={index} className="leading-8">
                      {para}
                    </p>
                  )
                )}
              </div>
            )}

            {/* Source & External Link Footer */}
            <div className="pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-muted">
                Published via{' '}
                <strong className="text-heading">{selectedStory.source}</strong> •{' '}
                <span>{selectedStory.date}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {selectedStory.externalUrl && (
                  <a
                    href={selectedStory.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F6B4F] hover:bg-[#16805E] text-white text-xs sm:text-sm font-bold shadow-md transition-all"
                  >
                    <span>Read Original Source</span>
                    <ExternalLink size={14} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStory(null);
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-page hover:bg-soft text-heading border border-line text-xs sm:text-sm font-bold transition-all cursor-pointer"
                >
                  Back to News Feed
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* More Tech News Section */}
        {relatedStories.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-extrabold text-heading flex items-center gap-2">
              <Newspaper size={18} className="text-[#0F6B4F]" />
              <span>More Tech News Dispatches</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedStories.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => handleReadStory(rel)}
                  className="p-4 rounded-2xl bg-card border border-line hover:border-[#0F6B4F]/50 transition-all cursor-pointer space-y-2.5 group"
                >
                  <div className="h-32 rounded-xl overflow-hidden bg-soft border border-line">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                    <span className="text-[#0F6B4F] font-bold">{rel.category}</span>
                    <span>{rel.readTime}</span>
                  </div>
                  <h4 className="text-sm font-bold text-heading group-hover:text-[#0F6B4F] line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-10">
      {/* ═══ LIVE BREAKING TICKER BAR ═══ */}
      <div className="rounded-2xl bg-card border border-line px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-[#4FD1A5] border border-emerald-500/30 text-[11px] font-mono font-bold uppercase tracking-wider shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Wire
          </span>
          <p className="text-xs sm:text-sm text-heading font-medium truncate">
            <span className="text-muted font-mono mr-2">[{breakingNews?.category}]</span>
            {breakingNews?.title}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden md:inline text-[11px] font-mono text-muted">
            Synced: {lastSyncedAt}
          </span>
          <button
            type="button"
            onClick={fetchLiveTechDispatches}
            disabled={syncingLive}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-soft hover:bg-[#0F6B4F] text-xs font-semibold text-heading hover:text-white border border-line transition-colors cursor-pointer disabled:opacity-50"
            title="Fetch latest live developer news"
          >
            <RefreshCw size={12} className={syncingLive ? 'animate-spin' : ''} />
            <span>{syncingLive ? 'Syncing...' : 'Refresh Feed'}</span>
          </button>
        </div>
      </div>

      {/* ═══ CYBER-EMERALD TECH NEWS HERO BANNER ═══ */}
      <section className="relative rounded-3xl overflow-hidden border border-[#2BAF85]/30 bg-gradient-to-br from-[#04120E] via-[#07241B] to-[#0B162C] p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#4FD1A5 1px, transparent 1px), radial-gradient(#0F6B4F 1px, #04120E 1px)',
            backgroundSize: '36px 36px',
            backgroundPosition: '0 0, 18px 18px',
          }}
        />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#0F6B4F]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Title, Description & Actions */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-emerald-400/30 text-xs font-mono text-[#4FD1A5]">
              <Radio size={14} className="animate-pulse" />
              <span>REAL-TIME DEVELOPER INTELLIGENCE • 2026 DISPATCH</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.12]">
              What&apos;s Happening in{' '}
              <span className="bg-gradient-to-r from-[#4FD1A5] via-teal-200 to-[#F4A62A] bg-clip-text text-transparent">
                Global Tech
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              High-signal engineering bulletins spanning autonomous AI agents, cloud-native Wasm runtimes, Linux kernel advancements, industrial IoT, cybersecurity disclosures, and next-gen silicon.
            </p>

            {/* Quick Stats + CTA Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {/* <button
                type="button"
                onClick={() => setPublishModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#0F6B4F] to-[#16805E] hover:from-[#16805E] hover:to-[#2BAF85] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#0F6B4F]/30 border border-[#4FD1A5]/30 transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Post Tech News</span>
              </button> */}

              <button
                type="button"
                onClick={() => handleReadStory(breakingNews)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-md transition-all cursor-pointer"
              >
                <Flame size={15} className="text-amber-400" />
                <span>Read Top Story</span>
              </button>

              <div className="flex items-center gap-4 pl-2 text-xs font-mono text-slate-300">
                <span>
                  <strong className="text-[#4FD1A5]">{allNews.length}</strong> Bulletins
                </span>
                <span>•</span>
                <span>
                  <strong className="text-amber-400">{bookmarkedIds.length}</strong> Saved
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Breaking Story Spotlight Card */}
          {breakingNews && (
            <div className="lg:col-span-5">
              <div
                onClick={() => handleReadStory(breakingNews)}
                className="group cursor-pointer rounded-2xl bg-[#071B15]/90 border border-emerald-500/30 hover:border-[#4FD1A5] p-5 shadow-2xl transition-all duration-300 space-y-4"
              >
                <div className="relative h-44 rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={breakingNews.image}
                    alt={breakingNews.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-rose-500 text-white flex items-center gap-1.5 shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      Breaking Spotlight
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-black/60 text-emerald-300 border border-white/15 backdrop-blur-md">
                      {breakingNews.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-200">
                    <span>{breakingNews.source}</span>
                    <span>{breakingNews.date}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-white group-hover:text-[#4FD1A5] transition-colors line-clamp-2 leading-snug">
                    {breakingNews.title}
                  </h2>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {breakingNews.description}
                  </p>
                </div>

                <div className="pt-1 flex items-center justify-between border-t border-white/10 text-xs">
                  <span className="text-slate-400 font-mono flex items-center gap-1.5">
                    <Clock size={12} className="text-[#4FD1A5]" />
                    {breakingNews.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-[#4FD1A5] group-hover:translate-x-1 transition-transform">
                    <span>Read Full Dispatch</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══ SEARCH, SORT, VIEW MODE & CATEGORY BAR ═══ */}
      <div className="rounded-2xl bg-card border border-line p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              size={17}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tech news, AI breakthroughs, IoT, Linux, cloud..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-page border border-line text-heading placeholder:text-muted text-sm focus:outline-none focus:border-[#0F6B4F]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category Dropdown + Sort + View Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Select Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-page border border-line text-xs font-semibold text-heading focus:outline-none focus:border-[#0F6B4F] cursor-pointer"
              aria-label="Filter by category"
            >
              {NEWS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({categoryCounts[cat] ?? 0})
                </option>
              ))}
            </select>

            {/* Sort Tabs */}
            <div className="inline-flex items-center p-1 rounded-xl bg-page border border-line">
              <button
                type="button"
                onClick={() => setSortBy('latest')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${sortBy === 'latest'
                  ? 'bg-[#0F6B4F] text-white'
                  : 'text-muted hover:text-heading'
                  }`}
              >
                Latest
              </button>
              <button
                type="button"
                onClick={() => setSortBy('popular')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${sortBy === 'popular'
                  ? 'bg-[#0F6B4F] text-white'
                  : 'text-muted hover:text-heading'
                  }`}
              >
                <TrendingUp size={12} />
                <span>Trending</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy('saved')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${sortBy === 'saved'
                  ? 'bg-[#0F6B4F] text-white'
                  : 'text-muted hover:text-heading'
                  }`}
              >
                <Bookmark size={12} />
                <span>Saved ({bookmarkedIds.length})</span>
              </button>
            </div>

            {/* Grid / Compact View Toggle */}
            <div className="inline-flex items-center p-1 rounded-xl bg-page border border-line">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid'
                  ? 'bg-[#0F6B4F] text-white'
                  : 'text-muted hover:text-heading'
                  }`}
                title="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'compact'
                  ? 'bg-[#0F6B4F] text-white'
                  : 'text-muted hover:text-heading'
                  }`}
                title="Compact Feed View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Quick Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {NEWS_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border cursor-pointer flex items-center gap-1.5 ${active
                  ? 'bg-gradient-to-r from-[#0F6B4F] to-[#16805E] text-white border-transparent shadow-sm'
                  : 'bg-page text-muted border-line hover:text-heading hover:border-[#0F6B4F]/40'
                  }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${active ? 'bg-white/20 text-white' : 'bg-soft text-muted'
                    }`}
                >
                  {categoryCounts[cat] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ NEWS DISPATCHES FEED ═══ */}
      {filteredNews.length === 0 ? (
        <div className="rounded-2xl bg-card border border-line p-12 text-center space-y-3">
          <Newspaper size={36} className="mx-auto text-muted opacity-50" />
          <h3 className="text-lg font-bold text-heading">No matching tech news found</h3>
          <p className="text-xs sm:text-sm text-muted max-w-md mx-auto">
            Try clearing your search query or switching back to All categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setSortBy('latest');
            }}
            className="px-4 py-2 rounded-xl bg-[#0F6B4F] text-white text-xs font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => {
            const isLiked = likedIds.includes(item.id);
            const isSaved = bookmarkedIds.includes(item.id);
            const totalLikes = (item.likes || 0) + (isLiked ? 1 : 0);

            return (
              <article
                key={item.id}
                onClick={() => handleReadStory(item)}
                className="group rounded-2xl bg-card border border-line hover:border-[#0F6B4F]/50 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer"
              >
                <div>
                  {/* Cover Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-soft border-b border-line">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full border font-bold backdrop-blur-md bg-black/60 ${item.badgeColor || 'text-emerald-300 border-emerald-500/30'
                          }`}
                      >
                        {item.category}
                      </span>
                      {item.isLiveWire && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/90 text-white font-mono font-bold">
                          LIVE
                        </span>
                      )}
                    </div>

                    {/* Bookmark & Delete Quick Actions */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {item.isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomNews(item.id, e)}
                          className="p-2 rounded-xl bg-black/65 hover:bg-rose-500 text-white backdrop-blur-md transition-colors cursor-pointer"
                          title="Delete custom news bulletin"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(item.id, e)}
                        className={`p-2 rounded-xl backdrop-blur-md border transition-colors cursor-pointer ${isSaved
                          ? 'bg-[#0F6B4F] text-white border-[#4FD1A5]/40'
                          : 'bg-black/60 text-white/80 hover:text-white border-white/15'
                          }`}
                        title={isSaved ? 'Remove Bookmark' : 'Save Story'}
                      >
                        <Bookmark
                          size={13}
                          className={isSaved ? 'fill-current' : ''}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-muted font-mono">
                      <span className="truncate max-w-[60%]">{item.source}</span>
                      <span>{item.date}</span>
                    </div>

                    <h3 className="text-base font-bold text-heading group-hover:text-[#0F6B4F] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-muted line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3.5 border-t border-line bg-page/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => toggleLike(item.id, e)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${isLiked
                        ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        : 'bg-card text-muted hover:text-heading border-line'
                        }`}
                    >
                      <Heart
                        size={12}
                        className={isLiked ? 'fill-current text-rose-400' : ''}
                      />
                      <span>{totalLikes}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleShare(item, e)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-card hover:bg-soft text-muted hover:text-heading border border-line text-[11px] font-semibold transition-colors cursor-pointer"
                      title="Copy story link"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <Share2 size={12} />
                      )}
                    </button>
                  </div>

                  <span className="inline-flex items-center gap-1 font-bold text-[#0F6B4F] group-hover:translate-x-0.5 transition-transform">
                    <span>Read Bulletin</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Compact Horizontal Feed View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredNews.map((item) => {
            const isLiked = likedIds.includes(item.id);
            const isSaved = bookmarkedIds.includes(item.id);
            const totalLikes = (item.likes || 0) + (isLiked ? 1 : 0);

            return (
              <div
                key={item.id}
                onClick={() => handleReadStory(item)}
                className="p-4 sm:p-5 rounded-2xl bg-card border border-line hover:border-[#0F6B4F]/45 transition-all flex flex-col sm:flex-row gap-4 sm:items-center group cursor-pointer shadow-sm"
              >
                <div className="w-full sm:w-40 h-28 shrink-0 rounded-xl overflow-hidden bg-soft border border-line">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-2 flex-grow min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${item.badgeColor}`}
                    >
                      {item.category}
                    </span>
                    <span className="text-[11px] text-muted font-mono">
                      {item.date}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-heading group-hover:text-[#0F6B4F] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted font-mono">
                        {item.source}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => toggleLike(item.id, e)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] cursor-pointer ${isLiked
                          ? 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                          : 'text-muted border-line'
                          }`}
                      >
                        <Heart size={11} className={isLiked ? 'fill-current' : ''} />
                        <span>{totalLikes}</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(item.id, e)}
                        className={`p-1 rounded-md border cursor-pointer ${isSaved
                          ? 'text-[#4FD1A5] border-emerald-500/30 bg-[#0F6B4F]/15'
                          : 'text-muted border-line'
                          }`}
                      >
                        <Bookmark size={11} className={isSaved ? 'fill-current' : ''} />
                      </button>
                    </div>

                    <span className="text-[#0F6B4F] font-bold inline-flex items-center gap-1">
                      <span>Open</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ FULL STORY READER MODAL ═══ */}
      {selectedStory && (
        <div
          onClick={() => setSelectedStory(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-3xl bg-card border border-line p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setSelectedStory(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-page hover:bg-soft text-muted hover:text-heading border border-line cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex flex-wrap items-center gap-2.5 pr-10">
              <span
                className={`text-xs px-3 py-1 rounded-full border font-bold ${selectedStory.badgeColor}`}
              >
                {selectedStory.category}
              </span>
              <span className="text-xs text-muted font-mono">
                {selectedStory.date}
              </span>
              <span className="text-xs text-muted font-mono">•</span>
              <span className="text-xs text-muted font-mono">
                {selectedStory.readTime}
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-extrabold text-heading leading-snug">
              {selectedStory.title}
            </h2>

            <div className="rounded-2xl overflow-hidden max-h-80 border border-line bg-soft">
              <img
                src={selectedStory.image}
                alt={selectedStory.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Key Engineering Takeaways */}
            {Array.isArray(selectedStory.takeaways) &&
              selectedStory.takeaways.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-page border border-line space-y-2.5">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F6B4F] flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>Key Engineering Takeaways</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedStory.takeaways.map((point, idx) => (
                      <li
                        key={idx}
                        className="text-xs sm:text-sm text-heading flex items-start gap-2"
                      >
                        <CheckCircle2
                          size={15}
                          className="text-[#0F6B4F] shrink-0 mt-0.5"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Full Coverage Paragraphs */}
            <div className="space-y-3 text-sm sm:text-base text-muted leading-relaxed">
              {(selectedStory.fullContent || [selectedStory.description]).map(
                (para, index) => (
                  <p key={index}>{para}</p>
                )
              )}
            </div>

            {/* Source & Interactive Footer */}
            <div className="p-4 rounded-2xl bg-page border border-line flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-muted">Source Dispatch: </span>
                <strong className="text-heading font-semibold">
                  {selectedStory.source}
                </strong>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleLike(selectedStory.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border font-bold cursor-pointer ${likedIds.includes(selectedStory.id)
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    : 'bg-card text-heading border-line'
                    }`}
                >
                  <Heart
                    size={14}
                    className={
                      likedIds.includes(selectedStory.id) ? 'fill-current' : ''
                    }
                  />
                  <span>
                    {(selectedStory.likes || 0) +
                      (likedIds.includes(selectedStory.id) ? 1 : 0)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleBookmark(selectedStory.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border font-bold cursor-pointer ${bookmarkedIds.includes(selectedStory.id)
                    ? 'bg-[#0F6B4F] text-white border-transparent'
                    : 'bg-card text-heading border-line'
                    }`}
                >
                  <Bookmark size={14} />
                  <span>
                    {bookmarkedIds.includes(selectedStory.id)
                      ? 'Bookmarked'
                      : 'Bookmark'}
                  </span>
                </button>

                {selectedStory.externalUrl && (
                  <a
                    href={selectedStory.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F6B4F] hover:bg-[#16805E] text-white font-bold transition-colors"
                  >
                    <span>Original Source</span>
                    <ExternalLink size={13} />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedStory(null)}
                  className="px-4 py-2 rounded-xl bg-soft hover:bg-card text-heading border border-line font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ POST NEW TECH NEWS MODAL (WITH COVER IMAGE LINK & UPLOAD) ═══ */}
      {publishModalOpen && (
        <div
          onClick={() => setPublishModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-3xl bg-card border border-line p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0F6B4F]/15 border border-[#0F6B4F]/30 flex items-center justify-center text-[#0F6B4F]">
                  <Newspaper size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-heading">
                    Publish Tech News Bulletin
                  </h3>
                  <p className="text-xs text-muted">
                    Share breaking developer news, releases, or architecture dispatches.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPublishModalOpen(false)}
                className="p-2 rounded-xl bg-page text-muted hover:text-heading border border-line cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handlePublishBulletin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={newBulletin.title}
                  onChange={(e) =>
                    setNewBulletin((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g. WebGPU Compute Shaders Accelerate Browser LLM Inference by 4x"
                  className="w-full px-4 py-2.5 rounded-xl bg-page border border-line text-sm text-heading focus:outline-none focus:border-[#0F6B4F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    Category
                  </label>
                  <select
                    value={newBulletin.category}
                    onChange={(e) =>
                      setNewBulletin((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-page border border-line text-sm text-heading focus:outline-none focus:border-[#0F6B4F]"
                  >
                    {NEWS_CATEGORIES.slice(1).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    Source Name
                  </label>
                  <input
                    type="text"
                    value={newBulletin.source}
                    onChange={(e) =>
                      setNewBulletin((prev) => ({
                        ...prev,
                        source: e.target.value,
                      }))
                    }
                    placeholder="e.g. TechJourney Wire"
                    className="w-full px-4 py-2.5 rounded-xl bg-page border border-line text-sm text-heading focus:outline-none focus:border-[#0F6B4F]"
                  />
                </div>
              </div>

              {/* Cover Image Link or File Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">
                    Cover Image (Link or Upload)
                  </label>
                  <div className="inline-flex p-0.5 rounded-lg bg-page border border-line">
                    <button
                      type="button"
                      onClick={() => setCoverMode('link')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${coverMode === 'link'
                        ? 'bg-[#0F6B4F] text-white'
                        : 'text-muted'
                        }`}
                    >
                      Image Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverMode('upload')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${coverMode === 'upload'
                        ? 'bg-[#0F6B4F] text-white'
                        : 'text-muted'
                        }`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCoverUpload(e.target.files?.[0])}
                  className="hidden"
                />

                {coverMode === 'link' ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={
                        newBulletin.image.startsWith('data:image/')
                          ? ''
                          : newBulletin.image
                      }
                      onChange={(e) => {
                        setUploadedFileName('');
                        setNewBulletin((prev) => ({
                          ...prev,
                          image: e.target.value,
                        }));
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-page border border-line text-sm text-heading focus:outline-none focus:border-[#0F6B4F]"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2.5 rounded-xl bg-soft hover:bg-[#0F6B4F] text-heading hover:text-white border border-line text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Upload size={13} />
                      <span>Upload</span>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 rounded-xl border-2 border-dashed border-line hover:border-[#0F6B4F] bg-page text-center cursor-pointer"
                  >
                    <Upload size={18} className="mx-auto text-[#0F6B4F] mb-1" />
                    <p className="text-xs font-semibold text-heading">
                      {uploadingCover
                        ? 'Processing image...'
                        : uploadedFileName || 'Click to choose cover image from device'}
                    </p>
                  </div>
                )}

                {newBulletin.image && (
                  <div className="relative h-36 rounded-xl overflow-hidden border border-line bg-soft">
                    <img
                      src={newBulletin.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  News Summary & Full Report *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newBulletin.description}
                  onChange={(e) =>
                    setNewBulletin((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Write the news summary and key engineering details..."
                  className="w-full px-4 py-2.5 rounded-xl bg-page border border-line text-sm text-heading focus:outline-none focus:border-[#0F6B4F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    Key Takeaways (Optional, 1 per line)
                  </label>
                  <textarea
                    rows={2}
                    value={newBulletin.keyTakeaways}
                    onChange={(e) =>
                      setNewBulletin((prev) => ({
                        ...prev,
                        keyTakeaways: e.target.value,
                      }))
                    }
                    placeholder="40% lower memory footprint&#10;Open-source MIT release"
                    className="w-full px-3.5 py-2 rounded-xl bg-page border border-line text-xs text-heading focus:outline-none focus:border-[#0F6B4F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    External Reference Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={newBulletin.externalUrl}
                    onChange={(e) =>
                      setNewBulletin((prev) => ({
                        ...prev,
                        externalUrl: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-page border border-line text-xs text-heading focus:outline-none focus:border-[#0F6B4F]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPublishModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-page border border-line text-xs font-semibold text-heading cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F6B4F] hover:bg-[#16805E] text-white text-xs font-bold shadow-lg shadow-[#0F6B4F]/25 cursor-pointer"
                >
                  Publish Bulletin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

