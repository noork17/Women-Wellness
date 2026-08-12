
import React, {
  lazy,
  Suspense,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { File, X } from "lucide-react"; // Importing the cross icon from lucide-react
import toast, { Toaster } from "react-hot-toast";
import { Button } from "./ui/button";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import SideBar from "@/components/kunal_components/SideBar"; // Import the custom sidebar
//import report from "./../assets/om.pdf"
import logo from "./../assets/health.webp";
import logo2 from "./../assets/health.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import FramesPreview from "./pcosframes";
import { image } from "@uiw/react-md-editor";
const MDEditor = lazy(() => import("@uiw/react-md-editor"));

const pcosFrames = [
 
];

const nodetectionframes = [
 
];

export default function PCOSDETECTION({ logoutFunction }) {
  const [analysisResult, setAnalysisResult] = useState(null);
 const {
     register,
     handleSubmit,
     watch,
     formState: { errors },
     reset,
     setValue,
   } = useForm({
     defaultValues: {
       gender: "female", // Set "female" as the default value
     },
   });
  const [pdfUrl, setPdfUrl] = useState("");
  const navigate = useNavigate();
  const [reportFrames, setReportFrames] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
  

  const [aiData, setAiData] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null); // For handling uploaded video
  const [frames, setFrames] = useState([]); // To store extracted frames
  const videoRef = useRef(null); // Reference to the video element
  const canvasRef = useRef(null); // Reference to the canvas element
  const [commentText, setCommentText] = useState("");

  // Handle file upload
  const fileInputRef = React.useRef(null);

  const generateRandomString = (length = 10) => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specials = "!@#$%^&*()-";
    const allCharacters = uppercase + lowercase + numbers + specials;

    // Ensure at least one of each required character type
    let result = [
      uppercase[Math.floor(Math.random() * uppercase.length)],
      lowercase[Math.floor(Math.random() * lowercase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      specials[Math.floor(Math.random() * specials.length)],
    ];

    // Fill the remaining length with random characters from allCharacter
    result = result.concat(
      Array.from(
        { length: length - 4 },
        () => allCharacters[Math.floor(Math.random() * allCharacters.length)]
      )
    );

    // Shuffle the result array to randomize character positions
    return result.sort(() => Math.random() - 0.5).join("");
  };
  const [visitId, setVisitId] = useState("");
  let temp = "";
  const [count, setCount] = useState(0);
  const [videoLink, setVideoLink] = useState("");

  const handleFileUpload = async (event) => {
    if (count > 0) return;

    let randString = await generateRandomString(12);
    const file = event.target.files[0]; // Get the uploaded file

    if (!file) return;

    const now = new Date();
    temp = `TEMPSETV_ULTS_${randString}_${String(now.getDate()).padStart(
      2,
      "0"
    )}${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}${now.getFullYear()}${String(now.getHours()).padStart(2, "0")}${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    setVisitId(temp);


    // Extract the file extension
    const fileExtension = file.name.split(".").pop(); // Get file extension
    const newFileName = `${temp}.${fileExtension}`; // Append extension to new name

    try {
      // ✅ Use `await` to ensure buffer is available before creating the Blob
      const buffer = await file.arrayBuffer();
      const renamedFile = new Blob([buffer], { type: file.type });

      // Append to FormData
      const formData = new FormData();
      formData.append("file", renamedFile, newFileName);
      formData.append("pdfFile", pdfBlob);
      formData.append("temp", temp);

      const response = await fetch("http://localhost:8080/auth/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setVideoLink(data.url);

    

      setUploadedFile(file);
      toast.success("File uploaded successfully!");

      const video = videoRef.current;
      if (video) {
        video.src = URL.createObjectURL(file);
        video.onloadeddata = () => {
          handleAnalyze();
        };
      } else {
        console.error("Video element is not available for processing.");
      }
    } catch (err) {
      console.error(err);
      console.log("An error occurred during upload");
    }
  };

  const videoSrc = useMemo(() => {
    return uploadedFile ? URL.createObjectURL(uploadedFile) : null;
  }, [uploadedFile]);
  // Clear uploaded file
  const clearFile = () => {
    setUploadedFile(null);
    setFrames([]); // Clear any extracted frames
    setAiData([]);
    toast.success("File cleared!");

    // Reset file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input to allow reuploading the same file
    }
    navigate(0);
  };
  // Extract frames from the video purana
  

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [images, setImages] = useState([]);
  const confirmGenerateReport = async (confirmed) => {
    if (confirmed) {
      try {
        // Create FormData with patient info and files
        const formData = new FormData();
        formData.append("patientId", patientInfo.patientId);
        formData.append("patientName", patientInfo.patientName);
        formData.append("patientAge", patientInfo.patientAge);
        formData.append("patientNumber", patientInfo.patientNumber);
        formData.append("gender", patientInfo.gender);
        formData.append("video", videoLink);
        formData.append("visitId", visitId);
        formData.append("report", reportContent);
        formData.append("pdfFile", pdfBlob);

        // Send to backend to store the visit data
        const response = await fetch(
          "http://localhost:8080/auth/api/submit-visit",
          {
            method: "POST",
            body: formData,
          }
        );

        // Handle response
        const result = await response.json();
        if (response.ok) {
          //toast.success("Report successfully generated and sent to backend.");
        } else {
          // toast.error("Failed to send the report to the backend.");
        }
      } catch (error) {
        console.error("Error sending data to backend:", error);
        toast.error("An error occurred while sending the data.");
      }
    }
    setShowConfirmation(false);
  };

  const handleGenerateClick = () => {
    // Show confirmation modal
    setShowConfirmation(true);
  };
  const [reportFramesState, setReportFramesState] = useState([]);
  // const handleRemoveImage = (imageToRemove) => {
  // setReportFramesState((prevFrames) =>
  //     prevFrames.filter((frame) => frame.frame_number !== imageToRemove.frame_number)
  // );
  //   setDraggedFrames((prev)=> prev.filter((frame)=>frame !== imageToRemove))
  // };

  const [draggedFrames, setDraggedFrames] = useState([]); // State to store dragged frame data

  const handleFrameDrop = (newFrameData) => {
    setDraggedFrames((prev) => [...prev, newFrameData]); // Add the new frame data to the state

  };

  const location = useLocation();
  const path = location.pathname.split("/").pop();
  sessionStorage.setItem("page", path);
  const [framerate, setFramerate] = useState(30); // Dynamic framerate if needed
  const batchSize = 10; // How many frames to send per batch
  let results = [];
  let idx = 0;
  const sendFramesToBackend = async (frames) => {
    try {
      const response = await fetch("http://localhost:5000/pcos-detection/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ frames }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from backend:", errorData.error || "Unknown error");
        return;
      }
  
      // Initialize variables for streaming data
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let dataBuffer = ""; // Buffer to handle partial chunks
      let results = []; // Store all frame results
      //let pcosFrames = []; // Store fibroid-specific frames
  
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
  
        // Decode and append the current chunk
        dataBuffer += decoder.decode(value, { stream: true });
  
        // Split the buffer into complete SSE messages
        const parts = dataBuffer.split("\n\n");
        for (let i = 0; i < parts.length - 1; i++) {
          const message = parts[i].trim();
          if (message.startsWith("data:")) {
            try {
              const jsonString = message.slice(5).trim(); // Remove `data:` prefix
              const parsedData = JSON.parse(jsonString); // Parse JSON
  
  
              // Check if the frame processing was successful
              if (parsedData.success) {
                const frameData = parsedData.result;
                results.push(frameData); // Add to overall results
  
                // Categorize frames with specific conditions
                if (
                  frameData.class_name &&
                  frameData.class_name.trim() !== "" &&
                  frameData.confidence > 0 &&
                  frameData.boxes &&
                  frameData.boxes.length > 0
                ) {
                  if (frameData.class_name === "pcos") {
                    const isDuplicate = pcosFrames.some(
                      (frame) => frame.num_PCOS === frameData.num_PCOS
                    );
  
                    if (!isDuplicate) {
                      pcosFrames.push(frameData);
                      setAiData((prev) => [...prev, frameData]);
                      results.push(frameData);
                    } 
                  }
                  setReportFrames((prev) => [
                    ...prev,
                    frameData.annotated_image,
                  ]);
                  idx += 1;
                  if (frameData && frameData.annotated_image) {
                    // Upload the annotated image to Azure Blob Storage
                    const azureBlobUrl = await uploadFrameToAzure(
                      frameData.annotated_image,
                      idx,
                      temp
                    );

                    if (azureBlobUrl) {
                      frameData.annotated_image_url = azureBlobUrl;
                      setReportFrames((prev) => [...prev, azureBlobUrl]);
                    } else {
                      console.error("Failed to upload frame to Azure.");
                    }
                  }
                } 
              }
            } catch (error) {
              console.error("Error parsing frame result:", error);
            }
          }
        }
  
        // Keep the last incomplete part in the buffer
        dataBuffer = parts[parts.length - 1];
      }
  
      // Once all frames are processed, sort and finalize
      // const sortedFrames = pcosFrames.sort(
      //   (a, b) => b.confidence - a.confidence
      // );
      // const topFrames = sortedFrames.slice(0, 2); // Select top frames based on confidence
  
      // setDraggedFrames(topFrames); // Update the state with top frames
  
    } catch (error) {
      console.error("Error sending frames to backend:", error);
    }
  };
    const [flag, setFlag] = useState(false);
  
    
  const extractFrames = async () => {
    const frameInterval = 1 / framerate; // Time gap between frames
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!video.duration || video.duration === Infinity) {
      await new Promise((resolve) => {
        video.onloadedmetadata = () => resolve();
      });
    }

    const duration = video.duration;
    let currentTime = 0;
    const extractedFrames = [];
    let frameBatch = [];

    const progressBar = document.getElementById("progress-bar");
    const progressValue = document.getElementById("progress-value");

    const updateProgress = (time) => {
      const progress = Math.min((time / duration) * 100, 100);
      progressBar.style.width = `${progress}%`;
      progressValue.textContent = `${Math.floor(progress)}%`;
    };

    const extractSingleFrame = async (time) => {
      return new Promise((resolve) => {
        video.currentTime = time;
        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frameData = canvas.toDataURL("image/png");
          extractedFrames.push(frameData); // Save locally too
          resolve(frameData);
        };
      });
    };

    while (currentTime <= duration) {
      const frameData = await extractSingleFrame(currentTime);
      frameBatch.push(frameData);

      if (frameBatch.length >= batchSize) {
        await sendFramesToBackend(frameBatch);
        setFlag(true);
        frameBatch = [];
      }

      updateProgress(currentTime);
      currentTime += frameInterval;
    }

    // Send remaining batch if any frames are left
    if (frameBatch.length > 0) {
      await sendFramesToBackend(frameBatch);
    }

    // Ensure progress hits 100% exactly
    progressBar.style.width = "100%";
    progressValue.textContent = "100%";

    setFrames(extractedFrames); // Save extracted frames to state if needed

    // Process and sort frames after all are processed
    const sortedFrames = results.sort((a, b) => b.confidence - a.confidence);
    const topFrames = sortedFrames.slice(0, 2);

    setDraggedFrames(topFrames); // Update UI with top frames

  };


 


const uploadFrameToAzure = async (base64Image, idx, visitId) => {
  try {
    const response = await fetch("http://localhost:8080/auth/upload-frame", {
      method: "POST",
      mode: "cors", // Allow cross-origin requests
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        annotated_image: base64Image,
        idx: idx,
        visitId: visitId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Azure Upload Error:", errorData.error);
      return null;
    }

    const data = await response.json();
    return data.blobUrl; // This is the Azure Blob Storage URL
  } catch (error) {
    console.error("Error uploading frame to Azure:", error);
    return null;
  }
};




  const [patientInfo, setPatientInfo] = useState({
    patientName: "",
    patientId: "",
    patientAge: "",
    patientNumber: "",
    gender: "",
  });
    const [pdfBlob, setPdfBlob] = useState("");
  

  const onSubmit = (data) => {
    const name = sessionStorage.getItem("loggedInuser");
    const id = sessionStorage.getItem("medicalId");

    if (
      !data.patientName ||
      !data.patientId ||
      !data.patientAge ||
      !data.patientNumber
    ) {
      toast.error("Fill all the details first");
      return;
    } else if (
      isNaN(data.patientAge) ||
      data.patientAge <= 0 ||
      data.patientAge > 150
    ) {
      toast.error(
        "Enter a correct age (greater than 0 and realistic, less than 150)"
      );
      return;
    } else if (data.patientName.length < 3) {
      toast.error("Name must be greater than 2 letters");
      return;
    } else {
      setShowConfirmation(true);
    }

    setPatientInfo({
      patientName: data.patientName,
      patientId: data.patientId,
      patientAge: data.patientAge,
      patientNumber: data.patientNumber,
      gender: data.gender,
    });

    try {
      const doc = new jsPDF();

      // Add logo if available
      if (logo2) {
        doc.addImage(logo2, "WEBP", 10, 10, 25, 20);
      }

      // Header Section
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text("THE SETV.G HOSPITAL", 105, 15, { align: "center" });
      doc.setFontSize(12);
      doc.text("Accurate | Caring | Instant", 105, 22, { align: "center" });
      doc.text("Phone: 040-XXXXXXXXX / +91 XX XXX XXX", 105, 30, {
        align: "center",
      });
      doc.text("Email: setvgbhospital@gmail.com", 105, 37, { align: "center" });
      doc.text(
        "SETV.ASRV LLP, Avishkaran, NIPER, Balanagar, Hyderabad, Telangana, 500037.",
        105,
        44,
        { align: "center" }
      );

      // Header Border
      doc.setFillColor(255, 0, 0);
      doc.rect(0, 47, 210, 3, "F");
      doc.setFillColor(0, 0, 255);
      doc.rect(0, 50, 210, 3, "F");

      // Report Title
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Patient Scan Report", 75, 60);

      // Patient Details
      doc.setFontSize(12);
      doc.text(`Patient Name: ${data.patientName}`, 10, 70);
      doc.text(`Patient ID: ${data.patientId}`, 10, 80);
      doc.text(`Age: ${data.patientAge}`, 10, 90);
      doc.text(`Radiologist Name: ${name}`, 120, 70);
      doc.text(`Radiologist ID: ${id}`, 120, 80);
      doc.text(
        `Date: ${data.date || new Date().toLocaleDateString()}`,
        120,
        90
      );
      doc.text(`Gender: ${data.gender}`, 10, 100);
      doc.text(
        `Time: ${data.time || new Date().toLocaleTimeString()}`,
        120,
        100
      );

      // Ultrasound Images - IMMEDIATELY AFTER DETAILS, BEFORE FINDINGS
      let y = 110; // After patient details (last was at 100)

      if (draggedFrames.length > 0) {
        doc.text("Ultrasound Scan Images:", 10, y);
        y += 5;

        let x = 10;
        draggedFrames.forEach((frame, index) => {
          if (index > 0 && index % 2 === 0) {
            y += 65;
            x = 10;
          }
          if (y > 250) {
            doc.addPage();
            y = 25;
            doc.text("Ultrasound Scan Images (contd.):", 10, y);
            y += 5;
          }
          doc.addImage(frame.annotated_image, "JPEG", x, y, 90, 60);
          x += 100;
        });

        y += 70; // Move y down after images
      }

      doc.text("Findings:", 10, y);
      y += 5;

      const findings = findingsText || "No findings provided.";
      const findingsLines = doc.splitTextToSize(findings, 190);
      doc.text(findingsLines, 10, y);

      // Footer
      doc.setFillColor(24, 185, 232).rect(0, 280, 210, 10, "F");
      doc.setTextColor(255, 255, 255).setFontSize(10);
      doc.text(
        "Page 1 || THE SETV.G HOSPITAL || EMERGENCY CONTACT - +91 XXXXXXXXXX",
        105,
        286,
        { align: "center" }
      );

      // Page 2 - Recommendations, Correlation & Disclaimer
      doc.addPage();
      doc.setFontSize(14).setTextColor(0, 51, 102);
      doc.text("THE SETV.G HOSPITAL", 105, 15, { align: "center" });
      doc.setFontSize(12);
      doc.text("Accurate | Caring | Instant", 105, 22, { align: "center" });

      doc.setFillColor(255, 0, 0).rect(0, 25, 210, 3, "F");
      doc.setFillColor(0, 0, 255).rect(0, 28, 210, 3, "F");

      doc.setFontSize(12).setTextColor(0, 0, 0);

      const recommendations =
        recommendationsText || "No recommendations provided.";
      doc.text("Recommendations:", 10, 40);
      const recommendationsLines = doc.splitTextToSize(recommendations, 190);
      doc.text(recommendationsLines, 10, 45);

      doc.text("Disclaimer:", 10, 130);
      const disclaimer = `
              The detected regions in the scan are indicative of possible tumors or abnormalities.
              Clinical correlation with the patient's medical history, physical examination, and
              further diagnostic tests is necessary for accurate evaluation.
             `;
      const disclaimerLines = doc.splitTextToSize(disclaimer, 190);
      doc.text(disclaimerLines, 10, 135);

      // Doctor's Comments
      doc.text(
        `Doctor's Comments: ${commentText || "No comments provided."}`,
        10,
        170
      );

      // Signature
      doc.text(`Name of Doctor: ${name}`, 10, 200);
      doc.text(`Medical ID: ${id}`, 10, 210);

      // Footer Page 2
      doc.setFillColor(24, 185, 232).rect(0, 280, 210, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.text(
        "Page 2 || THE SETV.G HOSPITAL || EMERGENCY CONTACT - +91 XXXXXXXXXX",
        105,
        286,
        { align: "center" }
      );

      // Ultrasound Images (Optional Page 3)

      const pdfBlob1 = doc.output("blob");
      const pdfUrl1 = URL.createObjectURL(pdfBlob1);

      setPdfBlob(pdfBlob1);
      setPdfUrl(pdfUrl1);
      const formData = new FormData();
      formData.append("pdfFile", pdfBlob1, `report-${data.patientId}.pdf`);
      formData.append("patientName", data.patientName);
      formData.append("patientId", data.patientId);
      formData.append("patientAge", data.patientAge);
      formData.append("patientNumber", data.patientNumber);
      formData.append("gender", data.gender);
      formData.append("visitId", visitId);
      setReportContent(pdfUrl1);
      if (!showConfirmation) {
        setShowReport(true);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate the report. Please try again.");
    }
  };


  const [showFindings, setShowFindings] = useState(false);

  const [recommendationsText, setRecommendationsText] = useState("");

  const [findingsText, setFindingsText] = useState("");

  const handleAnalyze = async () => {
    const video = videoRef.current;

    if (!video) {
      console.error("Video element is not available.");
      toast.error("Video element is missing. Please try again.");
      return;
    }

    // Wait for the video metadata to load
    if (!video.duration || video.duration === Infinity) {
      await new Promise((resolve) => {
        video.onloadedmetadata = () => resolve();
      });
    }

    if (video.duration === 0) {
      toast.error(
        "The uploaded video has no duration. Please upload a valid video file."
      );
      return;
    }

    try {
      toast.success("Analyzing video...");
      await extractFrames(); // Extract frames and send them to the backend
      setShowFindings(true); // Show findings immediately
    } catch (error) {
      console.error("Error during video analysis:", error);
      toast.error("An error occurred while analyzing the video.");
    }
  };

  
  const clearprocess = () => {
    setAnalysisResult(null);
  };
  
  const handleGenerateReport = () => {
    // Toggle the report visibility when the button is clicked
    setShowReport(true);
  };
  const [showReports, setShowReports] = useState(false);
  const [viewPdf, setViewPdf] = useState(false);
  //const report = "URL_TO_YOUR_REPORT"; // Replace with your actual PDF URL

  useEffect(() => {
      if (draggedFrames.length === 0) {
        setFindingsText("No abnormalities detected");
        // findings="";
        setRecommendationsText(
          "No definitive findings were identified during the current evaluation.  Clinical correlation is recommended.  Physician validation and further investigation, as deemed necessary, should be pursued."
        );
      }
    }, [draggedFrames]);

  const [reRender, setReRender] = useState(false);

  useEffect(() => {
    // Listen for messages from the iframe
    const handleMessage = (event) => {
      // Make sure the message is from the iframe (security check)
      if (event.origin !== window.location.origin) return;

      // Check for the message indicating the download button was clicked
      if (event.data === "downloadClicked") {
        // Trigger re-render and scroll to top
        setReRender((prev) => !prev);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("message", handleMessage);

    // Clean up event listener
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [reRender]);

  const [currentItem, setCurrentItem] = useState(null); // Store the currently displayed item

  useEffect(() => {
    let timer;
    if (aiData.length) {
      aiData.forEach((item, idx) => {
        timer = setTimeout(() => {
          setCurrentItem(item);
          // Update the current item with a delay
        }, idx * 2000); // Display the next item after 2 seconds
      });
    }

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [aiData]);

  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current frame index

  useEffect(() => {
    if (frames.length > 0) {
      // Start a timer when frames are available
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          // Loop through frames and reset to 0 after the last frame
          return prevIndex + 1 < frames.length ? prevIndex + 1 : 0;
        });
      }, 2000);

      return () => clearInterval(interval); // Clear interval on component unmount or when frames change
    }
  }, [frames]);

  //const[finalFrames,setFinalframes] = useState([]);

  const handleRemoveImage = (imageToRemove) => {
    setDraggedFrames((prev) => prev.filter((frame) => frame !== imageToRemove));
  };

  useEffect(() => {
    const sendFinalFramesToBackend = async () => {
      if (!draggedFrames || draggedFrames.length === 0) return;

      try {
        const response = await fetch(
          "http://localhost:5000/generate-findings2/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(draggedFrames),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error(
            "Error from backend:",
            errorData.error || "Unknown error"
          );
          return;
        }

        const data = await response.json();

        setFindingsText(data.findings);
        setRecommendationsText(data.recommendations);
      } catch (error) {
        console.error("Error sending frames to backend:", error);
      }
    };

    sendFinalFramesToBackend();
  }, [draggedFrames]); // Runs only when finalFrames changes

  const HEALTH_BG = "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1920&q=90";

  return (
    <div className="flex flex-col lg:flex-row relative bg-slate-900">
      <img
        src={logo}
        alt="Logo"
        className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 object-contain z-20"
      />

      <div className="fixed inset-0 pointer-events-none z-0 opacity-15">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HEALTH_BG})` }} />
      </div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-slate-900/90" />
      {/* Sidebar */}
      <SideBar
        logoutFunction={logoutFunction}
        className="lg:static lg:flex-shrink-0"
      />

      {/* Main Content */}
      <div className="relative z-10 flex-1 mx-auto p-4 sm:p-8 flex flex-col items-center justify-center bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-xl w-full max-w-screen-lg mt-20 border border-slate-700/50">
        <Toaster position="top-right" />
        <h1 className="text-2xl font-semibold mb-6 text-center md:text-3xl lg:text-4xl">
          PCOS Detection
        </h1>

        <div className="w-full">
          <div className="w-full">
            {/* File Upload Section  frame divison code asli wala upar h */}
            <div className="flex flex-wrap items-center bg-slate-800 rounded-md shadow-md">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-slate-700 hover:bg-gray-600 px-4 py-2 rounded-l-md text-xs sm:text-sm font-medium flex-shrink-0 flex items-center space-x-2"
              >
                <File size={16} className="text-gray-300" />
                <span>Upload Video</span>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                ref={fileInputRef} // Attach the ref here
                className="hidden"
              />

              <video ref={videoRef} className="hidden" />
              <div className="flex-1 px-4 py-2 text-xs sm:text-sm truncate">
                {uploadedFile ? uploadedFile.name : "No file selected"}
              </div>
              {uploadedFile && (
                <div className="flex items-center px-4 py-2">
                  <Link
                    to="#"
                    className="text-blue-500 text-xs sm:text-sm pr-4"
                    download={uploadedFile.name}
                  >
                    {`${(uploadedFile.size / 1024).toFixed(1)} KB`}
                  </Link>
                </div>
              )}
            </div>

            {/* Video Player */}
            {uploadedFile && (
              <div>
                <video
                  style={{ display: "none" }}
                  ref={videoRef}
                  src={URL.createObjectURL(uploadedFile)}
                  controls
                  onLoadedMetadata={() => {
                    const canvas = canvasRef.current;
                    const video = videoRef.current;
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                  }}
                ></video>
              </div>
            )}

            {/* Canvas for Frame Extraction */}
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          </div>

          {/*extract frame code khatam*/}

          {/* Shaded Box Display */}
          {uploadedFile && (
            <div className="mt-4 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-md shadow-lg border border-slate-600">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm sm:text-base font-medium truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {`${(uploadedFile.size / 1024).toFixed(1)} KB`}
                  </p>
                </div>
                <button
                  onClick={clearFile}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          )}
          <div className="mt-4">
                      <Label htmlFor="framerate">Framerate (frames per second)</Label>
                      <Input
                        disabled={!!uploadedFile}
                        id="framerate"
                        type="number"
                        min="1"
                        max="60"
                        step="1"
                        defaultValue="30"
                        onChange={(e) => {
                          if (e.target.value < 1) {
                            toast.error("enter a frame rate greater than 0");
                            return;
                          }
                          setFramerate(parseFloat(e.target.value));
                        }}
                        onMouseEnter={() => setIsHovered(true)} // Show note on hover
                        onMouseLeave={() => setIsHovered(false)} // Hide note when not hovering
                        className="mt-2  bg-slate-700 text-white placeholder-gray-500 border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Enter framerate (e.g., 30)"
                      />
          
                      {/* Hover note */}
                      {isHovered && (
                        <p className="absolute right-20 mt-1 text-red-500 text-sm bg-slate-800 p-2 rounded-md shadow-md w-[250px]">
                          Note: Frame rate can be set only before uploading the video.
                          Once uploaded, you must clear or reupload the video to change
                          the frame rate.
                        </p>
                      )}
                    </div>


          {uploadedFile && (
            <div className="mt-6">
              {/* Video Element */}
              <div className="mb-4">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  controls
                  className="w-full rounded"
                  onLoadedMetadata={(e) => {
                    if (e.target.duration === 0) {
                      toast.error(
                        "Invalid video file. Please upload a valid video."
                      );
                    }
                  }}
                />
              </div>

              {/* Progress Bar and Value */}
              <div className="relative mt-4">
                <div className="relative h-4 w-full bg-gray-300 rounded">
                  <div
                    id="progress-bar"
                    className="absolute h-full bg-green-500 rounded"
                    style={{ width: "0%" }} // Initial width
                  ></div>
                </div>
                <p
                  id="progress-value"
                  className="text-center mt-2 text-gray-700 font-medium"
                >
                  0%
                </p>
              </div>
            </div>
          )}

          {flag && (
            <div className="w-full flex flex-wrap gap-5 max-w-6xl mt-10  mx-auto p-4 sm:justify-center md:justify-start">
              {/* Processed Video Section */}
              <Card className="bg-slate-800 flex-1  mb-6 my-2">
                <CardHeader className="flex items-center justify-between ">
                  <h2 className="text-lg font-medium">Processed Video</h2>
                  <Button
                    variant="ghost"
                    onClick={clearprocess}
                    className="text-gray-400"
                  >
                    <X size={18} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black rounded-md overflow-hidden ">
                    {currentItem ? (
                      <img
                        src={`data:image/jpeg;base64,${currentItem.annotated_image}`}
                      />
                    ) : (
                      <div> No Frames To Show </div>
                    )}
                  </div>

                  <p className="mt-4 text-sm text-center text-gray-300">
                    Irregular hypoechoic tumor with unsharp border and
                    calcifications
                  </p>
                </CardContent>
              </Card>

              {/* Detection Details Section */}
              <div className="w-96">
                {/* Section 1: Summary */}

                {/* Section 2: Row-Wise Details */}
                {currentItem && (
                  <React.Fragment>
                    <div className="bg-slate-800 p-4 rounded-md shadow">
                      <h3 className="text-lg font-semibold mb-4">
                        Detection Summary
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="block font-medium">Frame Number</label>
                          <div className="bg-slate-700 rounded-md p-2 mt-1">
                            {currentItem.frame_number || "N/A"}
                          </div>
                        </div>
                        <div>
                          <label className="block font-medium">
                            Confidence
                          </label>
                          <div className="bg-slate-700 rounded-md p-2 mt-1">
                            {currentItem.confidence
                              ? currentItem.confidence
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-md shadow mt-4">
                      <h3 className="text-lg font-semibold mb-4">
                        Detailed Results
                      </h3>
                      <div className="grid grid-cols-1 gap-4 text-sm">
                       
                        <div>
                          <label className="block font-medium">
                            PCOS Detections
                          </label>
                          <div className="bg-slate-700 rounded-md p-2 mt-1">
                            {currentItem. num_PCOS|| "N/A"}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block font-medium">
                            Class Name
                          </label>
                          <div className="bg-slate-700 rounded-md p-2 mt-1">
                            {currentItem.class_name || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
          )}

          {flag && (
            <>
              {" "}
              <div className="mt- ">
                <FramesPreview
                 pcosFrames={pcosFrames}
                 nodetectionframes={nodetectionframes}
                  onFrameDrop={handleFrameDrop}
                  draggedFrames={draggedFrames}
                  setDraggedFrames={setDraggedFrames}
                  handleRemoveImage={handleRemoveImage}
                  reportFrames={reportFrames}
                />
              </div>
              <div className="mt-6 w-full max-w-6xl  rounded-lg shadow-lg ">
                {/* Recommendations and Findings Section */}
                {showFindings && (
                  <>
                    <div className="grid grid-cols-2 bg-slate-700 rounded-md gap-4 px-4 py-6">
                      {/* Recommendations Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Recommendations
                        </h3>
                        <textarea
                          value={recommendationsText}
                          onChange={(e) =>
                            setRecommendationsText(e.target.value)
                          }
                          className="w-full bg-slate-800 text-white p-4 rounded-md border border-slate-600 focus:outline-none focus:border-gray-500 resize-none"
                          rows="8"
                          placeholder="Enter recommendations here..."
                        ></textarea>
                      </div>

                      {/* Findings Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Findings
                        </h3>
                        <textarea
                          value={findingsText}
                          onChange={(e) => setFindingsText(e.target.value)}
                          className="w-full bg-slate-800 text-white p-4 rounded-md border border-slate-600 focus:outline-none focus:border-gray-500 resize-none"
                          rows="8"
                          placeholder="Enter findings here..."
                        ></textarea>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mt-4 mb-4">
                        Doctor Comments
                      </h3>
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full h-32 bg-slate-800 text-white p-4 rounded-md border border-slate-600 focus:outline-none focus:border-gray-500 resize-none"
                        rows="8"
                        placeholder="Enter Doctor Comments here..."
                      ></textarea>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Patient Information Form */}
          <form
            className="mt-10 bg-slate-800 p-6 rounded-md shadow-md"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="text-lg font-semibold mb-6 text-white">
              Patient Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Patient Name */}
              <div>
                <Label htmlFor="patientName" className="">
                  Patient Name
                </Label>
                <Input
                  id="patientName"
                  {...register("patientName", { required: true })}
                  placeholder="Enter patient name"
                  className="mt-2 bg-slate-700 text-white placeholder-gray-500 border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Patient ID */}
              <div>
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  {...register("patientId", { required: true })}
                  placeholder="Enter patient ID"
                  className="mt-2 bg-slate-700 text-white placeholder-gray-500 border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Patient Age */}
              <div>
                <Label htmlFor="patientAge">Patient Age</Label>

                <Input
                  id="patientAge"
                  type="number"
                  {...register("patientAge", {
                    required: "Age is required",
                    min: { value: 0, message: "Age cannot be negative" },
                    max: {
                      value: 120,
                      message: "Enter a realistic age (0-120)",
                    },
                    valueAsNumber: true,
                  })}
                  placeholder="Enter patient age"
                  className="mt-2 bg-slate-700 text-white placeholder-gray-500 border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (
                      !(
                        (
                          /[0-9]/.test(e.key) || // Allow digits (0-9)
                          e.key === "Backspace" || // Allow Backspace
                          e.key === "Delete" || // Allow Delete
                          e.key === "ArrowLeft" || // Allow Left Arrow
                          e.key === "ArrowRight" || // Allow Right Arrow
                          e.key === "Tab"
                        ) // Allow Tab key
                      )
                    ) {
                      e.preventDefault(); // Block all other keys
                    }
                  }}
                  onInput={(e) => {
                    if (e.target.value.length > 3) {
                      e.target.value = e.target.value.slice(0, 3); // Limit input to 3 digits
                    }
                  }}
                />

                {errors.patientAge && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.patientAge.message}
                  </p>
                )}
              </div>
              {/* Patient Number */}
              <div>
                <Label htmlFor="patientNumber">Patient Number</Label>
                <Input
                  id="patientNumber"
                  {...register("patientNumber", { required: true })}
                  placeholder="Enter patient number"
                  className="mt-2 bg-slate-700 text-white placeholder-gray-500 border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Patient Gender */}
              <div>
                <Label>Patient Gender</Label>
                <RadioGroup
                  value={watch("gender")} // Bind to form state
                  onValueChange={(value) => setValue("gender", value)} // Update form state
                  className="mt-2 flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      id="female"
                      value="female"
                      className="bg-slate-700 border border-slate-600 text-white rounded-full focus:ring-2 focus:ring-blue-500"
                    />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      id="other"
                      value="other"
                      className="bg-slate-700 border border-slate-600 text-white rounded-full focus:ring-2 focus:ring-blue-500"
                    />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Submit Button */}

            {/* Generate Report Button */}
            <Button
              type="submit"
              // onClick={handleGenerateClick} // Trigger confirmation modal
              variant="ghost"
              className="w-full mt-10 bg-slate-700 hover:bg-gray-500 tracking-wider text-md text-white font-semibold px-6 py-3 rounded-md"
            >
              Generate Report
            </Button>
          </form>
          {showConfirmation && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100"
              aria-labelledby="confirmation-modal"
              role="dialog"
              aria-modal="true"
            >
              <div className="w-[90%] max-w-sm bg-slate-800 rounded-lg shadow-lg border border-slate-600 relative">
                <div className="px-4 py-2 bg-slate-700 rounded-t-lg">
                  <h3
                    id="confirmation-modal"
                    className="text-lg font-semibold text-white"
                  >
                    Confirm Report Generation
                  </h3>
                </div>
                <div className="px-4 py-3 text-white">
                  <p>Are you sure you want to generate the report?</p>
                </div>
                <div className="flex justify-around px-4 py-3 bg-slate-700 rounded-b-lg">
                  <button
                    onClick={() => {
                      setShowConfirmation(false);
                      setShowReport(true);
                    }}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                  >
                    Yes, Generate
                  </button>
                  <button
                    onClick={() => {
                      setShowReport(false);
                      confirmGenerateReport(false);
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                  >
                    No, Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showReport && !showConfirmation && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              aria-labelledby="generated-report-modal"
              role="dialog"
              aria-modal="true"
            >
              {/* Popup Container */}
              <div className="w-[90%] max-w-2xl bg-slate-800 rounded-lg shadow-lg border border-slate-600 relative">
                {/* Header */}
                <div className="px-4 py-2 bg-slate-700 rounded-t-lg flex justify-between items-center">
                  <h3
                    id="generated-report-modal"
                    className="text-lg font-semibold text-white"
                  >
                    Generated Report
                  </h3>
                  <button
                    onClick={() => setShowReport(false)}
                    className="text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md"
                    aria-label="Close Modal"
                  >
                    Close
                  </button>
                </div>

                {/* Iframe Container */}
                <div className="h-[400px] overflow-y-auto">
                  <iframe
                    src={reportContent}
                    title="Generated Report"
                    className="w-full h-full"
                    frameBorder="0"
                  ></iframe>
                </div>

                <div className="flex justify-between items-center px-4 py-3 bg-slate-700 rounded-b-lg">
                  {/* Download and Close */}
                  <button
                    onClick={() => {
                      confirmGenerateReport(true);

                      if (!reportContent) {
                        toast.error("Report not ready yet!");
                        return;
                      }

                      // Trigger download
                      const link = document.createElement("a");
                      link.href = reportContent; // Use the generated Blob URL
                      link.download = "Fibroids_detections.pdf"; // Set file name
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);

                      // Close the popup and optionally reload
                      setShowReport(false);
                      setTimeout(() => {
                        window.location.reload();
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth", // Smooth scrolling effect
                        });
                      }, 100);

                      navigate("/all-reports");
                    }}
                    className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full"
                  >
                    ✓
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={() => setShowReport(false)}
                    className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full"
                    aria-label="Close without Download"
                  >
                    ✗
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
