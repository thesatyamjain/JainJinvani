import React, { useState, useRef, useEffect } from "react";
import { SpaceBackground } from "./components/layout/SpaceBackground";
import { Dock } from "./components/layout/Dock";
import { ExitToast } from "./components/layout/ExitToast";
import { BackToTop } from "./components/layout/BackToTop";
import { ScrollScrubber } from "./components/layout/ScrollScrubber";
import { Landing } from "./pages/Landing";
import { SadhanaMenu } from "./pages/SadhanaMenu";
import { LibraryMenu } from "./pages/LibraryMenu";
import { AdminLogin } from "./pages/AdminLogin";
import { ContentViewer } from "./pages/ContentViewer";
import { Panchang } from "./pages/Panchang";
import { AnimatePresence, motion } from "motion/react";

import { CategoryListing } from "./pages/CategoryListing";
import { MoreMenu } from "./pages/MoreMenu";
import { NotFound } from "./pages/NotFound";
import { FavoritesPage } from "./pages/FavoritesPage";
import { FestivalsPage } from "./pages/FestivalsPage";
import { TirthankarProfile } from "./pages/TirthankarProfile";
import { PilgrimagePage } from "./pages/PilgrimagePage";
import { PhilosophyPage } from "./pages/PhilosophyPage";
import { RitualsPage } from "./pages/RitualsPage";
import { PathshalaPage } from "./pages/PathshalaPage";
import { GalleryPage } from "./pages/GalleryPage";
import { ExploreMenu } from "./pages/ExploreMenu";
import { SamayikPage } from "./pages/SamayikPage";
import { DietaryPage } from "./pages/DietaryPage";
import { AsceticsPage } from "./pages/AsceticsPage";
import { MuniProfilesPage } from "./pages/MuniProfilesPage";
import { JapMalaPage } from "./pages/JapMalaPage";
import { NiyamaPage } from "./pages/NiyamaPage";
import { SearchOverlay } from "./components/layout/SearchOverlay";
import { useModalBackHandler } from "./lib";

const VALID_PAGES = new Set([
  "landing", "sadhana", "library", "category", "viewer", "panchang",
  "more", "admin", "notfound", "favorites", "festivals", "tirthankar",
  "pilgrimage", "philosophy", "rituals", "pathshala", "gallery",
  "explore", "samayik", "dietary", "ascetics", "muni-profiles",
  "jap", "niyam"
]);

const getInitialHashPage = () => {
  if (typeof window !== 'undefined' && window.location.hash) {
    const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0].split('/')[0];
    if (raw && VALID_PAGES.has(raw)) return raw;
    if (raw) return 'notfound';
  }
  return 'landing';
};

export default function App() {
  // Initialize state from history or default to hash / landing
  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== 'undefined' && window.history.state?.page) {
      return window.history.state.page;
    }
    return getInitialHashPage();
  });

  const [pageParams, setPageParams] = useState<any>(() => {
    if (typeof window !== 'undefined' && window.history.state?.params) {
      return window.history.state.params;
    }
    return null;
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showExitToast, setShowExitToast] = useState(false);
  const lastBackPressTimeRef = useRef<number>(0);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  const activePageRef = useRef(activePage);

  useEffect(() => {
    activePageRef.current = activePage;
  }, [activePage]);

  // Handle mobile back button closing the search overlay
  useModalBackHandler(isSearchOpen, () => setIsSearchOpen(false), 'search-overlay');

  // Sync with browser history & root exit prevention
  useEffect(() => {
    // Initial setup: ensure root history guard is in place
    if (!window.history.state || typeof window.history.state.historyIndex !== 'number') {
      const initialPage = window.history.state?.page || getInitialHashPage();
      const initialParams = window.history.state?.params || null;

      // Base entry at index 0
      window.history.replaceState(
        { page: initialPage, params: initialParams, historyIndex: 0, isRoot: true },
        '',
        window.location.hash || `#${initialPage}`
      );

      // If starting on landing, push a guard entry so back button is captured by popstate
      if (initialPage === 'landing') {
        window.history.pushState(
          { page: 'landing', params: null, historyIndex: 1, isRootGuard: true },
          '',
          '#landing'
        );
      }
    }

    const handlePopState = (event: PopStateEvent) => {
      // If a modal was open, useModalBackHandler will handle closing it
      if (event.state?.modalOpen) {
        return;
      }

      if (event.state?.page) {
        setActivePage(event.state.page);
        setPageParams(event.state.params || null);
      } else {
        // We reached root entry or popped outside app stack
        const now = Date.now();
        const timeDiff = now - lastBackPressTimeRef.current;

        if (activePageRef.current === 'landing' || !event.state) {
          if (timeDiff < 2000) {
            // Second back press within 2s: allow normal exit
            setShowExitToast(false);
            if (window.history.length > 1) {
              window.history.back();
            }
          } else {
            // First back press on root: show toast and re-arm guard
            lastBackPressTimeRef.current = now;
            setShowExitToast(true);
            if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
            toastTimeoutRef.current = setTimeout(() => {
              setShowExitToast(false);
            }, 2000);

            window.history.pushState(
              { page: 'landing', params: null, historyIndex: 1, isRootGuard: true },
              '',
              '#landing'
            );
            setActivePage('landing');
            setPageParams(null);
          }
        } else {
          setActivePage('landing');
          setPageParams(null);
          window.history.replaceState(
            { page: 'landing', params: null, historyIndex: 0, isRoot: true },
            '',
            '#landing'
          );
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const handleNavigate = (page: string, params?: any) => {
    // If navigating to the same page with identical params, do not push duplicate
    if (activePage === page && JSON.stringify(pageParams) === JSON.stringify(params)) {
      return;
    }

    const currentIndex = typeof window.history.state?.historyIndex === 'number'
      ? window.history.state.historyIndex
      : 1;
    const newIndex = currentIndex + 1;

    // Push new state to history stack
    window.history.pushState({ page, params, historyIndex: newIndex }, "", `#${page}`);
    setPageParams(params);
    setActivePage(page);
  };

  const handleBack = (fallbackPage: string = 'landing', fallbackParams?: any) => {
    // If there is browser history within our app, use standard back
    if (
      window.history.state &&
      typeof window.history.state.historyIndex === 'number' &&
      window.history.state.historyIndex > 1
    ) {
      window.history.back();
    } else {
      handleNavigate(fallbackPage, fallbackParams);
    }
  };

  // Scroll to top when activePage changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [activePage]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-slate-200 font-noto selection:bg-amber-500/30 selection:text-amber-100 bg-[#050a14]">

      {/* Background Layer */}
      <SpaceBackground />

      {/* Decorative overlaid gradient for depth */}
      <div className="fixed inset-0 pointer-events-none bg-radial-gradient from-transparent via-transparent to-black/40 z-0" />

      {/* Main Content Area */}
      <main ref={mainRef} className="relative z-10 w-full h-screen overflow-y-auto overflow-x-hidden custom-scrollbar">
        <AnimatePresence mode="wait">
          {activePage === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <Landing onNavigate={handleNavigate} />
            </motion.div>
          )}

          {activePage === "sadhana" && (
            <motion.div
              key="sadhana"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <SadhanaMenu onNavigate={handleNavigate} />
            </motion.div>
          )}

          {activePage === "library" && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <LibraryMenu onNavigate={handleNavigate} />
            </motion.div>
          )}

          {activePage === "category" && (
            <motion.div
              key="category"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <CategoryListing
                categoryId={pageParams?.id}
                onNavigate={handleNavigate}
                onBack={() => handleBack(pageParams?.source || "sadhana")}
              />
            </motion.div>
          )}

          {activePage === "viewer" && (
            <motion.div
              key="viewer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <ContentViewer
                onBack={() => {
                  if (pageParams?.previousPage) {
                    handleBack(pageParams.previousPage, pageParams.previousParams);
                  } else {
                    handleBack(
                      pageParams?.source === "library"
                        ? "library"
                        : pageParams?.source === "sadhana"
                          ? "sadhana"
                          : "landing"
                    );
                  }
                }}
                id={pageParams?.id}
                title={pageParams?.title}
                type={pageParams?.type || pageParams?.source}
              />
            </motion.div>
          )}

          {activePage === "panchang" && (
            <motion.div
              key="panchang"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <Panchang
                onBack={() => handleBack("sadhana")}
              />
            </motion.div>
          )}

          {activePage === "more" && (
            <motion.div
              key="more"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <MoreMenu onNavigate={handleNavigate} />
            </motion.div>
          )}

          {activePage === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <AdminLogin
                onLogin={() => alert("Welcome Admin!")}
              />
            </motion.div>
          )}

          {activePage === "notfound" && (
            <motion.div
              key="notfound"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <NotFound onNavigate={handleNavigate} />
            </motion.div>
          )}

          {activePage === "favorites" && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <FavoritesPage
                onNavigate={handleNavigate}
                onBack={() => handleBack("more")}
              />
            </motion.div>
          )}

          {activePage === "festivals" && (
            <motion.div
              key="festivals"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <FestivalsPage onBack={() => handleBack("favorites")} />
            </motion.div>
          )}

          {activePage === "tirthankar" && (
            <motion.div
              key="tirthankar"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <TirthankarProfile
                tirthankarId={pageParams?.id || 'adinath'}
                onBack={() => {
                  if (pageParams?.previousPage) {
                    handleBack(pageParams.previousPage, pageParams.previousParams);
                  } else {
                    handleBack(pageParams?.source || "sadhana");
                  }
                }}
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}

          {activePage === "pilgrimage" && (
            <motion.div
              key="pilgrimage"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <PilgrimagePage onBack={() => handleBack("explore")} />
            </motion.div>
          )}

          {activePage === "philosophy" && (
            <motion.div
              key="philosophy"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <PhilosophyPage onBack={() => handleBack("explore")} />
            </motion.div>
          )}

          {activePage === "rituals" && (
            <motion.div
              key="rituals"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <RitualsPage onBack={() => handleBack("explore")} />
            </motion.div>
          )}

          {activePage === "pathshala" && (
            <motion.div
              key="pathshala"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <PathshalaPage onBack={() => handleBack("explore")} />
            </motion.div>
          )}

          {activePage === "gallery" && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <GalleryPage onBack={() => handleBack("explore")} />
            </motion.div>
          )}

          {activePage === "explore" && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <ExploreMenu
                onBack={() => handleBack("more")}
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}

          {activePage === "samayik" && (
            <motion.div
              key="samayik"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <SamayikPage onBack={() => handleBack("sadhana")} />
            </motion.div>
          )}

          {activePage === "dietary" && (
            <motion.div
              key="dietary"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <DietaryPage onBack={() => handleBack("sadhana")} />
            </motion.div>
          )}

          {activePage === "ascetics" && (
            <motion.div
              key="ascetics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <AsceticsPage
                onBack={() => handleBack("explore")}
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}

          {activePage === "muni-profiles" && (
            <motion.div
              key="muni-profiles"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <MuniProfilesPage
                onBack={() => handleBack("ascetics")}
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}

          {activePage === "jap" && (
            <motion.div
              key="jap"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <JapMalaPage onBack={() => handleBack("sadhana")} />
            </motion.div>
          )}

          {activePage === "niyam" && (
            <motion.div
              key="niyam"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <NiyamaPage
                onBack={() => handleBack("sadhana")}
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}

          {!VALID_PAGES.has(activePage) && (
            <motion.div
              key="fallback-notfound"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <NotFound onNavigate={handleNavigate} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Dock Navigation - Hidden on login page */}
      {activePage !== "admin" && (
        <Dock
          activePage={activePage}
          onNavigate={handleNavigate}
          onSearchClick={() => setIsSearchOpen(true)}
          onBack={() => {
            if (activePage === "viewer") {
              if (pageParams?.previousPage) {
                handleBack(pageParams.previousPage, pageParams.previousParams);
              } else {
                handleBack(
                  pageParams?.source === "library"
                    ? "library"
                    : pageParams?.source === "sadhana"
                      ? "sadhana"
                      : "landing"
                );
              }
            } else {
              handleBack();
            }
          }}
          scrollContainerRef={mainRef}
        />
      )}

      {/* Global Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        currentActivePage={activePage}
      />

      {/* Double back exit toast on root screen */}
      <ExitToast isVisible={showExitToast} />

      {/* Interactive Touch Draggable Scroll Scrubber */}
      <ScrollScrubber scrollContainerRef={mainRef} />

      {/* Floating Back to Top button */}
      <BackToTop scrollContainerRef={mainRef} activePage={activePage} />
    </div>
  );
}