import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Rocket,
  Compass,
  Code2,
  Terminal,
  BrainCircuit,
  Zap,
  ShieldCheck,
  Globe2,
  Users,
  BookOpen,
  ArrowRight,
  Layers,
  Server,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import TechJourneyLogo from '../components/TechJourneyLogo';

export default function About() {
  const stats = [
    { label: 'Monthly Developers', value: '100K+', color: 'from-blue-500 to-cyan-400' },
    { label: 'Technical Articles', value: '500+', color: 'from-cyan-400 to-emerald-400' },
    { label: 'Developer Roadmaps', value: '50+', color: 'from-purple-500 to-pink-500' },
    { label: 'Interview Q&A Sets', value: '100+', color: 'from-amber-400 to-orange-500' },
  ];

  const coreValues = [
    {
      icon: Code2,
      title: 'Production-Grade Code',
      description: 'We prioritize real-world, battle-tested code architecture over superficial theoretical snippets.',
      glow: 'group-hover:border-blue-500/50 text-blue-400',
    },
    {
      icon: Compass,
      title: 'Guided Career Paths',
      description: 'Structured step-by-step developer roadmaps from complete beginner to Staff Architect.',
      glow: 'group-hover:border-purple-500/50 text-purple-400',
    },
    {
      icon: BrainCircuit,
      title: 'Cutting-Edge Ecosystems',
      description: 'In-depth coverage of AI & Machine Learning, Distributed Systems, Cloud Native, and Modern Web.',
      glow: 'group-hover:border-cyan-500/50 text-cyan-400',
    },
    {
      icon: ShieldCheck,
      title: '100% Free & Open Access',
      description: 'High-quality engineering knowledge should be freely accessible to developers worldwide.',
      glow: 'group-hover:border-emerald-500/50 text-emerald-400',
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Deep-Dive Articles',
      desc: 'Technical insights into Node.js internals, React rendering, memory leaks, and system design patterns.',
    },
    {
      icon: Compass,
      title: 'Interactive Roadmaps',
      desc: 'Visual learning paths for Frontend, Backend, Full Stack, AI & Data Science, and DevOps.',
    },
    {
      icon: Zap,
      title: 'Interview Q&A Suite',
      desc: 'Curated FAANG+ interview questions with interactive flashcard practice modes.',
    },
    {
      icon: Globe2,
      title: 'Tech News & Trends',
      desc: 'Stay informed with breaking framework updates, tool releases, and industry shifts.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-line">
        <div className="absolute inset-0 hero-grid opacity-50 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#0F6B4F]/10 via-[#16805E]/10 to-[#F4A62A]/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto relative z-10 text-center space-y-6"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="eyebrow-badge mx-auto"
          >
            <Sparkles size={14} />
            <span>About TechJourney</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl sm:text-6xl font-extrabold tracking-tight text-heading leading-tight"
          >
            Empowering Engineers to Build the <span className="tech-gradient-text">Future of Software</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-3xl mx-auto text-base sm:text-xl text-muted leading-relaxed"
          >
            TechJourney is a developer-first platform for software engineers, architects, and learners seeking high-impact articles, visual roadmaps, and interview mastery.
          </motion.p>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            {stats.map((s, idx) => (
              <motion.div
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ duration: 0.2 }}
                key={idx}
                className="p-5 rounded-2xl surface-card surface-card-hover shadow-lg"
              >
                <div className={`text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${s.color}`}>
                  {s.value}
                </div>
                <div className="text-xs font-medium text-muted mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ OUR MISSION & CORE VALUES ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-3"
        >
          <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Engineered for Excellence
          </h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
            Driven by Principles That Matter
          </h3>
          <p className="text-sm sm:text-base text-muted">
            We bridge the gap between superficial tutorial blogs and complex production software engineering.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                key={index}
                className="group p-6 rounded-2xl bg-page border border-line hover:bg-[#111827]/90 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl surface-card border border-line flex items-center justify-center ${item.glow} group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-[#16805E] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══ PLATFORM FEATURES GRID ═══ */}
      <section className="bg-[#080D1A] border-y border-line py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-6"
            >
              <TechJourneyLogo size={42} />
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Everything You Need to Scale Your Engineering Skills
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Whether you are preparing for a senior engineering interview at Google, decoupling a monolithic backend into microservices, or learning modern frontend patterns, TechJourney provides the exact tools and knowledge base.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Production System Architecture breakdown',
                  'Modern React 19 & Next.js Server Components',
                  'Node.js Event Loop & Memory Profiling',
                  'Interactive FAANG+ Interview Practice Cards',
                ].map((point, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    key={i} 
                    className="flex items-center gap-2.5 text-xs sm:text-sm text-cyan-200"
                  >
                    <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0" />
                    <span>{point}</span>
                  </motion.div>
                ))}
              </div>

              <div className="pt-4">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="inline-block">
                  <Link
                    to="/roadmaps"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0F6B4F] to-[#16805E] hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold transition-all shadow-md"
                  >
                    <span>Explore Roadmaps</span>
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Features Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    key={i}
                    className="p-6 rounded-2xl bg-page border border-line hover:border-cyan-500/50 transition-all space-y-3 shadow-lg"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Icon size={20} />
                    </div>
                    <h4 className="text-base font-bold text-white">{feat.title}</h4>
                    <p className="text-xs text-muted leading-relaxed">{feat.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CALL TO ACTION ═══ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-900/40 via-cyan-950/40 to-purple-900/40 border border-cyan-500/30 p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Ready to Take Your Tech Journey to the Next Level?
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-muted">
            Explore our articles, practice real interview questions, or follow structured career roadmaps today.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/blog"
                className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-[#0F6B4F] to-[#16805E] hover:from-blue-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg"
              >
                Browse Articles
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/interview-questions"
                className="inline-block px-6 py-3 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white text-xs sm:text-sm font-semibold border border-line transition-all"
              >
                Practice Interviews
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
