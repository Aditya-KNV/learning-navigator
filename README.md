# Learning Navigator

**Live Demo:** [https://Aditya-KNV.github.io/learning-navigator](https://Aditya-KNV.github.io/learning-navigator)

This project is a React-based interactive visualization designed to help users navigate educational curriculum paths. It leverages D3.js for the core mapping visualization and React for interface management and state synchronization.

## Local Run Instructions

To run this project locally, follow these steps:

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Aditya-KNV/learning-navigator.git
    cd learning-navigator
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

    _Note: This project requires `d3` as a dependency. If it is not automatically installed, run `npm install d3`._

3.  **Start the development server**
    ```bash
    npm start
    ```
    The application will run at http://localhost:3000.

## Component Structure

The application architecture is designed to separate the visualization logic from the UI components and state management.

- **LearningNavigator.js (Container):** Acts as the central state manager. It handles global states such as the user's history, the currently active node, and theme settings. It coordinates communication between the D3 map and the React sidebar.
- **components/LearningMap.js (Visualization):** Encapsulates the D3.js logic. This component manages SVG rendering, zoom behaviors, and layer management (z-indexing).
- **components/Interface.js (UI):** Contains functional React components for the user interface, including the Sidebar, Modal, Tooltip, and Control Buttons.
- **components/Icons.js:** A collection of SVG icons used throughout the application.
- **data.js:** Stores the mock curriculum data, color configurations, and theme definitions for light and dark modes.

## Interaction and Zoom Decisions

### Zoom and Detail Control

The application implements a geometric zoom with a semantic level-of-detail correction for text. While nodes and lines scale geometrically (growing larger as the user zooms in), text labels use inverse scaling (`scale(1/k)`). This ensures that text remains legible and maintains a constant visual size regardless of the zoom level.

### Interaction Optimization

- **Hover Performance:** Hover effects are decoupled from the main React render cycle. Hover interactions modify the DOM attributes directly via D3 rather than triggering a full component re-render. This ensures high frame rates during rapid mouse moveme
