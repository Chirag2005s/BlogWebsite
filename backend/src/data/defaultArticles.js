export const DEFAULT_ARTICLES = [
  {
    _id: 'art-1-internet',
    slug: 'how-does-the-internet-actually-work',
    title: 'How Does the Internet Actually Work?',
    category: { name: 'Internet & Networking', slug: 'internet-networking' },
    excerpt: 'From undersea fiber-optic cables and BGP routing to DNS resolution, TCP/IP handshakes, and TLS 1.3 encryption — demystifying the planetary network.',
    coverImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&auto=format&fit=crop&q=80',
    difficulty: 'Beginner',
    type: 'blog',
    status: 'Published',
    readingTime: 8,
    createdAt: '2026-03-15T10:00:00.000Z',
    author: {
      name: 'Dr. Elena Rostova',
      role: 'Principal Network Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    },
    likesCount: 342,
    likes: 342,
    views: 1420,
    bookmarksCount: 189,
    linkedSystem: {
      enabled: true,
      title: 'Global Subsea Fiber & BGP Topology Explorer',
      url: 'https://www.submarinecablemap.com',
      systemType: 'Interactive System Map',
      description: 'Explore live optical subsea cable telemetry and planetary routing hops.',
    },
    content: `# How Does the Internet Actually Work?

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
`
  },
  {
    _id: 'art-2-os',
    slug: 'understanding-operating-systems',
    title: 'Understanding Operating Systems: From Kernels to Processes',
    category: { name: 'Operating Systems', slug: 'operating-systems' },
    excerpt: 'Explore how the kernel arbitrates hardware, schedules threads, manages virtual memory paging, and isolates user space applications.',
    coverImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&auto=format&fit=crop&q=80',
    difficulty: 'Intermediate',
    type: 'blog',
    status: 'Published',
    readingTime: 10,
    createdAt: '2026-03-12T14:30:00.000Z',
    author: {
      name: 'Marcus Vance',
      role: 'Kernel Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
    },
    likesCount: 284,
    likes: 284,
    views: 980,
    bookmarksCount: 156,
    content: `# Understanding Operating Systems: From Kernels to Processes

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
    category: { name: 'Backend Development', slug: 'backend-development' },
    excerpt: 'Deconstructing what makes a server tick: socket lifecycle, non-blocking I/O event loops, reverse proxies, and horizontal load balancing.',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    difficulty: 'Intermediate',
    type: 'blog',
    status: 'Published',
    readingTime: 7,
    createdAt: '2026-03-08T09:15:00.000Z',
    author: {
      name: 'Chirag Visvakarma',
      role: 'Lead Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
    },
    likesCount: 412,
    likes: 412,
    views: 1850,
    bookmarksCount: 230,
    content: `# How Servers Work: Architecture, Protocols & Scaling

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
`
  },
  {
    _id: 'art-4-semiconductors',
    slug: 'introduction-to-semiconductor-technology',
    title: 'Introduction to Semiconductor Technology: From Silicon to Transistors',
    category: { name: 'Hardware', slug: 'hardware' },
    excerpt: 'Uncover the nanometer physics of silicon ingots, EUV photolithography, FinFET structures, and Gate-All-Around (GAA) nanosheets.',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    difficulty: 'Advanced',
    type: 'blog',
    status: 'Published',
    readingTime: 12,
    createdAt: '2026-03-02T16:45:00.000Z',
    author: {
      name: 'Dr. Arthur Sterling',
      role: 'Semiconductor Physicist',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
    },
    likesCount: 198,
    likes: 198,
    views: 740,
    bookmarksCount: 112,
    content: `# Introduction to Semiconductor Technology: From Silicon to Transistors

Modern microprocessors pack over 100 billion transistors into a chip no larger than a postage stamp. To understand software at its fundamental limit, developers must understand the marvel of modern semiconductor manufacturing.

---

## 1. What Is a Semiconductor?

A semiconductor is a material whose electrical conductivity falls between an insulator (like glass) and a conductor (like copper).

Silicon is an element with 4 valence electrons in its outer shell. In its pure crystalline state, electrons are locked in covalent bonds. By introducing microscopic impurities—a process known as **doping**—we alter its conductive properties:
- **N-Type (Negative)**: Doped with Phosphorus (5 valence electrons), yielding excess free electrons.
- **P-Type (Positive)**: Doped with Boron (3 valence electrons), creating "holes" that accept electrons.
`
  },
  {
    _id: 'art-5-cs-fundamentals',
    slug: 'computer-science-fundamentals-every-developer-should-know',
    title: 'Computer Science Fundamentals Every Developer Should Know',
    category: { name: 'Computer Science', slug: 'computer-science' },
    excerpt: 'The timeless mental models of software engineering: asymptotic complexity (Big-O), memory hierarchy, trees, graphs, and concurrency.',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    difficulty: 'Intermediate',
    type: 'blog',
    status: 'Published',
    readingTime: 11,
    createdAt: '2026-02-26T11:20:00.000Z',
    author: {
      name: 'Sofia Chen',
      role: 'Staff Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
    },
    likesCount: 512,
    likes: 512,
    views: 2310,
    bookmarksCount: 310,
    content: `# Computer Science Fundamentals Every Developer Should Know

Languages and frameworks change every 3 years, but core computer science principles remain constant over decades. Mastering these fundamentals transforms you from someone who merely glues libraries together into an engineer who understands system boundaries and trade-offs.

---

## 1. Asymptotic Complexity & Big-O Notation

Big-O measures how algorithm execution time or memory footprint scales as input size $N$ approaches infinity:

| Notation | Complexity Name | Typical Example | Practical Boundary |
| :--- | :--- | :--- | :--- |
| **$O(1)$** | Constant | Hash map lookup, array indexing | Instantaneous |
| **$O(\\log N)$** | Logarithmic | Binary search, balanced BST search | 1 billion items in ~30 operations |
| **$O(N)$** | Linear | Single loop pass, unsorted array scan | Predictable, scales with input |
| **$O(N \\log N)$** | Linearithmic | Merge sort, Quicksort (average) | Optimal comparison sort |
| **$O(N^2)$** | Quadratic | Nested loops, bubble sort | Unacceptable for large $N$ |
`
  },
  {
    _id: 'art-6-nodejs-interview',
    slug: 'nodejs-interview-questions',
    title: 'Node.js Interview Questions & Architecture Deep Dive',
    category: { name: 'Backend Development', slug: 'backend-development' },
    excerpt: 'Master tricky Node.js interview topics: the libuv event loop phases, microtasks vs macrotasks, streams, clustering, and memory leaks.',
    coverImage: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&auto=format&fit=crop&q=80',
    difficulty: 'Intermediate',
    type: 'blog',
    status: 'Published',
    readingTime: 9,
    createdAt: '2026-02-20T08:00:00.000Z',
    author: {
      name: 'James Thornton',
      role: 'Principal Backend Engineer',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'
    },
    likesCount: 320,
    likes: 320,
    views: 1190,
    bookmarksCount: 204,
    content: `# Node.js Interview Questions & Architecture Deep Dive

Node.js powers critical backend infrastructure at Netflix, LinkedIn, and Uber. Mastering its internals prepares you for senior systems design discussions.

---

## 1. The Libuv Event Loop Phases

Node.js executes JavaScript on a single thread via Google V8, but offloads asynchronous I/O to **libuv**'s multi-threaded thread pool.

Each iteration (tick) of the event loop passes through 6 strict FIFO queues:
1. **Timers**: Executes callbacks scheduled by \`setTimeout()\` and \`setInterval()\`.
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration.
3. **Idle, Prepare**: Used internally by libuv only.
4. **Poll**: Retrieves new I/O events; executes almost all callbacks (file I/O, network sockets).
5. **Check**: Executes \`setImmediate()\` callbacks.
6. **Close Callbacks**: Executes close events, e.g. \`socket.on('close', ...)\`.
`
  },
  {
    _id: '6abdd917aec03e97beee1e37',
    slug: 'gemini-4-argon-our-next-era-of-frontier-intelligence',
    title: 'Gemini 4 Argon: our next era of frontier intelligence',
    type: 'article',
    status: 'Published',
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
    likes: 890,
    views: 3450,
    bookmarksCount: 420,
    linkedSystem: {
      enabled: true,
      title: 'Google DeepMind Frontier Intelligence System Console',
      url: 'https://deepmind.google/technologies/gemini/',
      systemType: 'Frontier AI System',
      description: 'Access the official Gemini multimodal architecture benchmarks and live model console.',
    },
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
    status: 'Published',
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
    likes: 654,
    views: 2890,
    bookmarksCount: 290,
    linkedSystem: {
      enabled: true,
      title: 'Autonomous Multi-Agent Architecture Sandbox',
      url: '/problemhub',
      systemType: 'Interactive Code System',
      description: 'Launch the code execution sandbox and test multi-agent reasoning loops in real time.',
    },
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
