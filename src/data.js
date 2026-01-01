import React from "react";
import { Icons } from "./components/Icons";

export const theme = {
  light: {
    bg: "#f8fafc",
    cardBg: "#ffffff",
    headerBg: "#ffffff",
    text: "#1e293b",
    textSecondary: "#64748b",
    border: "#e2e8f0",
    gridColor: "#cbd5e1",
    tooltipBg: "rgba(255, 255, 255, 0.98)",
    modalBg: "#ffffff",
    shadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    historyItemBg: "#f8fafc",
    historyItemHover: "#f1f5f9",
    accent: "#3b82f6",
    activeItemBg: "#eff6ff",
    activeItemBorder: "#3b82f6",
  },
  dark: {
    bg: "#0f172a",
    cardBg: "#1e293b",
    headerBg: "#1e293b",
    text: "#f1f5f9",
    textSecondary: "#94a3b8",
    border: "#334155",
    gridColor: "#334155",
    tooltipBg: "rgba(30, 41, 59, 0.98)",
    modalBg: "#1e293b",
    shadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
    historyItemBg: "#334155",
    historyItemHover: "#475569",
    accent: "#60a5fa",
    activeItemBg: "#1e3a8a",
    activeItemBorder: "#60a5fa",
  },
};

export const getResourceColor = (type) =>
  ({
    video: "#ef4444",
    document: "#3b82f6",
    quiz: "#f59e0b",
    practice: "#10b981",
  }[type] || "#94a3b8");

export const getResourceIconComponent = (type) => {
  switch (type) {
    case "video":
      return <Icons.Play />;
    case "document":
      return <Icons.File />;
    case "quiz":
      return <Icons.CheckCircle />;
    case "practice":
      return <Icons.Pen />;
    default:
      return <Icons.File />;
  }
};

export const mockData = {
  course: {
    id: 1,
    name: "Advanced Data Structures",
    topics: [
      {
        id: 1,
        name: "Arrays & Strings",
        color: "#6366f1",
        resources: [
          {
            id: 101,
            type: "video",
            title: "Array Fundamentals",
            metadata: "Duration: 15 min",
            x: 0.3,
            y: 0.2,
          },
          {
            id: 102,
            type: "document",
            title: "String Algorithms",
            metadata: "PDF, 12 pages",
            x: 0.5,
            y: 0.3,
          },
          {
            id: 103,
            type: "quiz",
            title: "Arrays Quiz",
            metadata: "10 questions",
            x: 0.7,
            y: 0.25,
          },
        ],
      },
      {
        id: 2,
        name: "Trees & Graphs",
        color: "#10b981",
        resources: [
          {
            id: 201,
            type: "video",
            title: "Binary Trees",
            metadata: "Duration: 20 min",
            x: 0.4,
            y: 0.3,
          },
          {
            id: 202,
            type: "document",
            title: "Graph Theory",
            metadata: "PDF, 18 pages",
            x: 0.6,
            y: 0.4,
          },
          {
            id: 203,
            type: "practice",
            title: "Tree Traversal",
            metadata: "5 exercises",
            x: 0.5,
            y: 0.5,
          },
        ],
      },
      {
        id: 3,
        name: "Dynamic Programming",
        color: "#f59e0b",
        resources: [
          {
            id: 301,
            type: "video",
            title: "DP Introduction",
            metadata: "Duration: 25 min",
            x: 0.3,
            y: 0.4,
          },
          {
            id: 302,
            type: "document",
            title: "Memoization",
            metadata: "PDF, 15 pages",
            x: 0.5,
            y: 0.5,
          },
          {
            id: 303,
            type: "quiz",
            title: "DP Concepts",
            metadata: "15 questions",
            x: 0.5,
            y: 0.25,
          },
        ],
      },
      {
        id: 4,
        name: "Sorting & Searching",
        color: "#ef4444",
        resources: [
          {
            id: 401,
            type: "video",
            title: "Quick Sort",
            metadata: "Duration: 18 min",
            x: 0.4,
            y: 0.35,
          },
          {
            id: 402,
            type: "practice",
            title: "Binary Search",
            metadata: "8 exercises",
            x: 0.6,
            y: 0.5,
          },
          {
            id: 403,
            type: "document",
            title: "Sort Analysis",
            metadata: "PDF, 10 pages",
            x: 0.5,
            y: 0.6,
          },
        ],
      },
      {
        id: 5,
        name: "Hash Tables",
        color: "#8b5cf6",
        resources: [
          {
            id: 501,
            type: "video",
            title: "Hashing Basics",
            metadata: "Duration: 12 min",
            x: 0.35,
            y: 0.4,
          },
          {
            id: 502,
            type: "document",
            title: "Hashing Techniques",
            metadata: "PDF, 8 pages",
            x: 0.55,
            y: 0.5,
          },
          {
            id: 503,
            type: "quiz",
            title: "Hash Quiz",
            metadata: "12 questions",
            x: 0.7,
            y: 0.55,
          },
        ],
      },
      {
        id: 6,
        name: "Advanced Algorithms",
        color: "#ec4899",
        resources: [
          {
            id: 601,
            type: "video",
            title: "Greedy Algorithms",
            metadata: "Duration: 22 min",
            x: 0.4,
            y: 0.45,
          },
          {
            id: 602,
            type: "practice",
            title: "Algorithm Practice",
            metadata: "10 exercises",
            x: 0.6,
            y: 0.6,
          },
          {
            id: 603,
            type: "document",
            title: "Algorithm Design",
            metadata: "PDF, 20 pages",
            x: 0.5,
            y: 0.7,
          },
        ],
      },
    ],
    teachingAssistants: [
      {
        id: 1,
        name: "Abhijit Dibbidi",
        topicIndex: 0,
        expertise: "Arrays & Complexity",
        radiusFactor: 0.65,
      },
      {
        id: 2,
        name: "Aditya KNV",
        topicIndex: 2,
        expertise: "Dynamic Programming",
        radiusFactor: 0.7,
      },
      {
        id: 3,
        name: "Praneeth Reddy",
        topicIndex: 4,
        expertise: "Hash Tables",
        radiusFactor: 0.68,
      },
    ],
  },
  learnerHistory: [
    {
      resourceId: 101,
      timestamp: "2026-01-01T09:00:00",
      duration: 900,
      topicId: 1,
    },
    {
      resourceId: 102,
      timestamp: "2026-01-01T09:20:00",
      duration: 1200,
      topicId: 1,
    },
    {
      resourceId: 201,
      timestamp: "2026-01-01T10:00:00",
      duration: 1500,
      topicId: 2,
    },
    {
      resourceId: 301,
      timestamp: "2026-01-01T11:00:00",
      duration: 1800,
      topicId: 3,
    },
    {
      resourceId: 302,
      timestamp: "2026-01-01T11:35:00",
      duration: 1000,
      topicId: 3,
    },
    {
      resourceId: 401,
      timestamp: "2026-01-01T12:00:00",
      duration: 1100,
      topicId: 4,
    },
  ],
};
