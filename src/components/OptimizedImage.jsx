// Optimized Image Component with lazy loading and smooth fade-in
import React, { useState, useRef, useEffect } from 'react';
import '../styles/OptimizedImage.css';

/**
 * OptimizedImage Component
 * - Lazy loads images using IntersectionObserver
 * - Shows smooth fade-in animation when loaded
 * - Displays placeholder while loading
 */
export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  style = {},
  eager = false, // Set true for above-the-fold images
  ...props 
}) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(eager);
  const imgRef = useRef(null);

  useEffect(() => {
    if (eager) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [eager]);

  return (
    <div 
      ref={imgRef}
      className={`opt-img-wrapper ${className}`}
      style={style}
    >
      {/* Placeholder skeleton */}
      {!loaded && (
        <div className="opt-img-placeholder" aria-hidden="true" />
      )}
      
      {/* Actual image - only loads src when in view */}
      {inView && (
        <img
          src={src}
          alt={alt}
          className={`opt-img ${loaded ? 'opt-img--loaded' : ''}`}
          onLoad={() => setLoaded(true)}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
}

