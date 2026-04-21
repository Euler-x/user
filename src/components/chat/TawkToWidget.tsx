"use client";

import { useEffect } from "react";

export default function TawkToWidget() {
  useEffect(() => {
    if (document.getElementById("tawk-to")) return;
    const s = document.createElement("script");
    s.id = "tawk-to";
    s.async = true;
    s.src = "https://embed.tawk.to/69e2771df9ded71c3402789b/1jmea2jh1";
    s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    document.head.appendChild(s);
  }, []);

  return null;
}
