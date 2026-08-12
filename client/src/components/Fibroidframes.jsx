//////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED /////////////////////////////
////////////////////////// PREGNANCY TRACKER SOURCE CODE VERSION 2.0 ////////////////////////////
// FILE NAME : FramesPreview.jsx
// CODE CLEANED LAST ON : 27-02-2025
// CODE LENGTH OF FILE: LINE 16 - LINE 144
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 5 CHECKS
// DATE OF DEVELOPMENT START OF FramesPreview.jsx : 26/2/2025 - 27/2/2025
/////////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React component handles preview and management of ultrasound frames in the Pregnancy Tracker.
// It provides an interface to review detected fibroid frames and manually drag/drop them into
// a "final report" section, which is critical for diagnostic documentation.

/////////////////////// KEY FEATURES ///////////////////////////////////////////////////////////////////
/*
Frame Drag and Drop:

Users can drag detected frames into the final report section.

The final report section supports rearrangement and removal of frames.

Dynamic UI with Grid Layout:

Frames are displayed in a responsive grid.

Each frame supports preview, drag, and remove actions.

Data Flow Integration:

Frames are passed as props from parent component (main diagnostic module).

Any modifications (addition/removal of frames) propagate back to parent state.

Responsive Design:

Component is optimized for both desktop and tablet interfaces.

Hover effects, proper padding, and consistent color scheme for dark mode.

Error Handling:

Handles empty state gracefully when no frames are available.
*/

/////////////////////// KEY LIBRARIES AND DEPENDENCIES ///////////////////////////////////////////
/*
React: Core library for building the UI.

Tailwind CSS: For consistent and responsive styling.

Custom Grid Component (FibroidsGrid): Encapsulates frame display logic.

Base64 Image Handling: Displays base64-encoded images directly.
*/

/////////////////////// DATA FLOW ///////////////////////////////////////////////////////////////////
/*
Parent component (e.g., FibroidDetectionModule) passes fibroid frames and frames already in the report.

User interacts by dragging/dropping frames between sections.

Component updates the parent state via setDraggedFrames.

Parent component handles final processing (e.g., saving report to backend).
*/

/////////////////////// ENV OF FILE : FRONTEND //////////////////////////////////////////////////////
// LANGUAGES USED : REACT JS, TAILWIND CSS
// SECURITY CODE LEVEL : HIGH
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////

import React, { useState } from "react";
import Grid from "./FibroidsGrid"; // Import your Grid component

function FramesPreview({
  fibroidframes,
  nodetectionframes,
  draggedFrames,
  setDraggedFrames,
  handleRemoveImage,
}) {
  const [reportFramesState, setReportFramesState] = useState(draggedFrames);

  const handleDragDrop = (frameData) => {
    setDraggedFrames((prev) => [...prev, frameData]); // Update draggedFrames in main component
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedImage = event.dataTransfer.getData("image");
    if (droppedImage && !draggedFrames.includes(droppedImage)) {
      setDraggedFrames((prev) => [...prev, droppedImage]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (event, frame) => {
    // event.dataTransfer.setData("image", frame.annotated_image);
    handleDragDrop(frame);
  };

  const handleRemoveImages = (imageToRemove) => {
    setDraggedFrames((prev) => prev.filter((image) => image !== imageToRemove));
    handleRemoveImage(imageToRemove);
  };

  return (
    <div className="my-3 bg-gray-900 text-white p-5 w-full">
    <div className="flex">
      <div className="mb-6 w-full sm:w-3/4 lg:w-full pr-4 max-h-[600px] border border-gray-300">
        <h1 className="text-xl font-bold mb-4">Fibroid Frames</h1>
        <Grid frames={fibroidframes} handleDragStart={handleDragStart} />
      </div>
    </div>
    <div
      className="mb-8 w-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h3 className="text-xl text-white mb-4">Final Frames for Report</h3>
      <div className="grid grid-cols-2 gap-4 bg-gray-800 p-4 w-full rounded-lg shadow overflow-y-auto max-h-[500px]">
        {draggedFrames.length > 0 ? (
          draggedFrames.map((frame, index) => (
            <div key={index} className="relative w-full h-[300px]">
              <img
                src={`data:image/jpeg;base64,${frame.annotated_image}`}
                alt={`Frame ${index}`}
                className="w-full h-full object-contain cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(e, frame)}
              />
              <button
                onClick={() => handleRemoveImages(frame)}
                className="absolute top-1 right-1 text-white bg-red-600 hover:bg-red-800 rounded-full p-1"
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-4 text-center">No frames available.</div>
        )}
      </div>
    </div>
  </div>
  
  );
}

export default FramesPreview;
