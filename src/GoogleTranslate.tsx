import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const GoogleTranslate: React.FC = () => {
  const [widgetInitialized, setWidgetInitialized] = useState(false);
  const translateElementRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation(); // Track screen changes

  // Function to initialize the Google Translate widget
  const initializeWidget = () => {
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      if (translateElementRef.current) {
        // Clear previous content if it exists
        translateElementRef.current.innerHTML = '';

        // Initialize the Google Translate widget
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
        console.log('Google Translate Widget initialized.');
      }
    } else {
      console.error('Google Translate Element not available.');
    }
  };

  // Function to load the Google Translate script dynamically
  const loadGoogleTranslateScript = () => {
    const scriptId = 'google-translate-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      // Create the script element if it doesn't exist
      script = document.createElement('script');
      script.id = scriptId;
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;

      // Define the global callback to initialize the widget when the script is loaded
      window.googleTranslateElementInit = () => {
        // Directly initialize the widget without delay
        initializeWidget();
      };

      script.onload = () => {
        console.log('Google Translate script loaded successfully.');
      };

      script.onerror = () => {
        console.error('Failed to load the Google Translate script.');
      };

      document.body.appendChild(script);
    } else {
      // If the script is already in the DOM, initialize the widget
      console.log('Google Translate script already loaded. Reinitializing...');
      initializeWidget();
    }
  };

  // React useEffect hook to track screen changes and initialize the widget
  useEffect(() => {
    // Load the script and initialize the widget on route change
    loadGoogleTranslateScript();

    // Cleanup on component unmount or when the location changes
    return () => {
      if (translateElementRef.current) {
        translateElementRef.current.innerHTML = ''; // Clear widget content
      }
      setWidgetInitialized(false); // Reset widget state
    };
  }, [location]); // Reinitialize on location change (route change)

  const handleLogoClick = () => {
    if (translateElementRef.current) {
      const isVisible = translateElementRef.current.style.display === 'block';
      translateElementRef.current.style.display = isVisible ? 'none' : 'block';
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <img
        src="/images/GoogleTranslate.png"
        alt="Google Translate Logo"
        style={{
          cursor: 'pointer',
          marginTop: '10px',
          opacity: widgetInitialized ? 1 : 0.5,
        }}
        className="w-10 h-10 object-contain"
        onClick={widgetInitialized ? handleLogoClick : undefined}
      />
      {!widgetInitialized && <p>Loading Google Translate...</p>}

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