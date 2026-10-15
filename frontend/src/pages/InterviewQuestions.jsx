import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Search,
  Sparkles,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Filter,
  Code2,
  Cpu,
  Layers,
  Server,
  Globe,
  BrainCircuit,
  BookOpen,
  Share2,
  Building2,
  Award,
  Zap,
  Bookmark,
  BookmarkCheck,
  Shuffle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Database,
  Terminal,
} from 'lucide-react';
import api from '../services/api';

const GithubIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Icon Map for Categories
const CATEGORY_ICONS = {
  All: HelpCircle,
  'Node.js': Server,
  React: Layers,
  JavaScript: Code2,
  'System Design': BrainCircuit,
  Python: Cpu,
  Databases: Database,
  DevOps: Terminal,
};

// Built-in Comprehensive Multiple Questions & Answers Pack
const BUILTIN_INTERVIEW_QUESTIONS = [
  // ═══ NODE.JS ═══
  {
    _id: 'node-q1',
    question: 'What is the Event Loop in Node.js and how does it process asynchronous tasks?',
    category: 'Node.js',
    difficulty: 'Medium',
    companyTags: ['Amazon', 'Google', 'Netflix', 'Uber'],
    answer: `The Event Loop is Node.js's secret to achieving non-blocking I/O operations despite JavaScript running single-threaded. It delegates heavy tasks (file reading, network operations, database queries) to the OS kernel or libuv thread pool.

### Event Loop Phases (Executed in order):
1. **Timers**: Executes callbacks scheduled by \`setTimeout()\` and \`setInterval()\`.
2. **Pending Callbacks**: Executes I/O callbacks deferred from previous loop iterations.
3. **Idle, Prepare**: Used internally by Node.js.
4. **Poll**: Retrieves new I/O events and executes I/O related callbacks.
5. **Check**: Executes \`setImmediate()\` callbacks.
6. **Close Callbacks**: Executes cleanup callbacks (e.g. \`socket.on('close')\`).

*Microtask Queue (\`process.nextTick()\` and Promises) is executed immediately after the current operation finishes, before moving to the next phase.*`,
    codeSnippet: `const fs = require('fs');

console.log('1. Script Start');

setTimeout(() => console.log('2. setTimeout'), 0);
setImmediate(() => console.log('3. setImmediate'));

fs.readFile(__filename, () => {
  console.log('4. File Read I/O');
  setTimeout(() => console.log('5. Nested setTimeout'), 0);
  setImmediate(() => console.log('6. Nested setImmediate'));
});

Promise.resolve().then(() => console.log('7. Microtask Promise'));
process.nextTick(() => console.log('8. Microtask nextTick'));

console.log('9. Script End');`,
    explanation: '\`process.nextTick()\` runs immediately after the current phase completes, before Promises. \`setImmediate()\` runs in the Check phase of the event loop.',
    tags: ['Node.js', 'Event Loop', 'Libuv', 'Asynchronous'],
  },
  {
    _id: 'node-q2',
    question: 'What is the difference between Streams and Buffers in Node.js?',
    category: 'Node.js',
    difficulty: 'Medium',
    companyTags: ['Amazon', 'Microsoft', 'Netflix'],
    answer: `Buffers and Streams are both used for handling binary data in Node.js, but they handle memory allocation and data transfer differently:

- **Buffer**: Allocates a fixed amount of memory outside the V8 heap to store raw binary data all at once. Best for small data payloads.
- **Stream**: Processes data in chunks over time without loading the entire file/data into RAM. Crucial for handling large files (gigabytes) or real-time media feeds.

### Types of Streams:
1. **Readable**: Source of data (e.g. \`fs.createReadStream()\`, HTTP request).
2. **Writable**: Destination for data (e.g. \`fs.createWriteStream()\`, HTTP response).
3. **Duplex**: Both Readable and Writable (e.g. TCP Socket).
4. **Transform**: Duplex stream that modifies data as it is read/written (e.g. zlib compression, crypto).`,
    codeSnippet: `const fs = require('fs');
const zlib = require('zlib');

// Efficient Memory Usage via Stream Piping:
fs.createReadStream('large-file.log')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('large-file.log.gz'))
  .on('finish', () => console.log('Compression complete!'));`,
    explanation: 'Using Streams prevents Node.js process memory overload when transferring massive files across servers.',
    tags: ['Node.js', 'Streams', 'Buffers', 'Performance'],
  },
  {
    _id: 'node-q3',
    question: 'How do Worker Threads differ from the Cluster Module in Node.js?',
    category: 'Node.js',
    difficulty: 'Hard',
    companyTags: ['Google', 'Meta', 'Uber'],
    answer: `Both Worker Threads and Cluster enable Node.js to perform parallel execution, but at different process and memory boundaries:

- **Cluster Module**: Spawns multiple distinct Node.js processes sharing the same server port. Each process has its own V8 instance, memory, and event loop. Ideal for scaling I/O HTTP web servers across CPU cores.
- **Worker Threads (\`worker_threads\`)**: Spawns multiple threads within a **single process**. Threads share memory using \`ArrayBuffer\` or \`SharedArrayBuffer\`. Ideal for heavy CPU-bound tasks (image processing, encryption, machine learning calculations).`,
    codeSnippet: `const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: { num: 42 } });
  worker.on('message', (result) => console.log('Result from worker:', result));
} else {
  // Heavy CPU calculation inside Worker Thread
  const computeFactorial = (n) => (n <= 1 ? 1 : n * computeFactorial(n - 1));
  parentPort.postMessage(computeFactorial(workerData.num));
}`,
    explanation: 'Use Cluster for scaling web request throughput across CPU cores; use Worker Threads for isolated CPU-heavy algorithms without blocking the main event loop.',
    tags: ['Node.js', 'Worker Threads', 'Cluster', 'Multithreading'],
  },

  // ═══ REACT ═══
  {
    _id: 'react-q1',
    question: 'Explain Virtual DOM Reconciliation and how React Fiber optimizes rendering.',
    category: 'React',
    difficulty: 'Hard',
    companyTags: ['Meta', 'Facebook', 'Airbnb', 'Microsoft'],
    answer: `### Virtual DOM Reconciliation:
The Virtual DOM is a lightweight JS object representing the actual DOM. When component state changes:
1. React generates a new Virtual DOM tree.
2. React runs the **Diffing Algorithm** ($O(n)$ complexity using keys and element types).
3. React computes the minimal mutations required and applies them to the Real DOM.

### React Fiber Architecture:
Before Fiber (React 15), reconciliation was synchronous and un-interruptible (Stack Reconciler). Long renders caused lag and dropped animation frames.

React Fiber (React 16+) introduced an **asynchronous, incremental reconciler**:
- Breaks rendering work into small units called **Fiber nodes**.
- Allows React to pause, reuse, or abort rendering work based on priority (e.g. user input > animation > background fetch).
- Enables concurrent capabilities like \`useTransition\` and \`useDeferredValue\`.`,
    codeSnippet: `import { useState, useTransition } from 'react';

function SearchComponent({ items }) {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    // High priority: update input field immediately
    setQuery(e.target.value);

    // Low priority: defer heavy filtering render
    startTransition(() => {
      // Heavy filter execution deferred smoothly
    });
  };

  return <input value={query} onChange={handleChange} />;
}`,
    explanation: 'React Fiber makes complex UIs fluid by allowing high-priority user interactions to interrupt low-priority render updates.',
    tags: ['React', 'Virtual DOM', 'React Fiber', 'Concurrent Mode'],
  },
  {
    _id: 'react-q2',
    question: 'When should you use useMemo vs useCallback in React?',
    category: 'React',
    difficulty: 'Medium',
    companyTags: ['Meta', 'Amazon', 'Google'],
    answer: `Both \`useMemo\` and \`useCallback\` are optimization hooks that memoize values between renders to prevent unnecessary re-computations or child re-renders.

- **\`useMemo\`**: Memoizes the **result of a calculation/function**. Returns a memoized value.
  \`\`\`js
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
  \`\`\`
- **\`useCallback\`**: Memoizes a **function instance itself**. Returns a memoized callback function. Prevents child components wrapped in \`React.memo\` from re-rendering due to reference changes.
  \`\`\`js
  const handleClick = useCallback(() => console.log('Clicked'), []);
  \`\`\``,
    codeSnippet: `import React, { useState, useCallback, useMemo } from 'react';

const Child = React.memo(({ onClick, data }) => {
  console.log('Child Rendered');
  return <button onClick={onClick}>Items Count: {data.length}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [items] = useState([1, 2, 3, 4, 5]);

  // Memoize expensive sum calculation
  const totalSum = useMemo(() => items.reduce((a, b) => a + b, 0), [items]);

  // Memoize callback so Child doesn't re-render when count changes
  const handleChildClick = useCallback(() => {
    console.log('Total sum is:', totalSum);
  }, [totalSum]);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child onClick={handleChildClick} data={items} />
    </div>
  );
}`,
    explanation: 'Do not over-use memoization hooks blindly. They carry memory and dependency-checking overhead; use them when passing functions to memoized children or computing heavy operations.',
    tags: ['React', 'Hooks', 'useMemo', 'useCallback', 'Performance'],
  },
  {
    _id: 'react-q3',
    question: 'What are React Server Components (RSC) and how do they differ from SSR?',
    category: 'React',
    difficulty: 'Hard',
    companyTags: ['Meta', 'Vercel', 'Netflix'],
    answer: `### Server Side Rendering (SSR):
SSR renders HTML on the server for the initial page load, but sends ALL JavaScript component code to the client browser for **hydration**.

### React Server Components (RSC):
RSC execute **exclusively on the server** and NEVER send their JavaScript bundle to the client:
- Zero impact on client bundle size.
- Direct access to server backend resources (databases, internal microservices, file systems).
- Seamless integration with Client Components (\`'use client'\`) for interactive elements.`,
    codeSnippet: `// Server Component (Default in Next.js App Router) - Runs on Server ONLY
import db from '@/lib/db';

export default async function UserProfile({ userId }) {
  // Direct database fetch - no client bundle overhead!
  const user = await db.user.findUnique({ where: { id: userId } });

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}`,
    explanation: 'RSC allows developers to write backend data fetching code directly inside React components without creating separate REST/GraphQL API layers.',
    tags: ['React', 'Next.js', 'Server Components', 'Architecture'],
  },

  // ═══ JAVASCRIPT ═══
  {
    _id: 'js-q1',
    question: 'What are Closures in JavaScript and how do they work under the hood?',
    category: 'JavaScript',
    difficulty: 'Medium',
    companyTags: ['Google', 'Amazon', 'Apple', 'Microsoft'],
    answer: `A **Closure** is created whenever a function is defined inside another function, allowing the inner function to access the outer function's variable environment even after the outer function has finished executing.

### How it works under the hood:
When a function is declared in JS, it retains a hidden reference to its lexical scope (\`[[Environment]]\`). Even if the parent execution context is popped off the Call Stack, memory for enclosed variables remains allocated on the heap as long as the closure holds a reference to them.`,
    codeSnippet: `function createBankModule(initialBalance) {
  let balance = initialBalance; // Encapsulated private state

  return {
    deposit: (amount) => {
      balance += amount;
      return balance;
    },
    withdraw: (amount) => {
      if (amount > balance) return 'Insufficient Funds';
      balance -= amount;
      return balance;
    },
    getBalance: () => balance,
  };
}

const account = createBankModule(100);
console.log(account.deposit(50));  // 150
console.log(account.getBalance()); // 150
// console.log(account.balance) -> undefined (Data Privacy preserved!)`,
    explanation: 'Closures enable private variables, module patterns, function currying, and maintaining state across asynchronous event handlers.',
    tags: ['JavaScript', 'Closures', 'Scope', 'Functional Programming'],
  },
  {
    _id: 'js-q2',
    question: 'Explain Prototypal Inheritance and the Prototype Chain in JavaScript.',
    category: 'JavaScript',
    difficulty: 'Medium',
    companyTags: ['Amazon', 'Google', 'Meta'],
    answer: `In JavaScript, objects inherit properties and methods from other objects via the **Prototype Chain**.

Every JS object has an internal hidden link (\`[[Prototype]]\`, accessed via \`Object.getPrototypeOf(obj)\` or \`__proto__\`) pointing to its prototype object.

### Lookup Mechanism:
When accessing a property on an object:
1. JS looks at the object's own properties.
2. If not found, it checks its prototype (\`obj.__proto__\`).
3. It climbs up the prototype chain until it finds the property or reaches \`Object.prototype.__proto__ === null\`.`,
    codeSnippet: `function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function () {
  return \`\${this.name} makes a noise.\`;
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Link prototypes
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

const rex = new Dog('Rex', 'German Shepherd');
console.log(rex.speak()); // "Rex makes a noise." (Inherited via Prototype Chain!)`,
    explanation: 'ES6 \`class\` syntax is syntactical sugar over JavaScript prototypal inheritance under the hood.',
    tags: ['JavaScript', 'Prototypes', 'OOP', 'Inheritance'],
  },
  {
    _id: 'js-q3',
    question: 'How do Async/Await and Promises map to the JavaScript Microtask Queue?',
    category: 'JavaScript',
    difficulty: 'Hard',
    companyTags: ['Google', 'Meta', 'Netflix', 'Microsoft'],
    answer: `\`async/await\` is syntactical sugar built on top of native Promises and Generators.

- Marking a function \`async\` automatically wraps its return value in a resolved Promise.
- The \`await\` keyword pauses execution of the \`async\` function and registers the remainder of the function as a callback in the **Microtask Queue**.
- The main call stack continues executing synchronous code without blocking.
- Microtasks (Promise callbacks, \`queueMicrotask\`) run **immediately after synchronous code completes**, before any Macrotasks (\`setTimeout\`, \`setInterval\`, I/O).`,
    codeSnippet: `console.log('1. Sync Start');

setTimeout(() => console.log('2. Macrotask Timer'), 0);

async function asyncFn() {
  console.log('3. Inside Async Fn (Sync)');
  await Promise.resolve();
  console.log('4. After Await (Microtask)');
}

asyncFn();

Promise.resolve().then(() => console.log('5. Direct Microtask'));

console.log('6. Sync End');

// Output:
// 1. Sync Start
// 3. Inside Async Fn (Sync)
// 6. Sync End
// 4. After Await (Microtask)
// 5. Direct Microtask
// 2. Macrotask Timer`,
    explanation: 'Microtasks always execute to exhaustion before the browser allows rendering or processes the next Macrotask queue item.',
    tags: ['JavaScript', 'Async/Await', 'Promises', 'Microtask Queue'],
  },

  // ═══ SYSTEM DESIGN ═══
  {
    _id: 'sd-q1',
    question: 'How do you design a Scalable Rate Limiter algorithm for an API Gateway?',
    category: 'System Design',
    difficulty: 'Hard',
    companyTags: ['Uber', 'Stripe', 'Amazon', 'Cloudflare'],
    answer: `Rate limiters prevent API abuse, DDoS attacks, and server resource exhaustion.

### Common Algorithms:
1. **Token Bucket**: Refills tokens at a constant rate up to a capacity. Requests consume tokens. Handles bursts well.
2. **Leaking Bucket**: Processes requests at a fixed constant rate. Queues overflow requests. Smooths out traffic spikes.
3. **Fixed Window Counter**: Divides time into fixed windows (e.g. 1 minute). Resets count at window edge (vulnerable to double limit spikes at window boundaries).
4. **Sliding Window Log**: Stores timestamps in a sorted set (Redis ZSET). Highly accurate but memory intensive.
5. **Sliding Window Counter**: Combines current and previous window counts using weighted estimates. Low memory & highly accurate (Best for Distributed Systems).

### Distributed Implementation with Redis:
Store client request counts in **Redis** with TTL using atomic Lua scripts to prevent race conditions across multiple API gateway nodes.`,
    codeSnippet: `// Redis Sliding Window Rate Limiter Lua Script
const rateLimiterScript = \`
  local key = KEYS[1]
  local now = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  local limit = tonumber(ARGV[3])
  local clearBefore = now - window

  redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)
  local reqCount = redis.call('ZCARD', key)

  if reqCount < limit then
    redis.call('ZADD', key, now, now)
    redis.call('EXPIRE', key, math.ceil(window / 1000))
    return 1 -- Allowed
  else
    return 0 -- Rate Limited
  end
\`;`,
    explanation: 'Redis + Lua script guarantees atomic evaluation of rate limit counters in multi-instance API gateways.',
    tags: ['System Design', 'Rate Limiting', 'Redis', 'API Gateway'],
  },
  {
    _id: 'sd-q2',
    question: 'Explain Database Sharding vs Database Replication and when to use which.',
    category: 'System Design',
    difficulty: 'Hard',
    companyTags: ['Netflix', 'Meta', 'Amazon', 'Uber'],
    answer: `### Database Replication (Read Scaling):
Copies identical data from a primary (writer) node to one or more replica (reader) nodes.
- **Use Case**: Applications with high Read-to-Write ratios (e.g. 90% reads, 10% writes like blogs or news sites).
- **Types**: Synchronous (strong consistency) vs Asynchronous (eventual consistency with replication lag).

### Database Sharding (Write & Storage Scaling):
Horizontally partitions a massive dataset across separate independent database servers based on a **Shard Key** (e.g. \`hash(user_id) % num_shards\`).
- **Use Case**: Datasets exceeding single-server disk space or write throughput limits (e.g. high-volume social media feeds, financial transactions).

### Challenges of Sharding:
- Complex join operations across shards.
- Re-sharding when scaling shard count (mitigated using **Consistent Hashing**).
- Cross-shard distributed transactions (requires 2-Phase Commit).`,
    codeSnippet: `// Consistent Hashing Shard Lookup Concept
class ConsistentHashRing {
  constructor(nodes, replicas = 3) {
    this.ring = new Map();
    this.keys = [];
    // Adds virtual nodes to ring for balanced data distribution
  }

  getShardServer(userId) {
    const hash = this.hashFn(userId);
    // Find nearest server node on ring
    return this.findClosestNode(hash);
  }
}`,
    explanation: 'Replication solves high read volume; Sharding solves high write volume and database disk limits.',
    tags: ['System Design', 'Databases', 'Sharding', 'Replication'],
  },

  // ═══ PYTHON ═══
  {
    _id: 'py-q1',
    question: 'What is the Python Global Interpreter Lock (GIL) and how to write concurrent code in Python?',
    category: 'Python',
    difficulty: 'Medium',
    companyTags: ['Google', 'Spotify', 'Meta', 'Dropbox'],
    answer: `The **GIL (Global Interpreter Lock)** is a mutex in CPython that ensures only one native thread executes Python bytecode at any given time to protect CPython's memory management (reference counting).

### Impact on Concurrency:
- **CPU-bound tasks** (e.g. matrix multiplication, image encoding): Multithreading cannot scale across multiple CPU cores due to GIL contention.
- **I/O-bound tasks** (e.g. HTTP requests, file reading): Threads release the GIL while waiting for I/O, allowing efficient execution.

### How to Bypass GIL for CPU Work:
1. Use \`multiprocessing\` module (spawns separate processes with independent GILs).
2. Use C/C++ extensions (e.g. NumPy, PyTorch release GIL during native C computation).
3. Use alternative implementations (e.g. PyPy, JPython) or Python 3.13+ no-GIL experimental builds.`,
    codeSnippet: `from multiprocessing import Pool
import time

def cpu_heavy_work(n):
    return sum(i * i for i in range(n))

if __name__ == '__main__':
    numbers = [10000000, 10000000, 10000000, 10000000]
    
    # Multiprocessing uses multiple CPU cores by creating process pool
    with Pool() as pool:
        results = pool.map(cpu_heavy_work, numbers)
    print("Completed parallel calculations across cores:", len(results))`,
    explanation: 'Use \`asyncio\` or \`threading\` for I/O bound work; use \`multiprocessing\` or NumPy for CPU bound tasks in Python.',
    tags: ['Python', 'GIL', 'Multiprocessing', 'Concurrency'],
  },

  // ═══ DATABASES ═══
  {
    _id: 'db-q1',
    question: 'What are B-Tree Indexes and how do they speed up database queries?',
    category: 'Databases',
    difficulty: 'Medium',
    companyTags: ['Amazon', 'Microsoft', 'Oracle'],
    answer: `B-Trees (and B+ Trees) are self-balancing search trees used by relational databases (PostgreSQL, MySQL InnoDB) to store indexes.

### Why B-Trees for Databases?
- Without an index, finding a row requires a full table scan ($O(N)$ disk reads).
- With a B-Tree index, finding a row takes $O(\\log N)$ disk page reads.
- B+ Trees store all actual data pointers in leaf nodes connected as a doubly-linked list, making range queries (\`WHERE age BETWEEN 20 AND 30\`) extremely fast!

### Index Trade-offs:
- **Faster Reads**: Speeds up \`SELECT\` queries with \`WHERE\`, \`JOIN\`, and \`ORDER BY\`.
- **Slower Writes**: Every \`INSERT\`, \`UPDATE\`, or \`DELETE\` requires maintaining and re-balancing the B-Tree index structure on disk.`,
    codeSnippet: `-- Create composite B-Tree index in PostgreSQL/MySQL
CREATE INDEX idx_user_status_created 
ON users (status, created_at DESC);

-- Query utilizing the B-Tree Index:
SELECT * FROM users 
WHERE status = 'ACTIVE' 
ORDER BY created_at DESC 
LIMIT 20;`,
    explanation: 'Composite indexes must follow the Leftmost Prefix Rule to be used by the SQL query planner.',
    tags: ['Databases', 'B-Tree', 'Indexing', 'SQL Performance'],
  },

  // ═══ DEVOPS ═══
  {
    _id: 'devops-q1',
    question: 'What is the difference between Docker Containers and Virtual Machines (VMs)?',
    category: 'DevOps',
    difficulty: 'Easy',
    companyTags: ['AWS', 'Google Cloud', 'Microsoft', 'RedHat'],
    answer: `### Virtual Machines (VMs):
VMs virtualize hardware using a **Hypervisor** (e.g. ESXi, KVM, Hyper-V). Each VM runs a full guest Operating System with its own kernel, requiring gigabytes of memory and minutes to boot.

### Docker Containers:
Containers virtualize the **Operating System**. They share the host system's Linux kernel and isolate applications using Linux **namespaces** and **cgroups**.
- **Lightweight**: Megabytes in size vs Gigabytes.
- **Fast**: Boot in milliseconds.
- **Portable**: Identical behavior across local laptop, staging, and production cloud nodes.`,
    codeSnippet: `# Multi-stage Dockerfile for Node.js App Optimization
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Minimal Image
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
USER node
CMD ["node", "dist/server.js"]`,
    explanation: 'Multi-stage Docker builds dramatically reduce final container image sizes, enhancing security and deployment speed.',
    tags: ['DevOps', 'Docker', 'Containers', 'Infrastructure'],
  },
];

export default function InterviewQuestions() {
  const [apiQuestions, setApiQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'practice'
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [bookmarks, setBookmarks] = useState({});
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [copiedShareId, setCopiedShareId] = useState(null);
  
  // GitHub Repos Modal State
  const [githubRepos, setGithubRepos] = useState([]);
  const [showGithubModal, setShowGithubModal] = useState(false);

  // Practice Flashcard State
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [masteredIds, setMasteredIds] = useState(new Set());

  // Load Bookmarks & Mastered State from LocalStorage
  useEffect(() => {
    try {
      const savedBm = localStorage.getItem('interview_bookmarks');
      if (savedBm) setBookmarks(JSON.parse(savedBm));

      const savedMast = localStorage.getItem('interview_mastered');
      if (savedMast) setMasteredIds(new Set(JSON.parse(savedMast)));
    } catch (err) {
      console.error('Failed to load local storage state', err);
    }
  }, []);

  // Fetch Questions from Backend API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const [interviewsRes, settingsRes] = await Promise.all([
          api.get('/interviews'),
          api.get('/settings/github_interview_repos').catch(() => ({ data: null }))
        ]);

        if (interviewsRes.data?.success && Array.isArray(interviewsRes.data.data)) {
          setApiQuestions(interviewsRes.data.data);
        }

        if (settingsRes.data?.success && settingsRes.data.data) {
          try {
            setGithubRepos(JSON.parse(settingsRes.data.data));
          } catch (e) {
            console.error('Failed to parse github repos json', e);
          }
        }
      } catch (err) {
        console.error('Failed to fetch backend questions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Combine Built-in Questions with Backend API Questions seamlessly
  const allQuestions = useMemo(() => {
    const map = new Map();
    // Add built-ins first
    BUILTIN_INTERVIEW_QUESTIONS.forEach((q) => map.set(q._id, q));
    // Add API items (overriding if matching ID or adding new)
    apiQuestions.forEach((q) => map.set(q._id, q));
    return Array.from(map.values());
  }, [apiQuestions]);

  // Compute unique companies for filter
  const companyList = useMemo(() => {
    const companies = new Set();
    allQuestions.forEach((q) => {
      if (Array.isArray(q.companyTags)) {
        q.companyTags.forEach((c) => companies.add(c));
      }
    });
    return ['All', ...Array.from(companies).sort()];
  }, [allQuestions]);

  // Compute categories list & count
  const categoriesList = useMemo(() => {
    const catCounts = { All: allQuestions.length };
    allQuestions.forEach((q) => {
      const cat = q.category || 'General';
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });

    const uniqueCats = ['All', ...Object.keys(catCounts).filter((c) => c !== 'All')];
    return uniqueCats.map((cat) => ({
      id: cat,
      name: cat,
      count: catCounts[cat],
      Icon: CATEGORY_ICONS[cat] || BookOpen,
    }));
  }, [allQuestions]);

  // Filtered Questions List
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      // Bookmarks filter
      if (bookmarkedOnly && !bookmarks[q._id]) return false;

      // Category filter
      const matchesCategory =
        selectedCategory === 'All' || q.category.toLowerCase() === selectedCategory.toLowerCase();

      // Difficulty filter
      const matchesDifficulty =
        selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;

      // Company filter
      const matchesCompany =
        selectedCompany === 'All' ||
        (Array.isArray(q.companyTags) && q.companyTags.includes(selectedCompany));

      // Search query
      const qSearch = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !qSearch ||
        q.question.toLowerCase().includes(qSearch) ||
        q.answer.toLowerCase().includes(qSearch) ||
        q.category.toLowerCase().includes(qSearch) ||
        (q.tags && q.tags.some((t) => t.toLowerCase().includes(qSearch))) ||
        (q.companyTags && q.companyTags.some((c) => c.toLowerCase().includes(qSearch)));

      return matchesCategory && matchesDifficulty && matchesCompany && matchesSearch;
    });
  }, [allQuestions, selectedCategory, selectedDifficulty, selectedCompany, searchQuery, bookmarkedOnly, bookmarks]);

  // Auto set initial expanded ID when questions load
  useEffect(() => {
    if (filteredQuestions.length > 0 && expandedIds.size === 0) {
      setExpandedIds(new Set([filteredQuestions[0]._id]));
    }
  }, [filteredQuestions]);

  // Reset practice index when filter changes
  useEffect(() => {
    setPracticeIndex(0);
    setShowAnswer(false);
  }, [selectedCategory, selectedDifficulty, selectedCompany, searchQuery, bookmarkedOnly]);

  // Toggle Bookmark
  const toggleBookmark = (id, e) => {
    if (e) e.stopPropagation();
    setBookmarks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('interview_bookmarks', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save bookmark', err);
      }
      return next;
    });
  };

  // Toggle Mastered state in Practice Mode
  const toggleMastered = (id) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem('interview_mastered', JSON.stringify(Array.from(next)));
      } catch (err) {
        console.error('Failed to save mastered state', err);
      }
      return next;
    });
  };

  // Toggle single accordion item
  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Expand All / Collapse All
  const handleExpandAll = () => {
    if (expandedIds.size === filteredQuestions.length) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(filteredQuestions.map((q) => q._id)));
    }
  };

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareQuestion = (q, e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/interview-questions#${q._id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShareId(q._id);
    setTimeout(() => setCopiedShareId(null), 2000);
  };

  const handleRandomQuestion = () => {
    if (filteredQuestions.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    const targetQ = filteredQuestions[randomIndex];
    setExpandedIds(new Set([targetQ._id]));
    const el = document.getElementById(targetQ._id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const currentPracticeQ = filteredQuestions[practiceIndex];

  return (
    <div className="min-h-screen">
      {/* ═══ HERO BANNER ═══ */}
      <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#1E293B] overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto relative z-10 text-center"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold mb-5 shadow-sm"
          >
            <Sparkles size={14} />
            <span>Developer Interview Mastery Suite</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            Tech <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400">Interview Questions & Answers</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-muted leading-relaxed mb-8"
          >
            Curated questions, in-depth architectural answers, code examples, and practice modes for Node.js, React, JavaScript, System Design, Python, and Databases.
          </motion.p>

          {/* Quick Toolbar & Mode Switcher */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {/* View Mode Switcher */}
            <div className="bg-[#111827] p-1.5 rounded-2xl border border-line flex items-center gap-1 shadow-lg">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-[#0F6B4F] to-[#16805E] text-white shadow-md'
                    : 'text-muted hover:text-white'
                }`}
              >
                <BookOpen size={14} />
                <span>Question List</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setViewMode('practice')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'practice'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-muted hover:text-white'
                }`}
              >
                <Zap size={14} />
                <span>Practice Mode</span>
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowGithubModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#111827] border border-line text-muted hover:text-white shadow-lg transition-all hover:bg-[#1E293B]"
            >
              <GithubIcon size={14} />
              <span>GitHub Questions Repos</span>
            </motion.button>

            {/* Random Question Generator */}
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleRandomQuestion}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#1E293B] hover:bg-[#334155] border border-line text-xs font-semibold text-cyan-400 hover:text-white transition-all shadow-sm"
              title="Pick a random question"
            >
              <Shuffle size={14} />
              <span>Random Question</span>
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ═══ FILTER & CONTROLS TOOLBAR ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        {/* Search & Selectors Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6">
          {/* Search Input (5 cols) */}
          <div className="relative md:col-span-5">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by topic, question, code, or company (e.g. Event Loop, Amazon)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 input-field text-xs sm:text-sm text-white placeholder-[#94A3B8] focus:outline-none focus:border-cyan-500 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Difficulty Dropdown (2 cols) */}
          <div className="md:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2.5 input-field text-xs sm:text-sm text-heading focus:outline-none focus:border-cyan-500 transition-all"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Company Filter (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-3 py-2.5 input-field text-xs sm:text-sm text-heading focus:outline-none focus:border-cyan-500 transition-all"
            >
              <option value="All">All Companies (FAANG+)</option>
              {companyList
                .filter((c) => c !== 'All')
                .map((comp) => (
                  <option key={comp} value={comp}>
                    🏢 {comp}
                  </option>
                ))}
            </select>
          </div>

          {/* Bookmarks Toggle (2 cols) */}
          <div className="md:col-span-2 flex items-center justify-end">
            <button
              onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                bookmarkedOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'pill-inactive hover:text-heading'
              }`}
            >
              <Bookmark size={14} className={bookmarkedOnly ? 'fill-amber-400 text-amber-400' : ''} />
              <span>Saved ({Object.values(bookmarks).filter(Boolean).length})</span>
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4 mb-4 scrollbar-thin">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categoriesList.map((cat) => {
              const Icon = cat.Icon;
              const active = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                    active
                      ? 'bg-gradient-to-r from-[#0F6B4F] to-[#16805E] text-white border-cyan-400/50 font-semibold shadow-md shadow-cyan-500/10'
                      : 'pill-inactive hover:text-heading hover:bg-[#1E293B]'
                  }`}
                >
                  <Icon size={14} className={active ? 'text-white' : 'text-cyan-400'} />
                  <span>{cat.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                      active ? 'bg-white/20 text-white' : 'bg-[#1E293B] text-muted'
                    }`}
                  >
                    {cat.count}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Expand All / Collapse All Button (List View Only) */}
          {viewMode === 'list' && filteredQuestions.length > 0 && (
            <button
              onClick={handleExpandAll}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E293B] text-muted hover:text-white text-xs font-medium border border-line whitespace-nowrap"
            >
              {expandedIds.size === filteredQuestions.length ? 'Collapse All' : 'Expand All'}
            </button>
          )}
        </div>
      </section>

      {/* ═══ VIEW MODE 1: LIST / ACCORDION VIEW ═══ */}
      {viewMode === 'list' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="p-6 rounded-2xl bg-[#111827]/60 border border-line animate-pulse space-y-3"
                >
                  <div className="h-5 bg-[#1E293B] rounded w-3/4" />
                  <div className="h-4 bg-[#1E293B] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-[#111827]/40 border border-line">
              <HelpCircle size={48} className="mx-auto text-muted mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-white mb-2">No Matching Questions Found</h3>
              <p className="text-sm text-muted max-w-md mx-auto mb-6">
                We couldn't find any questions matching your current search or filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedDifficulty('All');
                  setSelectedCompany('All');
                  setSearchQuery('');
                  setBookmarkedOnly(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <motion.div layout className="space-y-4">
              {filteredQuestions.map((q, index) => {
                const isExpanded = expandedIds.has(q._id);
                const isBookmarked = !!bookmarks[q._id];

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                    key={q._id}
                    id={q._id}
                    className={`rounded-2xl transition-all duration-200 border ${
                      isExpanded
                        ? 'bg-[#111827] border-cyan-500/40 shadow-xl shadow-black/40'
                        : 'bg-[#111827]/70 border-line/70 hover:border-line hover:bg-[#111827]'
                    }`}
                  >
                    {/* Header */}
                    <div
                      onClick={() => toggleExpand(q._id)}
                      className="p-5 sm:p-6 cursor-pointer flex items-start justify-between gap-4 select-none"
                    >
                      <div className="space-y-2 flex-1">
                        {/* Badges Bar */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-muted font-bold">
                            Q{index + 1}.
                          </span>

                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                            {q.category}
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              q.difficulty === 'Easy'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : q.difficulty === 'Hard'
                                ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {q.difficulty}
                          </span>

                          {q.companyTags &&
                            q.companyTags.map((comp) => (
                              <span
                                key={comp}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20"
                              >
                                <Building2 size={11} />
                                <span>{comp}</span>
                              </span>
                            ))}
                        </div>

                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                          {q.question}
                        </h3>
                      </div>

                      {/* Right Action Icons */}
                      <div className="flex items-center gap-2 flex-shrink-0 pt-1">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          whileHover={{ scale: 1.08 }}
                          onClick={(e) => toggleBookmark(q._id, e)}
                          className={`p-2 rounded-xl border transition-all ${
                            isBookmarked
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                              : 'bg-[#1E293B]/80 hover:bg-[#1E293B] border-line text-muted hover:text-white'
                          }`}
                          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                        >
                          <Bookmark size={14} className={isBookmarked ? 'fill-amber-400' : ''} />
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          whileHover={{ scale: 1.08 }}
                          onClick={(e) => handleShareQuestion(q, e)}
                          className="p-2 rounded-xl bg-[#1E293B]/80 hover:surface-card border border-line text-muted hover:text-white transition-all"
                          title="Copy direct link to question"
                        >
                          {copiedShareId === q._id ? (
                            <Check size={14} className="text-emerald-400" />
                          ) : (
                            <Share2 size={14} />
                          )}
                        </motion.button>

                        <motion.div 
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="w-8 h-8 rounded-xl surface-card border border-line flex items-center justify-center text-muted"
                        >
                          <ChevronDown size={16} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Animated Accordion Body */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="answer-body"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-line space-y-5">
                            <div className="space-y-2">
                              <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-cyan-400 flex items-center gap-1.5">
                                <Check size={14} /> Comprehensive Answer
                              </h4>
                              <div className="text-sm text-[#CBD5E1] leading-relaxed whitespace-pre-line bg-[#0B1120]/60 p-4 rounded-xl border border-line/50">
                                {q.answer}
                              </div>
                            </div>

                            {q.codeSnippet && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-purple-400 flex items-center gap-1.5">
                                    <Code2 size={14} /> Code Example
                                  </h4>
                                  <button
                                    onClick={() => handleCopyCode(q.codeSnippet, q._id)}
                                    className="flex items-center gap-1.5 text-xs text-muted hover:text-white bg-[#1E293B] px-2.5 py-1 rounded-lg border border-line transition-all active:scale-95"
                                  >
                                    {copiedId === q._id ? (
                                      <>
                                        <Check size={13} className="text-emerald-400" />
                                        <span className="text-emerald-400">Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy size={13} />
                                        <span>Copy Code</span>
                                      </>
                                    )}
                                  </button>
                                </div>

                                <pre className="p-4 rounded-xl bg-[#090D16] border border-line font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto leading-relaxed shadow-inner">
                                  <code>{q.codeSnippet}</code>
                                </pre>
                              </div>
                            )}

                            {q.explanation && (
                              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-1">
                                <h4 className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                                  <Zap size={13} /> Key Interview Takeaway
                                </h4>
                                <p className="text-xs text-blue-200 leading-relaxed">
                                  {q.explanation}
                                </p>
                              </div>
                            )}

                            {q.tags && q.tags.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap pt-2">
                                <span className="text-[11px] text-muted">Topics:</span>
                                {q.tags.map((t) => (
                                  <span
                                    key={t}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#1E293B] text-muted border border-line"
                                  >
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>
      )}

      {/* ═══ VIEW MODE 2: INTERACTIVE PRACTICE FLASHCARDS ═══ */}
      {viewMode === 'practice' && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-[#111827]/40 border border-line">
              <HelpCircle size={48} className="mx-auto text-muted mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-white mb-2">No Questions for Practice</h3>
              <p className="text-sm text-muted max-w-md mx-auto mb-6">
                Adjust your filters or search criteria to start practicing.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Practice Progress Bar */}
              <div className="p-4 rounded-2xl bg-page border border-line space-y-2">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>
                    Question <strong className="text-white">{practiceIndex + 1}</strong> of{' '}
                    <strong className="text-white">{filteredQuestions.length}</strong>
                  </span>
                  <span>
                    Mastered:{' '}
                    <strong className="text-emerald-400">
                      {Array.from(masteredIds).filter((id) =>
                        filteredQuestions.some((q) => q._id === id)
                      ).length}
                    </strong>
                  </span>
                </div>
                <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((practiceIndex + 1) / filteredQuestions.length) * 100}%`,
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Flashcard Card */}
              <AnimatePresence mode="wait">
                {currentPracticeQ && (
                  <motion.div
                    key={currentPracticeQ._id}
                    initial={{ opacity: 0, scale: 0.95, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -16 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-cyan-500/30 shadow-2xl space-y-6 relative"
                  >
                    {/* Top Bar */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          {currentPracticeQ.category}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            currentPracticeQ.difficulty === 'Easy'
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : currentPracticeQ.difficulty === 'Hard'
                              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                              : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {currentPracticeQ.difficulty}
                        </span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleMastered(currentPracticeQ._id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                          masteredIds.has(currentPracticeQ._id)
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-[#1E293B] text-muted border-line hover:text-white'
                        }`}
                      >
                        <CheckCircle2 size={15} />
                        <span>
                          {masteredIds.has(currentPracticeQ._id) ? 'Mastered' : 'Mark as Mastered'}
                        </span>
                      </motion.button>
                    </div>

                    {/* Question */}
                    <div className="space-y-3 pt-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-muted font-bold">
                        Question #{practiceIndex + 1}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                        {currentPracticeQ.question}
                      </h2>
                    </div>

                    {/* Toggle Answer Button */}
                    <div className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAnswer(!showAnswer)}
                        className="w-full py-3 rounded-2xl bg-cyan-600/15 hover:bg-cyan-600/25 border border-cyan-500/40 text-cyan-300 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                      >
                        {showAnswer ? <EyeOff size={16} /> : <Eye size={16} />}
                        <span>{showAnswer ? 'Hide Answer' : 'Reveal Comprehensive Answer'}</span>
                      </motion.button>
                    </div>

                    {/* Answer Content */}
                    <AnimatePresence>
                      {showAnswer && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden space-y-5 pt-4 border-t border-line"
                        >
                          <div className="text-sm text-[#CBD5E1] leading-relaxed whitespace-pre-line bg-[#0B1120]/80 p-5 rounded-2xl border border-line">
                            {currentPracticeQ.answer}
                          </div>

                          {currentPracticeQ.codeSnippet && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-purple-400">
                                  Code Solution
                                </span>
                                <button
                                  onClick={() => handleCopyCode(currentPracticeQ.codeSnippet, currentPracticeQ._id)}
                                  className="text-xs text-muted hover:text-white flex items-center gap-1 active:scale-95"
                                >
                                  <Copy size={13} /> Copy
                                </button>
                              </div>
                              <pre className="p-4 rounded-xl bg-[#090D16] border border-line font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto">
                                <code>{currentPracticeQ.codeSnippet}</code>
                              </pre>
                            </div>
                          )}

                          {currentPracticeQ.explanation && (
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200">
                              <strong>💡 Key Insight:</strong> {currentPracticeQ.explanation}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Bottom Navigation Control */}
                    <div className="flex items-center justify-between pt-6 border-t border-line">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => {
                          setPracticeIndex((prev) => Math.max(0, prev - 1));
                          setShowAnswer(false);
                        }}
                        disabled={practiceIndex === 0}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] disabled:opacity-40 text-xs font-semibold text-white transition-all"
                      >
                        <ChevronLeft size={16} /> Previous
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => {
                          setPracticeIndex((prev) =>
                            Math.min(filteredQuestions.length - 1, prev + 1)
                          );
                          setShowAnswer(false);
                        }}
                        disabled={practiceIndex === filteredQuestions.length - 1}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0F6B4F] to-[#16805E] hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 text-xs font-semibold text-white transition-all shadow-md"
                      >
                        Next <ChevronRight size={16} />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </section>
      )}

      {/* GitHub Repos Modal */}
      <AnimatePresence>
        {showGithubModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowGithubModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-card border border-line rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-4 border-b border-line flex items-center justify-between bg-[#111827]">
                <div className="flex items-center gap-2 text-heading font-semibold">
                  <GithubIcon size={18} />
                  <h3>GitHub Repositories</h3>
                </div>
                <button 
                  onClick={() => setShowGithubModal(false)}
                  className="p-1.5 rounded-lg text-muted hover:bg-white/10 hover:text-white transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto space-y-3">
                {githubRepos.length === 0 ? (
                  <div className="text-center py-6 text-muted text-sm">
                    No repositories available at the moment.
                  </div>
                ) : (
                  githubRepos.map((repo, idx) => (
                    <motion.a
                      whileHover={{ x: 4 }}
                      key={idx}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-xl border border-line bg-page hover:bg-soft hover:border-[#0F6B4F]/40 transition-all group"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-heading group-hover:text-[#0F6B4F] transition-colors">{repo.title || 'GitHub Repository'}</span>
                        <span className="text-xs text-muted truncate max-w-[200px] mt-0.5">{repo.url}</span>
                      </div>
                      <ChevronRight size={16} className="text-muted group-hover:text-[#0F6B4F]" />
                    </motion.a>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
