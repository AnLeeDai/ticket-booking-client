function useDeviceName() {
  if (typeof navigator === "undefined") return "Unknown";

  const ua = navigator.userAgent.toLowerCase();

  if (/iphone/.test(ua)) return "iPhone";
  if (/ipad/.test(ua)) return "iPad";
  if (/android/.test(ua)) return "Android";
  if (/windows/.test(ua)) return "Windows";
  if (/macintosh|mac os x/.test(ua)) return "MacOS";
  if (/linux/.test(ua)) return "Linux";

  return "Unknown";
}

export default useDeviceName;
