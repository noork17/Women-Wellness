const express = require('express');
const mongoose = require('mongoose');
const { getContainerClient } = require('../models/azureblobservice'); // Use our common mock
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Visit = require('../models/visitId');  // Path to the Visit model
const Report = require("../models/report");

const { signup, login, forgotPassword, resetPassword } = require('../controllers/Authcontroller');
const { getDashboard, deployMobileVan } = require('../controllers/DashboardController');
const { analyzeReport } = require('../controllers/reportAnalysisController');
const { chatAssistant } = require('../controllers/chatAssistantController');
const { signupvalidation, loginValidation } = require('../middlewares/Authvalidation');

const router = require('express').Router();



// Login route
router.post('/login', loginValidation, login);

// Signup route
router.post('/signup', signupvalidation, signup);

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route
router.post('/reset-password', resetPassword);



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, 'uploads');
    // Create 'uploads' directory if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath); // Save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save with unique filename
  },
});

// Create a file filter to handle only video and PDF file types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/') || file.mimetype === 'application/pdf') {
    cb(null, true); // Accept video and PDF files
  } else {
    cb(new Error('Only video and PDF files are allowed'), false); // Reject other file types
  }
};


// Use this middleware to upload video and report files
const upload = multer();
router.post("/api/submit-visit", upload.single("pdfFile"), async (req, res) => {
  try {
    let {
      patientId,
      patientName,
      patientAge,
      patientNumber,
      gender,
      video,
      report,
      visitId,
    } = req.body;
    const now = new Date();
    let temp = visitId;

    visitId = visitId.substring(4, 25);
    visitId += `${String(now.getDate()).padStart(2, "0")}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${now.getFullYear()}${String(now.getHours()).padStart(
      2,
      "0"
    )}${String(now.getMinutes()).padStart(2, "0")}`;
    const containerClient = getContainerClient("scan-videos");
    const containerClient2 = getContainerClient("reports");

    const renameBlob = async (oldBlobName) => {
      const oldBlobClient = containerClient.getBlobClient(oldBlobName);

      // Check if the blob exists
      const exists = await oldBlobClient.exists();
      if (!exists) {
        return null; // Return null if the blob doesn't exist
      }

      // Generate new blob name
      const newBlobName = `${visitId}_video.mp4`;
      const newBlobClient = containerClient.getBlobClient(newBlobName);

      // Copy the existing blob to the new name
      await newBlobClient.beginCopyFromURL(oldBlobClient.url);

      // Delete the old blob after successful copy
      await oldBlobClient.delete();

      // ✅ Return the full URL of the renamed blob
      return newBlobClient.url;
    };

    // ✅ Calling the function and getting the URL
    renameBlob(`${temp}_video.mp4`).then((newUrl) => {
      if (newUrl) {
        video = newUrl; // Store the new URL in the variable
      }
    });

    const pdfBlobName = `${visitId}_report.pdf`;
    const blockBlobClient = containerClient2.getBlockBlobClient(pdfBlobName);

    // Upload PDF
    const pdfBuffer = req.file.buffer;
    await blockBlobClient.uploadData(pdfBuffer, {
      blobHTTPHeaders: { blobContentType: "application/pdf" },
    });

    const pdfUrl = blockBlobClient.url;
    report = pdfUrl;

    //frames code
    const renameFolder = async (oldFolderName, newFolderName) => {
      try {
        const containerClient3 = getContainerClient("scan-images");


        // **Step 1: Get all blobs inside the folder**
        const blobs = [];
        for await (const blob of containerClient3.listBlobsFlat({
          prefix: `${oldFolderName}/`,
        })) {
          blobs.push(blob.name);
        }

        if (blobs.length === 0) {
          return;
        }

        // **Step 2: Copy each blob to the new folder**
        for (const blobName of blobs) {
          const fileName = blobName.split("/").pop(); // Extract the filename (e.g., img1.png)
          const newBlobName = `${newFolderName}/${fileName}`; // New folder path

          const oldBlobClient = containerClient3.getBlobClient(blobName);
          const newBlobClient = containerClient3.getBlobClient(newBlobName);

          await newBlobClient.beginCopyFromURL(oldBlobClient.url);
        }

        // **Step 3: Delete old blobs**
        for (const blobName of blobs) {
          const oldBlobClient = containerClient3.getBlobClient(blobName);
          await oldBlobClient.delete();
        }

      
      } catch (error) {
        console.error("Error renaming folder:", error);
      }
    };
    renameFolder(temp, visitId);
    //end

    const newReport = new Report({
      visitId,
      patientId,
      patientName,
      patientAge,
      patientNumber,
      gender,
      video,
      report,
      visitDate: new Date().toISOString().split("T")[0], // Auto add date
      visitTime: new Date().toTimeString().split(" ")[0], // Auto add time
    });

    const savedReport = await newReport.save();
    res.status(201);
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(400).json({ message: error.message });
  }
});

router.get("/get-frames/:folder", async (req, res) => {
  try {
    const containerClient = getContainerClient("scan-images");

    const folder = req.params.folder;
    let imageUrls = [];

    // Fetch all blobs inside the folder
    for await (const blob of containerClient.listBlobsFlat({
      prefix: `${folder}/`,
    })) {
      // Use the URL from the mock
      const blobUrl = containerClient.getBlobClient(blob.name).url;
      imageUrls.push(blobUrl);
    }

    res.json({ images: imageUrls });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});



// Dashboard API - dynamic data
router.get("/api/dashboard", getDashboard);
router.post("/api/dashboard/deploy-van", deployMobileVan);

router.get("/api/reports", async (req, res) => {
  try {
    const reports = await Report.find();
    console.log(`Debug: Found ${reports.length} reports in database.`);
    res.json(reports);
  } catch (error) {
    console.error("Debug: Error fetching reports:", error);
    res.status(500).json({ message: error.message });
  }
});

const { v4: uuidv4 } = require("uuid"); // Ensure UUID is imported
require("dotenv").config();

router.post("/upload", upload.single("file"), async (req, res) => {
  const { temp } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const containerClient = getContainerClient("scan-videos");

    //const blobName = `${uuidv4()}-${req.file.originalname}`;
    const blobName = `${temp}_video.mp4`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: {
        blobContentType: req.file.mimetype, // e.g., 'video/mp4'
      },
    });

    const blobUrl = blockBlobClient.url;

    res.status(200).json({ message: "Upload successful", url: blobUrl });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

//original
router.post("/upload-frame", async (req, res) => {
  try {
    const { annotated_image, idx, visitId } = req.body; // Expect base64 image and a unique string

    console.log("index ", idx, " id", visitId);

    if (!annotated_image) {
      return res
        .status(400)
        .json({ error: "Annotated image and randString are required" });
    }

    // Use mocked client
    const containerClient = getContainerClient("scan-images");

    // Convert base64 image to Buffer
    const base64Image = annotated_image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Image, "base64");

    // Generate timestamp for folder structure (YYYYMMDDHHmm)

    // **Create virtual folder path**
    const folderName = visitId;
    const blobName = `${folderName}/img${idx}.png`; // Store in the folder

    // Upload the image
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(imageBuffer, {
      blobHTTPHeaders: { blobContentType: "image/png" },
    });

    // Return the full blob URL
    const blobUrl = blockBlobClient.url;

    res.status(200).json({ success: true, blobUrl });
  } catch (err) {
    console.error("Upload error:", err);
    res
      .status(500)
      .json({ error: "Failed to upload frame", details: err.message });
  }
});

const reportAnalysisUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok =
      file.mimetype === "application/pdf" ||
      /^image\/(png|jpeg|jpg|webp)$/i.test(file.mimetype);
    if (ok) cb(null, true);
    else cb(new Error("Only PDF or image (PNG, JPEG, WebP) allowed"));
  },
});

router.post("/api/analyze-report", reportAnalysisUpload.single("report"), analyzeReport);

router.post("/api/chat-assistant", chatAssistant);

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large (max 12 MB)." });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err && err.message === "Only PDF or image (PNG, JPEG, WebP) allowed") {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;
