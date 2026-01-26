"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { headerNavLinks } from "./nav-links";
import { scrollToSection } from "./navigation";
import "./mobile-menu.css";

export function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    // Return focus to menu button when closing
    setTimeout(() => {
      menuButtonRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Keyboard support: Escape key and focus trap
  useEffect(() => {
    if (!isMenuOpen || !mounted) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    // Focus trap: keep focus within menu when open
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const menu = document.querySelector('[role="dialog"]') as HTMLElement;
      if (!menu) return;

      const focusableElements = menu.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("keydown", handleTab);

    // Focus first focusable element when menu opens
    const menu = document.querySelector('[role="dialog"]') as HTMLElement;
    if (menu) {
      const firstFocusable = menu.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("keydown", handleTab);
    };
  }, [isMenuOpen, mounted]);

  const menuContent = mounted ? (
    <>
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`lg:hidden fixed top-0 right-0 bottom-0 w-[280px] max-w-[80vw] z-[70] overflow-y-auto bg-[#0a0a0f] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="text-lg font-semibold text-white">Menu</span>
          <button
            type="button"
            onClick={closeMenu}
            className="p-2 -mr-2 text-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] rounded-md"
            aria-label="Close menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="px-4 py-6">
          <div className="flex flex-col gap-1">
            {headerNavLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                  closeMenu();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    scrollToSection(link.href);
                    closeMenu();
                  }
                }}
                className={`text-base font-medium text-white/60 transition-all hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] py-3 px-3 rounded-lg hover:bg-white/5 ${
                  isMenuOpen ? "animate-fade-in-right" : ""
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "backwards",
                }}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-6 mt-4 border-t border-white/10">
              <Button variant="default" className="w-full" asChild>
                <Link
                  href="/onboarding/search"
                  onClick={() => closeMenu()}
                  className="flex items-center justify-center gap-1.5"
                  aria-label="Get Started"
                >
                  Get Started
                  <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </>
  ) : null;

  return (
    <>
      <button
        type="button"
        ref={menuButtonRef}
        onClick={toggleMenu}
        className="lg:hidden p-2 -mr-2 text-white transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] rounded-md"
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <HugeiconsIcon
            icon={Menu01Icon}
            strokeWidth={2}
            className="h-6 w-6"
          />
        )}
      </button>

      {mounted && createPortal(menuContent, document.body)}
    </>
  );
}
