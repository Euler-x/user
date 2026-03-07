"use client";

import Modal from "@/components/ui/Modal";
import type { Shortcut } from "@/hooks/useKeyboardShortcuts";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: Shortcut[];
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-dark-300 border border-white/10 text-[11px] font-mono text-gray-300 min-w-[20px] justify-center">
      {children}
    </kbd>
  );
}

function formatKeys(key: string) {
  const parts = key.split(" ").length > 1
    ? key.split(" ")
    : key.split("+");

  const separator = key.includes("+") ? "+" : " then ";

  return (
    <span className="flex items-center gap-1">
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-0.5">
          {i > 0 && (
            <span className="text-[10px] text-gray-600 mx-0.5">{separator}</span>
          )}
          <Kbd>{part.charAt(0).toUpperCase() + part.slice(1)}</Kbd>
        </span>
      ))}
    </span>
  );
}

export default function ShortcutsModal({
  isOpen,
  onClose,
  shortcuts,
}: ShortcutsModalProps) {
  const categories = ["General", "Navigation", "Actions"] as const;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts" size="md">
      <div className="space-y-5">
        {categories.map((cat) => {
          const catShortcuts = shortcuts.filter((s) => s.category === cat);
          if (catShortcuts.length === 0) return null;
          return (
            <div key={cat}>
              <h3 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                {cat}
              </h3>
              <div className="space-y-1">
                {catShortcuts.map((sc) => (
                  <div
                    key={sc.key}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.02]"
                  >
                    <span className="text-xs text-gray-300">{sc.description}</span>
                    {formatKeys(sc.key)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
