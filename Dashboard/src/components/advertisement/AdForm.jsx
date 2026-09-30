import React from 'react';
import { HiOutlineSave, HiOutlinePhotograph, HiOutlineVideoCamera, HiOutlineMenuAlt2, HiOutlineUpload } from 'react-icons/hi';

const AdForm = ({ adData, handleChange, handleSubmit, uploadFileHandler, loading, uploading }) => {
  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(0,212,255,0.1)', color: '#00d4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <HiOutlineSave size={20} />
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f0f0f5' }}>Settings</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Status Toggle */}
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={adData.isActive}
            onChange={handleChange}
            style={{ width: '20px', height: '20px', borderRadius: '4px', cursor: 'pointer' }}
          />
          <label htmlFor="isActive" style={{ fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#f0f0f5' }}>
            Enable Advertisement Section
          </label>
        </div>

        {/* Text Input */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HiOutlineMenuAlt2 size={16} /> Advertisement Text
          </label>
          <textarea
            name="text"
            value={adData.text}
            onChange={handleChange}
            rows="4"
            placeholder="Enter advertisement text here..."
            className="form-textarea"
            style={{ width: '100%', boxSizing: 'border-box' }}
            required
          ></textarea>
        </div>

        {/* Media Type Selection */}
        <div className="form-group">
          <label className="form-label">Media Type</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="mediaType"
                value="image"
                checked={adData.mediaType === 'image'}
                onChange={handleChange}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#f0f0f5' }}>
                <HiOutlinePhotograph size={16} color="#3b82f6" /> Image
              </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="mediaType"
                value="video"
                checked={adData.mediaType === 'video'}
                onChange={handleChange}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#f0f0f5' }}>
                <HiOutlineVideoCamera size={16} color="#7c3aed" /> Video
              </span>
            </label>
          </div>
        </div>

        {/* Media Upload & URL Input */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            {adData.mediaType === 'image' ? <HiOutlinePhotograph size={16} /> : <HiOutlineVideoCamera size={16} />} 
            {adData.mediaType === 'image' ? 'Image File/URL' : 'Video File/URL'}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <HiOutlineUpload size={16} />
                {uploading ? 'Uploading...' : 'Upload File'}
                <input
                  type="file"
                  onChange={uploadFileHandler}
                  accept={adData.mediaType === 'image' ? "image/*" : "video/*"}
                  style={{ display: 'none' }}
                />
              </label>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>or paste URL below:</span>
            </div>
            <input
              type="url"
              name="mediaUrl"
              value={adData.mediaUrl}
              onChange={handleChange}
              placeholder={`Enter ${adData.mediaType} URL or upload above...`}
              className="form-input"
              style={{ width: '100%', boxSizing: 'border-box' }}
              required
            />
          </div>
        </div>

        <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={loading || uploading}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <HiOutlineSave size={18} />
            {loading ? 'Saving...' : 'Save Advertisement'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdForm;
