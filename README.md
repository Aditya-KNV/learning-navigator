# Learning Navigator

This project is a React-based interactive visualization designed to help users navigate educational curriculum paths. It leverages D3.js for the core mapping visualization and React for interface management and state synchronization.

## Local Run Instructions

To run this project locally, follow these steps:

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd learning-navigator
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```
    *Note: This project requires `d3` as a dependency. If it is not automatically installed, run `npm install d3`.*

3.  **Start the development server**
    ```bash
    npm start
    ```
    The application will run at http://localhost:3000.

## Component Structure

The application architecture is designed to separate the visualization logic from the UI components and state management.

* **LearningNavigator.js (Container):** Acts as the central state manager. It handles global states such as the user's history, the currently active node, and theme settings. It coordinates communication between the D3 map and the React sidebar.
* **components/LearningMap.js (Visualization):** Encapsulates the D3.js logic. This component manages SVG rendering, zoom behaviors, and layer management (z-indexing).
* **components/Interface.js (UI):** Contains functional React components for the user interface, including the Sidebar, Modal, Tooltip, and Control Buttons.
* **components/Icons.js:** A collection of SVG icons used throughout the application.
* **data.js:** Stores the mock curriculum data, color configurations, and theme definitions for light and dark modes.

## Interaction and Zoom Decisions

### Zoom and Detail Control
The application implements a geometric zoom with a semantic level-of-detail correction for text. While nodes and lines scale geometrically (growing larger as the user zooms in), text labels use inverse scaling (`scale(1/k)`). This ensures that text remains legible and maintains a constant visual size regardless of the zoom level.

### Interaction Optimization
* **Hover Performance:** Hover effects are decoupled from the main React render cycle. Hover interactions modify the DOM attributes directly via D3 rather than triggering a full component re-render. This ensures high frame rates during rapid mouse movements.
* **"Play" Mode:** The Play Journey feature creates a synchronized playback of the learner's history. It updates three distinct parts of the system simultaneously: the map traces the path, the sidebar automatically scrolls to the active item, and the UI updates status indicators.

## Learning Journey Visualization Approach

### Spatial Encoding
The curriculum is represented using a Radial Tree Layout. This choice allows for a compact display of hierarchical data:
* **Topics:** Encoded as angular sectors (arcs) around the center.
* **Resources:** Encoded by their radial distance from the center.

### Journey Pathing
The learner's path is visualized using a linear curve interpolation (`d3.curveLinear`). This draws straight vector lines between nodes, ensuring that directional arrows align perfectly with the path segments.

### Layering and Masking
To maintain visual clarity, the journey line is rendered on the bottom layer. A "halo mask" technique is applied to the resource nodes—rendering a background-colored circle behind the visible node—which creates the visual effect of the line breaking cleanly around nodes it does not connect to, preventing visual clutter.

## Design Assumptions

* **Browser Support:** The visualization relies on SVG and hardware acceleration features found in modern browsers.
* **Data Structure:** The application assumes a hierarchical structure for topics and a flat array for the user's history log.
* **Viewport:** The radial layout is optimized for landscape or square containers but supports zooming and panning to accommodate smaller screens or mobile devices.
