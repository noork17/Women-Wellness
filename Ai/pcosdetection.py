# General imports
import os
import cv2
import pdb
import base64
import shutil
import numpy as np
import supervision as sv
import gradio as gr
import matplotlib.pyplot as plt
from ultralytics import YOLO
from PIL import Image
from fpdf import FPDF
from datetime import datetime
from datetime import datetime




global final_frames
final_frames = []

'''Directory Configuration'''

# LOGO_PATH = "Logo.png"  # Replace with the actual logo path

# Configuration for deployment
class DeploymentConfig:
    MODEL_PATH = "F:\\Breastcancer3.0 (6) (2)\\Breastcancer3.0\\Breastcancer\\Ai\\weights\\pcos\\best.pt"
    VIDEO_SAVE_DIR = "video"
    PCOS_FRAME_DIR = "frames/PCOS_frames"
    NO_PCOS_FRAME_DIR = "frames/no_PCOS_frames"
    FRAMES_ANALYSIS_DIR = "frames"
# Ensure the upload and frame directories exist
def clear_directory(directory):
    """Clear the directory by deleting all files and subdirectories."""
    if os.path.exists(directory):
        shutil.rmtree(directory)
    os.makedirs(directory)

# Clear and create necessary directories
clear_directory(DeploymentConfig.VIDEO_SAVE_DIR)
clear_directory(DeploymentConfig.FRAMES_ANALYSIS_DIR)
clear_directory(DeploymentConfig.PCOS_FRAME_DIR)
clear_directory(DeploymentConfig.NO_PCOS_FRAME_DIR)




'''Video Analysis'''


def load_model():
    model = YOLO(DeploymentConfig.MODEL_PATH)
    return model

def add_index_to_frames(frame,frame_number):
        
    frame_with_text = frame.copy()
    text = f"{frame_number}"
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 1
    thickness = 2
    text_size = cv2.getTextSize(text, font, font_scale, thickness)[0]
    text_x = (frame.shape[1] - text_size[0]) // 2
    text_y = text_size[1] + 10
    cv2.putText(
        frame_with_text,
        text,
        (text_x, text_y),
        font,
        font_scale,
        (255, 0, 0),  # Blue color in BGR
        thickness,
        cv2.LINE_AA,
    )
    return frame_with_text

# Analyze detection results and save frames
def analyse_result(result, frame_number, frame_with_results, num_PCOS,class_name,confidence,boxes):
    detections = sv.Detections.from_ultralytics(result)
    classes_detected = detections.data['class_name']
    if classes_detected.size > 0:
        class_name = classes_detected[0]
        boxes = detections.xyxy
        if class_name == 'pcos':
            num_PCOS += 1
            confidence = detections.confidence[0]
            output_path = os.path.join(DeploymentConfig.PCOS_FRAME_DIR, f"frame_{frame_number:04d}.jpg")
            cv2.imwrite(output_path, frame_with_results)
    return num_PCOS, class_name, confidence, boxes


def process_frames2(frames):
    """
    Process a list of frames for PCOS detection, analyze the results, and yield results for each frame in real-time.

    Args:
        frames (list): List of base64-encoded frame data.

    Yields:
        dict: A dictionary containing the analysis result for each frame.
    """
    num_PCOS = 0
    confidence = 0.0
    class_name = ''
    boxes = []

    # Load the AI model
    model = load_model()

    for frame_number, frame_data in enumerate(frames):
        try:
            # Decode the base64 frame data to an image
            img_data = base64.b64decode(frame_data.split(",")[1])
            np_img = np.frombuffer(img_data, dtype=np.uint8)
            frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

            # Perform AI predictions for the frame
            results_frame = model(frame)

            for result in results_frame:
                # Annotate the frame with predictions
                frame_with_results = result.plot()

                # Analyze the result and update counters
                num_PCOS, class_name, confidence, boxes = analyse_result(
                    result, frame_number, frame_with_results, num_PCOS, class_name, confidence, boxes
                )

                # Ensure all box data is converted to lists (if numpy.ndarray)
                boxes = [box.tolist() if isinstance(box, np.ndarray) else box for box in boxes]

                # Convert the annotated frame to a base64 string
                _, buffer = cv2.imencode('.jpg', frame_with_results)
                annotated_image_base64 = base64.b64encode(buffer).decode('utf-8')

                # Yield the analysis result for this frame
                yield {
                    'frame_number': frame_number,
                    'class_name': class_name,
                    'num_PCOS': num_PCOS,
                    'confidence': float(confidence),  # Ensure confidence is a float
                    'boxes': boxes,  # Ensure boxes is a list
                    'annotated_image': annotated_image_base64  # Add the annotated image
                }
        except Exception as e:
            # Handle exceptions and provide debug information if needed
            yield {
                'frame_number': frame_number,
                'error': str(e)
            }
# Process video and detect cancer frames in real-time
def process_video(video):
    filename = 'uploaded.mp4'
    video_path = os.path.join(DeploymentConfig.VIDEO_SAVE_DIR, filename)

    with open(video_path, 'wb') as f:
        f.write(video)

    cap = cv2.VideoCapture(video_path)
    model = load_model()

    frame_number = 0
    num_PCOS = 0
    
    global PCOS_frames
    global PCOS_confidence
    PCOS_confidence = []
    PCOS_frames = []
    no_Detection_frames = []
    final_frames = []
    final_images = []
    box = []
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        results = model(frame)
        frame_number += 1

        for result in results:
            frame_with_results = result.plot()
            frame_with_index = add_index_to_frames(frame_with_results,frame_number)
            confidence = 1
            class_name = 'No_detection'
            boxes = np.zeros((1,4))
            num_PCOS, class_name, confidence, boxes = analyse_result(result,frame_number,frame_with_index,num_PCOS,class_name,confidence,boxes)
        
        # Convert BGR to RGB for Gradio display and yield the processed frame for streaming
        frame_with_index_rgb = cv2.cvtColor(frame_with_index, cv2.COLOR_BGR2RGB)
        if class_name == 'pcos':
            PCOS_frames.append(frame_with_index_rgb)
            PCOS_confidence.append((confidence,frame_number,boxes))

        # Yield the current frame for real-time display in Gradio
        yield frame_with_index_rgb, class_name, num_PCOS, confidence, PCOS_frames, final_frames, final_images, box # no_Detection_frames
    
    cap.release()
    if len(PCOS_confidence)>0:
        max1 = max(PCOS_confidence)
        PCOS_confidence.remove(max1)
        max2 = max(PCOS_confidence)
        frame_number_1 = max1[1]
        box1 = max1[2]
        frame_number_2 = max2[1]
        box2 = max2[2]
        img1 = os.path.join(DeploymentConfig.PCOS_FRAME_DIR, f"frame_{frame_number_1:04d}.jpg")
        img2 = os.path.join(DeploymentConfig.PCOS_FRAME_DIR, f"frame_{frame_number_2:04d}.jpg")
        Img1 = cv2.imread(img1)
        Img2 = cv2.imread(img2)
        img1_rgb = cv2.cvtColor(Img1, cv2.COLOR_BGR2RGB)
        img2_rgb = cv2.cvtColor(Img2, cv2.COLOR_BGR2RGB)
        final_images = [img1, img2]
        box = [box1, box2]
        final_frames = [img1_rgb, img2_rgb]
    else: 
        final_images = []
        box = []
        final_frames = []

    yield frame_with_index_rgb, class_name, num_PCOS, confidence, PCOS_frames, final_frames, final_images, box
def handle_reject():
    return gr.update(visible=True)

def handle_manual_selection(index_input):
    global final_frames
    try:
        indices = list(map(int, index_input.split(',')))
        if len(indices) != 2:
            return "Error: Please enter exactly two indices.", [],[],[], gr.update(visible=True)
        box1 = [item for item in fibroid_confidence if item[1] == indices[0]]
        box2 = [item for item in fibroid_confidence if item[1] == indices[1]]
        box1 = box1[0][2]
        box2 = box2[0][2]
        img1 = os.path.join(DeploymentConfig.PCOS_FRAME_DIR, f"frame_{indices[0]:04d}.jpg")
        img2 = os.path.join(DeploymentConfig.PCOS_FRAME_DIR, f"frame_{indices[1]:04d}.jpg")
        Img1 = cv2.imread(img1)
        Img2 = cv2.imread(img2)
        img1_rgb = cv2.cvtColor(Img1, cv2.COLOR_BGR2RGB)
        img2_rgb = cv2.cvtColor(Img2, cv2.COLOR_BGR2RGB)
        final_images = [img1, img2]
        box = [box1, box2]
        final_frames = [img1_rgb, img2_rgb]
        return "Frames selected successfully!", final_frames, final_images, box, gr.update(visible=False)
    except (ValueError, IndexError):
        return "Error: Invalid indices. Ensure they are integers and within range.", [],[],[], gr.update(visible=True)
