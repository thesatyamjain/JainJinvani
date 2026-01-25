import React, { useState, useRef, useEffect } from "react";
import { SpaceBackground } from "./components/layout/SpaceBackground";
import { Dock } from "./components/layout/Dock";
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
import { SearchOverlay } from "./components/layout/SearchOverlay";
import { contentInventory } from "./data/inventory";

export default function App() {
  // Initialize state from history or default to landing
  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== 'undefined' && window.history.state?.page) {
      return window.history.state.page;
    }
    return "landing";
  });

  const [pageParams, setPageParams] = useState<any>(() => {
    if (typeof window !== 'undefined' && window.history.state?.params) {
      return window.history.state.params;
    }
    return null;
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Sync with browser history
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        setActivePage(event.state.page);
        setPageParams(event.state.params);
      } else {
        // Fallback for initial state or empty history
        setActivePage("landing");
        setPageParams(null);
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Ensure initial state exists so we can go "back" to it
    if (!window.history.state) {
      window.history.replaceState({ page: "landing", params: null }, "", "#landing");
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleNavigate = (page: string, params?: any) => {
    // Push new state to history stack
    window.history.pushState({ page, params }, "", `#${page}`);
    setPageParams(params);
    setActivePage(page);
  };

  // Scroll to top when activePage changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [activePage]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-slate-200 font-gotu selection:bg-amber-500/30 selection:text-amber-100 bg-[#050a14]">

      {/* Background Layer */}
      <SpaceBackground />

      {/* Decorative overlaid gradient for depth */}
      <div className="fixed inset-0 pointer-events-none bg-radial-gradient from-transparent via-transparent to-black/40 z-0" />

      {/* Main Content Area */}
      <main ref={mainRef} className="relative z-10 w-full h-screen overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {activePage === "landing" && (
            <motion.div
              key="landing"
              initial={{
                opacity: 0,
                scale: 0.95,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: 1.05,
                filter: "blur(10px)",
              }}
              transition={{ duration: 0.5 }}
              className="min-h-full"
            >
              <Landing onNavigate={handleNavigate} />
            </motion.div>
          )}

          {activePage === "sadhana" && (
            <motion.div
              key="sadhana"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <SadhanaMenu onNavigate={handleNavigate} />
            </motion.div>
          )}

          {activePage === "library" && (
            <motion.div
              key="library"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <LibraryMenu onNavigate={handleNavigate} />
            </motion.div>
          )}

          {activePage === "category" && (
            <motion.div
              key="category"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <CategoryListing
                categoryId={pageParams?.id}
                onNavigate={handleNavigate}
                onBack={() =>
                  handleNavigate(
                    pageParams?.source || "sadhana",
                  )
                }
              />
            </motion.div>
          )}

          {activePage === "viewer" && (
            <motion.div
              key="viewer"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <ContentViewer
                onBack={() => {
                  if (pageParams?.previousPage) {
                    handleNavigate(pageParams.previousPage, pageParams.previousParams);
                  } else {
                    handleNavigate(
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <Panchang
                onBack={() => handleNavigate("sadhana")}
              />
            </motion.div>
          )}

          {activePage === "more" && (
            <motion.div
              key="more"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <MoreMenu onNavigate={handleNavigate} />
            </motion.div>
          )}

          {activePage === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <AdminLogin
                onLogin={() => alert("Welcome Admin!")}
              />
            </motion.div>
          )}

          {activePage === "notfound" && (
            <motion.div
              key="notfound"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <NotFound onNavigate={handleNavigate} />
            </motion.div>
          )}

          {activePage === "favorites" && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <FavoritesPage
                onNavigate={handleNavigate}
                onBack={() => handleNavigate("more")}
              />
            </motion.div>
          )}

          {activePage === "festivals" && (
            <motion.div
              key="festivals"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <FestivalsPage onBack={() => handleNavigate("favorites")} />
            </motion.div>
          )}

          {activePage === "tirthankar" && (
            <motion.div
              key="tirthankar"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <TirthankarProfile
                tirthankarId={pageParams?.id || '24'}
                onBack={() => {
                  if (pageParams?.previousPage) {
                    handleNavigate(pageParams.previousPage, pageParams.previousParams);
                  } else {
                    handleNavigate(pageParams?.source || "sadhana");
                  }
                }}
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}

          {activePage === "pilgrimage" && (
            <motion.div
              key="pilgrimage"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <PilgrimagePage onBack={() => handleNavigate("favorites")} />
            </motion.div>
          )}

          {activePage === "philosophy" && (
            <motion.div
              key="philosophy"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <PhilosophyPage onBack={() => handleNavigate("favorites")} />
            </motion.div>
          )}

          {activePage === "rituals" && (
            <motion.div
              key="rituals"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <RitualsPage onBack={() => handleNavigate("favorites")} />
            </motion.div>
          )}

          {activePage === "pathshala" && (
            <motion.div
              key="pathshala"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <PathshalaPage onBack={() => handleNavigate("favorites")} />
            </motion.div>
          )}

          {activePage === "gallery" && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <GalleryPage onBack={() => handleNavigate("explore")} />
            </motion.div>
          )}

          {activePage === "explore" && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <ExploreMenu
                onBack={() => handleNavigate("more")}
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}

          {activePage === "samayik" && (
            <motion.div
              key="samayik"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <SamayikPage onBack={() => handleNavigate("sadhana")} />
            </motion.div>
          )}

          {activePage === "dietary" && (
            <motion.div
              key="dietary"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <DietaryPage onBack={() => handleNavigate("sadhana")} />
            </motion.div>
          )}

          {activePage === "ascetics" && (
            <motion.div
              key="ascetics"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <AsceticsPage
                onBack={() => handleNavigate("explore")}
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}

          {activePage === "muni-profiles" && (
            <motion.div
              key="muni-profiles"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="min-h-full"
            >
              <MuniProfilesPage
                onBack={() => handleNavigate("ascetics")}
                onNavigate={handleNavigate}
              />
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
        />
      )}

      {/* Global Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        currentActivePage={activePage}
      />
    </div>
  );
}