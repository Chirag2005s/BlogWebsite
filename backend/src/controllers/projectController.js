import mongoose from 'mongoose';
import Project from '../models/Project.js';
import ProjectComment from '../models/ProjectComment.js';
import User from '../models/User.js';

const INITIAL_PROJECTS = [
  {
    title: 'CloudPulse — Distributed Microservices Telemetry & APM',
    slug: 'cloudpulse-distributed-microservices-telemetry-apm',
    tagline: 'Real-time distributed tracing, log aggregation, and anomaly alerting platform for cloud-native Node.js & Go services.',
    description: `## Overview\n**CloudPulse** is an open-source application performance monitoring (APM) and distributed telemetry engine designed for high-throughput microservices.\n\n### Problem It Solves\nDebugging latency spikes across 20+ microservices is notoriously painful without unified correlation IDs and flamegraphs. CloudPulse ingests OpenTelemetry spans over gRPC/HTTP, correlates logs with traces, and visualizes service dependency graphs in real time.\n\n### Core Highlights\n- **Sub-second Trace Ingestion:** Built with Redis Streams and ClickHouse/MongoDB time-series collections.\n- **Live Service Dependency Topology:** Automatically maps upstream and downstream bottlenecks.\n- **Zero-Config SDK:** Drop-in middleware for Express, Fastify, and Go net/http.`,
    category: 'Backend & API',
    difficulty: 'Advanced',
    techStack: ['Node.js', 'React', 'TypeScript', 'Docker', 'Redis', 'MongoDB', 'WebSockets'],
    tags: ['Observability', 'Microservices', 'OpenTelemetry', 'DevOps'],
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80'
    ],
    githubUrl: 'https://github.com/techjourney-dev/cloudpulse-apm',
    liveDemoUrl: 'https://cloudpulse-demo.techjourney.dev',
    videoDemoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    keyFeatures: [
      'Distributed trace waterfall visualization with sub-millisecond precision',
      'Real-time WebSocket anomaly detection and Slack/Discord webhook alerts',
      'Automatic service map generation with error-rate heatmaps',
      'Role-based access control and multi-project API keys'
    ],
    architectureOverview: `1. **Ingestion Gateway (Node.js Cluster):** Receives OTLP payloads and buffers spans into Redis Streams.\n2. **Stream Processor Worker:** Aggregates p50/p95/p99 latency buckets every 5 seconds.\n3. **Storage Layer:** Time-series metrics and indexed trace documents in MongoDB.\n4. **Dashboard UI (React + Tailwind):** Streams live telemetry over WebSockets.`,
    setupInstructions: `git clone https://github.com/techjourney-dev/cloudpulse-apm.git\ncd cloudpulse-apm\ndocker compose up -d\nnpm install && npm run dev`,
    lookingForContributors: true,
    isFeatured: true,
    creatorName: 'Aarav Mehta',
    views: 342,
    likesCount: 28,
    bookmarksCount: 15,
  },
  {
    title: 'CodeWeaver AI — Autonomous Pull Request & Architecture Reviewer',
    slug: 'codeweaver-ai-autonomous-pr-reviewer',
    tagline: 'AST-aware AI code review assistant that detects security flaws, N+1 queries, and architectural drift directly on GitHub PRs.',
    description: `## Overview\n**CodeWeaver AI** combines static Abstract Syntax Tree (AST) parsing with LLM reasoning to deliver actionable, low-noise code reviews on every pull request.\n\n### Why CodeWeaver?\nGeneric AI wrappers flood PRs with trivial formatting comments. CodeWeaver builds a dependency graph of the modified files first, identifies security sinks, and only posts high-confidence architectural and performance recommendations.\n\n### Capabilities\n- Detects SQL/NoSQL injection vectors, unindexed queries, and memory leaks.\n- Generates inline GitHub suggestion blocks that developers can commit with one click.\n- Supports custom team rulebooks via \`.codeweaver.yml\`.`,
    category: 'AI / ML',
    difficulty: 'Advanced',
    techStack: ['Python', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'Docker'],
    tags: ['AI', 'LLM', 'Developer Tools', 'Static Analysis', 'GitHub App'],
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80'
    ],
    githubUrl: 'https://github.com/techjourney-dev/codeweaver-ai',
    liveDemoUrl: 'https://codeweaver.techjourney.dev',
    keyFeatures: [
      'Tree-sitter AST diff analyzer supporting JS/TS, Python, Go, and Rust',
      'Contextual RAG pipeline indexing repository architecture docs',
      'One-click GitHub commit suggestions for security patches',
      'Self-hostable with Ollama or cloud LLM providers'
    ],
    architectureOverview: `GitHub Webhook -> FastAPI Queue -> Tree-Sitter AST Parser -> Vector Context Retriever -> Structured Review Generator -> GitHub Checks API.`,
    setupInstructions: `git clone https://github.com/techjourney-dev/codeweaver-ai.git\ncd codeweaver-ai\ncp .env.example .env\npip install -r requirements.txt\nuvicorn app.main:app --reload`,
    lookingForContributors: true,
    isFeatured: true,
    creatorName: 'Priya Nair',
    views: 518,
    likesCount: 46,
    bookmarksCount: 29,
  },
  {
    title: 'SyncCanvas — Collaborative System Design Whiteboard',
    slug: 'synccanvas-collaborative-system-design-whiteboard',
    tagline: 'Multiplayer infinite canvas for software architects with live CRDT synchronization, cloud icons, and Markdown export.',
    description: `## Overview\n**SyncCanvas** is a fast, conflict-free collaborative whiteboard built specifically for system design interviews and engineering RFCs.\n\n### Built for Engineers\n- Includes pre-built stencils for Load Balancers, Kafka Brokers, Sharded Databases, CDN Edge nodes, and Kubernetes clusters.\n- Uses Yjs CRDTs over WebSockets so multiple engineers can sketch and annotate simultaneously with sub-20ms latency.\n- Exports diagrams directly to Mermaid.js, PNG, SVG, or embeddable links.`,
    category: 'Web App',
    difficulty: 'Intermediate',
    techStack: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'Tailwind CSS', 'Canvas API'],
    tags: ['System Design', 'CRDT', 'Real-Time', 'Whiteboard', 'Collaboration'],
    coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    screenshots: [],
    githubUrl: 'https://github.com/techjourney-dev/synccanvas',
    liveDemoUrl: 'https://synccanvas.techjourney.dev',
    keyFeatures: [
      'Conflict-free multiplayer state synchronization powered by CRDTs',
      '60+ cloud & distributed systems architecture components',
      'Live cursor presence and voice-note annotations',
      'Instant export to SVG, PNG, and Mermaid markdown'
    ],
    architectureOverview: `React HTML5 Canvas Renderer + Yjs CRDT Document Store + WebSocket Signaling Server + IndexedDB Offline Persistence.`,
    setupInstructions: `git clone https://github.com/techjourney-dev/synccanvas.git\ncd synccanvas\nnpm install\nnpm run start`,
    lookingForContributors: false,
    isFeatured: true,
    creatorName: 'Rohan Sharma',
    views: 275,
    likesCount: 34,
    bookmarksCount: 21,
  },
  {
    title: 'TermFlow — Interactive Terminal API Client & Load Tester',
    slug: 'termflow-terminal-api-client-load-tester',
    tagline: 'Keyboard-driven TUI and CLI tool for testing REST, GraphQL, and WebSocket endpoints with built-in concurrency benchmarking.',
    description: `## Overview\n**TermFlow** replaces heavy Electron API clients with a blazing-fast terminal interface that stores collections as plain Git-friendly YAML/JSON files in your repository.\n\n### Why Developers Love It\n- Uses < 15MB RAM and launches in 20 milliseconds.\n- Switch seamlessly between interactive request inspection and 10,000 RPS load testing.\n- Supports environment variable chaining and JWT auto-refresh hooks.`,
    category: 'DevTools & CLI',
    difficulty: 'Intermediate',
    techStack: ['Go', 'CLI', 'REST API', 'GraphQL', 'Docker'],
    tags: ['CLI', 'Go', 'API Testing', 'Benchmarking', 'Open Source'],
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1200&q=80',
    screenshots: [],
    githubUrl: 'https://github.com/techjourney-dev/termflow-cli',
    liveDemoUrl: 'https://termflow.techjourney.dev',
    keyFeatures: [
      'Vim-inspired keyboard navigation with syntax-highlighted JSON/Headers',
      'Git-native request collections stored in .termflow/ directory',
      'Built-in HTTP/2 load generator with live latency histograms',
      'Cross-platform single binary for Windows, macOS, and Linux'
    ],
    architectureOverview: `Written in Go using BubbleTea TUI framework + custom worker pool HTTP client for concurrent load generation.`,
    setupInstructions: `go install github.com/techjourney-dev/termflow@latest\ntermflow init\ntermflow run collection.yaml`,
    lookingForContributors: true,
    isFeatured: false,
    creatorName: 'Vikram Patel',
    views: 190,
    likesCount: 22,
    bookmarksCount: 14,
  },
  {
    title: 'DevVault — End-to-End Encrypted Environment & Secret Manager',
    slug: 'devvault-encrypted-secret-manager',
    tagline: 'Zero-knowledge team secret manager to sync .env files securely across local machines and CI/CD pipelines.',
    description: `## Overview\nStop sharing \`.env\` files over Slack! **DevVault** encrypts secrets on the client using AES-256-GCM before they ever touch the server.\n\n### Features\n- Inject secrets directly into child processes (\`devvault run -- npm start\`) without writing plaintext files to disk.\n- Full audit logs, secret rotation reminders, and granular environment scopes (\`development\`, \`staging\`, \`production\`).`,
    category: 'Full Stack',
    difficulty: 'Intermediate',
    techStack: ['Node.js', 'React', 'MongoDB', 'WebCrypto', 'Express', 'Tailwind CSS'],
    tags: ['Security', 'Cryptography', 'Full Stack', 'DevSecOps'],
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    screenshots: [],
    githubUrl: 'https://github.com/techjourney-dev/devvault',
    liveDemoUrl: 'https://devvault.techjourney.dev',
    keyFeatures: [
      'Client-side AES-256-GCM encryption and PBKDF2 key derivation',
      'CLI secret injector with zero plaintext disk footprint',
      'Environment diff viewer across Dev, Staging, and Prod',
      'Instant secret revocation and team role permissions'
    ],
    architectureOverview: `React Web Dashboard (WebCrypto API) + Express REST API + MongoDB Encrypted Blob Store + Node.js CLI wrapper.`,
    setupInstructions: `git clone https://github.com/techjourney-dev/devvault.git\ncd devvault\nnpm install\nnpm run dev`,
    lookingForContributors: false,
    isFeatured: false,
    creatorName: 'Neha Gupta',
    views: 215,
    likesCount: 19,
    bookmarksCount: 11,
  },
  {
    title: 'AlgoArena — Visual Data Structures & Graph Algorithm Sandbox',
    slug: 'algoarena-visual-dsa-sandbox',
    tagline: 'Interactive step-by-step visualizer for graph traversal, dynamic programming tables, balanced trees, and sorting algorithms.',
    description: `## Overview\n**AlgoArena** helps computer science students and interview candidates build intuition for complex algorithms by visualizing memory states, recursion trees, and pointer movements frame by frame.\n\n### Included Visualizers\n- **Graph Algorithms:** Dijkstra, A* Search, Bellman-Ford, Tarjan's SCC, Minimum Spanning Tree.\n- **Trees & Heaps:** AVL Tree rotations, Red-Black Trees, Trie prefix search.\n- **Dynamic Programming:** Live 2D DP table state transitions with recurrence highlights.`,
    category: 'Open Source',
    difficulty: 'Beginner',
    techStack: ['React', 'JavaScript', 'Tailwind CSS', 'Framer Motion', 'SVG'],
    tags: ['DSA', 'Algorithms', 'Visualization', 'Education', 'Frontend'],
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
    screenshots: [],
    githubUrl: 'https://github.com/techjourney-dev/algoarena',
    liveDemoUrl: 'https://algoarena.techjourney.dev',
    keyFeatures: [
      'Time-travel debugging slider to step forward and backward through execution frames',
      'Custom graph and maze drawing canvas with weighted edges',
      'Side-by-side pseudocode line highlighting synchronized with animation',
      'Adjustable playback speed from 0.25x to 4x'
    ],
    architectureOverview: `Deterministic Generator Functions yield state snapshots at each algorithmic step, rendered by a decoupled SVG/Canvas playback engine.`,
    setupInstructions: `git clone https://github.com/techjourney-dev/algoarena.git\ncd algoarena\nnpm install\nnpm run dev`,
    lookingForContributors: true,
    isFeatured: false,
    creatorName: 'Karan Verma',
    views: 410,
    likesCount: 39,
    bookmarksCount: 25,
  }
];

const ensureSeedProjects = async () => {
  try {
    const count = await Project.countDocuments();
    if (count === 0) {
      const anyUser = await User.findOne().select('_id name');
      const docs = INITIAL_PROJECTS.map((item) => ({
        ...item,
        creator: anyUser?._id || undefined,
      }));
      await Project.insertMany(docs);
    }
  } catch (err) {
    console.warn('Seed projects warning:', err.message);
  }
};

const parseListField = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map((i) => String(i).trim()).filter(Boolean);
  }
  return String(input)
    .split(',')
    .map((i) => i.trim())
    .filter(Boolean);
};

const parseLinesField = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map((i) => String(i).trim()).filter(Boolean);
  }
  return String(input)
    .split(/\r?\n|,/)
    .map((i) => i.trim())
    .filter(Boolean);
};

// @desc    Get all projects with filters & sorting
// @route   GET /api/projects
export const getProjects = async (req, res) => {
  try {
    await ensureSeedProjects();

    const {
      search,
      category,
      difficulty,
      tech,
      contributors,
      featured,
      creator,
      sort = 'newest',
    } = req.query;

    const query = { status: { $ne: 'Draft' } };

    if (category && category !== 'All') {
      query.category = category;
    }
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }
    if (tech && tech !== 'All') {
      query.techStack = { $regex: new RegExp(`^${tech}$`, 'i') };
    }
    if (contributors === 'true') {
      query.lookingForContributors = true;
    }
    if (featured === 'true') {
      query.isFeatured = true;
    }
    if (creator && mongoose.Types.ObjectId.isValid(creator)) {
      query.creator = creator;
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { tagline: regex },
        { description: regex },
        { techStack: regex },
        { tags: regex },
        { category: regex },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'likes' || sort === 'popular') {
      sortOption = { likesCount: -1, views: -1, createdAt: -1 };
    } else if (sort === 'views') {
      sortOption = { views: -1, createdAt: -1 };
    } else if (sort === 'comments') {
      sortOption = { commentsCount: -1, createdAt: -1 };
    } else if (sort === 'featured') {
      sortOption = { isFeatured: -1, likesCount: -1, createdAt: -1 };
    }

    const projects = await Project.find(query)
      .populate('creator', 'name email username profileImage role roleTitle')
      .sort(sortOption);

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's Project Hub portfolio & stats
// @route   GET /api/projects/my-hub
export const getMyProjectHub = async (req, res) => {
  try {
    const userId = req.user._id;

    const [myProjects, bookmarkedProjects, likedProjects] = await Promise.all([
      Project.find({ creator: userId })
        .populate('creator', 'name email username profileImage role roleTitle')
        .sort({ createdAt: -1 }),
      Project.find({ bookmarks: userId })
        .populate('creator', 'name email username profileImage role roleTitle')
        .sort({ createdAt: -1 }),
      Project.find({ likes: userId })
        .populate('creator', 'name email username profileImage role roleTitle')
        .sort({ createdAt: -1 }),
    ]);

    const totalLikesReceived = myProjects.reduce(
      (acc, p) => acc + (p.likesCount || p.likes?.length || 0),
      0
    );
    const totalViewsReceived = myProjects.reduce(
      (acc, p) => acc + (p.views || 0),
      0
    );
    const totalCommentsReceived = myProjects.reduce(
      (acc, p) => acc + (p.commentsCount || 0),
      0
    );

    res.json({
      stats: {
        projectsCreated: myProjects.length,
        bookmarkedCount: bookmarkedProjects.length,
        likedCount: likedProjects.length,
        totalLikesReceived,
        totalViewsReceived,
        totalCommentsReceived,
      },
      myProjects,
      bookmarkedProjects,
      likedProjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project by ID or slug
// @route   GET /api/projects/:id
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const project = await Project.findOne(
      isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id }
    ).populate('creator', 'name email username profileImage role roleTitle bio github linkedin');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.views = (project.views || 0) + 1;
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
export const createProject = async (req, res) => {
  try {
    const {
      title,
      tagline,
      description,
      category,
      difficulty,
      techStack,
      tags,
      coverImage,
      screenshots,
      githubUrl,
      liveDemoUrl,
      videoDemoUrl,
      keyFeatures,
      architectureOverview,
      setupInstructions,
      lookingForContributors,
      status,
    } = req.body;

    if (!title?.trim() || !tagline?.trim() || !description?.trim()) {
      return res.status(400).json({
        message: 'Title, tagline, and project description are required.',
      });
    }

    const project = new Project({
      title: title.trim(),
      tagline: tagline.trim(),
      description,
      category: category || 'Full Stack',
      difficulty: difficulty || 'Intermediate',
      techStack: parseListField(techStack),
      tags: parseListField(tags),
      coverImage: coverImage?.trim() || '',
      screenshots: parseLinesField(screenshots),
      githubUrl: githubUrl?.trim() || '',
      liveDemoUrl: liveDemoUrl?.trim() || '',
      videoDemoUrl: videoDemoUrl?.trim() || '',
      keyFeatures: parseLinesField(keyFeatures),
      architectureOverview: architectureOverview || '',
      setupInstructions: setupInstructions || '',
      lookingForContributors: Boolean(lookingForContributors),
      status: status === 'Draft' ? 'Draft' : 'Published',
      creator: req.user._id,
      creatorName: req.user.name || 'Developer',
    });

    const saved = await project.save();
    const populated = await Project.findById(saved._id).populate(
      'creator',
      'name email username profileImage role roleTitle'
    );

    res.status(201).json(populated || saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an existing project
// @route   PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const project = await Project.findOne(
      isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isOwner =
      project.creator && String(project.creator) === String(req.user._id);
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'Only the project creator or an admin can update this project.',
      });
    }

    const {
      title,
      tagline,
      description,
      category,
      difficulty,
      techStack,
      tags,
      coverImage,
      screenshots,
      githubUrl,
      liveDemoUrl,
      videoDemoUrl,
      keyFeatures,
      architectureOverview,
      setupInstructions,
      lookingForContributors,
      isFeatured,
      status,
    } = req.body;

    if (title !== undefined) project.title = title.trim();
    if (tagline !== undefined) project.tagline = tagline.trim();
    if (description !== undefined) project.description = description;
    if (category !== undefined) project.category = category;
    if (difficulty !== undefined) project.difficulty = difficulty;
    if (techStack !== undefined) project.techStack = parseListField(techStack);
    if (tags !== undefined) project.tags = parseListField(tags);
    if (coverImage !== undefined) project.coverImage = coverImage.trim();
    if (screenshots !== undefined) project.screenshots = parseLinesField(screenshots);
    if (githubUrl !== undefined) project.githubUrl = githubUrl.trim();
    if (liveDemoUrl !== undefined) project.liveDemoUrl = liveDemoUrl.trim();
    if (videoDemoUrl !== undefined) project.videoDemoUrl = videoDemoUrl.trim();
    if (keyFeatures !== undefined) project.keyFeatures = parseLinesField(keyFeatures);
    if (architectureOverview !== undefined) project.architectureOverview = architectureOverview;
    if (setupInstructions !== undefined) project.setupInstructions = setupInstructions;
    if (lookingForContributors !== undefined) {
      project.lookingForContributors = Boolean(lookingForContributors);
    }
    if (isFeatured !== undefined && isAdmin) {
      project.isFeatured = Boolean(isFeatured);
    }
    if (status !== undefined) {
      project.status = status === 'Draft' ? 'Draft' : 'Published';
    }

    const updated = await project.save();
    const populated = await Project.findById(updated._id).populate(
      'creator',
      'name email username profileImage role roleTitle'
    );

    res.json(populated || updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const project = await Project.findOne(
      isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isOwner =
      project.creator && String(project.creator) === String(req.user._id);
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'Only the project creator or an admin can delete this project.',
      });
    }

    await ProjectComment.deleteMany({ projectId: project._id });
    await Project.findByIdAndDelete(project._id);

    res.json({ message: 'Project deleted successfully', id: project._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle like on a project
// @route   POST /api/projects/:id/like
export const toggleLikeProject = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const project = await Project.findOne(
      isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userIdStr = String(req.user._id);
    const alreadyLiked = (project.likes || []).some(
      (uid) => String(uid) === userIdStr
    );

    if (alreadyLiked) {
      project.likes = project.likes.filter((uid) => String(uid) !== userIdStr);
      project.likesCount = Math.max(0, (project.likesCount || 1) - 1);
    } else {
      project.likes.push(req.user._id);
      project.likesCount = (project.likesCount || 0) + 1;
    }

    await project.save();

    res.json({
      isLiked: !alreadyLiked,
      likesCount: project.likesCount,
      likes: project.likes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle bookmark on a project
// @route   POST /api/projects/:id/bookmark
export const toggleBookmarkProject = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const project = await Project.findOne(
      isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userIdStr = String(req.user._id);
    const alreadyBookmarked = (project.bookmarks || []).some(
      (uid) => String(uid) === userIdStr
    );

    if (alreadyBookmarked) {
      project.bookmarks = project.bookmarks.filter(
        (uid) => String(uid) !== userIdStr
      );
      project.bookmarksCount = Math.max(0, (project.bookmarksCount || 1) - 1);
    } else {
      project.bookmarks.push(req.user._id);
      project.bookmarksCount = (project.bookmarksCount || 0) + 1;
    }

    await project.save();

    res.json({
      isBookmarked: !alreadyBookmarked,
      bookmarksCount: project.bookmarksCount,
      bookmarks: project.bookmarks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comments for a project
// @route   GET /api/projects/:id/comments
export const getProjectComments = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const project = await Project.findOne(
      isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id }
    ).select('_id');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const comments = await ProjectComment.find({ projectId: project._id })
      .populate('user', 'name email username profileImage role roleTitle')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Post a comment on a project
// @route   POST /api/projects/:id/comments
export const postProjectComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, feedbackType } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const project = await Project.findOne(
      isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const comment = new ProjectComment({
      projectId: project._id,
      user: req.user._id,
      text: text.trim(),
      feedbackType: feedbackType || 'General',
    });

    await comment.save();

    project.commentsCount = (project.commentsCount || 0) + 1;
    await project.save();

    const populated = await ProjectComment.findById(comment._id).populate(
      'user',
      'name email username profileImage role roleTitle'
    );

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment on a project
// @route   DELETE /api/projects/:id/comments/:commentId
export const deleteProjectComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const comment = await ProjectComment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const project = await Project.findById(comment.projectId || id);
    const isCommentAuthor = String(comment.user) === String(req.user._id);
    const isProjectOwner =
      project?.creator && String(project.creator) === String(req.user._id);
    const isAdmin = req.user.role === 'ADMIN';

    if (!isCommentAuthor && !isProjectOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await ProjectComment.findByIdAndDelete(commentId);

    if (project) {
      project.commentsCount = Math.max(0, (project.commentsCount || 1) - 1);
      await project.save();
    }

    res.json({ message: 'Comment deleted', commentId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle like on a project comment
// @route   POST /api/projects/:id/comments/:commentId/like
export const toggleLikeProjectComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await ProjectComment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const userIdStr = String(req.user._id);
    const alreadyLiked = (comment.likes || []).some(
      (uid) => String(uid) === userIdStr
    );

    if (alreadyLiked) {
      comment.likes = comment.likes.filter((uid) => String(uid) !== userIdStr);
    } else {
      comment.likes.push(req.user._id);
    }

    await comment.save();
    const populated = await ProjectComment.findById(comment._id).populate(
      'user',
      'name email username profileImage role roleTitle'
    );

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

