/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // Custom utilities for CLS prevention
      spacing: {
        safe: '1px', // Minimal spacing to prevent layout shifts
        'safe-2': '2px',
        'safe-4': '4px',
      },
      aspectRatio: {
        hero: '16/9',
        card: '4/3',
        square: '1/1',
        video: '16/9',
        thumbnail: '3/2',
      },
      animation: {
        // Layout-safe animations that don't cause CLS
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-in',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      // CLS-safe transition properties
      transitionProperty: {
        safe: 'opacity, transform, color, background-color, border-color, text-decoration-color, fill, stroke',
        colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
        opacity: 'opacity',
        transform: 'transform',
      },
      // Reserved space utilities for preventing layout shifts
      minHeight: {
        hero: '400px',
        card: '200px',
        thumbnail: '120px',
        avatar: '40px',
        button: '44px',
      },
      minWidth: {
        button: '44px',
        input: '200px',
        card: '280px',
      },
      // Skeleton loading utilities
      backgroundImage: {
        shimmer: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      },
      backgroundSize: {
        shimmer: '200% 100%',
      },
    },
  },
  plugins: [
    // Custom plugin for CLS-safe utilities
    function ({ addUtilities, theme }) {
      const newUtilities = {
        // Reserved space utilities
        '.reserve-space': {
          'min-height': '1px',
          'min-width': '1px',
          contain: 'layout style',
        },
        '.reserve-hero': {
          'min-height': theme('minHeight.hero'),
          contain: 'layout style',
        },
        '.reserve-card': {
          'min-height': theme('minHeight.card'),
          contain: 'layout style',
        },
        '.reserve-thumbnail': {
          'min-height': theme('minHeight.thumbnail'),
          contain: 'layout style',
        },

        // Layout stability utilities
        '.stable-grid': {
          display: 'grid',
          contain: 'layout style',
          'grid-template-columns': 'repeat(auto-fit, minmax(280px, 1fr))',
        },
        '.stable-flex': {
          display: 'flex',
          contain: 'layout style',
          'flex-wrap': 'wrap',
        },
        '.stable-flex > *': {
          'min-width': '0',
          'flex-shrink': '1',
        },

        // Image stability utilities
        '.img-stable': {
          display: 'block',
          'max-width': '100%',
          height: 'auto',
          contain: 'layout style',
        },
        '.img-fixed': {
          width: '100%',
          height: '100%',
          'object-fit': 'cover',
          contain: 'layout style',
        },

        // Text stability utilities
        '.text-stable': {
          'line-height': '1.5',
          'word-wrap': 'break-word',
          'overflow-wrap': 'break-word',
        },
        '.text-clamp-1': {
          display: '-webkit-box',
          '-webkit-line-clamp': '1',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.text-clamp-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.text-clamp-3': {
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },

        // Animation utilities that don't cause layout shifts
        '.animate-safe': {
          'transition-property': theme('transitionProperty.safe'),
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '150ms',
        },
        '.animate-colors': {
          'transition-property': theme('transitionProperty.colors'),
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '150ms',
        },
        '.animate-opacity': {
          'transition-property': theme('transitionProperty.opacity'),
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '150ms',
        },
        '.animate-transform': {
          'transition-property': theme('transitionProperty.transform'),
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '150ms',
        },

        // Skeleton loading utilities
        '.skeleton': {
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          'background-size': '200% 100%',
          animation: 'shimmer 1.5s ease-in-out infinite',
        },
        '.skeleton-text': {
          height: '1em',
          'border-radius': '4px',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          'background-size': '200% 100%',
          animation: 'shimmer 1.5s ease-in-out infinite',
        },
        '.skeleton-avatar': {
          width: '40px',
          height: '40px',
          'border-radius': '50%',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          'background-size': '200% 100%',
          animation: 'shimmer 1.5s ease-in-out infinite',
        },

        // Focus utilities for accessibility
        '.focus-visible': {
          outline: '2px solid transparent',
          'outline-offset': '2px',
        },
        '.focus-visible:focus-visible': {
          outline: '2px solid #3b82f6',
          'outline-offset': '2px',
        },

        // Safe hover effects
        '.hover-lift': {
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        },
        '.hover-lift:hover': {
          transform: 'translateY(-2px)',
          'box-shadow': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        '.hover-scale': {
          transition: 'transform 0.2s ease-in-out',
        },
        '.hover-scale:hover': {
          transform: 'scale(1.02)',
        },

        // Container query utilities for responsive design
        '.container-stable': {
          'container-type': 'inline-size',
          contain: 'layout style',
        },

        // Prevent layout shift during loading
        '.loading-stable': {
          'min-height': '200px',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          contain: 'layout style',
        },
      };

      addUtilities(newUtilities);
    },
  ],
};
