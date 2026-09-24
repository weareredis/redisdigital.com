export const GA_MEASUREMENT_ID = "G-60X4E7P2XQ";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackPageView(pathname: string) {
  if (typeof window.gtag !== "function") return;
  window.gtag("config", GA_MEASUREMENT_ID, { page_path: pathname });
}
