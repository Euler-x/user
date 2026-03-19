"use client";

import { Shield, FileText, AlertTriangle, Database } from "lucide-react";

const legalLinks = [
  { href: "/legal/terms", label: "Terms of Service", icon: FileText },
  { href: "/legal/privacy", label: "Privacy Policy", icon: Shield },
  { href: "/legal/gdpr", label: "GDPR Compliance", icon: Database },
  { href: "/legal/risk-disclosure", label: "Risk Disclosure", icon: AlertTriangle },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-200/50 backdrop-blur-sm mt-auto">
      <div className="px-4 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {legalLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-neon transition-colors"
              >
                <Icon className="h-3 w-3" />
                {label}
              </a>
            ))}
          </div>

          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Euler X. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
