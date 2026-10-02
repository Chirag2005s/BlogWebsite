import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronRight, AlertTriangle, Lock, FileText, Code2, BookOpen, Link as LinkIcon, UserX, RefreshCw, Mail } from 'lucide-react';

const SECTIONS = [
  {
    id: 1,
    icon: BookOpen,
    color: '#0F6B4F',
    bg: 'from-[#0F6B4F]/10 to-[#0F6B4F]/5',
    border: 'border-[#0F6B4F]/20',
    title: 'Website Usage',
    content: 'TechJourney is provided primarily for educational and informational purposes. You agree to use the website responsibly and in accordance with applicable laws. You must not attempt to damage, disrupt, hack, scrape, or gain unauthorized access to the website or its systems.',
  },
  {
    id: 2,
    icon: Lock,
    color: '#3b82f6',
    bg: 'from-[#3b82f6]/10 to-[#3b82f6]/5',
    border: 'border-[#3b82f6]/20',
    title: 'User Accounts',
    content: 'If you create an account, you are responsible for providing accurate information and protecting your login credentials. Do not share your account in a way that compromises security or violates these Terms.',
  },
  {
    id: 3,
    icon: FileText,
    color: '#a78bfa',
    bg: 'from-[#a78bfa]/10 to-[#a78bfa]/5',
    border: 'border-[#a78bfa]/20',
    title: 'User Content & Problem Hub',
    content: 'Users may submit programming problems, solutions, comments, questions, and other technology-related content. You must own or have permission to submit any content you upload.',
    extra: 'Do not submit passwords, API keys, private credentials, confidential information, malware, spam, illegal content, copyrighted material without permission, or abusive content. TechJourney may review, modify, restrict, or remove content that violates these Terms.',
  },
  {
    id: 4,
    icon: Code2,
    color: '#f97316',
    bg: 'from-[#f97316]/10 to-[#f97316]/5',
    border: 'border-[#f97316]/20',
    title: 'Programming Code',
    content: 'Code and solutions published on TechJourney are provided for educational purposes. Users should review and test code before using it in real projects or production environments. TechJourney is not responsible for problems caused by user-submitted code.',
  },
  {
    id: 5,
    icon: Shield,
    color: '#ec4899',
    bg: 'from-[#ec4899]/10 to-[#ec4899]/5',
    border: 'border-[#ec4899]/20',
    title: 'Intellectual Property',
    content: "TechJourney's original branding, design, articles, graphics, and other materials belong to TechJourney or their respective owners. You may not copy, reproduce, republish, or commercially distribute protected content without permission.",
  },
  {
    id: 6,
    icon: LinkIcon,
    color: '#06b6d4',
    bg: 'from-[#06b6d4]/10 to-[#06b6d4]/5',
    border: 'border-[#06b6d4]/20',
    title: 'Accuracy & Third-Party Links',
    content: 'Technology information may become outdated or contain errors. TechJourney does not guarantee that all content is complete or accurate. External links may lead to third-party websites that TechJourney does not control.',
  },
  {
    id: 7,
    icon: UserX,
    color: '#ef4444',
    bg: 'from-[#ef4444]/10 to-[#ef4444]/5',
    border: 'border-[#ef4444]/20',
    title: 'Suspension',
    content: 'TechJourney may suspend or terminate accounts that violate these Terms, misuse the platform, or create security or legal risks.',
  },
  {
    id: 8,
    icon: RefreshCw,
    color: '#facc15',
    bg: 'from-[#facc15]/10 to-[#facc15]/5',
    border: 'border-[#facc15]/20',
    title: 'Changes',
    content: 'We may update these Terms or modify website features when necessary. Continued use of TechJourney after changes means you accept the updated Terms.',
  },
  {
    id: 9,
    icon: Mail,
    color: '#10b981',
    bg: 'from-[#10b981]/10 to-[#10b981]/5',
    border: 'border-[#10b981]/20',
    title: 'Contact',
    content: 'For questions or concerns regarding these Terms, please contact TechJourney through the official contact information provided on the website.',
  },
];

export default function TermsAndConditions() {
  useEffect(() => {
    document.title = 'Terms & Conditions – TechJourney';
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-line">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0F6B4F]/8 blur-[100px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted mb-8">
            <Link to="/" className="hover:text-heading transition-colors">Home</Link>
            <ChevronRight size={14} className="opacity-40" />
            <span className="text-heading font-medium">Terms & Conditions</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="p-4 bg-gradient-to-br from-[#0F6B4F]/20 to-[#0F6B4F]/5 border border-[#0F6B4F]/20 rounded-2xl shrink-0">
              <Shield size={36} className="text-[#10b981]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F6B4F]/10 border border-[#0F6B4F]/20 text-[#10b981] text-xs font-semibold mb-4">
                <Shield size={13} />
                Legal Document
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-heading leading-tight mb-3">
                Terms & Conditions
              </h1>
              <p className="text-muted text-sm leading-relaxed max-w-2xl">
                Please read these terms carefully before using TechJourney. By accessing our platform, you agree to be bound by the following terms and conditions.
              </p>
              <div className="mt-5 flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-lg bg-card border border-line text-xs text-muted font-medium">
                  🗓 Last Updated: October 2, 2026
                </span>
                <span className="px-3 py-1 rounded-lg bg-card border border-line text-xs text-muted font-medium">
                  📋 9 Sections
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14 space-y-8">

        {/* Intro Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0F6B4F]/10 via-transparent to-transparent border border-[#0F6B4F]/20">
          <p className="text-sm text-heading leading-relaxed">
            Welcome to <span className="font-bold text-[#10b981]">TechJourney</span>, a technology and programming platform providing blogs, articles, roadmaps, programming resources, technology updates, and community features such as the Problem Hub.
            <span className="block mt-2 text-muted">By accessing or using TechJourney, you agree to these Terms & Conditions.</span>
          </p>
        </div>

        {/* Quick Jump */}
        <div className="bg-card border border-line rounded-2xl p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Quick Navigation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#section-${s.id}`}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-page hover:bg-soft border border-line hover:border-white/20 transition-all text-xs text-muted hover:text-heading group"
              >
                <s.icon size={13} style={{ color: s.color }} className="shrink-0" />
                <span><span className="text-muted/60 font-mono mr-1">{s.id}.</span>{s.title}</span>
                <ChevronRight size={11} className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
              </a>
            ))}
          </div>
        </div>

        {/* Section Cards */}
        <div className="space-y-5">
          {SECTIONS.map((section) => (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className={`group bg-card border border-line hover:border-opacity-60 rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:shadow-black/10 scroll-mt-24`}
            >
              {/* Section header */}
              <div className={`flex items-center gap-4 px-6 py-4 bg-gradient-to-r ${section.bg} border-b ${section.border}`}>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{
                    background: `${section.color}15`,
                    borderColor: `${section.color}30`,
                  }}
                >
                  <section.icon size={17} style={{ color: section.color }} />
                </div>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded-md"
                    style={{
                      color: section.color,
                      background: `${section.color}15`,
                    }}
                  >
                    §{section.id}
                  </span>
                  <h2 className="text-base font-bold text-heading truncate">{section.title}</h2>
                </div>
              </div>

              {/* Section body */}
              <div className="px-6 py-5 space-y-3">
                <p className="text-sm text-muted leading-relaxed">{section.content}</p>
                {section.extra && (
                  <div className="mt-3 p-4 rounded-xl bg-page border border-line">
                    <div className="flex gap-3">
                      <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-muted leading-relaxed">{section.extra}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Agreement Footer */}
        <div className="rounded-2xl overflow-hidden border border-[#0F6B4F]/30 bg-gradient-to-br from-[#0F6B4F]/10 via-card to-card p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0F6B4F]/10 border border-[#0F6B4F]/20 flex items-center justify-center mx-auto">
            <Shield size={26} className="text-[#10b981]" />
          </div>
          <h3 className="text-lg font-bold text-heading">You Agree to These Terms</h3>
          <p className="text-sm text-muted max-w-lg mx-auto leading-relaxed">
            By using <span className="font-semibold text-[#10b981]">TechJourney</span>, you confirm that you have read, understood, and agree to be bound by these Terms & Conditions.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
            <Link
              to="/contact"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0F6B4F] hover:bg-[#0C5A42] text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:-translate-y-0.5"
            >
              <Mail size={15} />
              Contact Us
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-2.5 bg-card hover:bg-soft border border-line text-muted hover:text-heading text-sm font-semibold rounded-xl transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
