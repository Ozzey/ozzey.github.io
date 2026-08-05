import { useEffect } from "react";

export function ResumePage() {
  useEffect(() => {
    window.location.replace("https://ozzey.github.io/");
  }, []);

  return null;
}
