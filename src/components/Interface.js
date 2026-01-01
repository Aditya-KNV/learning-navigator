import React from "react";
import { Icons } from "./Icons";
import { getResourceColor, getResourceIconComponent } from "../data";

export const IconButton = ({ onClick, icon, theme }) => (
  <button
    onClick={onClick}
    style={{
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      border: "none",
      borderRadius: "4px",
      color: theme.textSecondary,
      cursor: "pointer",
      transition: "background-color 0.2s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = theme.border;
      e.currentTarget.style.color = theme.text;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.color = theme.textSecondary;
    }}
  >
    {icon}
  </button>
);

export const ControlButton = ({ active, onClick, icon, label, theme }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 12px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: active ? theme.accent : "transparent",
      color: active ? "#fff" : theme.textSecondary,
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s",
    }}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export const Tooltip = ({ hoveredResource, hoveredTA, pos, theme }) => (
  <div
    style={{
      position: "fixed",
      left: pos.x,
      top: pos.y,
      transform: "translate(15px, 15px)",
      pointerEvents: "none",
      zIndex: 9999,
      backgroundColor: theme.tooltipBg,
      backdropFilter: "blur(8px)",
      padding: "16px",
      borderRadius: "8px",
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
      maxWidth: "280px",
    }}
  >
    {hoveredResource && (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <span style={{ color: getResourceColor(hoveredResource.type) }}>
            {getResourceIconComponent(hoveredResource.type)}
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: "700",
              textTransform: "uppercase",
              color: theme.textSecondary,
            }}
          >
            {hoveredResource.type}
          </span>
        </div>
        <div
          style={{ fontWeight: "600", marginBottom: "4px", color: theme.text }}
        >
          {hoveredResource.title}
        </div>
        <div style={{ fontSize: "12px", color: theme.textSecondary }}>
          {hoveredResource.metadata}
        </div>
      </>
    )}
    {hoveredTA && (
      <>
        <div
          style={{
            fontSize: "10px",
            fontWeight: "700",
            textTransform: "uppercase",
            color: "#6366f1",
            marginBottom: "8px",
          }}
        >
          Teaching Assistant
        </div>
        <div
          style={{ fontWeight: "600", marginBottom: "4px", color: theme.text }}
        >
          {hoveredTA.name}
        </div>
        <div style={{ fontSize: "12px", color: theme.textSecondary }}>
          {hoveredTA.expertise}
        </div>
      </>
    )}
  </div>
);

export const ResourceModal = ({ resource, onClose, theme }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 50,
      backgroundColor: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    onClick={onClose}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "480px",
        backgroundColor: theme.modalBg,
        borderRadius: "12px",
        padding: "32px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        border: `1px solid ${theme.border}`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: getResourceColor(resource.type),
              backgroundColor: `${getResourceColor(resource.type)}15`,
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            {resource.type}
          </span>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              marginTop: "12px",
              marginBottom: "4px",
            }}
          >
            {resource.title}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: theme.textSecondary,
          }}
        >
          <Icons.Close />
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            padding: "16px",
            backgroundColor: theme.bg,
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: theme.textSecondary,
              marginBottom: "4px",
            }}
          >
            Format
          </div>
          <div style={{ fontWeight: "500", fontSize: "13px" }}>
            {resource.metadata}
          </div>
        </div>
        <div
          style={{
            padding: "16px",
            backgroundColor: theme.bg,
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: theme.textSecondary,
              marginBottom: "4px",
            }}
          >
            Location
          </div>
          <div style={{ fontWeight: "500", fontSize: "13px" }}>
            Coordinates: {resource.x}, {resource.y}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: theme.accent,
            color: "#fff",
            fontWeight: "600",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Start Activity
        </button>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: `1px solid ${theme.border}`,
            backgroundColor: "transparent",
            color: theme.text,
            fontWeight: "500",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export const Sidebar = ({
  history,
  topics,
  onSelect,
  onClose,
  activeStepId,
  theme,
}) => (
  <div
    style={{
      width: "320px",
      backgroundColor: theme.cardBg,
      borderLeft: `1px solid ${theme.border}`,
      display: "flex",
      flexDirection: "column",
      zIndex: 20,
    }}
  >
    <div
      style={{
        padding: "20px",
        borderBottom: `1px solid ${theme.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2
        style={{
          fontSize: "14px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Icons.History /> Learning Path
      </h2>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: theme.textSecondary,
        }}
      >
        <Icons.Close />
      </button>
    </div>
    <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
      {history.map((h, idx) => {
        const resource = topics
          .flatMap((t) => t.resources)
          .find((r) => r.id === h.resourceId);
        if (!resource) return null;
        const isActive = activeStepId === resource.id;
        return (
          <div
            key={idx}
            id={`sidebar-item-${resource.id}`}
            onClick={() => onSelect(resource)}
            style={{
              padding: "12px",
              marginBottom: "8px",
              borderRadius: "6px",
              backgroundColor: isActive
                ? theme.activeItemBg
                : theme.historyItemBg,
              border: isActive
                ? `1px solid ${theme.activeItemBorder}`
                : `1px solid ${theme.border}`,
              cursor: "pointer",
              display: "flex",
              gap: "12px",
              transition: "all 0.3s",
            }}
          >
            <div
              style={{
                marginTop: "2px",
                color: getResourceColor(resource.type),
              }}
            >
              {getResourceIconComponent(resource.type)}
            </div>
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  marginBottom: "4px",
                  color: isActive ? theme.accent : theme.text,
                }}
              >
                {resource.title}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: theme.textSecondary,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Icons.Clock /> {Math.floor(h.duration / 60)}m
                </span>
                <span>
                  {new Date(h.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
