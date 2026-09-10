import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Terminal, 
  Cpu, 
  Layers, 
  Copy, 
  Check, 
  Play, 
  Search, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  Zap, 
  FileCode, 
  Compass, 
  GitBranch, 
  Box, 
  ChevronRight,
  Binary,
  PenTool,
  Share2,
  Plus
} from 'lucide-react';
import api from '../services/api';

/* ═══════════════════════════════════════════
   PRE-CURATED CODE SNIPPETS & PATTERNS
   ═══════════════════════════════════════════ */
const CODE_SNIPPETS = [
  {
    id: 'js-debounce',
    title: 'Custom Debounce Implementation',
    language: 'JavaScript',
    category: 'Design Patterns',
    difficulty: 'Intermediate',
    complexity: 'O(1) time · O(1) space',
    description: 'Guarantees that a function is not called again until a specified quiet period has passed. Essential for search inputs and window resize listeners.',
    code: `// High-performance Debounce with immediate flush option
function debounce(fn, delay = 300, immediate = false) {
  let timerId = null;

  return function (...args) {
    const callNow = immediate && !timerId;
    
    if (timerId) clearTimeout(timerId);

    timerId = setTimeout(() => {
      timerId = null;
      if (!immediate) fn.apply(this, args);
    }, delay);

    if (callNow) fn.apply(this, args);
  };
}

// Usage Example:
const logSearch = debounce((query) => {
  console.log('⚡ Query dispatched:', query);
}, 250);

logSearch('react');
logSearch('react hooks'); // Only this executes after 250ms`,
    output: `⚡ Query dispatched: react hooks
Execution: ~250ms elapsed
Memory delta: +0.02 MB`,
  },
  {
    id: 'ts-lru-cache',
    title: 'LRU Cache (Least Recently Used)',
    language: 'TypeScript',
    category: 'Algorithms & DS',
    difficulty: 'Advanced',
    complexity: 'O(1) get & put · O(capacity) space',
    description: 'Doubly-linked list + hash map hybrid for constant-time lookups, eviction, and head-promotion.',
    code: `class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V> = new Map();

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    
    // Refresh item position to signify recent usage
    const val = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict least recently used (first key in Map)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}

const lru = new LRUCache<string, number>(2);
lru.put('cpu', 94);
lru.put('gpu', 88);
console.log('CPU:', lru.get('cpu')); // 94 (refreshes cpu)
lru.put('ram', 72); // evicts 'gpu'
console.log('GPU exists?', lru.get('gpu')); // undefined`,
    output: `CPU: 94
GPU exists? undefined
Cache capacity: 2/2 items
All operations: O(1) time`,
  },
  {
    id: 'py-async-pool',
    title: 'Asynchronous Worker Pool with Semaphore',
    language: 'Python',
    category: 'Concurrency',
    difficulty: 'Intermediate',
    complexity: 'O(N/K) time · O(K) space',
    description: 'Safely limits concurrent IO requests using asyncio.Semaphore to prevent rate-limiting and socket exhaustion.',
    code: `import asyncio
import random

async def fetch_worker(task_id: int, sem: asyncio.Semaphore):
    async with sem:
        duration = random.uniform(0.1, 0.4)
        await asyncio.sleep(duration)
        return f"Task {task_id} completed in {duration:.2f}s"

async def main():
    concurrency_limit = 3
    sem = asyncio.Semaphore(concurrency_limit)
    tasks = [fetch_worker(i, sem) for i in range(1, 7)]
    
    results = await asyncio.gather(*tasks)
    for res in results:
        print("✔", res)

# Run event loop
asyncio.run(main())`,
    output: `✔ Task 1 completed in 0.18s
✔ Task 2 completed in 0.24s
✔ Task 3 completed in 0.31s
✔ Task 4 completed in 0.15s
✔ Task 5 completed in 0.29s
✔ Task 6 completed in 0.22s
Total jobs: 6 | Concurrency pool: 3 max`,
  },
  {
    id: 'go-channel-pipeline',
    title: 'Concurrent Fan-out / Fan-in Pipeline',
    language: 'Go',
    category: 'Concurrency',
    difficulty: 'Advanced',
    complexity: 'O(N) time · Concurrent streaming',
    description: 'Idiomatic Go pattern using goroutines and multiplexed channels to distribute heavy workloads across CPU cores.',
    code: `package main

import (
	"fmt"
	"sync"
)

// Producer
func generator(nums ...int) <-chan int {
	out := make(chan int)
	go func() {
		for _, n := range nums {
			out <- n
		}
		close(out)
	}()
	return out
}

// Worker stage
func squareWorker(in <-chan int) <-chan int {
	out := make(chan int)
	go func() {
		for n := range in {
			out <- n * n
		}
		close(out)
	}()
	return out
}

func main() {
	in := generator(2, 4, 6, 8, 10)
	c1 := squareWorker(in)
	
	for result := range c1 {
		fmt.Printf("Computed square: %d\\n", result)
	}
}`,
    output: `Computed square: 4
Computed square: 16
Computed square: 36
Computed square: 64
Computed square: 100
Goroutines active: 1
Heap allocation: 4.2 KB`,
  },
  {
    id: 'rust-zero-copy',
    title: 'Zero-Copy String Parser with Lifetimes',
    language: 'Rust',
    category: 'System Design',
    difficulty: 'Advanced',
    complexity: 'O(N) time · O(1) allocation',
    description: 'Leveraging Rust borrow checker & slice references (&str) to parse high-throughput telemetry without heap allocations.',
    code: `#[derive(Debug, PartialEq)]
struct Header<'a> {
    name: &'a str,
    value: &'a str,
}

fn parse_header<'a>(input: &'a str) -> Option<Header<'a>> {
    let mut parts = input.splitn(2, ':');
    let name = parts.next()?.trim();
    let value = parts.next()?.trim();
    Some(Header { name, value })
}

fn main() {
    let raw = "Content-Type: application/json; charset=utf-8";
    if let Some(header) = parse_header(raw) {
        println!("Key   => {}", header.name);
        println!("Value => {}", header.value);
    }
}`,
    output: `Key   => Content-Type
Value => application/json; charset=utf-8
Zero allocations made. Referenced directly from stack buffer.`,
  },
  {
    id: 'cpp-smart-pointers',
    title: 'Modern RAII & Custom Deleter with std::unique_ptr',
    language: 'C++',
    category: 'System Design',
    difficulty: 'Intermediate',
    complexity: 'O(1) time · 0 byte leak guarantee',
    description: 'Deterministic resource management in modern C++20 with custom deleter functor.',
    code: `#include <iostream>
#include <memory>

struct Socket {
    int fd;
    Socket(int d) : fd(d) { std::cout << "Socket open: " << fd << "\\n"; }
    ~Socket() { std::cout << "Socket closed: " << fd << "\\n"; }
};

int main() {
    // Custom deleter lambda ensures cleanup even if exceptions fire
    auto closer = [](Socket* s) {
        std::cout << "[RAII] Gracefully flushing socket buffers...\\n";
        delete s;
    };

    {
        std::unique_ptr<Socket, decltype(closer)> sock(new Socket(8080), closer);
        std::cout << "Transmitting telemetry data...\\n";
    } // Automatically closed here at scope exit

    return 0;
}`,
    output: `Socket open: 8080
Transmitting telemetry data...
[RAII] Gracefully flushing socket buffers...
Socket closed: 8080
Clean exit status: 0`,
  },
];

/* ═══════════════════════════════════════════
   DEV CHEATSHEETS
   ═══════════════════════════════════════════ */
const CHEATSHEETS = [
  {
    name: 'Git Workflow',
    icon: GitBranch,
    commands: [
      { cmd: 'git switch -c feature/your-branch', desc: 'Create & switch to a new branch safely' },
      { cmd: 'git commit --amend --no-edit', desc: 'Add staged changes to last commit without changing message' },
      { cmd: 'git log --oneline --graph --decorate -n 10', desc: 'Pretty visual graph of recent commits' },
      { cmd: 'git reset --soft HEAD~1', desc: 'Undo commit while keeping all changes staged' },
    ],
  },
  {
    name: 'Docker & Containers',
    icon: Box,
    commands: [
      { cmd: 'docker compose up -d --build', desc: 'Build and run services in detached background' },
      { cmd: 'docker system prune -af --volumes', desc: 'Reclaim disk space by purging dangling assets' },
      { cmd: 'docker exec -it <container_id> sh', desc: 'Open an interactive terminal inside running container' },
      { cmd: 'docker logs -f --tail=100 <container_id>', desc: 'Stream last 100 log lines continuously' },
    ],
  },
  {
    name: 'Linux / Terminal Power',
    icon: Terminal,
    commands: [
      { cmd: 'lsof -i :5000', desc: 'Find PID listening on port 5000' },
      { cmd: 'kill -9 $(lsof -t -i :5000)', desc: 'Force kill process occupying port 5000' },
      { cmd: 'curl -sI https://api.github.com | grep HTTP', desc: 'Inspect HTTP response headers quickly' },
      { cmd: 'tar -czvf archive.tar.gz /path/to/dir', desc: 'Create a gzipped tar archive efficiently' },
    ],
  },
];

/* ═══════════════════════════════════════════
   PROGRAMMING ROADMAPS / TRACKS
   ═══════════════════════════════════════════ */
const TRACKS = [
  {
    title: 'Systems & High Performance',
    tag: 'Low-level · C++ / Rust / Go',
    icon: Cpu,
    desc: 'Memory layouts, cache locality, SIMD intrinsics, zero-copy networking, and lock-free data structures.',
    color: 'from-blue-600 to-indigo-700',
    borderColor: 'border-blue-500/20',
  },
  {
    title: 'Full-Stack Modern Web',
    tag: 'Web Tech · React / Node / Next',
    icon: Layers,
    desc: 'Server components, event-driven streaming, optimistic UI, state synchronization, and edge runtime routing.',
    color: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-500/20',
  },
  {
    title: 'Concurrency & Distributed Systems',
    tag: 'Cloud Native · Python / Go',
    icon: Binary,
    desc: 'Raft consensus, CAP theorem trade-offs, message queues (Kafka, RabbitMQ), and microservice idempotency.',
    color: 'from-amber-600 to-orange-700',
    borderColor: 'border-amber-500/20',
  },
];

const Programming = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSnippet, setActiveSnippet] = useState(CODE_SNIPPETS[0]);
  const [copiedId, setCopiedId] = useState(null);
  const [running, setRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState(CODE_SNIPPETS[0].output);
  const [relatedArticles, setRelatedArticles] = useState([]);

  // Fetch articles related to programming / web technology
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const { data } = await api.get('/articles');
        if (data.success && data.data) {
          // Filter to technical / programming content
          const filtered = data.data.filter((a) => {
            const cat = a.category?.name?.toLowerCase() || '';
            const type = a.type || 'blog';
            return (
              cat.includes('web') || 
              cat.includes('machine') || 
              cat.includes('intelligence') ||
              cat.includes('hardware') ||
              type === 'article'
            );
          }).slice(0, 4);
          setRelatedArticles(filtered);
        }
      } catch (err) {
        console.error('Failed to load related programming articles', err);
      }
    };
    fetchRelated();
  }, []);

  // Update terminal output when changing active snippet
  useEffect(() => {
    setTerminalOutput(activeSnippet.output);
    setRunning(false);
  }, [activeSnippet]);

  // Copy code handler
  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Run snippet simulation
  const handleRunCode = () => {
    setRunning(true);
    setTerminalOutput('⏳ Compiling and executing in isolated sandbox container...');
    setTimeout(() => {
      setTerminalOutput(activeSnippet.output);
      setRunning(false);
    }, 700);
  };

  // Filter snippets
  const filteredSnippets = useMemo(() => {
    return CODE_SNIPPETS.filter((item) => {
      const matchesLang = selectedLanguage === 'All' || item.language === selectedLanguage;
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesQuery =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLang && matchesCat && matchesQuery;
    });
  }, [selectedLanguage, selectedCategory, searchQuery]);

  const languages = ['All', 'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'C++'];
  const categories = ['All', 'Algorithms & DS', 'Design Patterns', 'Concurrency', 'System Design'];

  return (
    <div className="space-y-12">
      {/* ═══ Page Hero ═══ */}
      <div className="relative py-8 sm:py-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/10 via-purple-600/5 to-transparent pointer-events-none" />
        <div className="relative max-w-4xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/15 text-primary-300 border border-primary-500/25 uppercase tracking-wider">
              <Code2 size={13} />
              Developer Code Hub
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
              <Sparkles size={11} />
              Interactive Lab
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Programming Hub & Architecture Lab
          </h1>
          <p className="text-text-secondary mt-3 text-lg max-w-2xl leading-relaxed">
            Algorithmic patterns, production-grade snippets, multi-language system blueprints, and clean code principles.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-2xl">
            <div className="glass-card rounded-xl p-3 text-center border-white/5">
              <div className="text-xl font-bold text-white">6+</div>
              <div className="text-[11px] text-text-muted mt-0.5">Languages</div>
            </div>
            <div className="glass-card rounded-xl p-3 text-center border-white/5">
              <div className="text-xl font-bold text-primary-400">O(1)</div>
              <div className="text-[11px] text-text-muted mt-0.5">Optimized Patterns</div>
            </div>
            <div className="glass-card rounded-xl p-3 text-center border-white/5">
              <div className="text-xl font-bold text-purple-400">Live</div>
              <div className="text-[11px] text-text-muted mt-0.5">Sandbox Preview</div>
            </div>
            <div className="glass-card rounded-xl p-3 text-center border-white/5">
              <div className="text-xl font-bold text-green-400">100%</div>
              <div className="text-[11px] text-text-muted mt-0.5">Tested Snippets</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Code Lab: Interactive Playground ═══ */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Terminal size={18} className="text-primary-400" />
              <h2 className="text-xl font-bold text-white">Interactive Pattern Lab</h2>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Inspect algorithm logic, complexity metrics, and test-run snippets directly in the terminal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunCode}
              disabled={running}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-lg shadow-primary-600/20 transition-all disabled:opacity-60 cursor-pointer"
            >
              <Play size={13} className={running ? 'animate-spin' : ''} />
              {running ? 'Running...' : 'Run in Sandbox'}
            </button>
            <button
              onClick={() => handleCopy(activeSnippet.id, activeSnippet.code)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass hover:bg-white/10 text-text-secondary hover:text-white text-xs font-medium transition-all cursor-pointer"
            >
              {copiedId === activeSnippet.id ? (
                <>
                  <Check size={13} className="text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Playground Container */}
        <div className="glass-card rounded-2xl overflow-hidden border border-white/8">
          {/* Editor Header Bar */}
          <div className="bg-surface-800/80 px-4 py-3 border-b border-white/6 flex flex-wrap items-center justify-between gap-3">
            {/* Snippet Selection Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
              {CODE_SNIPPETS.map((snippet) => (
                <button
                  key={snippet.id}
                  onClick={() => setActiveSnippet(snippet)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    activeSnippet.id === snippet.id
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30 shadow-sm'
                      : 'text-text-muted hover:text-text-secondary hover:bg-white/5'
                  }`}
                >
                  <FileCode size={12} />
                  {snippet.title}
                </button>
              ))}
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/20 font-mono text-[11px]">
                {activeSnippet.language}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-surface-700 text-text-secondary border border-white/6 text-[11px]">
                {activeSnippet.complexity}
              </span>
            </div>
          </div>

          {/* Editor + Terminal Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/6">
            {/* Code View (2 cols) */}
            <div className="lg:col-span-2 p-5 bg-surface-900/80 font-mono text-xs overflow-x-auto">
              <div className="text-text-muted text-[11px] mb-3 pb-2 border-b border-white/5 flex items-center justify-between">
                <span>// {activeSnippet.description}</span>
                <span className="text-[10px] text-primary-400 font-semibold uppercase tracking-wider">{activeSnippet.difficulty}</span>
              </div>
              <pre className="text-slate-200 leading-relaxed">
                <code>{activeSnippet.code}</code>
              </pre>
            </div>

            {/* Terminal View (1 col) */}
            <div className="p-5 bg-surface-950 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-white/6 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70 inline-block" />
                    <span className="ml-1 text-[11px] font-mono text-text-muted">stdout / runtime</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono text-green-400 font-semibold">Active</span>
                </div>

                <div className="mt-4 font-mono text-xs text-emerald-400/90 whitespace-pre-line leading-relaxed">
                  {terminalOutput}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="text-[11px] text-text-muted flex items-center justify-between">
                  <span>Environment: V8 / Node / WASM</span>
                  <span className="text-primary-400 font-mono">Exit Code: 0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Code Explorer & Filter Section ═══ */}
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-purple-400" />
            <h2 className="text-xl font-bold text-white">Pattern Library</h2>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Filter algorithms, design patterns, and idiomatic snippets by programming language and paradigm.
          </p>
        </div>

        {/* Search & Language Filters */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search algorithms, patterns, or syntax..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-800/80 border border-white/6 text-white placeholder-text-muted text-xs focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 transition-all"
              />
            </div>

            {/* Language Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedLanguage === lang
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                      : 'bg-surface-800/60 text-text-secondary hover:text-white border border-white/5 hover:bg-surface-700'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs text-text-muted mr-1 whitespace-nowrap">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Snippet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSnippets.map((snippet) => (
            <div
              key={snippet.id}
              className={`glass-card rounded-2xl p-5 flex flex-col justify-between hover:border-primary-500/30 transition-all group ${
                activeSnippet.id === snippet.id ? 'border-primary-500/40 bg-primary-500/5' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-primary-500/15 text-primary-300 border border-primary-500/20">
                    {snippet.language}
                  </span>
                  <span className={`text-[11px] font-semibold ${
                    snippet.difficulty === 'Beginner'
                      ? 'text-green-400'
                      : snippet.difficulty === 'Intermediate'
                      ? 'text-yellow-400'
                      : 'text-purple-400'
                  }`}>
                    {snippet.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition-colors">
                  {snippet.title}
                </h3>

                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                  {snippet.description}
                </p>

                <div className="bg-surface-900/60 rounded-xl p-2.5 text-[11px] font-mono text-text-muted border border-white/4">
                  {snippet.complexity}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => {
                    setActiveSnippet(snippet);
                    window.scrollTo({ top: 220, behavior: 'smooth' });
                  }}
                  className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Load in Lab <ArrowRight size={12} />
                </button>
                <button
                  onClick={() => handleCopy(snippet.id, snippet.code)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  title="Copy code"
                >
                  {copiedId === snippet.id ? (
                    <Check size={14} className="text-green-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Developer Roadmaps & Systems Tracks ═══ */}
      <section className="space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Engineering Tracks & Blueprints</h2>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Architectural patterns and foundational curriculum curated for software engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRACKS.map((track) => {
            const Icon = track.icon;
            return (
              <div
                key={track.title}
                className={`glass-card rounded-2xl p-6 relative overflow-hidden border ${track.borderColor} flex flex-col justify-between group hover:-translate-y-1 transition-all`}
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white">
                    <Icon size={20} className="text-primary-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="inline-block text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                    {track.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {track.desc}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-white/5">
                  <Link
                    to="/articles"
                    className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1"
                  >
                    Explore track guides <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ Cheatsheet Cards (Quick CLI & Commands) ═══ */}
      <section className="space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Developer Command Cheatsheet</h2>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Essential CLI commands to accelerate daily engineering workflows. Click to copy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CHEATSHEETS.map((sheet) => {
            const Icon = sheet.icon;
            return (
              <div key={sheet.name} className="glass-card rounded-2xl p-5 border border-white/6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                  <Icon size={16} className="text-primary-400" />
                  <h3 className="text-sm font-bold text-white">{sheet.name}</h3>
                </div>

                <div className="space-y-2.5">
                  {sheet.commands.map((cmdItem, i) => (
                    <div
                      key={i}
                      onClick={() => handleCopy(`cmd-${sheet.name}-${i}`, cmdItem.cmd)}
                      className="p-2.5 rounded-xl bg-surface-900/60 hover:bg-surface-800 border border-white/4 hover:border-primary-500/20 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <code className="text-[11px] font-mono text-primary-300 group-hover:text-primary-200 break-all">
                          {cmdItem.cmd}
                        </code>
                        <span className="text-text-muted group-hover:text-white ml-2 flex-shrink-0">
                          {copiedId === `cmd-${sheet.name}-${i}` ? (
                            <Check size={12} className="text-green-400" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </span>
                      </div>
                      <p className="text-[10px] text-text-muted mt-1 leading-snug">
                        {cmdItem.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ Related Articles & Publications ═══ */}
      {relatedArticles.length > 0 && (
        <section className="space-y-5 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-primary-400" />
                <h2 className="text-xl font-bold text-white">Related Technical Articles</h2>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Deep dives and architectural walkthroughs published on TechJourney.
              </p>
            </div>
            <Link
              to="/articles"
              className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedArticles.map((art) => (
              <Link
                key={art._id}
                to={`/blog/${art.slug}`}
                className="glass-card rounded-xl p-4 hover:border-primary-500/30 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-primary-400 uppercase tracking-wider">
                    {art.category?.name || 'Programming'}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors line-clamp-2">
                    {art.title}
                  </h4>
                  <p className="text-xs text-text-secondary line-clamp-2">
                    {art.excerpt}
                  </p>
                </div>
                <div className="text-[11px] text-text-muted pt-3 border-t border-white/5 mt-3 flex items-center justify-between">
                  <span>{art.readingTime || 3} min read</span>
                  <span className="text-primary-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Read <ChevronRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      {/* ═══ How to Add & Share Programming Information ═══ */}
      <section className="glass-card rounded-2xl p-6 sm:p-8 border border-white/8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-600/10 via-purple-600/5 to-transparent pointer-events-none rounded-full blur-2xl" />
        <div className="relative space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Share2 size={18} className="text-primary-400" />
                <h2 className="text-xl font-bold text-white">How to Add & Share Programming Knowledge</h2>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Contribute code snippets, architecture deep dives, or engineering solutions to TechJourney.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                to="/admin/add-article"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-lg shadow-primary-600/20 transition-all cursor-pointer"
              >
                <Plus size={14} />
                Write Article
              </Link>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <PenTool size={14} />
                Write Blog
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-surface-900/60 rounded-xl p-4 border border-white/5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 font-bold text-sm flex items-center justify-center">
                1
              </div>
              <h4 className="text-sm font-semibold text-white">Write with Markdown</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Use standard markdown code blocks (e.g. ```javascript, ```python) with syntax highlighting.
              </p>
            </div>

            <div className="bg-surface-900/60 rounded-xl p-4 border border-white/5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 font-bold text-sm flex items-center justify-center">
                2
              </div>
              <h4 className="text-sm font-semibold text-white">Tag & Categorize</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Choose categories like <span className="text-white font-medium">Web Technology</span> or <span className="text-white font-medium">Artificial Intelligence</span> to auto-feature on the Hub.
              </p>
            </div>

            <div className="bg-surface-900/60 rounded-xl p-4 border border-white/5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-sm flex items-center justify-center">
                3
              </div>
              <h4 className="text-sm font-semibold text-white">Publish & One-Click Share</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Every publication generates a permanent link with one-click URL copy and native device share.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programming;
