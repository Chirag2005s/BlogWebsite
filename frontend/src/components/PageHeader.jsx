import React from 'react';

/**
 * Consistent page hero used across list and content pages.
 */
export default function PageHeader({ icon: Icon, eyebrow, title, titleAccent, description, children }) {
  return (
    <div className="relative py-8 sm:py-12 border-b border-line overflow-hidden">
      <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none" />
      <div className="relative max-w-3xl space-y-4">
        {eyebrow && (
          <div className="eyebrow-badge">
            {Icon && <Icon size={14} />}
            <span>{eyebrow}</span>
          </div>
        )}
        <h1 className="page-title">
          {title}
          {titleAccent && (
            <>
              {' '}
              <span className="tech-gradient-text">{titleAccent}</span>
            </>
          )}
        </h1>
        {description && <p className="page-subtitle">{description}</p>}
        {children}
      </div>
    </div>
  );
}
