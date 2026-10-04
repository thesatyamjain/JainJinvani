import React, { lazy, Suspense, useState, useRef, useEffect } from "react";
import { SpaceBackground } from "./components/layout/SpaceBackground";
import { Dock } from "./components/layout/Dock";
import { ExitToast } from "./components/layout/ExitToast";
import { ScrollScrubber } from "./components/layout/ScrollScrubber";
import { PwaAppBridge } from "./components/layout/PwaAppBridge";
import { PageTransition } from "./components/layout/PageTransition";
import { AnimatePresence } from "motion/react";
import { useModalBackHandler } from "./lib";
import { parseLocation, buildPath, buildHash, VALID_PAGES } from "./utils/urlHelper";
import { resetSeoToDefault } from "./utils/seoHelper";
import { useEdgeSwipeBack } from "./hooks/useEdgeSwipeBack";
import { setAppNotificationBadge, clearAppNotificationBadge } from "./utils/pwaManager";
import { getDailyNiyamaState } from "./lib/storage";

// Critical initial render components
import { Landing } from "./pages/Landing";
import { SearchOverlay } from "./components/layout/SearchOverlay";

// Code-split secondary routes on demand (faster initial bundle & first paint)
const SadhanaMenu = lazy(() => import("./pages/SadhanaMenu").then((m) => ({ default: m.SadhanaMenu })));
const LibraryMenu = lazy(() => import("./pages/LibraryMenu").then((m) => ({ default: m.LibraryMenu })));
const MoreMenu = lazy(() => import("./pages/MoreMenu").then((m) => ({ default: m.MoreMenu })));
const ContentViewer = lazy(() => import("./pages/ContentViewer").then((m) => ({ default: m.ContentViewer })));
const CategoryListing = lazy(() => import("./pages/CategoryListing").then((m) => ({ default: m.CategoryListing })));
const Panchang = lazy(() => import("./pages/Panchang").then((m) => ({ default: m.Panchang })));
const ExploreMenu = lazy(() => import("./pages/ExploreMenu").then((m) => ({ default: m.ExploreMenu })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage").then((m) => ({ default: m.FavoritesPage })));
const ParvaPage = lazy(() => import("./pages/ParvaPage").then((m) => ({ default: m.ParvaPage })));
const FestivalsPage = lazy(() => import("./pages/ParvaPage").then((m) => ({ default: m.FestivalsPage })));
const TirthankarProfile = lazy(() => import("./pages/TirthankarProfile").then((m) => ({ default: m.TirthankarProfile })));
const TrikalTirthankarPage = lazy(() => import("./pages/TrikalTirthankarPage").then((m) => ({ default: m.TrikalTirthankarPage })));
const TirthPage = lazy(() => import("./pages/TirthPage").then((m) => ({ default: m.TirthPage })));
const PilgrimagePage = lazy(() => import("./pages/TirthPage").then((m) => ({ default: m.PilgrimagePage })));
const TattvaPage = lazy(() => import("./pages/TattvaPage").then((m) => ({ default: m.TattvaPage })));
const PhilosophyPage = lazy(() => import("./pages/TattvaPage").then((m) => ({ default: m.PhilosophyPage })));
const PujaPage = lazy(() => import("./pages/PujaPage").then((m) => ({ default: m.PujaPage })));
const RitualsPage = lazy(() => import("./pages/PujaPage").then((m) => ({ default: m.RitualsPage })));
const PathshalaPage = lazy(() => import("./pages/PathshalaPage").then((m) => ({ default: m.PathshalaPage })));
const GalleryPage = lazy(() => import("./pages/GalleryPage").then((m) => ({ default: m.GalleryPage })));
const SamayikPage = lazy(() => import("./pages/SamayikPage").then((m) => ({ default: m.SamayikPage })));
const AaharPage = lazy(() => import("./pages/AaharPage").then((m) => ({ default: m.AaharPage })));
const DietaryPage = lazy(() => import("./pages/AaharPage").then((m) => ({ default: m.DietaryPage })));
const MuniPage = lazy(() => import("./pages/MuniPage").then((m) => ({ default: m.MuniPage })));
const AsceticsPage = lazy(() => import("./pages/MuniPage").then((m) => ({ default: m.AsceticsPage })));
const MuniProfilesPage = lazy(() => import("./pages/MuniProfilesPage").then((m) => ({ default: m.MuniProfilesPage })));
const JapMalaPage = lazy(() => import("./pages/JapMalaPage").then((m) => ({ default: m.JapMalaPage })));
const NiyamaPage = lazy(() => import("./pages/NiyamaPage").then((m) => ({ default: m.NiyamaPage })));
const DailyPujaFlow = lazy(() => import("./pages/DailyPujaFlow").then((m) => ({ default: m.DailyPujaFlow })));
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

  // Global keyboard shortcut to toggle search overlay (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

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
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <Suspense fallback={<PageLoading />}>
        <AnimatePresence mode="wait">
          {activePage === "landing" && (
            <PageTransition pageKey="landing">
              <Landing onNavigate={handleNavigate} />
            </PageTransition>
          )}

          {activePage === "sadhana" && (
            <PageTransition pageKey="sadhana">
              <SadhanaMenu onNavigate={handleNavigate} />
            </PageTransition>
          )}

          {activePage === "library" && (
            <PageTransition pageKey="library">
              <LibraryMenu onNavigate={handleNavigate} />
            </PageTransition>
          )}

          {activePage === "category" && (
            <PageTransition pageKey="category">
              <CategoryListing
                categoryId={pageParams?.id}
                initialSubCategory={pageParams?.subCategory}
                onNavigate={handleNavigate}
                onBack={() => handleBack(pageParams?.source || "sadhana")}
              />
            </PageTransition>
          )}

          {activePage === "viewer" && (
            <PageTransition pageKey="viewer">
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
            </PageTransition>
          )}

          {activePage === "panchang" && (
            <PageTransition pageKey="panchang">
              <Panchang
                onBack={() => handleBack("sadhana")}
              />
            </PageTransition>
          )}

          {activePage === "more" && (
            <PageTransition pageKey="more">
              <MoreMenu onNavigate={handleNavigate} />
            </PageTransition>
          )}

          {activePage === "admin" && (
            <PageTransition pageKey="admin">
              <AdminLogin
                onBack={() => handleBack("landing")}
                onNavigate={handleNavigate}
              />
            </PageTransition>
          )}

          {activePage === "notfound" && (
            <PageTransition pageKey="notfound">
              <NotFound onNavigate={handleNavigate} />
            </PageTransition>
          )}

          {activePage === "favorites" && (
            <PageTransition pageKey="favorites">
              <FavoritesPage
                onNavigate={handleNavigate}
                onBack={() => handleBack("more")}
              />
            </PageTransition>
          )}

          {(activePage === "festivals" || activePage === "parva") && (
            <PageTransition pageKey="festivals">
              <ParvaPage onBack={() => handleBack("favorites")} />
            </PageTransition>
          )}

          {activePage === "tirthankar" && (
            <PageTransition pageKey="tirthankar">
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
            </PageTransition>
          )}

          {(activePage === "trikal-tirthankar" || activePage === "tirthankars" || activePage === "tirthankar-list") && (
            <PageTransition pageKey="trikal-tirthankar">
              <TrikalTirthankarPage
                initialEra={pageParams?.initialEra || 'present'}
                onBack={() => {
                  if (pageParams?.previousPage) {
                    handleBack(pageParams.previousPage, pageParams.previousParams);
                  } else {
                    handleBack(pageParams?.source || "explore");
                  }
                }}
                onNavigate={handleNavigate}
              />
            </PageTransition>
          )}

          {(activePage === "pilgrimage" || activePage === "tirth") && (
            <PageTransition pageKey="pilgrimage">
              <TirthPage onBack={() => handleBack("explore")} />
            </PageTransition>
          )}

          {(activePage === "philosophy" || activePage === "tattva") && (
            <PageTransition pageKey="philosophy">
              <TattvaPage onBack={() => handleBack("explore")} />
            </PageTransition>
          )}

          {(activePage === "rituals" || activePage === "puja") && (
            <PageTransition pageKey="rituals">
              <PujaPage onBack={() => handleBack("explore")} />
            </PageTransition>
          )}

          {activePage === "pathshala" && (
            <PageTransition pageKey="pathshala">
              <PathshalaPage onBack={() => handleBack("explore")} />
            </PageTransition>
          )}

          {activePage === "gallery" && (
            <PageTransition pageKey="gallery">
              <GalleryPage onBack={() => handleBack("explore")} />
            </PageTransition>
          )}

          {activePage === "explore" && (
            <PageTransition pageKey="explore">
              <ExploreMenu
                onBack={() => handleBack("more")}
                onNavigate={handleNavigate}
              />
            </PageTransition>
          )}

          {activePage === "samayik" && (
            <PageTransition pageKey="samayik">
              <SamayikPage onBack={() => handleBack("sadhana")} />
            </PageTransition>
          )}

          {(activePage === "dietary" || activePage === "aahar") && (
            <PageTransition pageKey="dietary">
              <AaharPage onBack={() => handleBack("sadhana")} />
            </PageTransition>
          )}

          {(activePage === "ascetics" || activePage === "muni") && (
            <PageTransition pageKey="ascetics">
              <MuniPage
                onBack={() => handleBack("explore")}
                onNavigate={handleNavigate}
              />
            </PageTransition>
          )}

          {activePage === "muni-profiles" && (
            <PageTransition pageKey="muni-profiles">
              <MuniProfilesPage
                onBack={() => handleBack("ascetics")}
                onNavigate={handleNavigate}
              />
            </PageTransition>
          )}

          {activePage === "jap" && (
            <PageTransition pageKey="jap">
              <JapMalaPage onBack={() => handleBack("sadhana")} />
            </PageTransition>
          )}

          {activePage === "niyam" && (
            <PageTransition pageKey="niyam">
              <NiyamaPage
                onBack={() => handleBack("sadhana")}
                onNavigate={handleNavigate}
              />
            </PageTransition>
          )}

          {activePage === "daily-puja" && (
            <PageTransition pageKey="daily-puja">
              <DailyPujaFlow
                onBack={() => handleBack("sadhana")}
                onNavigate={handleNavigate}
              />
            </PageTransition>
          )}

          {!VALID_PAGES.has(activePage) && (
            <PageTransition pageKey="fallback-notfound">
              <NotFound onNavigate={handleNavigate} />
            </PageTransition>
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
