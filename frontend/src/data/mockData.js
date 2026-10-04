// ═══════════════════════════════════════════
// TECHJOURNEY — COMPREHENSIVE MOCK DATA ENGINE
// ═══════════════════════════════════════════

export const CATEGORIES = [
  {
    id: 'programming',
    slug: 'programming',
    name: 'Programming',
    icon: 'Code2',
    description: 'Master core languages, algorithms, data structures, and idiomatic programming paradigms.',
    articleCount: 38,
    color: 'from-blue-500 to-cyan-500',
    borderGlow: 'hover:border-blue-500/40',
  },
  {
    id: 'web-development',
    slug: 'web-development',
    name: 'Web Development',
    icon: 'Globe',
    description: 'Modern full-stack web architecture, React, responsive layouts, and performance.',
    articleCount: 42,
    color: 'from-cyan-500 to-blue-600',
    borderGlow: 'hover:border-cyan-500/40',
  },
  {
    id: 'backend-development',
    slug: 'backend-development',
    name: 'Backend Development',
    icon: 'Server',
    description: 'Scalable distributed systems, microservices, databases, caching, and API design.',
    articleCount: 29,
    color: 'from-blue-600 to-purple-600',
    borderGlow: 'hover:border-purple-500/40',
  },
  {
    id: 'ai-machine-learning',
    slug: 'ai-machine-learning',
    name: 'AI & Machine Learning',
    icon: 'BrainCircuit',
    description: 'Deep neural networks, LLM agents, RAG architectures, transformers, and ML pipelines.',
    articleCount: 34,
    color: 'from-purple-500 to-pink-500',
    borderGlow: 'hover:border-purple-500/40',
  },
  {
    id: 'computer-science',
    slug: 'computer-science',
    name: 'Computer Science',
    icon: 'Binary',
    description: 'Foundational computation theory, discrete math, complexity analysis, and compilers.',
    articleCount: 25,
    color: 'from-cyan-500 to-emerald-500',
    borderGlow: 'hover:border-cyan-500/40',
  },
  {
    id: 'internet-networking',
    slug: 'internet-networking',
    name: 'Internet & Networking',
    icon: 'Network',
    description: 'TCP/IP stack, BGP routing, DNS hierarchy, TLS 1.3 encryption, and CDNs.',
    articleCount: 19,
    color: 'from-blue-500 to-indigo-600',
    borderGlow: 'hover:border-blue-500/40',
  },
  {
    id: 'operating-systems',
    slug: 'operating-systems',
    name: 'Operating Systems',
    icon: 'Terminal',
    description: 'Kernel architectures, process concurrency, virtual memory management, and Unix internals.',
    articleCount: 22,
    color: 'from-emerald-500 to-cyan-500',
    borderGlow: 'hover:border-emerald-500/40',
  },
  {
    id: 'hardware',
    slug: 'hardware',
    name: 'Hardware',
    icon: 'Cpu',
    description: 'Semiconductors, lithography, silicon architectures, CPU caches, and GPU tensor cores.',
    articleCount: 16,
    color: 'from-amber-500 to-orange-500',
    borderGlow: 'hover:border-amber-500/40',
  },
];

export const ROADMAPS = [
  {
    id: 'frontend-developer',
    slug: 'frontend-developer',
    title: 'Frontend Developer',
    description: 'Step-by-step path to becoming a modern frontend architect capable of crafting responsive, high-performance web applications.',
    difficulty: 'Intermediate',
    estimatedMonths: 6,
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    nodes: [
      { id: 1, name: 'HTML5 & Semantics', category: 'Foundation', status: 'completed', desc: 'Accessible document structure, ARIA roles, modern HTML5 semantic elements.' },
      { id: 2, name: 'Modern CSS & Layouts', category: 'Styling', status: 'completed', desc: 'Flexbox, CSS Grid, custom properties, subgrid, container queries.' },
      { id: 3, name: 'JavaScript Deep Dive', category: 'Core', status: 'current', desc: 'Event loop, prototypes, closures, async/await, ES2024 features.' },
      { id: 4, name: 'React 19 & Ecosystem', category: 'Framework', status: 'upcoming', desc: 'Hooks, Server Components, suspense, virtual DOM reconciliation, state.' },
      { id: 5, name: 'API Integration & REST', category: 'Data', status: 'upcoming', desc: 'Fetch API, TanStack Query, caching, WebSocket streaming.' },
      { id: 6, name: 'Git & Version Control', category: 'Tooling', status: 'upcoming', desc: 'Branching strategies, interactive rebase, pull requests, conventional commits.' },
      { id: 7, name: 'Deployment & CI/CD', category: 'DevOps', status: 'upcoming', desc: 'Edge workers, Vercel/Netlify, GitHub Actions, lighthouse audits.' }
    ]
  },
  {
    id: 'backend-developer',
    slug: 'backend-developer',
    title: 'Backend Developer',
    description: 'Master enterprise backend systems, scalable database design, distributed caching, and cloud APIs.',
    difficulty: 'Intermediate',
    estimatedMonths: 8,
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    nodes: [
      { id: 1, name: 'Backend Language (Node/Go/Python)', category: 'Core', status: 'completed', desc: 'Concurrency models, memory management, and asynchronous I/O.' },
      { id: 2, name: 'Relational & NoSQL Databases', category: 'Storage', status: 'completed', desc: 'PostgreSQL indexing, normalization, MongoDB aggregation pipelines.' },
      { id: 3, name: 'REST & GraphQL APIs', category: 'Networking', status: 'current', desc: 'Idempotency, HTTP status codes, schema validation, rate limiting.' },
      { id: 4, name: 'Auth & Security', category: 'Security', status: 'upcoming', desc: 'JWTs, OAuth 2.1, session rotation, CSRF/XSS prevention, TLS.' },
      { id: 5, name: 'Caching & Queues', category: 'Performance', status: 'upcoming', desc: 'Redis cache invalidation strategies, Kafka/RabbitMQ message brokers.' },
      { id: 6, name: 'Docker & Containers', category: 'Infra', status: 'upcoming', desc: 'Multi-stage builds, rootless containers, docker-compose orchestration.' },
      { id: 7, name: 'Cloud & Kubernetes', category: 'DevOps', status: 'upcoming', desc: 'Cloud architecture (AWS/GCP), pod scaling, load balancing, helm charts.' }
    ]
  },
  {
    id: 'full-stack-developer',
    slug: 'full-stack-developer',
    title: 'Full Stack Developer',
    description: 'Bridge the gap between fluid user experiences and resilient server architectures.',
    difficulty: 'Advanced',
    estimatedMonths: 10,
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    nodes: [
      { id: 1, name: 'Frontend Foundations', category: 'Frontend', status: 'completed', desc: 'TypeScript, Tailwind CSS, modern browser APIs.' },
      { id: 2, name: 'Component Architecture', category: 'Frontend', status: 'completed', desc: 'React, Next.js App Router, state managers, server rendering.' },
      { id: 3, name: 'Backend Engine', category: 'Backend', status: 'current', desc: 'Express / Fastify / NestJS, REST/RPC endpoints.' },
      { id: 4, name: 'Database Architecture', category: 'Data', status: 'upcoming', desc: 'PostgreSQL, Prisma ORM, migrations, ACID transactions.' },
      { id: 5, name: 'State & Realtime', category: 'Fullstack', status: 'upcoming', desc: 'WebSockets, Server-Sent Events, Redis pub/sub sync.' },
      { id: 6, name: 'Automated Testing', category: 'Quality', status: 'upcoming', desc: 'Unit testing with Vitest, E2E testing with Playwright.' },
      { id: 7, name: 'Cloud Deployment', category: 'DevOps', status: 'upcoming', desc: 'Docker, CI/CD pipelines, AWS S3/CloudFront, monitoring.' }
    ]
  },
  {
    id: 'mern-stack-developer',
    slug: 'mern-stack-developer',
    title: 'MERN Stack Developer',
    description: 'Deep specialization in MongoDB, Express.js, React, and Node.js for rapid, modern SaaS development.',
    difficulty: 'Intermediate',
    estimatedMonths: 6,
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    nodes: [
      { id: 1, name: 'JavaScript & Node.js', category: 'Runtime', status: 'completed', desc: 'NPM, CommonJS vs ES Modules, file system, streams.' },
      { id: 2, name: 'Express.js Framework', category: 'Backend', status: 'completed', desc: 'Middleware chains, routing, error handlers, CORS.' },
      { id: 3, name: 'MongoDB & Mongoose', category: 'Database', status: 'current', desc: 'Schema models, indexes, aggregation, embedded vs referenced docs.' },
      { id: 4, name: 'React SPA & Hooks', category: 'Frontend', status: 'upcoming', desc: 'Custom hooks, Context API, Tailwind integration, Vite setup.' },
      { id: 5, name: 'Redux Toolkit & Query', category: 'State', status: 'upcoming', desc: 'Global store, slices, RTK Query API layer and caching.' },
      { id: 6, name: 'Full Authentication', category: 'Security', status: 'upcoming', desc: 'Bcrypt password hashing, HTTP-only JWT cookies, role-based access.' },
      { id: 7, name: 'Production Deployment', category: 'Deploy', status: 'upcoming', desc: 'MongoDB Atlas, Render/Railway, CDN optimization, environment security.' }
    ]
  },
  {
    id: 'python-developer',
    slug: 'python-developer',
    title: 'Python Developer',
    description: 'Master idiomatic Python for backend services, automation scripts, and scalable microservices.',
    difficulty: 'Beginner to Advanced',
    estimatedMonths: 6,
    badgeColor: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    nodes: [
      { id: 1, name: 'Core Python Syntax', category: 'Syntax', status: 'completed', desc: 'Data types, list comprehensions, generators, decorators, typing.' },
      { id: 2, name: 'OOP & Design Patterns', category: 'Architecture', status: 'completed', desc: 'Classes, dunder methods, inheritance, metaclasses, factory pattern.' },
      { id: 3, name: 'FastAPI & Pydantic', category: 'Framework', status: 'current', desc: 'Asynchronous route handlers, automatic OpenAPI docs, schema validation.' },
      { id: 4, name: 'AsyncIO & Concurrency', category: 'Concurrency', status: 'upcoming', desc: 'Coroutines, event loops, tasks, multiprocessing vs threading.' },
      { id: 5, name: 'SQLAlchemy & Alembic', category: 'Database', status: 'upcoming', desc: 'ORM mappings, session scopes, async queries, schema migrations.' },
      { id: 6, name: 'Testing with PyTest', category: 'Testing', status: 'upcoming', desc: 'Fixtures, mocking, parameterization, code coverage analysis.' },
      { id: 7, name: 'Packaging & Poetry', category: 'Tooling', status: 'upcoming', desc: 'Virtual environments, pyproject.toml, building PyPI distributions.' }
    ]
  },
  {
    id: 'ai-engineer',
    slug: 'ai-engineer',
    title: 'AI Engineer',
    description: 'Build production-ready LLM agents, vector search retrieval systems, and fine-tuned AI applications.',
    difficulty: 'Advanced',
    estimatedMonths: 9,
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    nodes: [
      { id: 1, name: 'Math & Tensor Algebra', category: 'Theory', status: 'completed', desc: 'Matrix multiplications, gradients, backpropagation intuition.' },
      { id: 2, name: 'PyTorch Foundations', category: 'Deep Learning', status: 'completed', desc: 'Tensors, autograd, building simple multi-layer perceptrons.' },
      { id: 3, name: 'Transformers & Attention', category: 'NLP', status: 'current', desc: 'Self-attention mechanisms, encoder-decoder architectures, tokenization.' },
      { id: 4, name: 'Embeddings & Vector DBs', category: 'Retrieval', status: 'upcoming', desc: 'Pinecone, Qdrant, ChromaDB, cosine similarity, hybrid search.' },
      { id: 5, name: 'RAG Architecture', category: 'Application', status: 'upcoming', desc: 'Retrieval-Augmented Generation, chunking strategies, rerankers.' },
      { id: 6, name: 'Autonomous Agents', category: 'Agents', status: 'upcoming', desc: 'Tool calling, function execution, LangGraph, agent memory, planning loops.' },
      { id: 7, name: 'Model Evaluation & Ops', category: 'LLMOps', status: 'upcoming', desc: 'Evaluation benchmarks, latency reduction, quantization, vLLM serving.' }
    ]
  },
  {
    id: 'devops-engineer',
    slug: 'devops-engineer',
    title: 'DevOps Engineer',
    description: 'Automate build infrastructure, manage container clusters, and enforce zero-downtime reliability.',
    difficulty: 'Advanced',
    estimatedMonths: 8,
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    nodes: [
      { id: 1, name: 'Linux System Administration', category: 'OS', status: 'completed', desc: 'Systemd, bash scripting, permission management, cron, SSH keys.' },
      { id: 2, name: 'Networking & Firewalls', category: 'Network', status: 'completed', desc: 'Subnets, CIDR, iptables, DNS resolution, reverse proxies (NGINX).' },
      { id: 3, name: 'Git & CI/CD Automation', category: 'CI/CD', status: 'current', desc: 'GitHub Actions, GitLab CI, artifact caching, security scanning.' },
      { id: 4, name: 'Docker & Containerization', category: 'Containers', status: 'upcoming', desc: 'OCI specs, multi-stage builds, container networking and volumes.' },
      { id: 5, name: 'Kubernetes Orchestration', category: 'K8s', status: 'upcoming', desc: 'Deployments, Services, Ingress, StatefulSets, ConfigMaps, Secrets.' },
      { id: 6, name: 'Terraform (IaC)', category: 'Cloud', status: 'upcoming', desc: 'Infrastructure as Code, state management, modules, multi-cloud providers.' },
      { id: 7, name: 'Observability & SRE', category: 'Monitoring', status: 'upcoming', desc: 'Prometheus metrics, Grafana dashboards, Loki logs, OpenTelemetry traces.' }
    ]
  },
  {
    id: 'data-scientist',
    slug: 'data-scientist',
    title: 'Data Scientist',
    description: 'Transform raw data into predictive intelligence with statistical modeling and machine learning.',
    difficulty: 'Advanced',
    estimatedMonths: 8,
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    nodes: [
      { id: 1, name: 'Probability & Statistics', category: 'Math', status: 'completed', desc: 'Distributions, hypothesis testing, Bayes theorem, confidence intervals.' },
      { id: 2, name: 'Data Wrangling (Pandas/NumPy)', category: 'Analytics', status: 'completed', desc: 'Data cleaning, vectorization, aggregation, missing value handling.' },
      { id: 3, name: 'Exploratory Data Analysis', category: 'Visualization', status: 'current', desc: 'Seaborn, Matplotlib, identifying correlations, outlier detection.' },
      { id: 4, name: 'Supervised Learning', category: 'ML', status: 'upcoming', desc: 'Linear/Logistic regression, Decision Trees, Random Forests, XGBoost.' },
      { id: 5, name: 'Unsupervised Learning', category: 'ML', status: 'upcoming', desc: 'K-Means clustering, PCA dimensionality reduction, anomaly detection.' },
      { id: 6, name: 'Feature Engineering', category: 'Prep', status: 'upcoming', desc: 'Encoding categorical variables, scaling, normalization, polynomial features.' },
      { id: 7, name: 'Model Deployment (MLflow)', category: 'Ops', status: 'upcoming', desc: 'Experiment tracking, model registry, REST serving, drift monitoring.' }
    ]
  }
];

export const PROGRAMMING_LANGUAGES = [
  {
    name: 'JavaScript',
    slug: 'javascript',
    icon: '⚡',
    difficulty: 'Beginner to Advanced',
    tutorialCount: 64,
    description: 'The ubiquitous language of the web. Powers dynamic frontend interfaces and high-throughput server backends via Node.js.',
    popularity: '98%',
    codeSnippet: `// Asynchronous data fetching with modern JS
async function fetchDevJourney(userId) {
  try {
    const res = await fetch(\`/api/developers/\${userId}/roadmap\`);
    const { skills, progress } = await res.json();
    return { skills, level: progress > 80 ? 'Senior' : 'Mid' };
  } catch (err) {
    console.error('Failed to load roadmap:', err);
  }
}`
  },
  {
    name: 'Python',
    slug: 'python',
    icon: '🐍',
    difficulty: 'Beginner Friendly',
    tutorialCount: 58,
    description: 'Clean, readable syntax that dominates artificial intelligence, machine learning, data science, automation, and backend APIs.',
    popularity: '96%',
    codeSnippet: `# Building a minimal AI agent task runner
from typing import Dict, Any

def execute_agent_step(goal: str, memory: list[str]) -> Dict[str, Any]:
    context = " \\n".join(memory[-3:])
    decision = f"Analyzed '{goal}' with context: {context}"
    return {"action": "dispatch_tool", "payload": decision}

print(execute_agent_step("Analyze Repo", ["Cloned repo", "Ran linter"]))`
  },
  {
    name: 'Java',
    slug: 'java',
    icon: '☕',
    difficulty: 'Intermediate',
    tutorialCount: 44,
    description: 'The gold standard of enterprise systems, Android development, high-volume financial engines, and distributed microservices.',
    popularity: '89%',
    codeSnippet: `// Modern Java Record & Virtual Thread Executor
public record Developer(String name, String role, int experienceYears) {
  public static void main(String[] args) {
    var dev = new Developer("Alex", "Staff Architect", 10);
    System.out.println("Processing dev journey for: " + dev.name());
  }
}`
  },
  {
    name: 'C',
    slug: 'c',
    icon: '⚙️',
    difficulty: 'Intermediate to Hard',
    tutorialCount: 32,
    description: 'The foundation of modern computing. Direct memory control, kernel development, embedded microcontrollers, and extreme performance.',
    popularity: '82%',
    codeSnippet: `// Pointer manipulation and manual memory allocation
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *packet = (int*)malloc(sizeof(int) * 4);
    if (!packet) return 1;
    packet[0] = 0xDEADBEEF;
    printf("Hardware buffer address: %p, value: 0x%X\\n", (void*)packet, packet[0]);
    free(packet);
    return 0;
}`
  },
  {
    name: 'C++',
    slug: 'cpp',
    icon: '🚀',
    difficulty: 'Advanced',
    tutorialCount: 36,
    description: 'Unrivaled execution speed for game engines, browser kernels (V8/Blink), operating systems, and high-frequency trading platforms.',
    popularity: '85%',
    codeSnippet: `// Modern C++20 Concepts & Smart Pointers
#include <iostream>
#include <memory>
#include <concepts>

template<typename T>
concept Numeric = std::integral<T> || std::floating_point<T>;

template<Numeric T>
T computeLatency(T ping, T jitter) {
    return ping + (jitter * 2);
}

int main() {
    std::cout << "Engine Latency: " << computeLatency(12.5, 1.2) << "ms\\n";
}`
  },
  {
    name: 'TypeScript',
    slug: 'typescript',
    icon: '🔷',
    difficulty: 'Intermediate',
    tutorialCount: 52,
    description: 'Static typing for JavaScript. Enables safe refactoring, rich IDE autocompletion, and robust enterprise software architectures.',
    popularity: '94%',
    codeSnippet: `// Advanced Generics and Mapped Types
type RoadmapStage<T extends string> = {
  readonly id: number;
  stageName: T;
  isUnlocked: boolean;
  meta: Record<string, unknown>;
};

type DevRoadmap = RoadmapStage<'Frontend' | 'Backend' | 'AI'>;`
  },
  {
    name: 'SQL',
    slug: 'sql',
    icon: '🗄️',
    difficulty: 'Beginner to Intermediate',
    tutorialCount: 40,
    description: 'The universal language for relational databases. Querying, grouping, window functions, and indexing for relational data integrity.',
    popularity: '91%',
    codeSnippet: `-- Analytical window function for ranking read times
WITH ArticleStats AS (
  SELECT 
    title, category, reading_time,
    DENSE_RANK() OVER (PARTITION BY category ORDER BY views DESC) as rank
  FROM articles
)
SELECT * FROM ArticleStats WHERE rank <= 3;`
  }
];

export const TECH_NEWS = [
  {
    id: 'news-ai-agents',
    category: 'AI',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    title: 'Autonomous Coding Agents Reach New Benchmarks on SWE-bench Verified',
    description: 'Next-generation AI developer assistants demonstrate multi-file code refactoring, proactive unit test writing, and autonomous Git conflict resolution.',
    date: 'March 20, 2026',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    source: 'TechPulse AI',
  },
  {
    id: 'news-cloud-wasm',
    category: 'Cloud Computing',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    title: 'WebAssembly Native Runtimes Slash Edge Cold Starts Under 5 Milliseconds',
    description: 'Major cloud providers unveil universal Wasm edge runtimes that deliver near-instantaneous execution with a fraction of Docker container footprints.',
    date: 'March 18, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    source: 'Cloud Architecture Weekly',
  },
  {
    id: 'news-web-react19',
    category: 'Web Development',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    title: 'React 19 Server Actions and Compiler Formally Adopted by 75% of Top Frameworks',
    description: 'Automatic memoization and built-in server actions remove the need for manual useMemo hooks, streamlining developer workflows worldwide.',
    date: 'March 15, 2026',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    source: 'Frontend Digest',
  },
  {
    id: 'news-security-ebpf',
    category: 'Cybersecurity',
    badgeColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    title: 'eBPF-Driven Security Observability Becomes Mandatory Enterprise Standard',
    description: 'Real-time kernel level tracing neutralizes zero-day memory exploits before payloads execute in user space, reshaping cloud defensive architecture.',
    date: 'March 12, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    source: 'Infosec Global',
  },
  {
    id: 'news-devtools-rust',
    category: 'Developer Tools',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    title: 'Rust-Powered Linters and Bundlers Achieve Sub-100ms Builds on Monorepos',
    description: 'Toolchains built in Rust and Zig replace legacy build scripts, saving developers cumulative millions of hours in compilation and testing cycles.',
    date: 'March 10, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    source: 'DevTool Metrics',
  },
  {
    id: 'news-hardware-2nm',
    category: 'Hardware',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    title: '2-Nanometer Gate-All-Around (GAA) Wafers Enter Mass Commercial Production',
    description: 'The semiconductor industry marks another technological leap as nanosheet GAA transistors deliver 30% lower power consumption for AI hardware chips.',
    date: 'March 08, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    source: 'Silicon Horizon',
  }
];

export const ARTICLES = [
  {
    _id: 'art-1-internet',
    slug: 'how-does-the-internet-actually-work',
    title: 'How Does the Internet Actually Work?',
    type: 'blog',
    category: { name: 'Internet & Networking', slug: 'internet-networking' },
    excerpt: 'From undersea fiber-optic cables and BGP routing to DNS resolution, TCP/IP handshakes, and TLS 1.3 encryption — demystifying the planetary network.',
    coverImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&auto=format&fit=crop&q=80',
    difficulty: 'Beginner',
    readingTime: 8,
    createdAt: '2026-03-15T10:00:00.000Z',
    author: {
      name: 'Dr. Elena Rostova',
      role: 'Principal Network Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    },
    likesCount: 342,
    bookmarksCount: 189,
    content: `
# How Does the Internet Actually Work?

Every single day, trillions of messages, video packets, financial transactions, and database queries ripple across the globe in milliseconds. When you type \`https://techjourney.dev\` into your browser's address bar and press Enter, what invisible chain of physics, protocols, and routing decisions brings that page to your screen?

---

## 1. The Physical Layer: Glass Fibers Under Oceans

The internet is not primarily a "cloud" in the sky; it is a physical network of microscopic glass fibers laid across continents and the ocean floor.

- **Submarine Cables**: Over 99% of international data travels via submarine fiber optic cables. These cables are roughly the thickness of a garden hose and use total internal reflection to bounce laser pulses carrying terabits per second across thousands of miles.
- **Repeaters**: Every 50 to 100 kilometers underwater, optical amplifiers (erbium-doped fiber amplifiers) boost the fading light signals without converting them to electricity.

\`\`\`bash
# Trace the physical hops your packet takes to reach a destination
traceroute 1.1.1.1
\`\`\`

---

## 2. DNS: The Phonebook of the Digital World

Computers communicate using numeric or hexadecimal IP addresses (such as \`104.21.32.1\` or \`2606:4700::6815:2001\`). Humans prefer names like \`techjourney.dev\`.

DNS (Domain Name System) translates human names to machine coordinates via a hierarchical four-tier lookup:

1. **Browser & OS Cache**: Checks if the IP is already stored in local memory.
2. **Recursive Resolver**: Your ISP or public DNS provider (like 1.1.1.1 or 8.8.8.8) queries on your behalf.
3. **Root Nameservers**: 13 logical root server clusters globally direct the query to the proper TLD.
4. **TLD Nameserver**: Nameservers responsible for \`.dev\`, \`.com\`, etc.
5. **Authoritative Nameserver**: The definitive server hosting the domain's DNS A/AAAA records.

---

## 3. The TCP 3-Way Handshake & TLS 1.3

Once the browser knows the destination IP address, it initiates a reliable transport connection over TCP (Transmission Control Protocol) and negotiates encryption via TLS 1.3:

| Phase | Protocol | What Happens |
| :--- | :--- | :--- |
| **SYN** | TCP | Client sends initial sequence number to server |
| **SYN-ACK** | TCP | Server acknowledges and sends its own sequence |
| **ACK** | TCP | Connection established, reliable data stream ready |
| **ClientHello** | TLS 1.3 | Client presents cipher suites & public key share |
| **ServerHello** | TLS 1.3 | Server agrees on cipher, returns certificates & session key |

With TLS 1.3, this entire cryptographic negotiation happens in just **1 Round Trip Time (1-RTT)**, or **0-RTT** on resumed sessions.

---

## 4. Packet Routing & Border Gateway Protocol (BGP)

Data is broken into discrete chunks called **packets** (typically 1,500 bytes maximum transmission unit, MTU). Each packet contains:
- Source IP & Destination IP
- Sequence number
- Payload data
- Checksum for error detection

BGP (Border Gateway Protocol) is the postal routing system of the internet. Autonomous Systems (ISPs, tech giants, transit providers) continuously announce which IP prefixes they can deliver. Routers inspect each packet's header and forward it toward the next best hop based on AS-path length and peering policies.

> [!NOTE]
> Packets belonging to the same web request may take completely different physical routes around the world and arrive out of order. TCP rebuilds them sequentially at the destination.
`
  },
  {
    _id: 'art-2-os',
    slug: 'understanding-operating-systems',
    title: 'Understanding Operating Systems: From Kernels to Processes',
    type: 'blog',
    category: { name: 'Operating Systems', slug: 'operating-systems' },
    excerpt: 'Explore how the kernel arbitrates hardware, schedules threads, manages virtual memory paging, and isolates user space applications.',
    coverImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&auto=format&fit=crop&q=80',
    difficulty: 'Intermediate',
    readingTime: 10,
    createdAt: '2026-03-12T14:30:00.000Z',
    author: {
      name: 'Marcus Vance',
      role: 'Kernel Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
    },
    likesCount: 284,
    bookmarksCount: 156,
    content: `
# Understanding Operating Systems: From Kernels to Processes

An Operating System (OS) is the software layer that transforms raw, unforgiving hardware—billions of transistors, RAM chips, and storage controllers—into a reliable, multi-tasking computing environment.

---

## 1. The Kernel: The Core of Ring 0

Modern CPUs enforce hardware privilege rings:
- **Ring 0 (Kernel Space)**: Unrestricted access to CPU instructions, memory mapping, interrupt handlers, and hardware devices.
- **Ring 3 (User Space)**: Restriced sandbox where applications (browsers, Node.js, databases) execute.

Whenever an application needs to read a file, make a network request, or allocate heap memory, it cannot access the hardware directly. It must execute a **System Call (syscall)** to transition CPU execution from Ring 3 to Ring 0.

\`\`\`c
// Example: Invoking a raw system call in C
#include <unistd.h>
#include <sys/syscall.h>

int main() {
    const char msg[] = "Hello from Ring 3 via syscall!\\n";
    syscall(SYS_write, 1, msg, sizeof(msg) - 1);
    return 0;
}
\`\`\`

---

## 2. Processes vs Threads

A **Process** is an isolated execution environment containing:
1. Virtual address space (Code, Data, Heap, Stack).
2. File descriptor table.
3. Security credentials and environment variables.

A **Thread** is the smallest unit of CPU scheduling *within* a process. Multiple threads in the same process share the same heap, global variables, and open file descriptors, but each thread possesses its own **instruction pointer** and **stack frame**.

---

## 3. Virtual Memory & Paging

Processes don't interact with physical RAM addresses. The OS and CPU's **Memory Management Unit (MMU)** implement **Virtual Memory**:

- Memory is partitioned into fixed-size **Pages** (typically 4 KB).
- The OS maintains a **Page Table** mapping virtual pages to physical **Frames**.
- If a program accesses a virtual page that isn't mapped to physical RAM, the hardware triggers a **Page Fault**, prompting the kernel to fetch data from swap or disk.

This architecture ensures process isolation: Process A cannot read or overwrite Process B's memory because their virtual address spaces map to completely disjoint physical addresses.
`
  },
  {
    _id: 'art-3-servers',
    slug: 'how-servers-work',
    title: 'How Servers Work: Architecture, Protocols & Scaling',
    type: 'blog',
    category: { name: 'Backend Development', slug: 'backend-development' },
    excerpt: 'Deconstructing what makes a server tick: socket lifecycle, non-blocking I/O event loops, reverse proxies, and horizontal load balancing.',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    difficulty: 'Intermediate',
    readingTime: 7,
    createdAt: '2026-03-08T09:15:00.000Z',
    author: {
      name: 'Chirag Visvakarma',
      role: 'Lead Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
    },
    likesCount: 412,
    bookmarksCount: 230,
    content: `
# How Servers Work: Architecture, Protocols & Scaling

At its heart, a server is both a concept and a machine. As hardware, it is a computer optimized for 24/7 reliability with redundant power supplies and ECC memory. As software, it is a long-running process that listens on a network port for incoming requests, processes business logic, and returns responses.

---

## 1. The Socket Lifecycle

Every network connection begins with a BSD socket:

\`\`\`
socket() -> bind(IP, PORT) -> listen(BACKLOG) -> accept() -> read()/write() -> close()
\`\`\`

1. **socket()**: Creates a communication endpoint in the OS kernel.
2. **bind()**: Associates the socket with an IP and Port (e.g. \`0.0.0.0:443\`).
3. **listen()**: Marks the socket as passive, ready to accept incoming TCP handshakes.
4. **accept()**: Pops an established connection off the OS backlog queue and creates a dedicated client socket descriptor.

---

## 2. Multi-threaded vs Event-Driven I/O

How does a server handle 100,000 concurrent connections?

- **Thread-Per-Connection (Legacy / Apache)**: Each connection allocates a full OS thread with an 8MB stack. Memory limits cap concurrent connections around 5,000 to 10,000.
- **Event-Driven Non-Blocking I/O (Node.js, NGINX, Netty)**: Uses OS multiplexing primitives (\`epoll\` on Linux, \`kqueue\` on macOS) to monitor thousands of sockets on a single thread. The server only wakes up when a socket actually receives bytes.

---

## 3. Reverse Proxies & Load Balancing

In modern production, requests rarely hit your application server directly:

1. **Edge CDN (Cloudflare/Fastly)**: Caches static assets and shields against DDoS attacks.
2. **Reverse Proxy / Ingress (NGINX/Traefik)**: Terminates TLS, compresses payloads (Brotli/Gzip), and distributes traffic.
3. **Load Balancing Algorithms**:
   - Round Robin
   - Least Connections
   - Consistent IP Hashing
`
  },
  {
    _id: 'art-4-semiconductors',
    slug: 'introduction-to-semiconductor-technology',
    title: 'Introduction to Semiconductor Technology: From Silicon to Transistors',
    type: 'blog',
    category: { name: 'Hardware', slug: 'hardware' },
    excerpt: 'Uncover the nanometer physics of silicon ingots, EUV photolithography, FinFET structures, and Gate-All-Around (GAA) nanosheets.',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    difficulty: 'Advanced',
    readingTime: 12,
    createdAt: '2026-03-02T16:45:00.000Z',
    author: {
      name: 'Dr. Arthur Sterling',
      role: 'Semiconductor Physicist',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
    },
    likesCount: 198,
    bookmarksCount: 112,
    content: `
# Introduction to Semiconductor Technology: From Silicon to Transistors

Modern microprocessors pack over 100 billion transistors into a chip no larger than a postage stamp. To understand software at its fundamental limit, developers must understand the marvel of modern semiconductor manufacturing.

---

## 1. What Is a Semiconductor?

A semiconductor is a material whose electrical conductivity falls between an insulator (like glass) and a conductor (like copper).

Silicon is an element with 4 valence electrons in its outer shell. In its pure crystalline state, electrons are locked in covalent bonds. By introducing microscopic impurities—a process known as **doping**—we alter its conductive properties:
- **N-Type (Negative)**: Doped with Phosphorus (5 valence electrons), yielding excess free electrons.
- **P-Type (Positive)**: Doped with Boron (3 valence electrons), creating "holes" that accept electrons.

---

## 2. The Transistor: The Universal Binary Switch

A **MOSFET (Metal-Oxide-Semiconductor Field-Effect Transistor)** consists of three terminals:
- **Source**: Where charge carriers enter.
- **Drain**: Where charge carriers leave.
- **Gate**: The electrical valve that controls the flow.

Applying a positive voltage to the gate creates an electrical field that opens a conductive channel between Source and Drain, representing a binary **1**. Removing voltage closes the channel, representing a binary **0**.

---

## 3. EUV Photolithography: Printing with Light

How do you print features that are just 2 nanometers wide?

1. **Extreme Ultraviolet (EUV) Light**: Wavelength of just 13.5 nanometers, produced by firing high-energy CO2 lasers at falling molten tin droplets 50,000 times per second.
2. **Photoresist Coating**: Silicon wafers are coated with light-sensitive chemical resists.
3. **Mask Projection**: EUV light reflects off multi-layer mirrors through a photomask, exposing nanoscale circuit patterns.
4. **Etching & Ion Implantation**: Chemical acids wash away exposed resist, followed by ion bombardment to dope silicon layers.
`
  },
  {
    _id: 'art-5-cs-fundamentals',
    slug: 'computer-science-fundamentals-every-developer-should-know',
    title: 'Computer Science Fundamentals Every Developer Should Know',
    type: 'blog',
    category: { name: 'Computer Science', slug: 'computer-science' },
    excerpt: 'The timeless mental models of software engineering: asymptotic complexity (Big-O), memory hierarchy, trees, graphs, and concurrency.',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    difficulty: 'Intermediate',
    readingTime: 11,
    createdAt: '2026-02-26T11:20:00.000Z',
    author: {
      name: 'Sofia Chen',
      role: 'Staff Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
    },
    likesCount: 512,
    bookmarksCount: 310,
    content: `
# Computer Science Fundamentals Every Developer Should Know

Languages and frameworks change every 3 years, but core computer science principles remain constant over decades. Mastering these fundamentals transforms you from someone who merely glues libraries together into an engineer who understands system boundaries and trade-offs.

---

## 1. Asymptotic Complexity & Big-O Notation

Big-O measures how algorithm execution time or memory footprint scales as input size $N$ approaches infinity:

| Notation | Complexity Name | Typical Example | Practical Boundary |
| :--- | :--- | :--- | :--- |
| **$O(1)$** | Constant | Hash map lookup, array indexing | Instantaneous |
| **$O(\log N)$** | Logarithmic | Binary search, balanced BST search | 1 billion items in ~30 operations |
| **$O(N)$** | Linear | Single loop pass, unsorted array scan | Predictable, scales with input |
| **$O(N \log N)$** | Linearithmic | Merge sort, Quicksort (average) | Optimal comparison sort |
| **$O(N^2)$** | Quadratic | Nested loops, bubble sort | Unacceptable for large $N$ |

---

## 2. Essential Data Structures

1. **Arrays vs Linked Lists**:
   - Arrays provide contiguous memory layout, enabling CPU cache prefetching and $O(1)$ random access.
   - Linked lists permit $O(1)$ insertion at pointers but suffer from cache misses due to pointer chasing.
2. **Hash Tables**:
   - Computes a hash function over a key to index into bucket arrays.
   - Handles collisions via separate chaining or open addressing.
3. **Trees & Graphs**:
   - Binary Search Trees (Red-Black / AVL) maintain sorted order in $O(\log N)$.
   - Graphs model relationships (social networks, dependency graphs, road routing) traversed using BFS and DFS.

---

## 3. The CPU Cache Hierarchy

Memory speed is governed by physics. Accessing main RAM takes roughly 200 CPU cycles. To hide this latency, modern processors use tiered caches:

- **L1 Cache**: ~1 nanosecond (4 cycles) — 32KB to 64KB per core.
- **L2 Cache**: ~3-4 nanoseconds (14 cycles) — 512KB to 1MB per core.
- **L3 Cache**: ~10-15 nanoseconds (50 cycles) — Shared 16MB to 64MB.
- **Main RAM**: ~60-100 nanoseconds (200 cycles).
- **NVMe SSD**: ~20,000 nanoseconds.
`
  },
  {
    _id: 'art-6-nodejs-interview',
    slug: 'nodejs-interview-questions',
    title: 'Node.js Interview Questions & Architecture Deep Dive',
    type: 'blog',
    category: { name: 'Backend Development', slug: 'backend-development' },
    excerpt: 'Master tricky Node.js interview topics: the libuv event loop phases, microtasks vs macrotasks, streams, clustering, and memory leaks.',
    coverImage: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&auto=format&fit=crop&q=80',
    difficulty: 'Intermediate',
    readingTime: 9,
    createdAt: '2026-02-20T08:00:00.000Z',
    author: {
      name: 'Chirag Visvakarma',
      role: 'Lead Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
    },
    likesCount: 376,
    bookmarksCount: 245,
    content: `
# Node.js Interview Questions & Architecture Deep Dive

Node.js remains one of the most widely deployed server-side runtimes in modern tech. Here are the core architectural questions senior interviewers ask candidates.

---

## 1. What Is the Event Loop and What Are Its Phases?

Node.js executes JavaScript on a single thread using the V8 engine and offloads asynchronous I/O to the **libuv** C library.

The event loop cycles through six distinct phases in order:

1. **Timers Phase**: Executes callbacks scheduled by \`setTimeout()\` and \`setInterval()\`.
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration (e.g. TCP errors).
3. **Idle, Prepare**: Used internally by libuv.
4. **Poll Phase**: Retrieves new I/O events; executes almost all callbacks (file I/O, network data).
5. **Check Phase**: Executes callbacks scheduled by \`setImmediate()\`.
6. **Close Callbacks**: Handles socket and handle closures like \`socket.on('close')\`.

### Microtask Queues: The High-Priority Exception
Between *each* phase transition, Node drains the microtask queue:
- \`process.nextTick()\` queue (highest priority).
- Promise reactions (\`.then()\`, \`async/await\`).

\`\`\`javascript
// Classic Event Loop Question: Guess the output order
console.log('1 - Start');

setTimeout(() => console.log('2 - Timer 0ms'), 0);

Promise.resolve().then(() => console.log('3 - Promise Microtask'));

process.nextTick(() => console.log('4 - nextTick Microtask'));

setImmediate(() => console.log('5 - setImmediate Check'));

console.log('6 - End');

// Output:
// 1 - Start
// 6 - End
// 4 - nextTick Microtask
// 3 - Promise Microtask
// 2 - Timer 0ms
// 5 - setImmediate Check
\`\`\`

---

## 2. Streams and Backpressure

When transferring gigabyte-sized files, reading the entire buffer into RAM leads to process crashes:

\`\`\`javascript
// Bad: Consumes 2GB of RAM
const data = fs.readFileSync('huge-file.csv');
res.send(data);

// Good: Constant memory usage of ~64KB via Streams
const stream = fs.createReadStream('huge-file.csv');
stream.pipe(res);
\`\`\`

**Backpressure** occurs when the readable stream pushes data faster than the writable destination can consume it. The \`.pipe()\` abstraction automatically pauses reading when internal write buffers fill.
`
  },
  {
    _id: '6abdd917aec03e97beee1e37',
    slug: 'gemini-4-argon-our-next-era-of-frontier-intelligence',
    title: 'Gemini 4 Argon: our next era of frontier intelligence',
    type: 'article',
    category: { name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
    excerpt: 'Frontier AI models: exploring multimodal reasoning, long-context latency reduction, and agentic workflows in production.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    difficulty: 'Advanced',
    readingTime: 12,
    createdAt: '2026-03-20T10:00:00.000Z',
    author: {
      name: 'Google DeepMind Team',
      role: 'Frontier Research',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    },
    likesCount: 890,
    bookmarksCount: 420,
    content: `# Gemini 4 Argon: our next era of frontier intelligence

Gemini 4 Argon introduces radical efficiency gains across multimodal inference, recursive reasoning loops, and long-context processing.

---

## 1. Native Multimodal Architecture

Traditional architectures utilize disparate encoders for vision, audio, and language. Gemini 4 Argon utilizes a unified tokenization space where text, video tokens, and audio spectrogram patches coexist in the same sparse mixture-of-experts (MoE) transformer.

## 2. Agentic Tool Execution

With low-latency speculative decoding, Argon can generate and evaluate candidate bash scripts, API payloads, and code refactorings asynchronously.
`
  },
  {
    _id: '6aa28c40a0217b30ceabf881',
    slug: 'ai-agents-how-they-are-changing-software-development-in-2026',
    title: 'AI Agents: How They Are Changing Software Development in 2026',
    type: 'article',
    category: { name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
    excerpt: 'From code completion to autonomous development loops: how LLM agents are reshaping how software is planned, written, and verified.',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80',
    difficulty: 'Intermediate',
    readingTime: 9,
    createdAt: '2026-03-18T12:00:00.000Z',
    author: {
      name: 'Dr. Elena Rostova',
      role: 'Principal Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
    },
    likesCount: 654,
    bookmarksCount: 290,
    content: `# AI Agents: How They Are Changing Software Development in 2026

The shift from passive code generation to autonomous, self-correcting agents represents the largest productivity inflection in computing history.

---

## 1. The Autonomous Execution Loop

Modern agentic assistants do not just suggest code snippets; they possess iterative operational loops:
1. **Perception**: Reading workspace structure, linter messages, and test outputs.
2. **Planning**: Decomposing large tasks into verifiable sub-goals.
3. **Tool Execution**: Editing files, running tests, checking diffs, and self-correcting syntax errors.
`
  }
];

export const BLOGS = ARTICLES.filter((a) => !a.type || a.type === 'blog');
export const CURATED_ARTICLES = ARTICLES.filter((a) => a.type === 'article');

export const CODE_OF_THE_DAY = {
  title: 'developer_manifesto.js',
  language: 'javascript',
  lines: [
    { num: 1, content: 'const developer = {', type: 'keyword' },
    { num: 2, content: '  learn: true,', type: 'boolean' },
    { num: 3, content: '  build: true,', type: 'boolean' },
    { num: 4, content: '  improve: true', type: 'boolean' },
    { num: 5, content: '};', type: 'keyword' },
    { num: 6, content: '', type: 'empty' },
    { num: 7, content: 'console.log("Keep Coding 🚀");', type: 'fn' },
  ],
  rawCode: `const developer = {
  learn: true,
  build: true,
  improve: true
};

console.log("Keep Coding 🚀");`
};

export const PLATFORM_STATS = [
  { value: 10, suffix: '+', label: 'Technology Categories', desc: 'From AI to Semiconductors' },
  { value: 100, suffix: '+', label: 'Technical Articles', desc: 'Deep dives and interview prep' },
  { value: 20, suffix: '+', label: 'Developer Roadmaps', desc: 'Interactive step-by-step paths' },
  { value: 50, suffix: '+', label: 'Programming Topics', desc: 'Languages, tooling & cheat sheets' }
];
