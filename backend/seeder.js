import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Category from './src/models/Category.js';
import Tag from './src/models/Tag.js';
import Article from './src/models/Article.js';
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

    console.log('Dummy Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
