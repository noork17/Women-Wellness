//////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////// SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED ////////////////////////
// //////////////////// PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR DEVELOPMENT) //
// CODE CLEANED LAST ON : 27-02-2025 //
// CODE LENGTH OF FILE GRID.JSX LINE 16 - LINE 170 //
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 6 CHECKS //
// DATE OF DEVELOPMENT START OF GRID.JSX 26/2/2025 - 27/2/2025 //
///////////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React component is a core imaging interface within the Pregnancy Tracker application.
// It handles the display of ultrasound frames and allows users to zoom, pan, and drag images.

// Key Features:
/*
Frame Display:
- Displays all ultrasound frames passed as props in a grid-like scrollable container.
- Each frame is clickable to open a zoomable and pannable modal view.

Drag & Drop Support:
- Users can drag and drop images for further processing or sharing.

Modal with Image Zoom & Pan:
- Modal supports zoom in/out using the mouse wheel.
- Images inside modal can be panned by dragging with the mouse.

Error Handling:
- Displays fallback message if no frames are available.

Responsive Design:
- Works well on both mobile and desktop (optimized for desktop ultrasound review).

Keyboard/Mouse Handling:
- Zoom handled via mouse scroll.
- Panning handled via mouse drag.

Security Note:
- This component does not directly manage patient data.
- All images are assumed to be pre-sanitized by backend services before reaching frontend.

*/

// Key Libraries and Dependencies:
/*
React: Core library for component logic.
@/components/ui/card: Custom UI component styled using Tailwind + ShadCN.
Tailwind CSS: Styling and responsive layout.
*/

// Data Flow:
/*
- Parent passes `frames` array to this component.
- Each `frame` contains an `annotated_image` in base64 format.
- User interacts via clicks, drags, and scrolls to review frames.
- Drag actions trigger `handleDragStart` to notify parent for external handling.
*/
// ENV OF FILE : FRONTEND //
// LANGUAGES USED : REACT JS, TAILWIND CSS //
// SECURITY CODE LEVEL : HIGH //
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////


import React ,{useState,useRef,useEffect} from "react";
import { Card } from "./ui/card";

function Grid({ frames, title, handleDragStart }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  // Disable body scrolling when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [modalOpen]);

  // Handle image click to open modal
  const openModal = (image) => {
    setCurrentImage(image);
    setModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentImage(null);
    setZoomLevel(1); // Reset zoom
    setDragStart({ x: 0, y: 0 });
    setIsDragging(false);
  };

  // Handle zoom using mouse wheel
  const handleWheel = (e) => {
    e.preventDefault(); // Prevent page scrolling while zooming
    if (e.deltaY < 0) {
      setZoomLevel((prevZoom) => prevZoom + 0.1); // Zoom In
    } else {
      setZoomLevel((prevZoom) => (prevZoom > 0.1 ? prevZoom - 0.1 : 0.1)); // Zoom Out
    }
  };

  // Handle mouse down event to start panning
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse move event to drag image (pan)
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    imageRef.current.style.transform = `scale(${zoomLevel}) translate(${deltaX}px, ${deltaY}px)`;
  };

  // Handle mouse up event to stop panning
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Close modal when clicking outside the image
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  return (
    <div className="mb-6 w-full sm:w-1/2 lg:w-full pr-2 overflow-y-auto overflow-x-hidden max-h-[400px] border border-gray-300 my-1">
      <div className="flex flex-col space-y-4">
        {frames.length>0?(frames.map((frame, index) => (
          <Card key={index} className="border border-gray-700 rounded overflow-hidden w-[800px]">
            <img
              src={`data:image/jpeg;base64,${frame.annotated_image}`}
              alt={`Frame ${index + 1}`}
              className="w-full h-auto object-contain cursor-pointer"
              draggable
              onClick={() => openModal(frame.annotated_image)} // Open modal on click
              onDragStart={(e) => handleDragStart(e, frame)} // Drag start handler
            />
          </Card>
        ))):( 
        
          <div className="col-span-4 text-center">No frames available.</div>

        )}
      </div>

      {/* Modal for displaying the image */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
          onClick={handleOverlayClick} // Close modal if clicked outside the image
        >
          <div
            className="relative max-w-3xl max-h-[80vh] overflow-hidden"
            onWheel={handleWheel} // Handle zoom using mouse scroll
            onMouseDown={handleMouseDown} // Start panning
            onMouseMove={handleMouseMove} // Pan image
            onMouseUp={handleMouseUp} // Stop panning
            onMouseLeave={handleMouseUp} // Stop panning if mouse leaves
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-800"
            >
              ×
            </button>

            <img
              ref={imageRef}
              src={`data:image/jpeg;base64,${currentImage}`}
              alt="Zoomed Image"
              className="w-full h-auto object-contain"
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.3s ease',
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Grid;

