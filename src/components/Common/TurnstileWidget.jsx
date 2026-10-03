import { useEffect, useRef, useState } from "react";
import { ShieldCheck, AlertCircle } from "lucide-react";

export const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY ||
  "0x4AAAAAAFM2AAF9bt8YWPjl";

/**
 * Cloudflare Turnstile Human Verification Widget
 * Provides seamless, non-intrusive CAPTCHA protection for forms
 */
export default function TurnstileWidget({
  onVerify,
  onError,
  onExpire,
  className = "",
  theme = "dark",
}) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let checkInterval;

    const renderWidget = () => {
      if (
        window.turnstile &&
        containerRef.current &&
        widgetIdRef.current === null
      ) {
        try {
          const id = window.turnstile.render(containerRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            theme: theme,
            size: "flexible",
            callback: (token) => {
              if (onVerify) onVerify(token);
            },
            "error-callback": (err) => {
              console.warn("[Turnstile] Widget error:", err);
              if (onError) onError(err);
            },
            "expired-callback": () => {
              if (onExpire) onExpire();
            },
          });
          widgetIdRef.current = id;
          setIsLoaded(true);
        } catch (e) {
          console.warn("[Turnstile] Render error:", e);
        }
      }
    };

    // If script is already loaded
    if (window.turnstile) {
      renderWidget();
    } else {
      // Check if script tag is already in DOM
      let script = document.getElementById("cf-turnstile-script");
      if (!script) {
        script = document.createElement("script");
        script.id = "cf-turnstile-script";
        script.src =
          "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onerror = () => setLoadError(true);
        document.head.appendChild(script);
      }

      checkInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkInterval);
          renderWidget();
        }
      }, 100);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (widgetIdRef.current !== null && window.turnstile?.remove) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore cleanup errors
        }
        widgetIdRef.current = null;
      }
    };
  }, [onVerify, onError, onExpire, theme]);

  if (loadError) {
    return (
      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
        <AlertCircle size={16} className="text-red-400 shrink-0" />
        <span>Security challenge script failed to load. Please check your network or ad-blocker.</span>
      </div>
    );
  }

  return (
    <div className={`turnstile-container overflow-hidden rounded-2xl ${className}`}>
      <div
        ref={containerRef}
        className="min-h-[65px] flex items-center justify-center"
      />
    </div>
  );
}
