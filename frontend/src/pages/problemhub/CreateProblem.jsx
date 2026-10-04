import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Code2, 
  Bug, 
  Send, 
  AlertCircle, 
  Info, 
  Loader2,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Sparkles,
  FileUp,
  FileText,
  X,
  Check,
  RotateCcw,
  HelpCircle,
  Terminal
} from 'lucide-react';
import api from '../../services/api';

const DRAFT_STORAGE_KEY = 'techjourney_problem_hub_draft';

const POPULAR_TAGS = [
  'Algorithms', 'Two Pointers', 'Binary Search', 'Dynamic Programming',
  'Arrays', 'Strings', 'Async/Await', 'React Hooks', 'Express.js', 'Recursion'
];

const SAMPLE_ALGORITHM = {
  title: 'Two Sum II - Sorted Array Pointer Search',
  description: 'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.',
  category: 'Algorithms',
  difficulty: 'Medium',
  language: 'JavaScript',
  type: 'Standard',
  tags: ['Algorithms', 'Two Pointers', 'Arrays', 'Binary Search'],
  inputFormat: 'numbers: number[], target: number',
  outputFormat: 'number[]: 1-indexed indices [index1, index2]',
  constraints: '2 <= numbers.length <= 3 * 10^4\n-1000 <= numbers[i] <= 1000\nnumbers is sorted in non-decreasing order.',
  exampleInput: 'numbers = [2, 7, 11, 15], target = 9',
  exampleOutput: '[1, 2]',
  starterCode: `/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
function twoSum(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [-1, -1];
}`
};

const SAMPLE_DEBUG_CHALLENGE = {
  title: 'Fix Async State Race Condition in Node.js Cache',
  description: 'The cache manager middleware occasionally returns stale data or null when multiple concurrent requests hit the fetchOrUpdate routine.',
  category: 'Backend',
  difficulty: 'Hard',
  language: 'Node.js',
  type: 'Debug Challenge',
  tags: ['Async/Await', 'Express.js', 'Concurrency'],
  expectedBehavior: 'All concurrent requests for the same cache key should await the single ongoing fetch and receive valid updated data without cache miss collisions.',
  currentBehavior: 'Under heavy load, multiple identical fetch operations fire simultaneously, causing a race condition and returning null to secondary requesters.',
  exampleInput: 'GET /api/data?key=user_metrics (concurrent x 10)',
  exampleOutput: 'Status: 200 { source: "cache", data: {...} } on subsequent requests',
  starterCode: `const memoryCache = new Map();

async function getCachedData(key, fetchFn) {
  // BUG: Missing synchronization for concurrent in-flight requests
  if (memoryCache.has(key)) {
    return memoryCache.get(key);
  }

  const result = await fetchFn();
  memoryCache.set(key, result);
  return result;
}

module.exports = { getCachedData };`
};

const SAMPLE_PSEUDOCODE = `ALGORITHM BinarySearch(array, target):
  INPUT: Sorted array of integers, target integer to find
  OUTPUT: Index of target in array, or -1 if not found

  1. Initialize low <- 0
  2. Initialize high <- length(array) - 1
  
  3. WHILE low <= high DO:
       mid <- low + floor((high - low) / 2)
       
       IF array[mid] == target THEN:
           RETURN mid
       ELSE IF array[mid] < target THEN:
           low <- mid + 1
       ELSE:
           high <- mid - 1
       END IF
     END WHILE

  4. RETURN -1  // Target not found in array`;

const detectLanguageFromExtension = (filename) => {
  if (!filename) return null;
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'py': return 'Python';
    case 'js': return 'JavaScript';
    case 'jsx': case 'tsx': return 'React';
    case 'ts': return 'JavaScript';
    case 'java': return 'Java';
    case 'cpp': case 'cc': case 'cxx': case 'c': case 'h': case 'hpp': return 'C++';
    default: return null;
  }
};

const generateStarterSkeleton = (pseudocode, language = 'JavaScript') => {
  if (!pseudocode || !pseudocode.trim()) return '';
  const lines = pseudocode.trim().split('\n');
  const lang = (language || 'JavaScript').toLowerCase();

  if (lang.includes('python')) {
    const commented = lines.map(line => line.trim() ? `# ${line}` : '#').join('\n');
    return `# ==========================================\n# PSEUDOCODE SPECIFICATION\n# ==========================================\n${commented}\n# ==========================================\n\ndef solution(*args, **kwargs):\n    # TODO: Implement solution based on the pseudocode above\n    pass\n`;
  } else if (lang.includes('java') && !lang.includes('script')) {
    const commented = lines.map(line => line.trim() ? ` * ${line}` : ' *').join('\n');
    return `/**\n * ==========================================\n * PSEUDOCODE SPECIFICATION\n * ==========================================\n${commented}\n * ==========================================\n */\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Test your solution here\n    }\n\n    public static Object solve() {\n        // TODO: Implement solution based on the pseudocode above\n        return null;\n    }\n}\n`;
  } else if (lang.includes('c++')) {
    const commented = lines.map(line => line.trim() ? ` * ${line}` : ' *').join('\n');
    return `/**\n * ==========================================\n * PSEUDOCODE SPECIFICATION\n * ==========================================\n${commented}\n * ==========================================\n */\n\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid solve() {\n    // TODO: Implement solution based on the pseudocode above\n}\n\nint main() {\n    solve();\n    return 0;\n}\n`;
  } else {
    // JavaScript, React, Node.js, etc.
    const commented = lines.map(line => line.trim() ? ` * ${line}` : ' *').join('\n');
    return `/**\n * ==========================================\n * PSEUDOCODE SPECIFICATION\n * ==========================================\n${commented}\n * ==========================================\n */\n\nfunction solution() {\n  // TODO: Implement solution based on the pseudocode above\n}\n`;
  }
};

export default function CreateProblem() {
  const navigate = useNavigate();

  // Read authenticated user safely
  const userInfo = (() => {
    try {
      const raw = localStorage.getItem('userInfo');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [draftSaved, setDraftSaved] = useState(false);

  // Main Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Algorithms',
    difficulty: 'Medium',
    language: 'JavaScript',
    type: 'Standard', // 'Standard' | 'Debug Challenge'
    tags: [],
    expectedBehavior: '',
    currentBehavior: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    exampleInput: '',
    exampleOutput: '',
    starterCode: '',
    pseudocode: '',
  });

  const [tagInput, setTagInput] = useState('');
  
  // Upload and code hub state
  const [codeHubTab, setCodeHubTab] = useState('upload-code'); // 'upload-code' | 'upload-pseudo' | 'editor'
  const [uploadedFile, setUploadedFile] = useState(null); // { name, size, type: 'code'|'pseudocode', rawContent, linesCount }
  const [isDragging, setIsDragging] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState(null);
  const [pseudoFormatMode, setPseudoFormatMode] = useState('commented'); // 'commented' | 'raw'

  const titleInputRef = useRef(null);
  const descInputRef = useRef(null);
  const codeFileInputRef = useRef(null);
  const pseudoFileInputRef = useRef(null);

  // Load saved draft on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === 'object') {
          setFormData(prev => ({
            ...prev,
            ...parsed,
            tags: Array.isArray(parsed.tags) ? parsed.tags : []
          }));
        }
      }
    } catch (e) {
      console.error('Failed to load problem draft:', e);
    }
  }, []);

  // Save draft debounce
  useEffect(() => {
    if (!formData.title && !formData.description && !formData.starterCode) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2500);
      } catch (e) {
        console.error('Failed to auto-save draft:', e);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  // Tag management
  const handleAddTag = (tagToAdd) => {
    const cleaned = tagToAdd.trim().replace(/^#/, '');
    if (!cleaned) return;
    if (!formData.tags.includes(cleaned)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, cleaned]
      }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  // Code File Upload Handler
  const handleProcessCodeFile = (file) => {
    if (!file) return;

    const MAX_SIZE = 1024 * 1024; // 1MB
    if (file.size > MAX_SIZE) {
      setUploadFeedback({
        type: 'error',
        message: 'File size exceeds 1MB limit. Please upload a smaller code file.'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content !== 'string') {
        setUploadFeedback({ type: 'error', message: 'Unable to read code file.' });
        return;
      }

      const linesCount = content.split('\n').length;
      const sizeStr = file.size < 1024 ? `${file.size} B` : `${(file.size / 1024).toFixed(1)} KB`;
      const detectedLang = detectLanguageFromExtension(file.name);

      setFormData(prev => ({
        ...prev,
        language: detectedLang || prev.language,
        starterCode: content
      }));

      setUploadedFile({
        name: file.name,
        size: sizeStr,
        type: 'code',
        rawContent: content,
        linesCount
      });

      setUploadFeedback({
        type: 'success',
        message: `Code file "${file.name}" loaded! (${linesCount} lines, ${sizeStr})${detectedLang ? ` — Language updated to ${detectedLang}` : ''}`
      });
    };

    reader.onerror = () => {
      setUploadFeedback({ type: 'error', message: 'Failed to read file. Please try again.' });
    };

    reader.readAsText(file);
  };

  // Pseudocode File Upload Handler
  const handleProcessPseudocodeFile = (file) => {
    if (!file) return;

    const MAX_SIZE = 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadFeedback({
        type: 'error',
        message: 'File size exceeds 1MB limit. Please upload a smaller pseudocode file.'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content !== 'string') {
        setUploadFeedback({ type: 'error', message: 'Unable to parse pseudocode file.' });
        return;
      }

      const linesCount = content.split('\n').length;
      const sizeStr = file.size < 1024 ? `${file.size} B` : `${(file.size / 1024).toFixed(1)} KB`;

      let initialStarter = content;
      if (pseudoFormatMode === 'commented') {
        initialStarter = generateStarterSkeleton(content, formData.language);
      }

      setFormData(prev => ({
        ...prev,
        starterCode: initialStarter,
        pseudocode: content
      }));

      setUploadedFile({
        name: file.name,
        size: sizeStr,
        type: 'pseudocode',
        rawContent: content,
        linesCount
      });

      setUploadFeedback({
        type: 'success',
        message: `Pseudocode "${file.name}" loaded! (${linesCount} lines, ${sizeStr})`
      });
    };

    reader.onerror = () => {
      setUploadFeedback({ type: 'error', message: 'Failed to read pseudocode file.' });
    };

    reader.readAsText(file);
  };

  // Universal drag-and-drop
  const handleDropAnyFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pseudo' || ext === 'pseudocode' || codeHubTab === 'upload-pseudo') {
      handleProcessPseudocodeFile(file);
    } else {
      handleProcessCodeFile(file);
    }
  };

  // Toggle pseudocode skeleton vs raw
  const handleTogglePseudoFormat = (mode) => {
    setPseudoFormatMode(mode);
    const raw = uploadedFile?.rawContent || formData.pseudocode;
    if (!raw) return;

    if (mode === 'commented') {
      const skeleton = generateStarterSkeleton(raw, formData.language);
      setFormData(prev => ({ ...prev, starterCode: skeleton }));
      setUploadFeedback({ type: 'success', message: `Formatted pseudocode as commented skeleton for ${formData.language}.` });
    } else {
      setFormData(prev => ({ ...prev, starterCode: raw }));
      setUploadFeedback({ type: 'success', message: 'Switched to raw pseudocode.' });
    }
  };

  // Load sample pseudocode
  const handleLoadSamplePseudocode = () => {
    setCodeHubTab('upload-pseudo');
    const sampleData = {
      name: 'binary_search.pseudo',
      size: '780 B',
      type: 'pseudocode',
      rawContent: SAMPLE_PSEUDOCODE,
      linesCount: SAMPLE_PSEUDOCODE.split('\n').length
    };
    setUploadedFile(sampleData);
    const code = pseudoFormatMode === 'commented'
      ? generateStarterSkeleton(SAMPLE_PSEUDOCODE, formData.language)
      : SAMPLE_PSEUDOCODE;
    setFormData(prev => ({
      ...prev,
      starterCode: code,
      pseudocode: SAMPLE_PSEUDOCODE
    }));
    setUploadFeedback({
      type: 'success',
      message: 'Sample algorithm pseudocode loaded!'
    });
  };

  // Pre-fill a demo problem
  const handleLoadDemo = (type = 'Standard') => {
    const sample = type === 'Debug Challenge' ? SAMPLE_DEBUG_CHALLENGE : SAMPLE_ALGORITHM;
    setFormData({
      ...sample,
      tags: [...sample.tags],
      pseudocode: ''
    });
    setUploadedFile({
      name: type === 'Debug Challenge' ? 'cache_bug.js' : 'solution.js',
      size: '1.2 KB',
      type: 'code',
      rawContent: sample.starterCode,
      linesCount: sample.starterCode.split('\n').length
    });
    setFormError(null);
    setUploadFeedback({
      type: 'success',
      message: `Loaded sample ${type} challenge!`
    });
  };

  // Clear or reset form
  const handleResetForm = () => {
    if (window.confirm('Reset all fields and clear draft?')) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setFormData({
        title: '',
        description: '',
        category: 'Algorithms',
        difficulty: 'Medium',
        language: 'JavaScript',
        type: 'Standard',
        tags: [],
        expectedBehavior: '',
        currentBehavior: '',
        inputFormat: '',
        outputFormat: '',
        constraints: '',
        exampleInput: '',
        exampleOutput: '',
        starterCode: '',
        pseudocode: '',
      });
      setUploadedFile(null);
      setFormError(null);
      setUploadFeedback(null);
    }
  };

  // Primary Submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setFormError(null);

    // Auth verification
    if (!userInfo) {
      setFormError('Please log in with your TechJourney account to post a challenge.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validation
    if (!formData.title?.trim()) {
      setFormError('Problem Title is required.');
      titleInputRef.current?.focus();
      titleInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (formData.title.trim().length < 5) {
      setFormError('Problem Title must be at least 5 characters long.');
      titleInputRef.current?.focus();
      return;
    }

    if (!formData.description?.trim()) {
      setFormError('Please provide a short description of the problem.');
      descInputRef.current?.focus();
      descInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        difficulty: formData.difficulty,
        language: formData.language,
        type: formData.type,
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        expectedBehavior: formData.expectedBehavior?.trim() || '',
        currentBehavior: formData.currentBehavior?.trim() || '',
        inputFormat: formData.inputFormat?.trim() || '',
        outputFormat: formData.outputFormat?.trim() || '',
        constraints: formData.constraints?.trim() || '',
        exampleInput: formData.exampleInput?.trim() || '',
        exampleOutput: formData.exampleOutput?.trim() || '',
        starterCode: formData.starterCode || '',
        creator: userInfo?._id,
        creatorId: userInfo?._id
      };

      const { data } = await api.post('/problems', payload);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setSuccessMsg('Problem published successfully! Redirecting...');
      setTimeout(() => {
        navigate(`/problemhub/problem/${data._id}`);
      }, 800);
    } catch (error) {
      console.error('Failed to create problem:', error);
      const serverMessage = error.response?.data?.message || error.message || 'Failed to publish problem. Please verify required fields and try again.';
      setFormError(serverMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Readiness Checklist status calculation
  const checklist = [
    { label: 'Problem Title', done: Boolean(formData.title?.trim().length >= 5) },
    { label: 'Problem Description', done: Boolean(formData.description?.trim().length >= 10) },
    { 
      label: formData.type === 'Debug Challenge' ? 'Bug & Expected Behavior' : 'Problem Specifications',
      done: formData.type === 'Debug Challenge' 
        ? Boolean(formData.expectedBehavior || formData.currentBehavior)
        : Boolean(formData.inputFormat || formData.outputFormat || formData.constraints)
    },
    { label: 'Test Case Examples', done: Boolean(formData.exampleInput || formData.exampleOutput) },
    { label: 'Code or Pseudocode Attached', done: Boolean(formData.starterCode?.trim()) }
  ];

  const completedCount = checklist.filter(c => c.done).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="min-h-screen bg-page text-heading py-10 px-4 sm:px-6 lg:px-8">
      {/* ── Breadcrumb & Top Bar ── */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-line">
          <div>
            <Link 
              to="/problemhub" 
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-[#2BAF85] transition-colors mb-2"
            >
              <ArrowLeft size={16} /> Return to Problem Hub
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-heading">
              Post a Problem
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Challenge the TechJourney community with an algorithmic puzzle or a real-world debugging challenge.
            </p>
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center flex-wrap gap-2.5">
            {draftSaved && (
              <span className="text-xs font-mono text-[#2BAF85] flex items-center gap-1.5 bg-[#0F6B4F]/10 border border-[#0F6B4F]/30 px-2.5 py-1 rounded-full">
                <Check size={12} /> Draft saved
              </span>
            )}

            <button
              type="button"
              onClick={() => handleLoadDemo('Standard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-soft hover:bg-line text-heading border border-line transition-all cursor-pointer"
              title="Pre-fill with an algorithm example challenge"
            >
              <Sparkles size={14} className="text-yellow-400" /> Demo Algorithm
            </button>

            <button
              type="button"
              onClick={() => handleLoadDemo('Debug Challenge')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-soft hover:bg-line text-heading border border-line transition-all cursor-pointer"
              title="Pre-fill with a debugging challenge"
            >
              <Bug size={14} className="text-rose-400" /> Demo Debug
            </button>

            <button
              type="button"
              onClick={handleResetForm}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
              title="Clear all fields"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Form Layout (Grid) ── */}
      <div className="max-w-7xl mx-auto">
        {/* Global Error Banner */}
        {formError && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start justify-between gap-3 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-400" />
              <div>
                <p className="font-semibold text-sm">Unable to Publish Problem</p>
                <p className="text-xs text-red-400/90 mt-0.5">{formError}</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setFormError(null)} 
              className="text-red-400 hover:text-red-300 cursor-pointer p-1"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}

        {/* Global Success Banner */}
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 flex items-center gap-3 shadow-lg"
          >
            <CheckCircle2 size={20} className="shrink-0 text-green-400" />
            <p className="font-semibold text-sm">{successMsg}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ══════════════════════════════════════════════════
              LEFT COLUMN: Full Problem Builder (8 cols)
             ══════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 space-y-8">
            {/* ── CARD 1: Challenge Identity & Type ── */}
            <div className="bg-card border border-line rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-line/60">
                <div className="w-8 h-8 rounded-lg bg-[#0F6B4F]/20 text-[#2BAF85] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-lg font-bold text-heading">Challenge Identity</h2>
                  <p className="text-xs text-slate-400">Choose the challenge type, title, and key category tags.</p>
                </div>
              </div>

              {/* Challenge Type Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                  Challenge Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'Standard' }))}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      formData.type === 'Standard'
                        ? 'border-[#0F6B4F] bg-[#0F6B4F]/10 shadow-[0_0_20px_rgba(15,107,79,0.2)]'
                        : 'border-line bg-soft text-muted hover:border-slate-500'
                    }`}
                  >
                    {formData.type === 'Standard' && (
                      <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#2BAF85] shadow-[0_0_8px_#2BAF85]" />
                    )}
                    <Code2 size={24} className={`mb-2 ${formData.type === 'Standard' ? 'text-[#2BAF85]' : 'text-slate-400'}`} />
                    <div className="font-bold text-heading text-sm sm:text-base">Standard Challenge</div>
                    <p className="text-xs text-slate-400 mt-1">Algorithms, data structures, logic puzzles, or building a feature.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'Debug Challenge' }))}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      formData.type === 'Debug Challenge'
                        ? 'border-rose-500 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                        : 'border-line bg-soft text-muted hover:border-slate-500'
                    }`}
                  >
                    {formData.type === 'Debug Challenge' && (
                      <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                    )}
                    <Bug size={24} className={`mb-2 ${formData.type === 'Debug Challenge' ? 'text-rose-400' : 'text-slate-400'}`} />
                    <div className="font-bold text-heading text-sm sm:text-base">Debug Challenge</div>
                    <p className="text-xs text-slate-400 mt-1">Provide broken code for others to fork, investigate, and fix.</p>
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-heading">
                    Problem Title <span className="text-red-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formData.title.length}/120
                  </span>
                </div>
                <input
                  ref={titleInputRef}
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={120}
                  placeholder="e.g., Implement LRU Cache with O(1) Operations"
                  className="w-full bg-soft border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Difficulty, Language, Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full bg-soft border border-line rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading appearance-none cursor-pointer"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Primary Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full bg-soft border border-line rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading appearance-none cursor-pointer"
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="Node.js">Node.js</option>
                    <option value="Python">Python</option>
                    <option value="React">React</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-soft border border-line rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading appearance-none cursor-pointer"
                  >
                    <option value="Algorithms">Algorithms</option>
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>
              </div>

              {/* Tags Interactive Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Tags & Topics (Press Enter or comma to add)
                </label>
                <div className="flex flex-wrap items-center gap-2 p-2 bg-soft border border-line rounded-xl min-h-[46px]">
                  {formData.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center gap-1.5 text-xs font-medium bg-card px-2.5 py-1 rounded-lg border border-line text-heading"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-red-400 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={formData.tags.length === 0 ? "e.g., Arrays, Hash Map (press Enter)" : "Add tag..."}
                    className="flex-1 min-w-[130px] bg-transparent text-sm focus:outline-none text-heading placeholder:text-slate-500 px-2 py-1"
                  />
                </div>

                {/* Popular Tags Suggestions */}
                <div className="flex items-center flex-wrap gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-500 mr-1">Suggestions:</span>
                  {POPULAR_TAGS.filter(t => !formData.tags.includes(t)).slice(0, 6).map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-line/40 hover:bg-[#0F6B4F]/20 hover:text-[#2BAF85] text-slate-400 transition-colors cursor-pointer"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  Problem Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  ref={descInputRef}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Explain the problem statement clearly. What is the objective, background context, or goal of this challenge?"
                  className="w-full bg-soft border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading placeholder:text-slate-500 resize-none"
                  required
                />
              </div>
            </div>

            {/* ── CARD 2: Specifications & Test Cases ── */}
            <div className="bg-card border border-line rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-line/60">
                <div className="w-8 h-8 rounded-lg bg-[#0F6B4F]/20 text-[#2BAF85] flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-lg font-bold text-heading">
                    {formData.type === 'Debug Challenge' ? 'Bug Specifications' : 'Specifications & Constraints'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {formData.type === 'Debug Challenge' 
                      ? 'Describe what behavior is expected vs what the code is currently doing wrong.'
                      : 'Define inputs, outputs, and operational constraints for developers.'}
                  </p>
                </div>
              </div>

              {formData.type === 'Debug Challenge' ? (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs flex items-start gap-2.5">
                    <Info size={16} className="shrink-0 mt-0.5" />
                    <span>Provide clear repro steps or describe the symptoms of the bug so developers can isolate the root cause.</span>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-2">Expected Behavior</label>
                    <textarea
                      name="expectedBehavior"
                      value={formData.expectedBehavior}
                      onChange={handleChange}
                      rows="3"
                      placeholder="e.g., The authenticateUser() middleware should verify the JWT and attach req.user with decoded payload."
                      className="w-full bg-soft border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-2">Current Behavior (The Bug)</label>
                    <textarea
                      name="currentBehavior"
                      value={formData.currentBehavior}
                      onChange={handleChange}
                      rows="3"
                      placeholder="e.g., Throws a 500 TypeError: Cannot read property 'id' of undefined when Authorization header lacks Bearer prefix."
                      className="w-full bg-soft border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500/50 text-heading resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-heading mb-2">Input Format</label>
                      <textarea
                        name="inputFormat"
                        value={formData.inputFormat}
                        onChange={handleChange}
                        rows="2"
                        placeholder="e.g., numbers: number[], target: number"
                        className="w-full bg-soft border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-heading mb-2">Output Format</label>
                      <textarea
                        name="outputFormat"
                        value={formData.outputFormat}
                        onChange={handleChange}
                        rows="2"
                        placeholder="e.g., number[]: [index1, index2]"
                        className="w-full bg-soft border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading resize-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-heading mb-2">Constraints</label>
                    <textarea
                      name="constraints"
                      value={formData.constraints}
                      onChange={handleChange}
                      rows="2"
                      placeholder="e.g., Time Complexity: O(n), Space Complexity: O(1). 1 <= array.length <= 10^5"
                      className="w-full bg-soft border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Example Test Cases */}
              <div className="pt-2 border-t border-line/60">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Sample Test Case (Input & Output)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs font-mono text-slate-400 mb-1.5">Example Input</span>
                    <textarea
                      name="exampleInput"
                      value={formData.exampleInput}
                      onChange={handleChange}
                      rows="3"
                      placeholder="e.g., [2, 7, 11, 15], target = 9"
                      className="w-full bg-[#0a0a0a] border border-line rounded-xl px-4 py-3 text-xs font-mono text-[#a9b1d6] focus:outline-none focus:border-[#0F6B4F] resize-none"
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-mono text-slate-400 mb-1.5">Example Output</span>
                    <textarea
                      name="exampleOutput"
                      value={formData.exampleOutput}
                      onChange={handleChange}
                      rows="3"
                      placeholder="e.g., [1, 2]"
                      className="w-full bg-[#0a0a0a] border border-line rounded-xl px-4 py-3 text-xs font-mono text-green-400 focus:outline-none focus:border-[#0F6B4F] resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── CARD 3: Code & Pseudocode Center (Upload & Edit) ── */}
            <div className="bg-card border border-line rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-line/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0F6B4F]/20 text-[#2BAF85] flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-heading">
                      {formData.type === 'Debug Challenge' ? 'Broken Code Hub' : 'Starter Code & Blueprint'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Upload source code, upload pseudocode outline, or type code directly.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-heading px-2.5 py-1 rounded-lg bg-soft border border-line">
                  {formData.language}
                </span>
              </div>

              {/* Hidden File Pickers */}
              <input
                type="file"
                ref={codeFileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleProcessCodeFile(file);
                  e.target.value = '';
                }}
                accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.cc,.c,.cs,.go,.rs,.php,.rb,.html,.css,.json,.sql,text/plain"
                className="hidden"
              />
              <input
                type="file"
                ref={pseudoFileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleProcessPseudocodeFile(file);
                  e.target.value = '';
                }}
                accept=".txt,.pseudo,.pseudocode,.md,text/plain"
                className="hidden"
              />

              {/* Mode Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 bg-soft rounded-2xl border border-line">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCodeHubTab('upload-code')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      codeHubTab === 'upload-code'
                        ? 'bg-[#0F6B4F] text-white shadow-sm'
                        : 'text-slate-400 hover:text-heading'
                    }`}
                  >
                    <Code2 size={14} /> Upload Code File
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeHubTab('upload-pseudo')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      codeHubTab === 'upload-pseudo'
                        ? 'bg-[#0F6B4F] text-white shadow-sm'
                        : 'text-slate-400 hover:text-heading'
                    }`}
                  >
                    <FileText size={14} /> Upload Pseudocode
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeHubTab('editor')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      codeHubTab === 'editor'
                        ? 'bg-[#0F6B4F] text-white shadow-sm'
                        : 'text-slate-400 hover:text-heading'
                    }`}
                  >
                    <Terminal size={14} /> Code Editor
                  </button>
                </div>

                <div className="flex items-center gap-2 px-1">
                  {codeHubTab === 'upload-code' && (
                    <button
                      type="button"
                      onClick={() => codeFileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#0F6B4F] hover:bg-[#16805E] text-white transition-all cursor-pointer shadow-sm"
                    >
                      <FileUp size={13} /> Browse Code
                    </button>
                  )}
                  {codeHubTab === 'upload-pseudo' && (
                    <>
                      <button
                        type="button"
                        onClick={() => pseudoFileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#0F6B4F] hover:bg-[#16805E] text-white transition-all cursor-pointer shadow-sm"
                      >
                        <FileUp size={13} /> Browse Pseudocode
                      </button>
                      <button
                        type="button"
                        onClick={handleLoadSamplePseudocode}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-card hover:bg-line text-heading border border-line transition-all cursor-pointer"
                        title="Load sample pseudocode"
                      >
                        <Sparkles size={13} className="text-yellow-400" /> Sample
                      </button>
                    </>
                  )}
                  {formData.starterCode && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Clear the code in the editor?')) {
                          setFormData(prev => ({ ...prev, starterCode: '', pseudocode: '' }));
                          setUploadedFile(null);
                        }
                      }}
                      className="text-xs text-slate-400 hover:text-red-400 px-2 py-1 rounded hover:bg-red-500/10 cursor-pointer"
                      title="Clear code"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Dropzone (shown on Upload Code or Upload Pseudocode tabs when no file is active) */}
              {(codeHubTab === 'upload-code' || codeHubTab === 'upload-pseudo') && !uploadedFile && (
                <div
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
                  onDrop={handleDropAnyFile}
                  onClick={() => {
                    if (codeHubTab === 'upload-code') {
                      codeFileInputRef.current?.click();
                    } else {
                      pseudoFileInputRef.current?.click();
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#2BAF85] bg-[#0F6B4F]/15 scale-[1.01]'
                      : 'border-line hover:border-[#0F6B4F] bg-[#0a0a0a]/50 hover:bg-[#0a0a0a]'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-soft flex items-center justify-center text-slate-400">
                      <UploadCloud size={24} className={isDragging ? 'text-[#2BAF85] animate-bounce' : ''} />
                    </div>
                    <div className="text-sm font-medium text-heading">
                      {codeHubTab === 'upload-code' ? (
                        <>Drag & drop a source code file here, or <span className="text-[#2BAF85] underline">browse</span></>
                      ) : (
                        <>Drag & drop a pseudocode outline file here, or <span className="text-[#2BAF85] underline">browse</span></>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {codeHubTab === 'upload-code' 
                        ? 'Supports .js, .py, .java, .cpp, .ts, .c, .html, .css (Max 1MB)' 
                        : 'Supports .pseudo, .txt, .md algorithm outlines (Max 1MB)'}
                    </p>
                  </div>
                </div>
              )}

              {/* Uploaded File Pill Card */}
              {uploadedFile && (
                <div className="bg-[#0a0a0a] border border-line rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-heading truncate max-w-[200px] sm:max-w-xs">
                          {uploadedFile.name}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-line/60 text-slate-300 font-mono">
                          {uploadedFile.size}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#0F6B4F]/20 text-[#2BAF85] border border-[#0F6B4F]/30">
                          {uploadedFile.type === 'code' ? 'Code File' : 'Pseudocode'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {uploadedFile.linesCount} lines loaded into challenge starter code
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-2">
                    {uploadedFile.type === 'pseudocode' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleTogglePseudoFormat('commented')}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            pseudoFormatMode === 'commented'
                              ? 'bg-[#0F6B4F] text-white shadow-sm'
                              : 'bg-soft hover:bg-line text-slate-300 border border-line'
                          }`}
                        >
                          Commented Skeleton
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTogglePseudoFormat('raw')}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            pseudoFormatMode === 'raw'
                              ? 'bg-[#0F6B4F] text-white shadow-sm'
                              : 'bg-soft hover:bg-line text-slate-300 border border-line'
                          }`}
                        >
                          Raw Pseudocode
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedFile(null);
                        setUploadFeedback({ type: 'info', message: 'Detached file reference.' });
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Notification Message */}
              {uploadFeedback && (
                <div className={`text-xs px-3.5 py-2.5 rounded-xl flex items-center justify-between border ${
                  uploadFeedback.type === 'error'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : uploadFeedback.type === 'info'
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    : 'bg-green-500/10 border-green-500/30 text-green-400'
                }`}>
                  <div className="flex items-center gap-2">
                    {uploadFeedback.type === 'error' ? (
                      <AlertCircle size={14} className="shrink-0" />
                    ) : (
                      <CheckCircle2 size={14} className="shrink-0" />
                    )}
                    <span>{uploadFeedback.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadFeedback(null)}
                    className="hover:opacity-75 transition-opacity cursor-pointer ml-2"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Interactive Code Editor (always accessible so authors can review and adjust code) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>
                    {formData.type === 'Debug Challenge' ? 'Broken Code Body:' : 'Starter Code / Solution Scaffold:'}
                  </span>
                  <span className="font-mono">
                    {formData.starterCode ? `${formData.starterCode.split('\n').length} lines` : '0 lines'}
                  </span>
                </div>

                <textarea
                  name="starterCode"
                  value={formData.starterCode}
                  onChange={handleChange}
                  rows="14"
                  placeholder="// Paste or write starter code, or upload a code/pseudocode file using the options above..."
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={handleDropAnyFile}
                  className="w-full bg-[#0a0a0a] border border-line rounded-2xl px-4 py-4 text-xs sm:text-sm font-mono text-[#a9b1d6] focus:outline-none focus:border-[#0F6B4F] resize-y shadow-inner"
                />
                <p className="text-[11px] text-slate-500 flex items-center justify-between px-1">
                  <span>Tip: You can drag and drop code files directly into this box.</span>
                  <span>{formData.starterCode.length} characters</span>
                </p>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
              RIGHT COLUMN: Sticky Summary & Publish Bar (4 cols)
             ══════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
            {/* Publish Action Card */}
            <div className="bg-card border border-line rounded-3xl p-6 shadow-xl space-y-6">
              <h3 className="text-base font-bold text-heading">Publish Challenge</h3>

              {/* Checklist Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Readiness Score</span>
                  <span className="font-bold text-[#2BAF85] font-mono">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-soft overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0F6B4F] to-[#2BAF85] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="space-y-2 pt-2">
                  {checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      {item.done ? (
                        <CheckCircle2 size={14} className="text-[#2BAF85] shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-line shrink-0" />
                      )}
                      <span className={item.done ? 'text-heading' : 'text-slate-400'}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Author Tag */}
              <div className="p-3 rounded-xl bg-soft border border-line text-xs flex items-center justify-between">
                <span className="text-slate-400">Posting as:</span>
                <span className="font-semibold text-heading truncate max-w-[150px]">
                  @{userInfo?.name || 'Anonymous Developer'}
                </span>
              </div>

              {/* Publish Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-[#0F6B4F] hover:bg-[#16805E] transition-all shadow-[0_0_25px_rgba(15,107,79,0.35)] hover:shadow-[0_0_35px_rgba(22,128,94,0.55)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Publishing Challenge...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Publish Problem Now</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Problem Card Preview */}
            <div className="bg-card border border-line rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Hub Card Preview
              </h4>

              <div className="bg-[#0a0a0a] border border-line rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    formData.type === 'Debug Challenge' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                      : 'bg-[#0F6B4F]/20 text-[#2BAF85] border border-[#0F6B4F]/30'
                  }`}>
                    {formData.type}
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    formData.difficulty === 'Hard'
                      ? 'bg-red-500/10 text-red-400'
                      : formData.difficulty === 'Medium'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {formData.difficulty}
                  </span>
                </div>

                <div className="font-bold text-heading text-sm line-clamp-2">
                  {formData.title || 'Untitled Problem Challenge'}
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {formData.description || 'Problem statement and challenge description will appear here...'}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-line/40 text-[11px] text-slate-500">
                  <span className="font-mono text-[#2BAF85]">{formData.language}</span>
                  <span>{formData.category}</span>
                </div>
              </div>
            </div>

            {/* Authoring Guidelines */}
            <div className="p-5 rounded-3xl bg-soft/50 border border-line text-xs space-y-2 text-slate-400">
              <p className="font-semibold text-heading flex items-center gap-1.5">
                <HelpCircle size={14} className="text-[#2BAF85]" /> Authoring Guidelines
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Include edge cases (empty inputs, negative bounds).</li>
                <li>State time and space complexity constraints.</li>
                <li>Avoid revealing the full solution in starter code.</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
