import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // Milliseconds interval
  isAsciiArt?: boolean;
  bypassTyping?: boolean;
  onComplete?: () => void;
}

export function TypewriterText({ 
  text, 
  speed = 10, 
  isAsciiArt = false,
  bypassTyping = false,
  onComplete
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState(() => {
    if (isAsciiArt || bypassTyping) {
      return text;
    }
    return '';
  });

  useEffect(() => {
    if (isAsciiArt || bypassTyping) {
      setDisplayedText(text);
      // Removed automatic scroll lock to bottom for static/completed lines,
      // which allows users to scroll up and read history freely.
      const timer = setTimeout(() => {
        onComplete?.();
      }, 5);
      return () => clearTimeout(timer);
    }

    let currentIndex = 0;
    setDisplayedText('');

    if (!text) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 5);
      return () => clearTimeout(timer);
    }

    // Adjust chunk size and speed depending on the text length for optimized readability and UX
    const stepSize = text.length > 400 ? 6 : (text.length > 150 ? 3 : 1);
    const adjustedSpeed = text.length > 400 ? 4 : speed;

    const intervalId = setInterval(() => {
      currentIndex += stepSize;
      
      if (currentIndex >= text.length) {
        setDisplayedText(text);
        clearInterval(intervalId);
        onComplete?.();
      } else {
        setDisplayedText(text.slice(0, currentIndex));
      }

      // Smoothly push container scrollbar to the bottom as text content expands,
      // but ONLY if the user is currently at or near the bottom.
      // This prevents locking the viewport if they manually scroll up.
      const scrollbox = document.getElementById('terminal-scrollbox');
      if (scrollbox) {
        const threshold = 100; // px threshold from bottom
        const isNearBottom = scrollbox.scrollHeight - scrollbox.scrollTop - scrollbox.clientHeight < threshold;
        if (isNearBottom) {
          scrollbox.scrollTop = scrollbox.scrollHeight;
        }
      }
    }, adjustedSpeed);

    return () => {
      clearInterval(intervalId);
    };
  }, [text, speed, isAsciiArt, bypassTyping, onComplete]);

  return <>{displayedText}</>;
}
