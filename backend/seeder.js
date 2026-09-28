import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Category from './src/models/Category.js';
import Tag from './src/models/Tag.js';
import Article from './src/models/Article.js';
import InterviewQuestion from './src/models/InterviewQuestion.js';
import slugify from 'slugify';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear existing data except users
    await Article.deleteMany();
    await Category.deleteMany();
    await Tag.deleteMany();
    await InterviewQuestion.deleteMany();

    // Get an admin user to be the author
    let adminUser = await User.findOne({ role: 'ADMIN' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin Developer',
        email: 'admin@devknowledge.local',
        password: 'password123',
        role: 'ADMIN',
      });
      console.log('Created Admin User: admin@devknowledge.local / password123');
    }

    // Create Categories
    const categories = await Category.insertMany([
      { name: 'Node.js', slug: 'nodejs', description: 'Backend JavaScript runtime' },
      { name: 'React', slug: 'react', description: 'Frontend UI library' },
      { name: 'Architecture', slug: 'architecture', description: 'System design and architecture' },
      { name: 'AI Development', slug: 'ai-development', description: 'Building with AI models' }
    ]);

    // Create Tags
    const tags = await Tag.insertMany([
      { name: 'Express', slug: 'express' },
      { name: 'Authentication', slug: 'authentication' },
      { name: 'Hooks', slug: 'hooks' },
      { name: 'MongoDB', slug: 'mongodb' },
      { name: 'Prompt Engineering', slug: 'prompt-engineering' }
    ]);

    // Create Dummy Articles
    const sampleArticles = [
      {
        title: 'Understanding req.params vs req.query in Express',
        excerpt: 'A deep dive into routing parameters and query strings in Express.js and when to use which for your REST APIs.',
        content: `
# Understanding req.params vs req.query

When building REST APIs in Express.js, developers often get confused about how to extract variables from the URL.

## req.params

Route parameters are named URL segments that are used to capture the values specified at their position in the URL.

\`\`\`javascript
app.get('/users/:userId/books/:bookId', (req, res) => {
  // Access userId via: req.params.userId
  // Access bookId via: req.params.bookId
  res.send(req.params);
});
\`\`\`

## req.query

Query strings are commonly used to send data that does not dictate the route structure, such as search terms, sorting, and pagination.

\`\`\`javascript
app.get('/search', (req, res) => {
  // URL: /search?keyword=javascript&sort=asc
  console.log(req.query.keyword); // javascript
  console.log(req.query.sort); // asc
});
\`\`\`

## Summary
Use \`req.params\` to identify a specific resource or resource collection. Use \`req.query\` to sort, filter, or paginate that resource.
        `,
        coverImage: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=1000',
        category: categories[0]._id,
        tags: [tags[0]._id],
        difficulty: 'Beginner',
        status: 'Published',
        views: 124,
        likes: 34,
      },
      {
        title: 'Mastering React Custom Hooks',
        excerpt: 'Learn how to abstract complex logic into reusable React custom hooks to keep your components clean and maintainable.',
        content: `
# React Custom Hooks

Custom hooks are a mechanism to reuse stateful logic (such as setting up a subscription and remembering the current value), but every time you use a custom hook, all state and effects inside of it are fully isolated.

## Example: useWindowSize

Here is a common custom hook to track the window dimensions.

\`\`\`javascript
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
\`\`\`

Now you can use this hook in any component without rewriting the event listeners!
        `,
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000',
        category: categories[1]._id,
        tags: [tags[2]._id],
        difficulty: 'Intermediate',
        status: 'Published',
        views: 543,
        likes: 120,
      },
      {
        title: 'Integrating AI into Node.js Applications',
        excerpt: 'How to securely connect to LLMs and build autonomous AI agents using Node.js and Express.',
        content: `
# Building AI Agents with Node.js

Artificial Intelligence is taking over software development. In this guide, we'll see how to quickly interface with the OpenAI API using Node.js.

## The Setup

First, install the \`openai\` package. Ensure your API keys are stored securely in your \`.env\` file.

\`\`\`javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-4',
  });
  
  console.log(chatCompletion.choices[0].message.content);
}

main();
\`\`\`

## Security Concerns
Never expose your API key to the frontend React application. Always use a Node.js middleware layer to proxy requests to the LLM.
        `,
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
        category: categories[3]._id,
        tags: [tags[4]._id],
        difficulty: 'Advanced',
        status: 'Published',
        views: 890,
        likes: 210,
      }
    ];

    for (let articleData of sampleArticles) {
      const slug = slugify(articleData.title, { lower: true, strict: true });
      const readingTime = Math.ceil(articleData.content.split(' ').length / 200);

      await Article.create({
        ...articleData,
        slug,
        readingTime,
        author: adminUser._id,
        publishedAt: Date.now(),
      });
    }

    // Create Sample Interview Questions
    const sampleQuestions = [
      {
        question: 'What is the Event Loop in Node.js and how does it handle asynchronous I/O?',
        category: 'Node.js',
        difficulty: 'Medium',
        answer: `The Event Loop is the core mechanism in Node.js that enables non-blocking, asynchronous I/O operations despite JavaScript being single-threaded. It offloads operations to the system kernel whenever possible.

When an async operation (like file read or HTTP request) starts, Node.js hands it over to libuv or the OS kernel and continues executing JS code. Once the operation completes, its callback is pushed to the Event Queue and picked up by the Event Loop when the Call Stack is clear.`,
        codeSnippet: `const fs = require('fs');

console.log('1. Start');

fs.readFile('file.txt', 'utf8', (err, data) => {
  console.log('3. File Content Read');
});

console.log('2. End');

// Output:
// 1. Start
// 2. End
// 3. File Content Read`,
        explanation: 'Node.js uses libuv under the hood to handle thread pools and event loop queues (Timers, I/O callbacks, Idle/Prepare, Poll, Check, Close callbacks).',
        tags: ['Node.js', 'Asynchronous', 'Event Loop', 'Libuv'],
        companyTags: ['Amazon', 'Google', 'Netflix', 'Uber'],
      },
      {
        question: 'Explain the difference between Virtual DOM and Real DOM in React.',
        category: 'React',
        difficulty: 'Easy',
        answer: `The Virtual DOM (VDOM) is a lightweight, in-memory representation of the real DOM nodes. 

When a component's state changes:
1. React creates a new Virtual DOM tree.
2. React compares (diffs) the new Virtual DOM with the previous snapshot (Reconciliation algorithm).
3. React calculates the minimum necessary set of real DOM operations and updates only those specific nodes in the Real DOM (Batch rendering).`,
        codeSnippet: `// Example showing React state change triggering diffing
function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`,
        explanation: 'Manipulating the Real DOM is slow because it causes browser re-layouts and repaints. Virtual DOM batching significantly improves web application rendering performance.',
        tags: ['React', 'Virtual DOM', 'Reconciliation', 'Performance'],
        companyTags: ['Meta', 'Facebook', 'Microsoft', 'Airbnb'],
      },
      {
        question: 'What are Closures in JavaScript and how are they used in practice?',
        category: 'JavaScript',
        difficulty: 'Medium',
        answer: `A closure is a combination of a function bundled together (enclosed) with references to its surrounding state (lexical environment). In JavaScript, closures give inner functions access to an outer function's scope even after the outer function has finished executing.`,
        codeSnippet: `function createCounter() {
  let count = 0; // Private state
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2`,
        explanation: 'Closures are used for data privacy/encapsulation, currying, function factories, and maintaining state in asynchronous callbacks.',
        tags: ['JavaScript', 'Closures', 'Scope', 'Functional Programming'],
        companyTags: ['Google', 'Amazon', 'Apple', 'Microsoft'],
      },
      {
        question: 'How do you design a high-availability Microservices Architecture?',
        category: 'System Design',
        difficulty: 'Hard',
        answer: `Designing high-availability microservices requires applying key resilience and scalability principles:

1. **API Gateway & Load Balancing**: Distribute requests evenly using NGINX/Envoy or AWS ALB with health checks.
2. **Circuit Breakers**: Implement resilience patterns (e.g., Resilience4j, Hystrix) to stop cascading service failures.
3. **Database Sharding & Replication**: Primary-replica setups for read scaling and geographic distribution.
4. **Asynchronous Messaging**: Decouple communication using Apache Kafka or RabbitMQ.
5. **Observability**: Distributed tracing (Jaeger/Zipkin), metrics (Prometheus/Grafana), and centralized logging.`,
        codeSnippet: `// Circuit Breaker Concept Pseudocode
async function callServiceWithFallback(serviceFn, fallbackFn) {
  if (circuitBreaker.isOpen()) {
    return fallbackFn();
  }
  try {
    const result = await serviceFn();
    circuitBreaker.recordSuccess();
    return result;
  } catch (err) {
    circuitBreaker.recordFailure();
    return fallbackFn();
  }
}`,
        explanation: 'High availability is measured in availability SLAs (e.g. 99.99% uptime). Zero single points of failure (SPOF) is mandatory.',
        tags: ['System Design', 'Microservices', 'High Availability', 'Architecture'],
        companyTags: ['Netflix', 'Uber', 'Amazon', 'Meta'],
      },
      {
        question: 'What is Python Global Interpreter Lock (GIL) and how does it impact concurrency?',
        category: 'Python',
        difficulty: 'Medium',
        answer: `The GIL is a mutex (mutual exclusion lock) that protects access to Python objects, preventing multiple native threads from executing Python bytecodes at the same time in CPython.

While multithreading works well for I/O-bound tasks (network, file reads), CPU-bound multithreading in CPython cannot utilize multiple CPU cores concurrently. To run CPU-intensive tasks on multiple cores, use the \`multiprocessing\` module or C-extensions instead.`,
        codeSnippet: `from multiprocessing import Process

def compute_heavy(n):
    return sum(i * i for i in range(n))

if __name__ == '__main__':
    p1 = Process(target=compute_heavy, args=(10000000,))
    p2 = Process(target=compute_heavy, args=(10000000,))
    p1.start()
    p2.start()
    p1.join()
    p2.join()`,
        explanation: 'PyTorch, NumPy, and C extensions bypass the GIL during heavy numerical computations because they release the GIL inside compiled C/C++ blocks.',
        tags: ['Python', 'GIL', 'Concurrency', 'Multiprocessing'],
        companyTags: ['Google', 'Meta', 'Spotify', 'Dropbox'],
      }
    ];

    for (let qData of sampleQuestions) {
      await InterviewQuestion.create({
        ...qData,
        createdBy: adminUser._id,
      });
    }

    console.log('Dummy Data & Interview Questions Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
