import React, { useEffect, useRef, useState } from 'react';

const GoogleTranslate: React.FC = () => {
  const [widgetInitialized, setWidgetInitialized] = useState(false);
  const translateElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initializeWidget = () => {
      if (
        window.google &&
        window.google.translate &&
        window.google.translate.TranslateElement
      ) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,fr,es,de,zh-CN,ms,hi',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          translateElementRef.current!
        );
        setWidgetInitialized(true);
      }
    };

    // Load the Google Translate script
    const scriptExists = document.querySelector(
      'script[src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]'
    );

    if (!scriptExists) {
      const script = document.createElement('script');
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      // Set up the global callback
      window.googleTranslateElementInit = initializeWidget;

      // Add a fallback in case the script doesn't load immediately
      script.onload = initializeWidget;
    } else {
      // If script exists, initialize the widget immediately
      initializeWidget();
    }

    return () => {
      // Cleanup the widget to avoid duplication
      if (translateElementRef.current) {
        translateElementRef.current.innerHTML = '';
      }
      setWidgetInitialized(false);
    };
  }, []);

  const handleLogoClick = () => {
    if (translateElementRef.current) {
      const isVisible = translateElementRef.current.style.display === 'block';
      translateElementRef.current.style.display = isVisible ? 'none' : 'block';
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Google Translate Logo */}
      <img
        src="/images/GoogleTranslate.png"
        alt="Google Translate Logo"
        style={{ cursor: 'pointer', marginTop: '10px' }}
        className="w-10 h-10 object-contain"
        onClick={handleLogoClick}
      />

      {/* Translation Dropdown */}
      <div
        id="google_translate_element"
        ref={translateElementRef}
        style={{
          display: 'none',
          position: 'absolute',
          top: '40px',
          right: '0px',
          zIndex: 1000,
          backgroundColor: 'white',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      ></div>
    </div>
  );
};

export default GoogleTranslate;
