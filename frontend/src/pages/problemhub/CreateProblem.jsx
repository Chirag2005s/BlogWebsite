import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Bug, Code2, Send, AlertCircle, Info, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function CreateProblem() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Backend',
    difficulty: 'Medium',
    language: 'JavaScript',
    type: 'Standard',
    tags: '',
    expectedBehavior: '',
    currentBehavior: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    exampleInput: '',
    exampleOutput: '',
    starterCode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/problems', formData);
      navigate(`/problemhub/problem/${data._id}`);
    } catch (error) {
      console.error('Failed to create problem:', error);
      alert('Failed to create problem. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Basic Information' },
    { num: 2, label: 'Problem Details' },
    { num: 3, label: 'Starter Code' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-heading mb-4">Post a Problem</h1>
        <p className="text-slate-400">Challenge the TechJourney developer community.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-line -z-10" />
        {steps.map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-2 bg-page px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
              step >= s.num 
                ? 'bg-[#0F6B4F] border-[#0F6B4F] text-white shadow-[0_0_15px_rgba(15,107,79,0.5)]' 
                : 'bg-card border-line text-muted'
            }`}>
              {s.num}
            </div>
            <span className={`text-xs font-semibold ${step >= s.num ? 'text-[#0F6B4F]' : 'text-muted'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-card border border-line rounded-3xl p-6 md:p-10 shadow-xl">
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-heading mb-2">Problem Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'Standard' }))}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.type === 'Standard' 
                          ? 'border-[#0F6B4F] bg-[#0F6B4F]/5 shadow-sm' 
                          : 'border-line bg-soft text-muted hover:border-slate-500'
                      }`}
                    >
                      <Code2 size={24} className={`mb-2 ${formData.type === 'Standard' ? 'text-[#0F6B4F]' : ''}`} />
                      <div className="font-bold text-heading">Standard Challenge</div>
                      <div className="text-xs text-slate-400 mt-1">Algorithm, logic, or building a feature.</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'Debug Challenge' }))}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.type === 'Debug Challenge' 
                          ? 'border-red-500 bg-red-500/5 shadow-sm' 
                          : 'border-line bg-soft text-muted hover:border-slate-500'
                      }`}
                    >
                      <Bug size={24} className={`mb-2 ${formData.type === 'Debug Challenge' ? 'text-red-500' : ''}`} />
                      <div className="font-bold text-heading">Debug Challenge</div>
                      <div className="text-xs text-slate-400 mt-1">Provide broken code for others to fix.</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-heading mb-2">Problem Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Fix the Node.js Authentication Bug"
                    className="w-full bg-soft border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-heading mb-2">Difficulty</label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      className="w-full bg-soft border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading appearance-none"
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-heading mb-2">Language</label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full bg-soft border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading appearance-none"
                    >
                      <option>JavaScript</option>
                      <option>Node.js</option>
                      <option>Python</option>
                      <option>React</option>
                      <option>Java</option>
                      <option>C++</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-heading mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-soft border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading appearance-none"
                    >
                      <option>Frontend</option>
                      <option>Backend</option>
                      <option>Algorithms</option>
                      <option>Database</option>
                      <option>DevOps</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-heading mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g., JWT, Express, Bug"
                    className="w-full bg-soft border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-heading mb-2">Short Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Briefly describe what this problem is about..."
                    className="w-full bg-soft border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading resize-none"
                    required
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {formData.type === 'Debug Challenge' ? (
                  <>
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm flex items-start gap-3">
                      <Info size={18} className="mt-0.5 shrink-0" />
                      <p>For a Debug Challenge, explain what the code is <strong>supposed</strong> to do, and what it is <strong>currently</strong> doing wrong.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-heading mb-2">Expected Behavior</label>
                      <textarea
                        name="expectedBehavior"
                        value={formData.expectedBehavior}
                        onChange={handleChange}
                        rows="3"
                        placeholder="e.g., The API should return a 200 status with the user object."
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
                        placeholder="e.g., The API returns a 500 error complaining about undefined 'req.user'."
                        className="w-full bg-soft border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 text-heading resize-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-heading mb-2">Input Format</label>
                      <textarea
                        name="inputFormat"
                        value={formData.inputFormat}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Describe the input arguments or request body."
                        className="w-full bg-soft border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-heading mb-2">Output Format</label>
                      <textarea
                        name="outputFormat"
                        value={formData.outputFormat}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Describe the expected output or response."
                        className="w-full bg-soft border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-heading mb-2">Constraints</label>
                      <textarea
                        name="constraints"
                        value={formData.constraints}
                        onChange={handleChange}
                        rows="2"
                        placeholder="e.g., Time complexity should be O(n)."
                        className="w-full bg-soft border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading resize-none"
                      />
                    </div>
                  </>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-heading mb-2">Example Input</label>
                    <textarea
                      name="exampleInput"
                      value={formData.exampleInput}
                      onChange={handleChange}
                      rows="3"
                      className="w-full bg-[#0a0a0a] border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] text-[#a9b1d6] font-mono resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-heading mb-2">Example Output</label>
                    <textarea
                      name="exampleOutput"
                      value={formData.exampleOutput}
                      onChange={handleChange}
                      rows="3"
                      className="w-full bg-[#0a0a0a] border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] text-[#a9b1d6] font-mono resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm flex items-start gap-3">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p>
                    {formData.type === 'Debug Challenge' 
                      ? 'Paste the broken code here. Other developers will fork it and submit their fixed versions.' 
                      : 'Provide starter code or function signatures for the developers to begin with.'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between bg-[#111827] border border-line border-b-0 rounded-t-xl px-4 py-2">
                    <span className="text-xs font-mono text-slate-400">{formData.language}</span>
                  </div>
                  <textarea
                    name="starterCode"
                    value={formData.starterCode}
                    onChange={handleChange}
                    rows="15"
                    placeholder="// Write your code here..."
                    className="w-full bg-[#0a0a0a] border border-line rounded-b-xl px-4 py-4 text-sm focus:outline-none focus:border-[#0F6B4F] text-[#a9b1d6] font-mono resize-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-10 flex items-center justify-between pt-6 border-t border-line">
            <button
              type="button"
              onClick={prevStep}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
                step === 1 ? 'opacity-0 pointer-events-none' : 'bg-soft text-heading hover:bg-line border border-line'
              }`}
            >
              <ChevronLeft size={18} /> Back
            </button>
            
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all bg-[#0F6B4F] hover:bg-[#16805E] text-white shadow-lg"
              >
                Next Step <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all bg-[#0F6B4F] hover:bg-[#16805E] text-white shadow-[0_0_20px_rgba(15,107,79,0.4)] hover:shadow-[0_0_30px_rgba(22,128,94,0.6)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>Publishing... <Loader2 size={18} className="animate-spin" /></>
                ) : (
                  <>Publish Problem <Send size={18} /></>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
