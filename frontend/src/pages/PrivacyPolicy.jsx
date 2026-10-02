import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye, ChevronRight, AlertTriangle, Lock, FileText,
  Cookie, Globe, Shield, Database, UserCheck, RefreshCw, Mail, Server
} from 'lucide-react';

const SECTIONS = [
  {
    id: 1,
    icon: FileText,
    color: '#0F6B4F',
    bg: 'from-[#0F6B4F]/10 to-[#0F6B4F]/5',
    border: 'border-[#0F6B4F]/20',
    title: 'Information We Collect',
    content: 'We may collect information you voluntarily provide, such as your name, email address, username, profile details, comments, programming problems, solutions, and other content you submit.',
    extra: 'We may also collect basic technical information such as IP address, browser type, device information, pages visited, and website usage data.',
  },
  {
    id: 2,
    icon: Eye,
    color: '#3b82f6',
    bg: 'from-[#3b82f6]/10 to-[#3b82f6]/5',
    border: 'border-[#3b82f6]/20',
    title: 'How We Use Information',
    content: 'Information may be used to:',
    bullets: [
      'Create and manage accounts.',
      'Provide and improve website features.',
      'Display user-submitted content.',
      'Respond to questions and support requests.',
      'Improve performance and user experience.',
      'Prevent spam, abuse, fraud, and unauthorized activity.',
      'Understand general website usage.',
    ],
  },
  {
    id: 3,
    icon: Globe,
    color: '#a78bfa',
    bg: 'from-[#a78bfa]/10 to-[#a78bfa]/5',
    border: 'border-[#a78bfa]/20',
    title: 'Public Content',
    content: 'Problems, solutions, comments, and other content intentionally submitted to public areas of TechJourney may be visible to other users.',
    warning: 'Do not publish passwords, API keys, authentication tokens, database credentials, confidential information, or sensitive personal information.',
  },
  {
    id: 4,
    icon: Cookie,
    color: '#f97316',
    bg: 'from-[#f97316]/10 to-[#f97316]/5',
    border: 'border-[#f97316]/20',
    title: 'Cookies',
    content: 'TechJourney may use cookies to maintain sessions, remember preferences, improve functionality, analyze usage, and enhance security. You can manage cookies through your browser settings.',
  },
  {
    id: 5,
    icon: Server,
    color: '#06b6d4',
    bg: 'from-[#06b6d4]/10 to-[#06b6d4]/5',
    border: 'border-[#06b6d4]/20',
    title: 'Third-Party Services',
    content: 'We may use third-party services for hosting, authentication, analytics, security, email, databases, or other functionality. Their use of information is governed by their respective policies.',
  },
  {
    id: 6,
    icon: Lock,
    color: '#ec4899',
    bg: 'from-[#ec4899]/10 to-[#ec4899]/5',
    border: 'border-[#ec4899]/20',
    title: 'Data Security',
    content: 'We use reasonable measures to protect information from unauthorized access, misuse, loss, or disclosure. However, no internet service can guarantee complete security.',
  },
  {
    id: 7,
    icon: Database,
    color: '#facc15',
    bg: 'from-[#facc15]/10 to-[#facc15]/5',
    border: 'border-[#facc15]/20',
    title: 'Data Retention',
    content: 'Information may be retained as reasonably necessary to provide services, maintain security, meet legal obligations, and operate TechJourney.',
  },
  {
    id: 8,
    icon: UserCheck,
    color: '#10b981',
    bg: 'from-[#10b981]/10 to-[#10b981]/5',
    border: 'border-[#10b981]/20',
    title: 'Your Rights',
    content: 'Subject to applicable law, you may request access to, correction of, or deletion of certain personal information.',
  },
  {
    id: 9,
    icon: RefreshCw,
    color: '#8b5cf6',
    bg: 'from-[#8b5cf6]/10 to-[#8b5cf6]/5',
    border: 'border-[#8b5cf6]/20',
    title: 'Changes',
    content: 'We may update this Privacy Policy when necessary. Changes will be posted on this page with a revised "Last Updated" date.',
  },
  {
    id: 10,
    icon: Mail,
    color: '#f43f5e',
    bg: 'from-[#f43f5e]/10 to-[#f43f5e]/5',
    border: 'border-[#f43f5e]/20',
    title: 'Contact',
    content: 'For privacy questions or requests, please contact TechJourney using the official contact information provided on the website.',
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy – Tech Journey';
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#3b82f6]/8 blur-[100px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted mb-8">
            <Link to="/" className="hover:text-heading transition-colors">Home</Link>
            <ChevronRight size={14} className="opacity-40" />
            <span className="text-heading font-medium">Privacy Policy</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="p-4 bg-gradient-to-br from-[#3b82f6]/20 to-[#3b82f6]/5 border border-[#3b82f6]/20 rounded-2xl shrink-0">
              <Shield size={36} className="text-[#3b82f6]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] text-xs font-semibold mb-4">
                <Lock size={13} />
                Legal Document
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-heading leading-tight mb-3">
                Privacy Policy
              </h1>
              <p className="text-muted text-sm leading-relaxed max-w-2xl">
                TechJourney respects your privacy and is committed to protecting your information. This policy explains how information may be collected and used when you access or use our platform.
              </p>
              <div className="mt-5 flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-lg bg-card border border-line text-xs text-muted font-medium">
                  🗓 Last Updated: October 2, 2026
                </span>
                <span className="px-3 py-1 rounded-lg bg-card border border-line text-xs text-muted font-medium">
                  📋 10 Sections
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14 space-y-8">

        {/* Intro Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#3b82f6]/10 via-transparent to-transparent border border-[#3b82f6]/20">
          <p className="text-sm text-heading leading-relaxed">
            Welcome to <span className="font-bold text-[#3b82f6]">TechJourney</span> — a technology and programming platform providing blogs, articles, roadmaps, programming resources, Problem Hub, comments, and other features.
            <span className="block mt-2 text-muted">By accessing or using TechJourney, you acknowledge this Privacy Policy.</span>
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
              className="group bg-card border border-line rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:shadow-black/10 scroll-mt-24"
            >
              {/* Section header */}
              <div className={`flex items-center gap-4 px-6 py-4 bg-gradient-to-r ${section.bg} border-b ${section.border}`}>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{ background: `${section.color}15`, borderColor: `${section.color}30` }}
                >
                  <section.icon size={17} style={{ color: section.color }} />
                </div>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded-md shrink-0"
                    style={{ color: section.color, background: `${section.color}15` }}
                  >
                    §{section.id}
                  </span>
                  <h2 className="text-base font-bold text-heading truncate">{section.title}</h2>
                </div>
              </div>

              {/* Section body */}
              <div className="px-6 py-5 space-y-3">
                <p className="text-sm text-muted leading-relaxed">{section.content}</p>

                {/* Bullet list */}
                {section.bullets && (
                  <ul className="mt-3 space-y-2">
                    {section.bullets.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: section.color }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Extra text */}
                {section.extra && (
                  <p className="text-sm text-muted leading-relaxed mt-1">{section.extra}</p>
                )}

                {/* Warning block */}
                {section.warning && (
                  <div className="mt-3 p-4 rounded-xl bg-page border border-yellow-500/20">
                    <div className="flex gap-3">
                      <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-muted leading-relaxed">{section.warning}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Acknowledgement Footer */}
        <div className="rounded-2xl overflow-hidden border border-[#3b82f6]/30 bg-gradient-to-br from-[#3b82f6]/10 via-card to-card p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center mx-auto">
            <Shield size={26} className="text-[#3b82f6]" />
          </div>
          <h3 className="text-lg font-bold text-heading">You Acknowledge This Policy</h3>
          <p className="text-sm text-muted max-w-lg mx-auto leading-relaxed">
            By using <span className="font-semibold text-[#3b82f6]">TechJourney</span>, you confirm that you have read and understood this Privacy Policy and how your information may be collected and used.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
            <Link
              to="/contact"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:-translate-y-0.5"
            >
              <Mail size={15} />
              Contact Us
            </Link>
            <Link
              to="/terms"
              className="flex items-center gap-2 px-5 py-2.5 bg-card hover:bg-soft border border-line text-muted hover:text-heading text-sm font-semibold rounded-xl transition-all"
            >
              <FileText size={15} />
              Terms & Conditions
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
