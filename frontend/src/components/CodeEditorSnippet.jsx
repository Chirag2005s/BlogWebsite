import React, { useState } from 'react';
import { Copy, Check, Terminal, Play, Flame } from 'lucide-react';
import { CODE_OF_THE_DAY } from '../data/mockData';

export default function CodeEditorSnippet() {
  const [copied, setCopied] = useState(false);
  const [outputVisible, setOutputVisible] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_OF_THE_DAY.rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    setOutputVisible(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-[#334155] shadow-2xl shadow-black/80 bg-[#020617] group hover:border-blue-500/40 transition-all duration-300">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0B1120] border-b border-[#334155] select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#EF4444] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#F59E0B] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#22C55E] inline-block shadow-sm" />
          </div>
          
          <div className="ml-3 flex items-center gap-2 px-3 py-1 rounded-md bg-[#1E293B]/80 border border-[#334155] text-xs font-mono text-[#F8FAFC]">
            <Terminal size={12} className="text-[#06B6D4]" />
            <span>{CODE_OF_THE_DAY.title}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
            title="Execute Code"
          >
            <Play size={11} fill="currentColor" />
            <span>Run</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155] transition-colors border border-[#334155]"
            title="Copy snippet"
          >
            {copied ? (
              <>
                <Check size={12} className="text-[#22C55E]" />
                <span className="text-[#22C55E]">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="p-5 font-mono text-sm sm:text-base leading-relaxed overflow-x-auto bg-[#020617]">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="select-none pr-4 text-right text-[#64748B] text-xs align-top w-6">1</td>
              <td className="text-[#F8FAFC]">
                <span className="text-[#8B5CF6] font-semibold">const</span>{' '}
                <span className="text-[#3B82F6]">developer</span>{' '}
                <span className="text-[#06B6D4]">=</span> {'{'}
              </td>
            </tr>
            <tr>
              <td className="select-none pr-4 text-right text-[#64748B] text-xs align-top">2</td>
              <td className="text-[#F8FAFC] pl-4">
                <span className="text-[#94A3B8]">learn:</span>{' '}
                <span className="text-[#22C55E] font-semibold">true</span>,
              </td>
            </tr>
            <tr>
              <td className="select-none pr-4 text-right text-[#64748B] text-xs align-top">3</td>
              <td className="text-[#F8FAFC] pl-4">
                <span className="text-[#94A3B8]">build:</span>{' '}
                <span className="text-[#22C55E] font-semibold">true</span>,
              </td>
            </tr>
            <tr>
              <td className="select-none pr-4 text-right text-[#64748B] text-xs align-top">4</td>
              <td className="text-[#F8FAFC] pl-4">
                <span className="text-[#94A3B8]">improve:</span>{' '}
                <span className="text-[#22C55E] font-semibold">true</span>
              </td>
            </tr>
            <tr>
              <td className="select-none pr-4 text-right text-[#64748B] text-xs align-top">5</td>
              <td className="text-[#F8FAFC]">{'};'}</td>
            </tr>
            <tr>
              <td className="select-none pr-4 text-right text-[#64748B] text-xs align-top">6</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td className="select-none pr-4 text-right text-[#64748B] text-xs align-top">7</td>
              <td className="text-[#F8FAFC]">
                <span className="text-[#3B82F6]">console</span>
                <span className="text-[#94A3B8]">.</span>
                <span className="text-[#8B5CF6]">log</span>
                <span className="text-[#06B6D4]">(</span>
                <span className="text-[#06B6D4]">"Keep Coding 🚀"</span>
                <span className="text-[#06B6D4]">)</span>
                <span className="text-[#94A3B8]">;</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Simulated Console Output */}
      {outputVisible && (
        <div className="px-5 py-3 bg-[#0B1120] border-t border-[#334155] font-mono text-xs flex items-center justify-between animate-slide-down">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="text-[#64748B]">&gt;</span>
            <span className="font-semibold">Keep Coding 🚀</span>
          </div>
          <span className="text-[#64748B]">Process exited with code 0 (2ms)</span>
        </div>
      )}

      {/* Bottom Bar Status */}
      <div className="px-4 py-2 bg-[#080D1A] border-t border-[#334155]/60 flex items-center justify-between text-[11px] font-mono text-[#64748B]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#06B6D4]">
            <Flame size={12} /> TechJourney Code of the Day
          </span>
          <span>UTF-8</span>
        </div>
        <div>JavaScript (ES2026)</div>
      </div>
    </div>
  );
}
