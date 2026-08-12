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
    MODEL_PATH = 'F:\\Breastcancer3.0 (6) (2)\\Breastcancer3.0\\Breastcancer\\Ai\\weights\\best.pt'
    VIDEO_SAVE_DIR = "video"
    MALIGNANT_FRAME_DIR = "frames/MALIGNANT_frames"
    BENIGN_FRAME_DIR = "frames/BENIGN_frames"
    FRAMES_ANALYSIS_DIR = "frames"
    SELECTED_IMAGES_REPORT = "frames/Report_images"

# Ensure the upload and frame directories exist
def clear_directory(directory):
    """Clear the directory by deleting all files and subdirectories."""
    if os.path.exists(directory):
        shutil.rmtree(directory)
    os.makedirs(directory)

# Clear and create necessary directories
clear_directory(DeploymentConfig.VIDEO_SAVE_DIR)
clear_directory(DeploymentConfig.FRAMES_ANALYSIS_DIR)
clear_directory(DeploymentConfig.MALIGNANT_FRAME_DIR)
clear_directory(DeploymentConfig.BENIGN_FRAME_DIR)
clear_directory(DeploymentConfig.SELECTED_IMAGES_REPORT)



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
def analyse_result(result, frame_number, frame_with_results, num_malignant, num_benign, num_detections,class_name,confidence,boxes):
    detections = sv.Detections.from_ultralytics(result)
    classes_detected = detections.data['class_name']
    
    if classes_detected.size > 0:
        class_name = classes_detected[0]
        num_detections += 1
        boxes = detections.xyxy
        if class_name == 'malignant':
            num_malignant += 1
            confidence = detections.confidence[0]
            output_path = os.path.join(DeploymentConfig.MALIGNANT_FRAME_DIR, f"frame_{frame_number:04d}.jpg")
            cv2.imwrite(output_path, frame_with_results)
        elif class_name == 'benign':
            num_benign += 1
            confidence = detections.confidence[0]
            output_path = os.path.join(DeploymentConfig.BENIGN_FRAME_DIR, f"frame_{frame_number:04d}.jpg")
            cv2.imwrite(output_path, frame_with_results)
    return num_malignant, num_benign, num_detections, class_name, confidence, boxes


def process_frames(frames):
    num_malignant = 0
    num_benign = 0
    num_detections = 0
    class_name = ''
    confidence = 0
    boxes = []
    model = load_model()

    for frame_number, frame_data in enumerate(frames):
        # Decode the base64 frame data
        img_data = base64.b64decode(frame_data.split(",")[1])
        np_img = np.frombuffer(img_data, dtype=np.uint8)
        frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        # AI predictions for the frame
        results_frame = model(frame)

        for result in results_frame:
            # Annotate the frame
            frame_with_results = result.plot()
              
            # Analyze the result and update counters
            num_malignant, num_benign, num_detections, class_name, confidence, boxes = analyse_result(
                result, frame_number, frame_with_results, num_malignant, num_benign, num_detections, class_name, confidence, boxes
            )

            # Convert any numpy.ndarray objects (like 'boxes') to lists
            boxes = [box.tolist() if isinstance(box, np.ndarray) else box for box in boxes]

            # Convert the annotated frame to base64 string
            _, buffer = cv2.imencode('.jpg', frame_with_results)
            annotated_image_base64 = base64.b64encode(buffer).decode('utf-8')

            # Yield the analysis result for this frame immediately
            yield {
                'frame_number': frame_number,
                'class_name': class_name,
                'num_malignant': num_malignant,
                'num_benign': num_benign,
                'num_detections': num_detections,
                'confidence': float(confidence),  # Ensure confidence is a float
                'boxes': boxes,  # Ensure boxes is a list
                'annotated_image': annotated_image_base64  # Add the annotated image
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
    num_detections = 0
    num_malignant = 0
    num_benign = 0
    global benign_frames
    global malign_frames
    global malign_confidence
    global benign_confidence
    malign_frames = []
    benign_frames = []
    malign_confidence = []
    benign_confidence = []
    final_frames = []
    final_images = []
    box = []
    final_class_name = ''

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
            num_malignant, num_benign, num_detections, class_name, confidence, boxes = analyse_result(result, frame_number, frame_with_index, num_malignant, num_benign, num_detections,class_name,confidence,boxes)
        
        # Convert BGR to RGB for Gradio display and yield the processed frame for streaming
        frame_with_index_rgb = cv2.cvtColor(frame_with_index, cv2.COLOR_BGR2RGB)
        if class_name == 'malignant':
            malign_frames.append(frame_with_index_rgb)
            malign_confidence.append((confidence,frame_number,boxes))
        if class_name == 'benign':
            benign_frames.append(frame_with_index_rgb)
            benign_confidence.append((confidence,frame_number,boxes))

        # Yield the current frame for real-time display in Gradio
        yield frame_with_index_rgb, class_name, num_detections, num_malignant, num_benign, confidence, malign_frames, benign_frames, final_frames, final_images, box, final_class_name  # no_Detection_frames
    
    cap.release()
    if num_malignant >= num_benign:
        if len(malign_confidence)>0:
            max1 = max(malign_confidence)
            malign_confidence.remove(max1)
            max2 = max(malign_confidence)
            frame_number_1 = max1[1]
            box1 = max1[2]
            frame_number_2 = max2[1]
            box2 = max2[2]
            img1 = os.path.join(DeploymentConfig.MALIGNANT_FRAME_DIR, f"frame_{frame_number_1:04d}.jpg")
            img2 = os.path.join(DeploymentConfig.MALIGNANT_FRAME_DIR, f"frame_{frame_number_2:04d}.jpg")
            Img1 = cv2.imread(img1)
            Img2 = cv2.imread(img2)
            img1_rgb = cv2.cvtColor(Img1, cv2.COLOR_BGR2RGB)
            img2_rgb = cv2.cvtColor(Img2, cv2.COLOR_BGR2RGB)
            final_images = [img1, img2]
            box = [box1, box2]
            final_frames = [img1_rgb, img2_rgb]
            final_class_name = 'malignant'
        else:
            final_images = []
            box = []
            final_frames = [ ]
            final_class_name = 'No class detected'
    else:
        if len(benign_confidence)>0:
            max1 = max(benign_confidence)
            benign_confidence.remove(max1)
            max2 = max(benign_confidence)
            frame_number_1 = max1[1]
            box1 = max1[2]
            frame_number_2 = max2[1]
            box2 = max2[2]
            img1 = os.path.join(DeploymentConfig.BENIGN_FRAME_DIR, f"frame_{frame_number_1:04d}.jpg")
            img2 = os.path.join(DeploymentConfig.BENIGN_FRAME_DIR, f"frame_{frame_number_2:04d}.jpg")
            Img1 = cv2.imread(img1)
            Img2 = cv2.imread(img2)
            img1_rgb = cv2.cvtColor(Img1, cv2.COLOR_BGR2RGB)
            img2_rgb = cv2.cvtColor(Img2, cv2.COLOR_BGR2RGB)
            final_images = [img1, img2]
            box = [box1, box2]
            final_frames = [img1_rgb, img2_rgb]
            final_class_name = 'benign'
        else:
            final_images = []
            box = []
            final_frames = [ ]
            final_class_name = 'No class detected'

    yield frame_with_index_rgb, class_name, num_detections, num_malignant, num_benign, confidence, malign_frames, benign_frames, final_frames, final_images, box, final_class_name # no_Detection_frames

def handle_reject():
    return gr.update(visible=True)

def handle_manual_selection(index_input,class_name):
    global final_frames
    try:
        indices = list(map(int, index_input.split(',')))
        if len(indices) != 2:
            return "Error: Please enter exactly two indices.", [],[],[], gr.update(visible=True)
        if class_name == "malignant":
            box1 = [item for item in malign_confidence if item[1] == indices[0]]
            box2 = [item for item in malign_confidence if item[1] == indices[1]]
            pdb.set_trace()
            box1 = box1[0][2]
            box2 = box2[0][2]
            img1 = os.path.join(DeploymentConfig.MALIGNANT_FRAME_DIR, f"frame_{indices[0]:04d}.jpg")
            img2 = os.path.join(DeploymentConfig.MALIGNANT_FRAME_DIR, f"frame_{indices[1]:04d}.jpg")
            Img1 = cv2.imread(img1)
            Img2 = cv2.imread(img2)
            img1_rgb = cv2.cvtColor(Img1, cv2.COLOR_BGR2RGB)
            img2_rgb = cv2.cvtColor(Img2, cv2.COLOR_BGR2RGB)
            final_images = [img1, img2]
            box = [box1, box2]
            final_frames = [img1_rgb, img2_rgb]
        if class_name == 'benign':
            box1 = [item for item in benign_confidence if item[1] == indices[0]]
            box2 = [item for item in benign_confidence if item[1] == indices[1]]
            box1 = box1[0][2]
            box2 = box2[0][2]
            img1 = os.path.join(DeploymentConfig.BENIGN_FRAME_DIR, f"frame_{indices[0]:04d}.jpg")
            img2 = os.path.join(DeploymentConfig.BENIGN_FRAME_DIR, f"frame_{indices[1]:04d}.jpg")
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