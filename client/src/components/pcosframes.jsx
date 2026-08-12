import React, { useState } from "react";
import Grid from "./pcosgrid"; // Import your Grid component

function FramesPreview({
  pcosFrames,
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
        <div className="mb-6 w-full sm:w-1/2 lg:w-[500px] pr-4 max-h-[400px] border border-gray-300">
          <h1>PCOS Frames</h1>
          <Grid frames={pcosFrames} handleDragStart={handleDragStart} />
        </div>
        <div className="mb-6 w-full sm:w-1/2 lg:w-[500px] pr-4 max-h-[400px] border border-gray-300">
          <h1>nodetectionframes Frames</h1>
          <Grid frames={nodetectionframes} handleDragStart={handleDragStart} />
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
