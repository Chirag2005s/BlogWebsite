import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, MapPin, Send, Clock, MessageCircle, CheckCircle2, AlertCircle,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import api from '../services/api';

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    title: 'Email',
    value: 'techjourney822@gmail.com',
    hint: 'We reply within 24 hours',
  },
  {
    icon: Phone,
    title: 'Phone',
    value: 'None | Send Message',
    hint: 'Mon–Fri, 10:00–18:00 IST',
  },
  {
    icon: MapPin,
    title: 'Studio',
    value: 'Bengaluru, India',
    hint: 'Remote-first team',
  },
  {
    icon: Clock,
    title: 'Support hours',
    value: 'All Time',
    hint: 'Closed on public holidays',
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in your name, email, and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/contact', form);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact submission error:', err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <PageHeader
        icon={MessageCircle}
        eyebrow="Get in touch"
        title="Contact"
        titleAccent="TechJourney"
        description="Questions about articles, partnerships, or the platform? Send a message and the team will get back to you."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CONTACT_CHANNELS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              whileHover={{ y: -5, scale: 1.02 }}
              key={item.title} 
              className="surface-card p-5 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-soft border border-line flex items-center justify-center text-[#0F6B4F] mb-3">
                <Icon size={18} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">{item.title}</p>
              <p className="mt-1 text-sm font-semibold text-heading">{item.value}</p>
              <p className="mt-1 text-xs text-muted">{item.hint}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3 surface-card p-6 sm:p-8 shadow-xl"
        >
          <h2 className="text-xl font-bold text-heading mb-1">Send a message</h2>
          <p className="text-sm text-muted mb-6">Share a few details and we will respond by email.</p>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-5 rounded-2xl bg-soft border border-line flex items-start gap-3 text-[#0F6B4F]"
              >
                <CheckCircle2 size={20} className="shrink-0 mt-0.5 text-emerald-400" />
                <div>
                  <p className="font-semibold text-emerald-400">Message sent successfully!</p>
                  <p className="text-sm text-muted mt-1">Thanks for reaching out. We will reply as soon as we can.</p>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-3 text-sm font-semibold link-accent cursor-pointer"
                  >
                    Send another message
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-4"
              >
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                  >
                    <AlertCircle size={16} />
                    {error}
                  </motion.div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-muted mb-2">Name</label>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      className="input-field"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-muted mb-2">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={onChange}
                      className="input-field"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-muted mb-2">Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={onChange}
                    className="input-field"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-muted mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={onChange}
                    className="input-field resize-y min-h-32"
                    placeholder="Tell us a bit more…"
                  />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit" 
                  disabled={loading} 
                  className="btn-primary disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Sending…' : 'Send message'}
                  <Send size={16} />
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-4"
        >
          <motion.div whileHover={{ y: -3 }} className="surface-card p-6 shadow-lg">
            <h3 className="text-lg font-bold text-heading mb-2">Editorial &amp; partnerships</h3>
            <p className="text-sm text-muted leading-relaxed">
              Guest posts, sponsorships, and collaboration requests are welcome. Include your timeline and audience so we can respond with a clear next step.
            </p>
          </motion.div>
          <motion.div whileHover={{ y: -3 }} className="surface-card p-6 shadow-lg">
            <h3 className="text-lg font-bold text-heading mb-2">Technical issues</h3>
            <p className="text-sm text-muted leading-relaxed">
              For bugs on the site, mention the page URL and what you expected to happen. That helps us reproduce and fix it faster.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
