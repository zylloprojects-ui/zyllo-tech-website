"use client";

import { ArrowRight, ExternalLink, Loader2, Search, Sparkles, X, Compass } from "lucide-react";
import Image from "@/lib/nx/image";
import Link from "@/lib/nx/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { searchSite } from "@/lib/api/search";
import { getVerifiedAnswer } from "@/lib/api/ai-knowledge";
import { supabase } from "@/lib/supabase/client";

const SUGGESTIONS = [
  "What services does Zyllo Tech offer?",
  "Do you build mobile apps?",
  "How do I get a quote / estimate?",
  "AI & Machine Learning solutions",
];

export default function AISearchBar({ variant = "icon" }) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState(null);
  const [quickActions, setQuickActions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Global keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    function handleGlobalKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Modal open/close side effects (Escape key & body scroll lock)
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") closeBar();
    }
    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 60);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      clearTimeout(focusTimer);
    };
  }, [isOpen]);

  // Live client-side search matching while typing
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults([]);
      return;
    }

    let active = true;
    searchSite(trimmed)
      .then((results) => {
        if (active) {
          setSearchResults(results);
        }
      })
      .catch(() => {
        if (active) setSearchResults([]);
      });

    return () => {
      active = false;
    };
  }, [query]);

  function openBar() {
    setIsOpen(true);
  }

  function closeBar() {
    setIsOpen(false);
    setAnswer(null);
    setQuickActions([]);
    setQuery("");
    setSearchResults([]);
  }

  async function ask(text) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setIsLoading(true);
    setAnswer(null);
    setQuickActions([]);

    // 1. Get verified knowledge base response as default / fallback
    const fallback = getVerifiedAnswer(trimmed);

    try {
      // 2. Try Supabase Edge Function with a fast timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const fnPromise = supabase.functions.invoke("ai-search", {
        body: { query: trimmed },
      });

      const { data, error: fnError } = await Promise.race([
        fnPromise,
        new Promise((_, reject) => {
          controller.signal.addEventListener("abort", () =>
            reject(new Error("Timeout"))
          );
        }),
      ]);
      clearTimeout(timeoutId);

      if (!fnError && data?.reply) {
        setAnswer(data.reply);
        if (fallback?.quickActions) setQuickActions(fallback.quickActions);
      } else {
        // Use verified knowledge response
        if (fallback) {
          setAnswer(fallback.reply);
          setQuickActions(fallback.quickActions || []);
        } else {
          setAnswer(
            "Zyllo Tech specializes in Custom Software, Web Applications, Mobile App Development, AI/ML Engineering, and Cloud Infrastructure. How can we help you today?"
          );
        }
      }
    } catch {
      // Seamlessly fall back to verified knowledge engine without showing an error
      if (fallback) {
        setAnswer(fallback.reply);
        setQuickActions(fallback.quickActions || []);
      } else {
        setAnswer(
          "Zyllo Tech delivers custom software, responsive web apps, mobile apps, and enterprise AI solutions. How can our engineering team assist you?"
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    ask(query);
  }

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={openBar}
          aria-label="Search and ask AI about Zyllo Tech (Ctrl+K)"
          title="Search & AI Assistant (Ctrl+K)"
          className="group relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#cbd5e1] bg-white text-[#556375] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#f96706] hover:text-[#f96706] hover:shadow-[0_4px_14px_rgba(249,103,6,0.22)] active:translate-y-0 active:scale-95"
        >
          {/* Centered Magnifying Glass */}
          <Search
            className="h-[18px] w-[18px] text-[#475569] transition-colors duration-200 group-hover:text-[#1d2735]"
            strokeWidth={1.85}
            aria-hidden="true"
          />

          {/* Top-Right AI Sparkle Badge matching user design */}
          <span
            className="pointer-events-none absolute -top-1 -right-1 flex h-[18px] w-[18px] items-center justify-center"
            aria-hidden="true"
          >
            <svg
              className="h-[18px] w-[18px] text-[#f96706] drop-shadow-[0_1px_2px_rgba(249,103,6,0.35)] transition-transform duration-300 group-hover:scale-115 group-hover:rotate-12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 4-point radiant star */}
              <path
                d="M12 2C12 6.5 8.5 10 4 10C8.5 10 12 13.5 12 18C12 13.5 15.5 10 20 10C15.5 10 12 6.5 12 2Z"
                fill="#f96706"
              />
              {/* Hollow center ring */}
              <circle cx="12" cy="10" r="2.2" fill="#ffffff" />
              {/* Lower-left satellite accent dot */}
              <circle cx="4" cy="16.5" r="1.6" fill="#f96706" />
              {/* Upper-right satellite accent dot */}
              <circle cx="19.5" cy="4" r="1.6" fill="#f96706" />
            </svg>
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={openBar}
          className="group flex w-full items-center justify-between rounded-xl border border-[#cbd5e1] bg-white px-3 py-2.5 text-left text-sm font-medium text-[#6c7889] shadow-sm transition-all hover:border-[#f96706]/60 hover:text-[#f96706]"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#cbd5e1] bg-white text-[#556375] shadow-xs group-hover:border-[#f96706]">
              <Search className="h-4 w-4 text-[#556375] group-hover:text-[#1d2735]" strokeWidth={1.85} />
              <span className="pointer-events-none absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center">
                <svg className="h-3.5 w-3.5 text-[#f96706]" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C12 6.5 8.5 10 4 10C8.5 10 12 13.5 12 18C12 13.5 15.5 10 20 10C15.5 10 12 6.5 12 2Z"
                    fill="#f96706"
                  />
                  <circle cx="12" cy="10" r="2.2" fill="#ffffff" />
                  <circle cx="4" cy="16.5" r="1.6" fill="#f96706" />
                  <circle cx="19.5" cy="4" r="1.6" fill="#f96706" />
                </svg>
              </span>
            </span>
            <span className="text-[13.5px]">Search or ask AI anything...</span>
          </div>
          <kbd className="rounded border border-[#e2e5ea] bg-[#f6f7f9] px-1.5 py-0.5 text-[11px] font-semibold text-[#8b93a3]">
            Ctrl+K
          </kbd>
        </button>
      )}

      {mounted &&
        isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pb-6 pt-[10vh] sm:pt-[14vh]"
            role="dialog"
            aria-modal="true"
            aria-label="Site Search & AI Assistant"
          >
            <div
              aria-hidden="true"
              className="zt-ai-search-backdrop fixed inset-0 bg-[#0b0e17]/60 backdrop-blur-[4px]"
              onClick={closeBar}
            />

            <div className="zt-ai-search-pop relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#d9dde2] bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
              {/* Header */}
              <div className="flex items-center gap-2.5 border-b border-[#e8eaee] bg-gradient-to-r from-[#fff7f0] via-white to-[#f0f6ff] px-4 py-3">
                <Image
                  src="/zyllo-icon.png"
                  alt=""
                  width={500}
                  height={273}
                  className="h-6 w-auto shrink-0 drop-shadow-[0_0_6px_rgba(249,103,6,0.35)]"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#1d2735]">
                    Ask anything about{" "}
                    <span className="text-[#f96706]">Zyllo</span>{" "}
                    <span className="text-[#1f4693]">Tech</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeBar}
                  aria-label="Close"
                  className="rounded-lg p-1.5 text-[#6c7889] transition-colors hover:bg-neutral-100 hover:text-[#1d2735]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2 border-b border-[#eceef2] px-4 py-3">
                <Search className="h-4 w-4 shrink-0 text-[#6c7889]" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    if (answer) {
                      setAnswer(null);
                      setQuickActions([]);
                    }
                  }}
                  placeholder="Type to search pages, or ask a question..."
                  className="flex-1 border-none bg-transparent text-sm text-[#1d2735] placeholder:text-[#6c7889]/60 focus:outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setSearchResults([]);
                      setAnswer(null);
                      setQuickActions([]);
                    }}
                    className="p-1 text-[#8b93a3] hover:text-[#1d2735]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="inline-flex items-center justify-center rounded-lg bg-[#f96706] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#c9580d] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    "Ask"
                  )}
                </button>
              </form>

              {/* Main Content Area */}
              <div className="max-h-[62vh] overflow-y-auto overscroll-contain">
                {/* AI / Knowledge Answer Box */}
                {answer && (
                  <div className="border-b border-[#eceef2] bg-[#fafbfc] p-4 text-sm leading-relaxed text-[#1d2735]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#f96706] uppercase tracking-wider mb-2">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Assistant Response</span>
                    </div>
                    <p className="text-[#344054] leading-relaxed whitespace-pre-line">{answer}</p>

                    {/* Quick action buttons */}
                    {quickActions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-[#eaecf0]">
                        {quickActions.map((action) =>
                          action.external ? (
                            <a
                              key={action.label}
                              href={action.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
                            >
                              <span>{action.label}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <Link
                              key={action.label}
                              href={action.href}
                              onClick={closeBar}
                              className="inline-flex items-center gap-1 rounded-full border border-[#f96706]/30 bg-[#fff5eb] px-3 py-1 text-xs font-semibold text-[#a84a0b] hover:bg-[#ffe8d6] transition-colors"
                            >
                              <span>{action.label}</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2 border-b border-[#eceef2] px-4 py-4 text-sm text-[#6c7889]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#f96706]" aria-hidden="true" />
                    Finding answer for &quot;{query}&quot;...
                  </div>
                )}

                {/* Live Matching Pages & Services */}
                {searchResults.length > 0 && (
                  <div className="px-4 py-3">
                    <p className="text-[11px] font-bold tracking-wider text-[#6c7889] uppercase mb-2">
                      Matching Pages &amp; Services ({searchResults.length})
                    </p>
                    <div className="flex flex-col gap-1">
                      {searchResults.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeBar}
                          className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors duration-150 hover:bg-[#f6f8fa]"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-[#1d2735] group-hover:text-[#f96706]">
                                {item.title}
                              </span>
                              {item.type && (
                                <span className="rounded-md border border-[#e2e5ea] bg-[#f2f4f7] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                                  {item.type}
                                </span>
                              )}
                            </div>
                            {item.subtitle && (
                              <p className="truncate text-xs text-[#6c7889] mt-0.5">
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                          <ArrowRight
                            className="h-4 w-4 shrink-0 text-[#c4c9d1] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[#f96706]"
                            aria-hidden="true"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* No results message */}
                {!isLoading && !answer && query.trim().length >= 2 && searchResults.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-[#6c7889]">
                    <Compass className="mx-auto h-8 w-8 text-[#f96706]/40 mb-2" />
                    <p className="font-semibold text-[#1d2735]">No exact page match for &quot;{query}&quot;</p>
                    <p className="mt-1 text-xs text-[#6c7889]">
                      Click &quot;Ask&quot; above to get an instant answer from our knowledge assistant, or try searching for <strong className="text-[#1d2735]">web apps</strong>, <strong className="text-[#1d2735]">mobile</strong>, <strong className="text-[#1d2735]">estimator</strong>, or <strong className="text-[#1d2735]">contact</strong>.
                    </p>
                  </div>
                )}

                {/* Suggestions shown when query is empty */}
                {query.trim().length === 0 && (
                  <div className="px-4 py-3">
                    <p className="text-[11px] font-bold tracking-wider text-[#6c7889] uppercase mb-2">
                      Suggested Questions
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {SUGGESTIONS.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            setQuery(suggestion);
                            ask(suggestion);
                          }}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-[#344054] transition-colors hover:bg-[#fff7f0] hover:text-[#f96706]"
                        >
                          <span>{suggestion}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-[#c4c9d1]" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="flex items-center justify-between border-t border-[#eaecf0] bg-[#f9fafb] px-4 py-2 text-[11px] text-[#667085]">
                <span>ESC to close</span>
                <span>Press Enter to ask</span>
              </div>
            </div>

            <style>{`
              @keyframes ztAiSearchBackdropFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .zt-ai-search-backdrop {
                animation: ztAiSearchBackdropFadeIn 0.2s ease-out both;
              }
              @keyframes ztAiSearchPop {
                from {
                  opacity: 0;
                  transform: scale(0.97) translateY(-8px);
                }
                to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
              .zt-ai-search-pop {
                animation: ztAiSearchPop 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
              }
            `}</style>
          </div>,
          document.body
        )}
    </>
  );
}
