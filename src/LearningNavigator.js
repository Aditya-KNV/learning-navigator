import React, { useRef, useState, useEffect } from "react";
import { theme, mockData } from "./data";
import { Icons } from "./components/Icons";
import LearningMap from "./components/LearningMap";
import {
  IconButton,
  ControlButton,
  Tooltip,
  ResourceModal,
  Sidebar,
} from "./components/Interface";

const LearningNavigator = () => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // State
  const [selectedResource, setSelectedResource] = useState(null);
  const [hoveredResource, setHoveredResource] = useState(null);
  const [hoveredTA, setHoveredTA] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showHistory, setShowHistory] = useState(true);
  const [showJourney, setShowJourney] = useState(true);
  const [showTAs, setShowTAs] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStepId, setActiveStepId] = useState(null);

  // Zoom Controls Refs (populated by child)
  const zoomControls = useRef(null);

  const currentTheme = darkMode ? theme.dark : theme.light;

  useEffect(() => {
    const update = () => {
      if (containerRef.current)
        setDimensions(containerRef.current.getBoundingClientRect());
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Handle Sidebar Auto-Scroll
  useEffect(() => {
    if (activeStepId && showHistory) {
      const el = document.getElementById(`sidebar-item-${activeStepId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeStepId, showHistory]);

  const togglePlay = () => {
    setShowJourney(true);
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: currentTheme.bg,
        color: currentTheme.text,
        fontFamily: '"Inter", sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          height: "64px",
          padding: "0 24px",
          backgroundColor: currentTheme.headerBg,
          borderBottom: `1px solid ${currentTheme.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ color: currentTheme.accent }}>
            <Icons.Map />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
              {mockData.course.name}
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: currentTheme.textSecondary,
              }}
            >
              Learning Navigator
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <ControlButton
            active={isPlaying}
            onClick={togglePlay}
            icon={<Icons.PlayCircle />}
            label={isPlaying ? "Playing..." : "Play Journey"}
            theme={currentTheme}
          />
          <div
            style={{
              width: 1,
              height: 24,
              backgroundColor: currentTheme.border,
              margin: "0 8px",
            }}
          />
          <ControlButton
            active={showJourney}
            onClick={() => setShowJourney(!showJourney)}
            icon={<Icons.Layers />}
            label="Journey"
            theme={currentTheme}
          />
          <ControlButton
            active={showTAs}
            onClick={() => setShowTAs(!showTAs)}
            icon={<Icons.User />}
            label="TAs"
            theme={currentTheme}
          />
          <div
            style={{
              width: 1,
              height: 24,
              backgroundColor: currentTheme.border,
              margin: "0 8px",
            }}
          />
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            icon={darkMode ? <Icons.Sun /> : <Icons.Moon />}
            theme={currentTheme}
          />
        </div>
      </header>

      <div
        style={{
          display: "flex",
          height: "calc(100vh - 64px)",
          position: "relative",
        }}
      >
        <div
          ref={containerRef}
          style={{ flex: 1, position: "relative", overflow: "hidden" }}
        >
          {/* MAP */}
          <LearningMap
            width={dimensions.width}
            height={dimensions.height}
            theme={currentTheme}
            data={mockData}
            viewStates={{ showJourney, showTAs, isPlaying }}
            actions={{
              setHoveredResource,
              setHoveredTA,
              setTooltipPos,
              setSelectedResource,
              setIsPlaying,
              setActiveStepId,
            }}
            onZoomInit={(controls) => {
              zoomControls.current = controls;
            }}
          />

          {/* Zoom Buttons (Floating) */}
          <div
            style={{
              position: "absolute",
              bottom: "32px",
              right: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              backgroundColor: currentTheme.cardBg,
              padding: "8px",
              borderRadius: "8px",
              boxShadow: currentTheme.shadow,
              border: `1px solid ${currentTheme.border}`,
            }}
          >
            <IconButton
              onClick={() => zoomControls.current?.zoomIn()}
              icon={<Icons.ZoomIn />}
              theme={currentTheme}
            />
            <IconButton
              onClick={() => zoomControls.current?.zoomOut()}
              icon={<Icons.ZoomOut />}
              theme={currentTheme}
            />
            <div
              style={{
                height: 1,
                backgroundColor: currentTheme.border,
                margin: "4px 0",
              }}
            />
            <IconButton
              onClick={() => zoomControls.current?.reset()}
              icon={<Icons.Refresh />}
              theme={currentTheme}
            />
          </div>
        </div>

        {/* Sidebar */}
        {showHistory && (
          <Sidebar
            history={mockData.learnerHistory}
            topics={mockData.course.topics}
            activeStepId={activeStepId}
            onSelect={setSelectedResource}
            onClose={() => setShowHistory(false)}
            theme={currentTheme}
          />
        )}
        {!showHistory && (
          <button
            onClick={() => setShowHistory(true)}
            style={{
              position: "absolute",
              right: 0,
              top: "24px",
              backgroundColor: currentTheme.cardBg,
              border: `1px solid ${currentTheme.border}`,
              borderRight: "none",
              borderRadius: "8px 0 0 8px",
              padding: "12px 8px",
              cursor: "pointer",
              boxShadow: currentTheme.shadow,
            }}
          >
            <Icons.History />
          </button>
        )}
      </div>

      {(hoveredResource || hoveredTA) && (
        <Tooltip
          hoveredResource={hoveredResource}
          hoveredTA={hoveredTA}
          pos={tooltipPos}
          theme={currentTheme}
        />
      )}
      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          theme={currentTheme}
        />
      )}
    </div>
  );
};

export default LearningNavigator;
