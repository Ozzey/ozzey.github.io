import { useEffect } from "react";

export function ResumePage() {
  useEffect(() => {
    const resumeUrl = new URL("/", window.location.origin);
    resumeUrl.searchParams.set("from", "portfolio");

    window.location.replace(resumeUrl.toString());
  }, []);

  return null;
}
