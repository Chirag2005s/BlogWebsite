import React from 'react';
import { HiOutlineEye, HiOutlinePhotograph, HiOutlineVideoCamera } from 'react-icons/hi';

const AdPreview = ({ adData }) => {
  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <HiOutlineEye size={20} />
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f0f0f5' }}>Live Preview</h2>
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', minHeight: '400px', position: 'relative' }}>
        
        {!adData.isActive && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)', padding: '8px 16px', borderRadius: '8px', fontWeight: '500', letterSpacing: '0.025em' }}>
              Currently Disabled
            </div>
          </div>
        )}

        {(!adData.text && !adData.mediaUrl) ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '8px' }}>
            <HiOutlinePhotograph size={40} style={{ opacity: 0.3 }} />
            <span style={{ fontSize: '14px' }}>Preview will appear here</span>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#0B1120', position: 'relative' }} className="preview-container">
            {/* Standard layout is column (mobile), but we want row on larger screens.
                Since we can't easily use media queries inline, we will just use a row layout. 
                Wait, row layout is better for previews anyway. */}
            <div style={{ display: 'flex', flex: 1, flexDirection: 'row', width: '100%', height: '100%' }}>
              
              {/* Left: Text Content */}
              <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white', position: 'relative', zIndex: 10, minHeight: '250px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#00d4ff', fontWeight: 'bold', background: 'rgba(0,212,255,0.1)', padding: '4px 8px', borderRadius: '9999px', border: '1px solid rgba(0,212,255,0.2)', alignSelf: 'flex-start', marginBottom: '16px', boxShadow: '0 0 10px rgba(0,212,255,0.2)' }}>
                  Sponsored
                </span>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', lineHeight: '1.625', whiteSpace: 'pre-wrap' }}>
                  {adData.text || "Your advertisement text..."}
                </p>
              </div>

              {/* Right: Media Content */}
              <div style={{ flex: 1, background: 'black', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {adData.mediaUrl ? (
                  adData.mediaType === 'image' ? (
                    <img src={adData.mediaUrl} alt="Ad Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', inset: 0, zIndex: 0 }} />
                  ) : (
                    <video src={adData.mediaUrl} controls autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', inset: 0, zIndex: 0 }} />
                  )
                ) : (
                  <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    {adData.mediaType === 'image' ? <HiOutlinePhotograph size={32} /> : <HiOutlineVideoCamera size={32} />}
                    <span style={{ fontSize: '12px' }}>No media provided</span>
                  </div>
                )}
                
                {/* Media Overlay Gradient */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, black, transparent)', pointerEvents: 'none', zIndex: 10 }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdPreview;
