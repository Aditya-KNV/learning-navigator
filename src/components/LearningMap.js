import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { getResourceColor } from "../data";

const LearningMap = ({
  width,
  height,
  theme,
  data,
  viewStates,
  actions,
  onZoomInit,
}) => {
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const zoomBehaviorRef = useRef(null);
  const currentZoomState = useRef({ k: 1, x: 0, y: 0 });
  
  const { showJourney, showTAs, isPlaying } = viewStates;

  useEffect(() => {
    if (!svgRef.current || width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.on(".zoom", null); // Clear previous zoom listeners
    svg.selectAll("*").remove();

    const margin = 80;
    const maxRadius = Math.min(width, height) - margin * 2;
    const originX = margin + 40;
    const originY = height - margin - 40;

    const defs = svg.append("defs");

    // Capture Rect (Invisible background to catch zoom events)
    svg
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "transparent")
      .style("cursor", "grab")
      .on("mousedown", function () {
        d3.select(this).style("cursor", "grabbing");
      })
      .on("mouseup", function () {
        d3.select(this).style("cursor", "grab");
      });

    const g = svg.append("g").attr("class", "main-group");
    gRef.current = g.node();

    // 1. Background Grid
    const bgGradient = defs
      .append("radialGradient")
      .attr("id", "bg-gradient")
      .attr("cx", originX / width)
      .attr("cy", originY / height)
      .attr("r", "0.8");
    bgGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", theme.bg)
      .attr("stop-opacity", 0);
    bgGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", theme.bg)
      .attr("stop-opacity", 0);

    const gridGroup = g.append("g").attr("class", "grid-group");
    [0.25, 0.5, 0.75, 1].forEach((factor) => {
      gridGroup
        .append("path")
        .attr(
          "d",
          d3
            .arc()
            .innerRadius(maxRadius * factor)
            .outerRadius(maxRadius * factor)
            .startAngle(0)
            .endAngle(Math.PI / 2)
        )
        .attr("transform", `translate(${originX}, ${originY})`)
        .attr("fill", "none")
        .attr("stroke", theme.gridColor)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4,4")
        .attr("opacity", 0.5)
        .style("pointer-events", "none");
    });

    const numTopics = data.course.topics.length;
    const angleStep = Math.PI / 2 / numTopics;
    for (let i = 0; i <= numTopics; i++) {
      const angle = i * angleStep;
      const x2 = originX + Math.cos(angle) * maxRadius;
      const y2 = originY - Math.sin(angle) * maxRadius;
      gridGroup
        .append("line")
        .attr("x1", originX)
        .attr("y1", originY)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", theme.gridColor)
        .attr("stroke-width", 1)
        .attr("opacity", 0.5)
        .style("pointer-events", "none");
    }

    // 2. Journey Line (Layer 0)
    if (showJourney && data.learnerHistory.length > 0) {
      const journeyGroup = g.append("g").attr("class", "journey-group");

      const journeyPoints = data.learnerHistory
        .map((history) => {
          let resource = null;
          data.course.topics.forEach((topic) => {
            const found = topic.resources.find(
              (r) => r.id === history.resourceId
            );
            if (found) resource = found;
          });
          if (!resource) return null;
          const topicIndex = data.course.topics.findIndex((t) =>
            t.resources.includes(resource)
          );
          const sAngle = topicIndex * angleStep;
          const eAngle = (topicIndex + 1) * angleStep;
          const rAngle = sAngle + (eAngle - sAngle) * resource.x;
          const rRadius = maxRadius * (0.2 + resource.y * 0.75);
          const x = originX + Math.cos(rAngle) * rRadius;
          const y = originY - Math.sin(rAngle) * rRadius;
          return { x, y, id: resource.id };
        })
        .filter(Boolean);

      if (journeyPoints.length > 1) {
        const lineGenerator = d3
          .line()
          .x((d) => d.x)
          .y((d) => d.y)
          .curve(d3.curveLinear);
        const path = journeyGroup
          .append("path")
          .datum(journeyPoints)
          .attr("d", lineGenerator)
          .attr("fill", "none")
          .attr("stroke", theme.accent)
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", isPlaying ? "none" : "6,4")
          .attr("opacity", 0.6)
          .style("pointer-events", "none");

        if (isPlaying) {
          const totalLength = path.node().getTotalLength();
          path
            .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
            .attr("stroke-dashoffset", totalLength)
            .attr("opacity", 1)
            .attr("stroke-width", 4)
            .transition()
            .duration(5000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
            .tween("progress", () => (t) => {
              const p = path.node().getPointAtLength(totalLength * t);
              let closestId = null;
              journeyPoints.forEach((point) => {
                if (Math.hypot(p.x - point.x, p.y - point.y) < 40)
                  closestId = point.id;
              });
              if (closestId) {
                actions.setActiveStepId(closestId);
                d3.select(`#resource-dot-${closestId}`)
                  .attr("fill", theme.accent)
                  .attr("stroke", theme.accent); // Highlight color only
              } else {
                journeyPoints.forEach((pt) =>
                  d3
                    .select(`#resource-dot-${pt.id}`)
                    .attr("stroke", theme.bg)
                    .attr("fill", getResourceColor("video"))
                );
              }
            })
            .on("end", () => {
              actions.setIsPlaying(false);
              actions.setActiveStepId(null);
              path
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "6,4")
                .attr("opacity", 0.6);
              journeyPoints.forEach((pt) =>
                d3.select(`#resource-dot-${pt.id}`).attr("stroke", theme.bg)
              );
            });
        } else {
          journeyPoints.forEach((point, i) => {
            if (i === journeyPoints.length - 1) return;
            const next = journeyPoints[i + 1];
            const angle =
              Math.atan2(next.y - point.y, next.x - point.x) * (180 / Math.PI);
            const midX = (point.x + next.x) / 2;
            const midY = (point.y + next.y) / 2;
            journeyGroup
              .append("path")
              .attr("d", "M -6 -4 L 2 0 L -6 4")
              .attr("transform", `translate(${midX}, ${midY}) rotate(${angle})`)
              .attr("fill", "none")
              .attr("stroke", theme.accent)
              .attr("stroke-width", 2)
              .attr("stroke-linecap", "round")
              .attr("stroke-linejoin", "round");
          });
        }
      }
    }

    // 3. Topics Segments (Layer 1)
    const topicsGroup = g.append("g").attr("class", "topics-group");
    data.course.topics.forEach((topic, i) => {
      const startAngle = i * angleStep;
      const endAngle = (i + 1) * angleStep;
      const arc = d3
        .arc()
        .innerRadius(maxRadius * 0.15)
        .outerRadius(maxRadius)
        .startAngle(startAngle)
        .endAngle(endAngle);
      const segmentGroup = topicsGroup.append("g");
      segmentGroup
        .append("path")
        .attr("d", arc)
        .attr("transform", `translate(${originX}, ${originY})`)
        .attr("fill", topic.color)
        .attr("opacity", 0.08)
        .attr("stroke", topic.color)
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.3);
      const labelAngle = (startAngle + endAngle) / 2;
      const lx = originX + Math.cos(labelAngle) * (maxRadius * 1.05);
      const ly = originY - Math.sin(labelAngle) * (maxRadius * 1.05);
      segmentGroup
        .append("text")
        .attr("x", lx)
        .attr("y", ly)
        .attr("text-anchor", i > numTopics / 2 ? "end" : "start")
        .attr("fill", theme.text)
        .attr("font-size", "12px")
        .attr("font-weight", "600")
        .text(topic.name)
        .style("pointer-events", "none");
    });

    // --- 4. Resources (Layer 2: DOTS) ---
    // We strictly separate Dots and Labels into layers to ensure Text is ALWAYS on top.
    const dotsLayer = g.append("g").attr("class", "dots-layer");
    const labelsLayer = g.append("g").attr("class", "labels-layer");
    const labelData = [];

    data.course.topics.forEach((topic, topicIndex) => {
      const sAngle = topicIndex * angleStep;
      const eAngle = (topicIndex + 1) * angleStep;

      topic.resources.forEach((resource) => {
        const rAngle = sAngle + (eAngle - sAngle) * resource.x;
        const rRadius = maxRadius * (0.2 + resource.y * 0.75);
        const x = originX + Math.cos(rAngle) * rRadius;
        const y = originY - Math.sin(rAngle) * rRadius;

        // --- DRAW DOT ---
        const resourceGroup = dotsLayer
          .append("g")
          .attr("transform", `translate(${x}, ${y})`)
          .style("cursor", "pointer");
        // Halo Mask (hides journey line behind)
        resourceGroup
          .append("circle")
          .attr("r", 12)
          .attr("fill", theme.bg)
          .attr("stroke", "none");
        // Outer Glow
        resourceGroup
          .append("circle")
          .attr("r", 8)
          .attr("fill", getResourceColor(resource.type))
          .attr("opacity", 0.2);
        // Core Dot
        resourceGroup
          .append("circle")
          .attr("id", `resource-dot-${resource.id}`)
          .attr("r", 5)
          .attr("fill", getResourceColor(resource.type))
          .attr("stroke", theme.bg)
          .attr("stroke-width", 1.5);

        // --- DRAW LABEL (Top Layer) ---
        // Top half = Text Up, Bottom half = Text Down
        const dir = y < originY ? -1 : 1;

        const labelText = labelsLayer
          .append("text")
          .attr("class", "resource-label")
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", dir === -1 ? "auto" : "hanging")
          .style("font-size", "11px")
          .style("font-weight", "600")
          .style("fill", theme.text)
          .style("paint-order", "stroke")
          .style("stroke", theme.bg)
          .style("stroke-width", "3px")
          .style("stroke-linecap", "round")
          .style("stroke-linejoin", "round")
          .style("pointer-events", "none") // Click through text to canvas
          .style("will-change", "transform")
          .text(resource.title);

        // 14px Offset = Very close but not overlapping the 8px radius
        labelData.push({
          element: labelText,
          baseX: x,
          baseY: y,
          dir: dir,
          offset: 14,
        });

        // Hover Events (NO visual changes to node size/opacity)
        resourceGroup
          .on("mouseenter", (event) => {
            actions.setHoveredResource(resource);
            actions.setTooltipPos({ x: event.clientX, y: event.clientY });
            // Only bold the text
            labelText.style("font-weight", "800");
          })
          .on("mouseleave", () => {
            actions.setHoveredResource(null);
            labelText.style("font-weight", "600");
          })
          .on("click", () => actions.setSelectedResource(resource));
      });
    });

    // 5. Teaching Assistants
    if (showTAs) {
      data.course.teachingAssistants.forEach((ta) => {
        const topicIndex = ta.topicIndex;
        const sAngle = topicIndex * angleStep;
        const eAngle = (topicIndex + 1) * angleStep;
        const taAngle = (sAngle + eAngle) / 2;
        const taRadius = maxRadius * ta.radiusFactor;
        const x = originX + Math.cos(taAngle) * taRadius;
        const y = originY - Math.sin(taAngle) * taRadius;

        // Draw Dot
        const taMarker = dotsLayer
          .append("g")
          .attr("transform", `translate(${x}, ${y})`)
          .style("cursor", "pointer");
        taMarker.append("circle").attr("r", 14).attr("fill", theme.bg);
        taMarker
          .append("circle")
          .attr("r", 10)
          .attr("fill", "#6366f1")
          .attr("fill-opacity", 0.2)
          .attr("stroke", "#6366f1")
          .attr("stroke-width", 1.5);
        taMarker
          .append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "0.3em")
          .style("font-size", "8px")
          .style("fill", theme.text)
          .text("TA");

        // Draw Label
        const dir = y < originY ? -1 : 1;
        const taLabel = labelsLayer
          .append("text")
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", dir === -1 ? "auto" : "hanging")
          .style("font-size", "10px")
          .style("font-weight", "700")
          .style("fill", theme.text)
          .style("paint-order", "stroke")
          .style("stroke", theme.bg)
          .style("stroke-width", "3px")
          .style("pointer-events", "none")
          .style("will-change", "transform")
          .text(ta.name);

        labelData.push({
          element: taLabel,
          baseX: x,
          baseY: y,
          dir: dir,
          offset: 18,
        });

        taMarker
          .on("mouseenter", (event) => {
            actions.setHoveredTA(ta);
            actions.setTooltipPos({ x: event.clientX, y: event.clientY });
          })
          .on("mouseleave", () => actions.setHoveredTA(null));
      });
    }

    // --- 6. Zoom Logic ---
    const updateLabels = (k) => {
      labelData.forEach((l) => {
        // Apply scale inverse so text stays consistent size
        // Offset logic: Move up/down by (offset / zoom)
        const dist = l.offset / k;
        const ty = l.dir * dist;
        l.element.attr(
          "transform",
          `translate(${l.baseX}, ${l.baseY + ty}) scale(${1 / k})`
        );
      });
    };

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        currentZoomState.current = event.transform;
        updateLabels(event.transform.k);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Initial Render - FORCE updates
    const initialK = currentZoomState.current.k || 1;
    svg.call(
      zoom.transform,
      d3.zoomIdentity
        .translate(currentZoomState.current.x, currentZoomState.current.y)
        .scale(initialK)
    );
    updateLabels(initialK);

    if (onZoomInit) {
      onZoomInit({
        zoomIn: () => svg.transition().duration(300).call(zoom.scaleBy, 1.4),
        zoomOut: () => svg.transition().duration(300).call(zoom.scaleBy, 0.71),
        reset: () =>
          svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity),
      });
    }
  }, [width, height, showJourney, showTAs, isPlaying, theme]);
  // ^^^ CRITICAL: Only re-run when these Primitives change.
  // 'actions' is NOT in here, so hover updates won't redraw the map.

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      style={{ cursor: "grab", outline: "none" }}
      onMouseDown={(e) => (e.currentTarget.style.cursor = "grabbing")}
      onMouseUp={(e) => (e.currentTarget.style.cursor = "grab")}
    />
  );
};

export default LearningMap;
