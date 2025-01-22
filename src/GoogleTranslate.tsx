import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const GoogleTranslate: React.FC = () => {
  const [widgetInitialized, setWidgetInitialized] = useState(false);
  const translateElementRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const observerRef = useRef<MutationObserver | null>(null);

  const initializeWidget = () => {
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      if (translateElementRef.current) {
        translateElementRef.current.innerHTML = ''; // Clear any previous widget

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

        // Observe for changes to the Google Translate banner
        setupBannerObserver();
      }
    } else {
      console.error('Google Translate Element is not available.');
    }
  };

  const loadGoogleTranslateScript = () => {
    const scriptId = 'google-translate-script';
    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;

    window.googleTranslateElementInit = () => {
      initializeWidget();
    };

    script.onload = () => {
      console.log('Google Translate script loaded successfully.');
    };

    script.onerror = () => {
      console.error('Failed to load the Google Translate script.');
    };

    document.body.appendChild(script);
  };

  const setupBannerObserver = () => {
    const bodyObserver = new MutationObserver(() => {
      const banner = document.querySelector('.goog-te-banner-frame');
      const navbar = document.querySelector('.navbar'); // Adjust this selector based on your navbar

      if (banner) {
        // Add padding to the navbar if the banner is present
        if (navbar) {
          navbar.setAttribute('style', 'padding-top: 40px; transition: padding 0.3s;');
        }
      } else {
        // Remove the padding if the banner is gone
        if (navbar) {
          navbar.setAttribute('style', 'padding-top: 0px; transition: padding 0.3s;');
        }
      }
    });

    // Observe the body for changes (e.g., banner added/removed)
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    // Clean up observer on unmount
    observerRef.current = bodyObserver;
  };

  useEffect(() => {
    loadGoogleTranslateScript();

    return () => {
      if (translateElementRef.current) {
        translateElementRef.current.innerHTML = '';
      }
      setWidgetInitialized(false);

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      const script = document.getElementById('google-translate-script');
      if (script) {
        script.remove();
      }
    };
  }, [location]);

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
