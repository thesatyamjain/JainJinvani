import React, { lazy, Suspense, useState, useRef, useEffect } from "react";
import { SpaceBackground } from "./components/layout/SpaceBackground";
import { Dock } from "./components/layout/Dock";
import { ExitToast } from "./components/layout/ExitToast";
import { ScrollScrubber } from "./components/layout/ScrollScrubber";
import { PwaAppBridge } from "./components/layout/PwaAppBridge";
import { AnimatePresence, motion } from "motion/react";
import { useModalBackHandler } from "./lib";
import { parseLocation, buildPath, buildHash, VALID_PAGES } from "./utils/urlHelper";
import { resetSeoToDefault } from "./utils/seoHelper";
import { useEdgeSwipeBack } from "./hooks/useEdgeSwipeBack";
import { setAppNotificationBadge, clearAppNotificationBadge } from "./utils/pwaManager";
import { getDailyNiyamaState } from "./lib/storage";

import { Landing } from "./pages/Landing";
import { SadhanaMenu } from "./pages/SadhanaMenu";
import { LibraryMenu } from "./pages/LibraryMenu";
import { MoreMenu } from "./pages/MoreMenu";
import { ContentViewer } from "./pages/ContentViewer";
import { CategoryListing } from "./pages/CategoryListing";
import { Panchang } from "./pages/Panchang";
import { ExploreMenu } from "./pages/ExploreMenu";
import { SearchOverlay } from "./components/layout/SearchOverlay";
import { NotFound } from "./pages/NotFound";
import { FavoritesPage } from "./pages/FavoritesPage";
import { FestivalsPage } from "./pages/FestivalsPage";
import { TirthankarProfile } from "./pages/TirthankarProfile";
import { PilgrimagePage } from "./pages/PilgrimagePage";
import { PhilosophyPage } from "./pages/PhilosophyPage";
import { RitualsPage } from "./pages/RitualsPage";
import { PathshalaPage } from "./pages/PathshalaPage";
import { GalleryPage } from "./pages/GalleryPage";
import { SamayikPage } from "./pages/SamayikPage";
import { DietaryPage } from "./pages/DietaryPage";
import { AsceticsPage } from "./pages/AsceticsPage";
import { MuniProfilesPage } from "./pages/MuniProfilesPage";
import { JapMalaPage } from "./pages/JapMalaPage";
import { NiyamaPage } from "./pages/NiyamaPage";
import { DailyPujaFlow } from "./pages/DailyPujaFlow";

// Heavy back-office admin pages remain code-split
const AdminLogin = lazy(() => import("./pages/AdminLogin").then(({ AdminLogin }) => ({ default: AdminLogin })));

const PageLoading = () => (
  <div className="min-h-full flex flex-col items-center justify-center gap-3 select-none py-16">
    <div className="w-8 h-8 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
  </div>
);

export default function App() {
  // Initialize state from history or parse from initial URL (path or hash)
  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== 'undefined' && window.history.state?.page) {
      return window.history.state.page;
    }
    const initialRoute = typeof window !== 'undefined' ? parseLocation(window.location) : { page: 'landing', params: null };
    return initialRoute.page;
  });

  const [pageParams, setPageParams] = useState<any>(() => {
    if (typeof window !== 'undefined' && window.history.state?.params) {
      return window.history.state.params;
    }
    const initialRoute = typeof window !== 'undefined' ? parseLocation(window.location) : { page: 'landing', params: null };
    return initialRoute.params;
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showExitToast, setShowExitToast] = useState(false);
  const lastBackPressTimeRef = useRef<number>(0);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  const activePageRef = useRef(activePage);

  useEffect(() => {
    activePageRef.current = activePage;
    // Sync SEO metadata for portal sections
    if (activePage !== 'viewer' && activePage !== 'tirthankar' && activePage !== 'category') {
      resetSeoToDefault(activePage);
    }
  }, [activePage]);

  // Handle mobile back button closing the search overlay
  useModalBackHandler(isSearchOpen, () => setIsSearchOpen(false), 'search-overlay');

  // Sync with browser history & root exit prevention
  useEffect(() => {
    // Initial setup: ensure root history guard is in place
    if (!window.history.state || typeof window.history.state.historyIndex !== 'number') {
      const initialRoute = parseLocation(window.location);
      const initialPage = window.history.state?.page || initialRoute.page;
      const initialParams = window.history.state?.params || initialRoute.params;
      const initialUrl = window.location.hash ? window.location.hash : buildPath(initialPage, initialParams);

      // Base entry at index 0
      window.history.replaceState(
        { page: initialPage, params: initialParams, historyIndex: 0, isRoot: true },
        '',
        initialUrl
      );

      // If starting on landing, push a guard entry so back button is captured by popstate
      if (initialPage === 'landing') {
        window.history.pushState(
          { page: 'landing', params: null, historyIndex: 1, isRootGuard: true },
          '',
          '/'
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
        // Fallback to parsing the current window location if history state was absent
        const locationRoute = parseLocation(window.location);
        if (locationRoute.page && locationRoute.page !== 'landing') {
          setActivePage(locationRoute.page);
          setPageParams(locationRoute.params);
          return;
        }

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
              '/'
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
            '/'
          );
        }
      }
    };

    // React to direct URL adjustments (external anchors or address bar changes)
    const handleLocationChange = () => {
      const currentRoute = parseLocation(window.location);
      setActivePage(currentRoute.page);
      setPageParams(currentRoute.params);
    };

    // Force manual scroll restoration so the browser doesn't scroll the document window
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const handleOrientation = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener("orientationchange", handleOrientation, { passive: true });
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handleLocationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientation);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handleLocationChange);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const handleNavigate = (page: string, params?: any) => {
    // If navigating to the same page with identical params, scroll smoothly to top
    if (activePage === page && JSON.stringify(pageParams) === JSON.stringify(params)) {
      mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      window.scrollTo(0, 0);
      return;
    }

    const currentIndex = typeof window.history.state?.historyIndex === 'number'
      ? window.history.state.historyIndex
      : 1;
    const newIndex = currentIndex + 1;
    const targetUrl = buildPath(page, params);

    // Push new state to history stack with clean path URL for SEO and sharing
    window.history.pushState({ page, params, historyIndex: newIndex }, "", targetUrl);
    setPageParams(params || null);
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
    window.scrollTo(0, 0);
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    const rafId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      if (mainRef.current) mainRef.current.scrollTop = 0;
    });
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      if (mainRef.current) mainRef.current.scrollTop = 0;
    }, 180);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [activePage]);

  // SOTA Native Edge-Swipe Back Gesture on touchscreens
  useEdgeSwipeBack({
    onBack: () => handleBack(),
    enabled: activePage !== 'landing' && !isSearchOpen,
  });

  // SOTA App Badging: Sync app icon badge with pending daily Niyama
  useEffect(() => {
    try {
      const nState = getDailyNiyamaState();
      if (nState.completedIds.length === 0) {
        setAppNotificationBadge(1);
      } else {
        clearAppNotificationBadge();
      }
    } catch (e) {}
  }, [activePage]);

  return (
    <div className="relative h-full w-full overflow-hidden text-slate-100 font-noto selection:bg-amber-500/30 selection:text-amber-100 bg-[#05060a]">

      {/* Background Layer */}
      <SpaceBackground />

      {/* Main Content Area */}
      <main
        ref={mainRef}
        className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-y-contain pt-[env(safe-area-inset-top,0px)]"
        style={{ WebkitOverflowScrolling: 'touch', transform: 'translateZ(0)' }}
      >
        <Suspense fallback={<PageLoading />}>
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
                initialSubCategory={pageParams?.subCategory}
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
                onBack={() => handleBack("landing")}
                onNavigate={handleNavigate}
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

          {activePage === "daily-puja" && (
            <motion.div
              key="daily-puja"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="min-h-full overflow-x-hidden"
            >
              <DailyPujaFlow
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
        </Suspense>
      </main>

      {/* Floating Dock Navigation - Hidden on admin portal */}
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
      {isSearchOpen && (
        <Suspense fallback={null}>
          <SearchOverlay
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onNavigate={handleNavigate}
            currentActivePage={activePage}
          />
        </Suspense>
      )}

      {/* PWA Native Experience Bridge (Install sheet, Offline banner, Updates) */}
      <PwaAppBridge />

      {/* Double back exit toast on root screen */}
      <ExitToast isVisible={showExitToast} />

      {/* Interactive Touch Draggable Scroll Scrubber */}
      <ScrollScrubber scrollContainerRef={mainRef} />
    </div>
  );
}
