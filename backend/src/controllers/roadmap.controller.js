import slugify from 'slugify';
import Roadmap from '../models/Roadmap.js';

const DEFAULT_ROADMAPS = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer Roadmap',
    slug: 'frontend-developer',
    category: 'Web Development',
    description: 'Master modern client-side development from web fundamentals to advanced React performance tuning, state management, and web design system architecture.',
    icon: 'Layout',
    color: 'from-blue-600 to-cyan-500',
    borderColor: 'border-blue-500/30',
    estimatedTime: '6-8 Months',
    level: 'Beginner to Advanced',
    totalTopics: 18,
    phases: [
      {
        phaseNumber: 1,
        title: 'Phase 1: Web Core Fundamentals',
        description: 'Establish strong mastery of browser mechanics, semantic HTML5, modern CSS3 styling, and ES6+ JavaScript core concepts.',
        nodes: [
          {
            id: 'fe-html-css',
            title: 'HTML5 & Modern CSS3 Layouts',
            tag: 'Must Learn',
            description: 'Semantic tags, Accessibility (a11y), CSS Flexbox, CSS Grid, media queries, CSS custom properties (variables), and responsive design principles.',
            keyTopics: ['Semantic Elements', 'Flexbox & Grid', 'Responsive Breakpoints', 'ARIA Roles', 'CSS Variables'],
            articleSlug: 'mastering-react-custom-hooks',
          },
          {
            id: 'fe-javascript-es6',
            title: 'Modern JavaScript (ES6+)',
            tag: 'Core Skill',
            description: 'Promises, Async/Await, Fetch API, DOM manipulation, Closures, Event Loop, Array Methods (map, filter, reduce), and ES modules.',
            keyTopics: ['Async/Await & Promises', 'Event Loop & Event Delegation', 'Closures & Scope', 'Destructuring & Rest/Spread'],
          },
          {
            id: 'fe-git-tooling',
            title: 'Version Control & Build Tools',
            tag: 'Workflow',
            description: 'Git branching models, GitHub PR workflows, Vite, npm/pnpm package managers, ESLint, and Prettier formatting.',
            keyTopics: ['Git Branching Strategy', 'Vite Bundler', 'npm / pnpm Scripts', 'ESLint Configuration'],
          },
        ],
      },
      {
        phaseNumber: 2,
        title: 'Phase 2: Frontend Frameworks & State',
        description: 'Build component-driven single page applications using React, custom hooks, client-side routing, and scalable state management.',
        nodes: [
          {
            id: 'fe-react-core',
            title: 'React.js Architecture & JSX',
            tag: 'Essential Framework',
            description: 'Components, Props, State management with useState and useReducer, Effects with useEffect, and Component Lifecycle.',
            keyTopics: ['JSX & Virtual DOM', 'useState & useEffect', 'Component Composition', 'Form Handling & Controlled Inputs'],
          },
          {
            id: 'fe-react-advanced',
            title: 'Custom Hooks & State Management',
            tag: 'Advanced React',
            description: 'Extracting reusable business logic into custom hooks, Context API, Zustand, Redux Toolkit, and TanStack Query (React Query) for server state.',
            keyTopics: ['Custom Hook Design', 'Context API', 'Zustand / Redux Toolkit', 'TanStack Query Data Fetching'],
          },
          {
            id: 'fe-tailwind-styling',
            title: 'Modern Styling & UI Component Systems',
            tag: 'Styling',
            description: 'Tailwind CSS, Glassmorphism, CSS Modules, Styled Components, Framer Motion animations, and Radix UI / Shadcn headless components.',
            keyTopics: ['Tailwind CSS Utility Classes', 'Glassmorphism Effects', 'Framer Motion Animations', 'Accessible Component Libraries'],
          },
        ],
      },
      {
        phaseNumber: 3,
        title: 'Phase 3: Production Mastery & Next.js',
        description: 'Elevate frontend applications with Server-Side Rendering (SSR), Next.js App Router, performance optimization, and testing.',
        nodes: [
          {
            id: 'fe-nextjs-app-router',
            title: 'Next.js & Server Components',
            tag: 'Full-Stack React',
            description: 'Next.js App Router, React Server Components (RSC), Static Site Generation (SSG), Incremental Static Regeneration (ISR), and API routes.',
            keyTopics: ['App Router & File Routing', 'Server Components vs Client Components', 'SSG, SSR, & ISR', 'SEO & OpenGraph Tags'],
          },
          {
            id: 'fe-performance',
            title: 'Web Performance & Core Web Vitals',
            tag: 'Optimization',
            description: 'LCP, CLS, INP metrics, Code splitting, Dynamic imports, Image optimization, Lighthouse audit optimization, and Caching strategies.',
            keyTopics: ['Core Web Vitals (LCP/CLS/INP)', 'Lazy Loading & Code Splitting', 'CDN Asset Caching', 'Bundle Size Budgeting'],
          },
          {
            id: 'fe-testing',
            title: 'Frontend Testing & CI Automation',
            tag: 'Quality Assurance',
            description: 'Unit testing with Vitest / Jest, React Testing Library, End-to-End testing with Playwright or Cypress.',
            keyTopics: ['Vitest Component Tests', 'React Testing Library User Events', 'Playwright E2E Testing', 'GitHub Actions CI'],
          },
        ],
      },
    ],
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer Roadmap',
    slug: 'backend-developer',
    category: 'Web Development',
    description: 'Design robust server architectures, secure REST & GraphQL APIs, manage SQL/NoSQL databases, and deploy resilient microservices.',
    icon: 'Server',
    color: 'from-emerald-600 to-teal-500',
    borderColor: 'border-emerald-500/30',
    estimatedTime: '6-8 Months',
    level: 'Beginner to Advanced',
    totalTopics: 18,
    phases: [
      {
        phaseNumber: 1,
        title: 'Phase 1: Server Core & Node.js Runtime',
        description: 'Understand server-side JavaScript/TypeScript, Express framework fundamentals, async processing, and basic HTTP semantics.',
        nodes: [
          {
            id: 'be-nodejs-express',
            title: 'Node.js & Express.js Core',
            tag: 'Core Server Runtime',
            description: 'Express routing, middleware architecture, request handling, error handling middlewares, and environment configuration.',
            keyTopics: ['req.params vs req.query', 'Custom Middleware Functions', 'Centralized Error Handler', 'Environment Variable Security'],
            articleSlug: 'understanding-reqparams-vs-reqquery-in-express',
          },
          {
            id: 'be-http-rest',
            title: 'HTTP Semantics & RESTful API Design',
            tag: 'API Architecture',
            description: 'HTTP methods, status codes, headers, CORS configuration, API versioning, input validation with Zod / Joi.',
            keyTopics: ['REST Best Practices', 'HTTP Response Status Codes', 'Input Validation (Zod)', 'Dynamic CORS Configuration'],
          },
          {
            id: 'be-auth-security',
            title: 'Authentication & Security Best Practices',
            tag: 'Security',
            description: 'JWT tokens, HTTP-Only cookies, bcrypt password hashing, RBAC (Role-Based Access Control), Helmet security headers, rate limiting.',
            keyTopics: ['JWT Access & Refresh Tokens', 'Bcrypt Hashing', 'Role-Based Authorization', 'Helmet & Express Rate Limit'],
          },
        ],
      },
      {
        phaseNumber: 2,
        title: 'Phase 2: Database Architecture & Data Pipelines',
        description: 'Master relational and NoSQL data modelling, ORMs/ODMs, query indexing, transactions, and caching.',
        nodes: [
          {
            id: 'be-mongodb-mongoose',
            title: 'MongoDB & Mongoose ODM',
            tag: 'NoSQL Database',
            description: 'Document schema design, indexes, population, aggregation pipelines, transactions, and connection lifecycle handling.',
            keyTopics: ['Schema & Document Design', 'Single & Compound Indexes', 'Aggregation Framework', 'Connection Error Recovery'],
          },
          {
            id: 'be-postgresql-prisma',
            title: 'PostgreSQL & Prisma / SQL',
            tag: 'Relational Database',
            description: 'Relational schema normalization, foreign keys, SQL joins, ACID transactions, Prisma ORM migrations, and indexing.',
            keyTopics: ['SQL Joins & Foreign Keys', 'Prisma Schema & Migrations', 'ACID Transactions', 'Connection Pooling'],
          },
          {
            id: 'be-redis-caching',
            title: 'Redis Caching & Message Queues',
            tag: 'Performance',
            description: 'In-memory caching with Redis, session store, rate limiting, and background job processing with BullMQ / RabbitMQ.',
            keyTopics: ['Cache Invalidation Strategies', 'Redis Key Expiration', 'Background Queues (BullMQ)', 'Pub/Sub Messaging'],
          },
        ],
      },
      {
        phaseNumber: 3,
        title: 'Phase 3: System Design & Microservices',
        description: 'Scale backends to high traffic loads with microservice architecture, API Gateways, containerization, and monitoring.',
        nodes: [
          {
            id: 'be-system-design',
            title: 'System Design & Distributed Patterns',
            tag: 'Architecture',
            description: 'Load balancing, database sharding & read replicas, idempotent APIs, circuit breakers, and event-driven architecture.',
            keyTopics: ['Load Balancing Algorithms', 'Database Read Replicas', 'Idempotent API Requests', 'Event-Driven Systems'],
          },
          {
            id: 'be-docker-deploy',
            title: 'Docker & Cloud Deployment',
            tag: 'DevOps & Infra',
            description: 'Dockerfile multi-stage builds, Docker Compose, Nginx reverse proxy, Vercel/Render deployments, and CI/CD pipelines.',
            keyTopics: ['Docker Multi-stage Builds', 'Nginx Reverse Proxy & SSL', 'CI/CD Pipelines', 'Cloud Hosting (AWS / Render)'],
          },
        ],
      },
    ],
  },
  {
    id: 'fullstack-engineer',
    title: 'Full-Stack Software Engineer',
    slug: 'fullstack-engineer',
    category: 'Full Stack',
    description: 'Complete end-to-end blueprint bridging modern React/Next.js frontend with Node.js/Express & cloud database backends.',
    icon: 'Layers',
    color: 'from-purple-600 to-pink-500',
    borderColor: 'border-purple-500/30',
    estimatedTime: '8-12 Months',
    level: 'Intermediate to Advanced',
    totalTopics: 20,
    phases: [
      {
        phaseNumber: 1,
        title: 'Phase 1: Full-Stack MERN / PERN Fundamentals',
        description: 'Integrate React client apps seamlessly with Express.js APIs and MongoDB / PostgreSQL databases.',
        nodes: [
          {
            id: 'fs-mern-integration',
            title: 'Client-Server Communication & Axios/Fetch',
            tag: 'Integration',
            description: 'Connecting React components to Node.js backend endpoints, error handling, credentials passing, and environmental variables.',
            keyTopics: ['Axios Interceptors', 'Cross-Origin Requests (CORS)', 'Cookie Credentials', 'API Environment Config'],
          },
          {
            id: 'fs-auth-flow',
            title: 'Full-Stack Auth & Protected Routes',
            tag: 'Security & User Context',
            description: 'Implementing complete signup/login flow with JWT, HTTP-Only cookies, React router auth guards, and admin authorization.',
            keyTopics: ['Auth State Context', 'Protected Layout Components', 'Token Auto-refresh', 'Role Management'],
          },
        ],
      },
      {
        phaseNumber: 2,
        title: 'Phase 2: Production Monorepos & Next.js Full-Stack',
        description: 'Build modern monolithic or monorepo full-stack web applications with server actions, TypeScript, and unified database layers.',
        nodes: [
          {
            id: 'fs-nextjs-fullstack',
            title: 'Next.js App Router & Server Actions',
            tag: 'Modern Stack',
            description: 'Building full-stack web apps in a single Next.js project using Server Actions, Prisma, and NextAuth.js / Clerk authentication.',
            keyTopics: ['Server Actions Mutations', 'NextAuth / Clerk Auth', 'Route Handlers (APIs)', 'Optimistic UI Updates'],
          },
          {
            id: 'fs-typescript-fullstack',
            title: 'End-to-End TypeScript & tRPC / Zod',
            tag: 'Type Safety',
            description: 'Shared TypeScript types between frontend and backend, runtime schema validation with Zod, or type-safe RPC with tRPC.',
            keyTopics: ['Shared Type Definitions', 'Zod Schema Validation', 'tRPC API Procedures', 'Compile-time Safety'],
          },
        ],
      },
      {
        phaseNumber: 3,
        title: 'Phase 3: Production DevOps & Cloud Architecture',
        description: 'Deploy resilient applications with automated CI/CD pipelines, database backups, domain management, and error tracking.',
        nodes: [
          {
            id: 'fs-cloud-deployment',
            title: 'Cloud Deployment, SSL & DNS',
            tag: 'Deployment',
            description: 'Deploying client apps to Vercel/Netlify, backend to Render/AWS, MongoDB Atlas configuration, custom domains, and SSL certificates.',
            keyTopics: ['Vercel & Render Setup', 'MongoDB Atlas / Supabase', 'Custom DNS Records', 'Environment Secrets Management'],
          },
          {
            id: 'fs-monitoring-logging',
            title: 'Production Monitoring & Error Tracking',
            tag: 'Observability',
            description: 'Sentry error tracking, Winston/Pino server logging, health check endpoints, uptime monitoring, and database health status.',
            keyTopics: ['Sentry Diagnostics', 'Winston Structured Logs', 'Database Health Checks', 'APM Metrics'],
          },
        ],
      },
    ],
  },
  {
    id: 'ai-data-engineer',
    title: 'AI & Machine Learning Engineer',
    slug: 'ai-data-engineer',
    category: 'AI & Data Science',
    description: 'Build modern AI-powered applications, integrate Large Language Models (LLMs), design RAG pipelines, and deploy AI services.',
    icon: 'BrainCircuit',
    color: 'from-amber-600 to-rose-500',
    borderColor: 'border-amber-500/30',
    estimatedTime: '6-9 Months',
    level: 'Intermediate to Advanced',
    totalTopics: 16,
    phases: [
      {
        phaseNumber: 1,
        title: 'Phase 1: Python for AI & Data Foundations',
        description: 'Master Python asynchronous data processing, NumPy matrix operations, Pandas dataframes, and data cleaning.',
        nodes: [
          {
            id: 'ai-python-core',
            title: 'Python Async & Data Libraries',
            tag: 'Foundations',
            description: 'Asyncio concurrent requests, Type hints, Pydantic data schemas, NumPy vectors, and Pandas data manipulations.',
            keyTopics: ['Asyncio Concurrency', 'Pydantic Models', 'NumPy Arrays & Matrices', 'Pandas Dataframes'],
          },
          {
            id: 'ai-llm-integration',
            title: 'LLM APIs & Prompt Engineering',
            tag: 'Generative AI',
            description: 'Interfacing with OpenAI, Anthropic Claude, and Gemini APIs securely in Node.js / Python server environments.',
            keyTopics: ['OpenAI / Gemini SDK', 'System Prompt Structuring', 'Structured JSON Outputs', 'API Rate Limiting & Safety'],
            articleSlug: 'integrating-ai-into-nodejs-applications',
          },
        ],
      },
      {
        phaseNumber: 2,
        title: 'Phase 2: RAG & Vector Search Systems',
        description: 'Implement Retrieval-Augmented Generation (RAG) using vector databases, embedding models, and LangChain / LlamaIndex.',
        nodes: [
          {
            id: 'ai-vector-databases',
            title: 'Embeddings & Vector Databases',
            tag: 'Vector Search',
            description: 'Generating text embeddings (OpenAI/HuggingFace), storing in Pinecone, Qdrant, or Pgvector, and performing cosine similarity search.',
            keyTopics: ['Vector Embeddings', 'Cosine Similarity Search', 'Pinecone / Pgvector Setup', 'Document Chunking Strategies'],
          },
          {
            id: 'ai-rag-frameworks',
            title: 'LangChain & Autonomous AI Agents',
            tag: 'AI Agents',
            description: 'Building RAG chains, autonomous agent tool invocation, memory management, and function calling workflows.',
            keyTopics: ['LangChain / LlamaIndex Chains', 'Function Calling & Tool Use', 'Conversation Memory', 'Evaluation & Benchmarks'],
          },
        ],
      },
    ],
  },
  {
    id: 'devops-cloud-engineer',
    title: 'DevOps & Cloud Engineer Roadmap',
    slug: 'devops-cloud-engineer',
    category: 'DevOps & Infrastructure',
    description: 'Automate infrastructure provisioning, CI/CD pipelines, container orchestration with Kubernetes, and cloud security.',
    icon: 'Cpu',
    color: 'from-orange-600 to-amber-500',
    borderColor: 'border-orange-500/30',
    estimatedTime: '6-8 Months',
    level: 'Intermediate to Advanced',
    totalTopics: 15,
    phases: [
      {
        phaseNumber: 1,
        title: 'Phase 1: Linux & Containerization',
        description: 'Master Linux administration, shell scripting, networking concepts, and Docker containers.',
        nodes: [
          {
            id: 'do-linux-shell',
            title: 'Linux CLI & Bash Scripting',
            tag: 'OS Core',
            description: 'Process management, file permissions, SSH keys, network utilities (curl, lsof, netstat), and automated Bash scripts.',
            keyTopics: ['SSH & Key Security', 'Systemctl & Process Monitoring', 'Crontab Automation', 'Network Diagnostics'],
          },
          {
            id: 'do-docker-containers',
            title: 'Docker & Multi-Container Environments',
            tag: 'Containerization',
            description: 'Creating production Dockerfiles, image size optimization, Docker Compose networking, volumes, and health checks.',
            keyTopics: ['Dockerfile Optimization', 'Docker Compose Stack', 'Volume Persistence', 'Container Network Isolation'],
          },
        ],
      },
      {
        phaseNumber: 2,
        title: 'Phase 2: CI/CD Automation & Kubernetes',
        description: 'Build automated delivery pipelines and orchestrate distributed applications with Kubernetes.',
        nodes: [
          {
            id: 'do-cicd-github-actions',
            title: 'CI/CD Pipelines with GitHub Actions',
            tag: 'Automation',
            description: 'Automated testing, linting, Docker image building, artifact push to Docker Hub / ECR, and automatic staging deployment.',
            keyTopics: ['GitHub Actions Workflows', 'Build Caching', 'Secret Management', 'Automated Rollbacks'],
          },
          {
            id: 'do-kubernetes-basics',
            title: 'Kubernetes Container Orchestration',
            tag: 'Orchestration',
            description: 'Pods, Deployments, Services, Ingress controllers, ConfigMaps, Secrets, and Helm charts for cloud environments.',
            keyTopics: ['Pods & Deployments', 'Services & Ingress Routes', 'ConfigMaps & Secrets', 'Helm Packaging'],
          },
        ],
      },
    ],
  },
];

// Auto-seed initial roadmaps into MongoDB if database collection is empty
const ensureRoadmapsSeeded = async () => {
  try {
    const count = await Roadmap.countDocuments();
    if (count === 0) {
      console.log('Seeding initial programmer roadmaps into database...');
      for (const item of DEFAULT_ROADMAPS) {
        await Roadmap.create({
          title: item.title,
          slug: item.slug,
          category: item.category,
          description: item.description,
          icon: item.icon,
          color: item.color,
          borderColor: item.borderColor,
          estimatedTime: item.estimatedTime,
          level: item.level,
          phases: item.phases,
        });
      }
      console.log('Initial roadmaps successfully seeded to MongoDB.');
    }
  } catch (err) {
    console.error('Auto-seed roadmaps error:', err.message);
  }
};

// @desc    Get all programmer roadmaps from database
// @route   GET /api/roadmaps
// @access  Public
export const getRoadmaps = async (req, res, next) => {
  try {
    await ensureRoadmapsSeeded();
    const { category, search } = req.query;

    let dbRoadmaps = await Roadmap.find().sort({ createdAt: -1 });

    // Transform DB docs into standard JSON shape
    let list = dbRoadmaps.map((r) => ({
      id: r._id.toString(),
      _id: r._id,
      title: r.title,
      slug: r.slug,
      category: r.category,
      description: r.description,
      icon: r.icon,
      color: r.color,
      borderColor: r.borderColor,
      estimatedTime: r.estimatedTime,
      level: r.level,
      phases: r.phases,
    }));

    if (category && category !== 'All') {
      list = list.filter(
        (r) => r.category.toLowerCase() === category.toLowerCase() || r.slug === category
      );
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.phases.some((p) =>
            p.nodes.some(
              (n) =>
                n.title.toLowerCase().includes(q) ||
                n.description.toLowerCase().includes(q) ||
                (n.keyTopics && n.keyTopics.some((t) => t.toLowerCase().includes(q)))
            )
          )
      );
    }

    res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single roadmap by ID or slug
// @route   GET /api/roadmaps/:id
// @access  Public
export const getRoadmapById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let roadmap = null;
    try {
      roadmap = await Roadmap.findOne({ $or: [{ _id: id }, { slug: id }] });
    } catch (e) {
      // Ignore invalid ObjectId error
    }

    if (!roadmap) {
      roadmap = DEFAULT_ROADMAPS.find((r) => r.id === id || r.slug === id);
    }

    if (!roadmap) {
      res.status(404);
      throw new Error('Programmer Roadmap not found');
    }

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new programmer roadmap (RESTRICTED TO ADMIN / DASHBOARD ONLY)
// @route   POST /api/roadmaps
// @access  Private/Admin
export const createRoadmap = async (req, res, next) => {
  try {
    const {
      title,
      category = 'Web Development',
      description,
      icon = 'Compass',
      color = 'from-blue-600 to-cyan-500',
      borderColor = 'border-blue-500/30',
      estimatedTime = '6-8 Months',
      level = 'Beginner to Advanced',
      phases = [],
    } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error('Please provide both title and description for the roadmap');
    }

    let slug = slugify(title, { lower: true, strict: true });
    const existing = await Roadmap.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const roadmap = new Roadmap({
      title,
      slug,
      category,
      description,
      icon,
      color,
      borderColor,
      estimatedTime,
      level,
      phases,
      createdBy: req.user?._id,
    });

    const savedRoadmap = await roadmap.save();

    res.status(201).json({
      success: true,
      message: 'Roadmap created successfully via Admin Dashboard',
      data: savedRoadmap,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete custom roadmap (RESTRICTED TO ADMIN / DASHBOARD ONLY)
// @route   DELETE /api/roadmaps/:id
// @access  Private/Admin
export const deleteRoadmap = async (req, res, next) => {
  try {
    const { id } = req.params;
    let roadmap = null;
    
    try {
      roadmap = await Roadmap.findById(id);
    } catch (e) {
      // Ignore invalid ObjectId cast error
    }

    if (!roadmap) {
      roadmap = await Roadmap.findOne({ slug: id });
    }

    if (!roadmap) {
      res.status(404);
      throw new Error('Roadmap not found or already removed');
    }

    await roadmap.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Roadmap deleted successfully from Dashboard',
    });
  } catch (error) {
    next(error);
  }
};
