import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../src/models/Problem.js';
import Solution from '../src/models/Solution.js';
import User from '../src/models/User.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const chirag = await User.findOne({ email: 'chirag@gmail.com' });
  const mukesh = await User.findOne({ email: 'mukesh@gmail.com' });

  if (!chirag || !mukesh) {
    console.log('Users not found');
    process.exit(1);
  }

  // Clear existing problems/solutions for clean state
  await Problem.deleteMany({});
  await Solution.deleteMany({});

  // 1. Chirag creates a problem
  const prob1 = await Problem.create({
    title: 'Two Sum in JavaScript',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    category: 'DSA',
    difficulty: 'Easy',
    language: 'JavaScript',
    type: 'Standard',
    tags: ['array', 'hashmap', 'easy'],
    creator: chirag._id,
    starterCode: 'function twoSum(nums, target) {\n  // your code\n}',
    solutionsCount: 1,
    views: 12,
    likes: 3,
    isSolved: true
  });

  // 2. Chirag creates a second problem
  const prob2 = await Problem.create({
    title: 'Fix Memory Leak in Node.js Event Listener',
    description: 'A long-running EventEmitter listener is not being cleaned up properly on connection close.',
    category: 'Node.js',
    difficulty: 'Medium',
    language: 'Node.js',
    type: 'Debug Challenge',
    tags: ['nodejs', 'memory', 'events'],
    creator: chirag._id,
    starterCode: 'server.on("connection", socket => { ... })',
    solutionsCount: 0,
    views: 5,
    likes: 1,
    isSolved: false
  });

  // 3. Mukesh creates a problem
  const prob3 = await Problem.create({
    title: 'Reverse a Linked List',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    category: 'DSA',
    difficulty: 'Easy',
    language: 'JavaScript',
    type: 'Standard',
    tags: ['linkedlist', 'pointers'],
    creator: mukesh._id,
    starterCode: 'function reverseList(head) {\n}',
    solutionsCount: 1,
    views: 8,
    likes: 2,
    isSolved: true
  });

  // 4. Chirag submits a solution to Mukesh's problem (prob3), which Mukesh accepts!
  const sol1 = await Solution.create({
    problemId: prob3._id,
    user: chirag._id,
    language: 'JavaScript',
    code: 'function reverseList(head) {\n  let prev = null;\n  let curr = head;\n  while (curr) {\n    let next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}',
    explanation: 'Iterative approach in O(n) time and O(1) space complexity.',
    isAccepted: true,
    likes: 4
  });
  prob3.acceptedSolution = sol1._id;
  await prob3.save();

  // 5. Mukesh submits a solution to Chirag's problem (prob1), which Chirag accepts!
  const sol2 = await Solution.create({
    problemId: prob1._id,
    user: mukesh._id,
    language: 'JavaScript',
    code: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n}',
    explanation: 'Single pass using Hash Map for O(n) lookup.',
    isAccepted: true,
    likes: 5
  });
  prob1.acceptedSolution = sol2._id;
  await prob1.save();

  console.log('Seeded sample problems and solutions successfully!');
  console.log('Chirag posted:', 2, 'solved:', 1, 'accepted:', 1);
  console.log('Mukesh posted:', 1, 'solved:', 1, 'accepted:', 1);

  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
