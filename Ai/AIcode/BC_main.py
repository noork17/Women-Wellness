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

logo_html = """
<div style="position: absolute; top: -1px; left: 10px; z-index: 10;">
    <img src="https://static.wixstatic.com/media/97eec0_ea4ba24d6d0d47878d10ad9895edb726~mv2.png/v1/fill/w_208,h_138,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/white_logo_transparent_background.png
" alt="Logo" style="height: 80px;">
</div>
"""
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
'''Directory Configuration'''

LOGO_PATH = "Logo.png"  # Replace with the actual logo path

# Configuration for deployment
class DeploymentConfig:
    MODEL_PATH = 'weights/best.pt'
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

#--------------------------------------------------------------------------------------------------------------------------#
'''Report Generation'''

class PDF(FPDF):
    def header(self):
        # Hospital logo
        if os.path.exists(LOGO_PATH):
            self.image(LOGO_PATH, 10, 10, 30)  # Adjust position and size as needed

        # Title and contact information
        self.set_xy(45, 10)  # Align text to the right of the logo
        self.set_font('Arial', 'B', 14)  # Bold font for hospital name
        self.cell(0, 8, "THE SETV.G HOSPITAL", ln=True, align='L')  # Hospital name

        self.set_xy(45, 18)
        self.set_font('Arial', 'B', 12)  # Bold font for tagline
        self.cell(0, 8, "Accurate | Caring | Instant", ln=True, align='L')  # Tagline

        self.set_xy(135, 10)
        self.set_font('Arial', 'B', 10)  # Bold font for contact details
        self.cell(0, 8, "Phone: 040-XXXXXXXXX / +91 XX XXX XXX", ln=True, align='R')
        self.cell(0, 8, "Email: setvgbhospital@gmail.com", ln=True, align='R')

        self.set_xy(10, 30)  # Position address below logo
        self.set_font('Arial', 'B', 10)
        self.cell(0, 8, "SETV.ASRV LLP, Avishkaran, NIPER, Balanagar, Hyderabad, Telangana, 500037.", ln=True, align='C')

        # Add a blue line
        self.set_fill_color(0, 121, 191)  # Blue color
        self.rect(10, 40, 190, 3, 'F')

        # Add a red line
        self.set_fill_color(228, 30, 37)  # Red color
        self.rect(10, 43, 190, 3, 'F')

        self.ln(15)

    def footer(self):
        self.set_y(-15)
        self.set_fill_color(100, 149, 237)  # Medium blue
        self.rect(0, self.get_y(), 210, 10, 'F')
        self.set_font('Arial', 'I', 8)
        self.set_text_color(255, 255, 255)
        self.cell(0, 10, f"Page {self.page_no()} || THE SETV.G HOSPITAL || EMERGENCY CONTACT - +91 XXXXXXXXXX", 0, 0, 'C')

# Function to capture patient details
def get_patient_info(name, patient_id, age, gender):

    radiologist_name = "Dr. Iron Man"
    radiologist_id = "345621"
    return {
        "Name": name,
        "Age": age,
        "Gender": gender,
        "Patient_ID": patient_id,
        "Radiologist_Name": radiologist_name,
        "Radiologist_ID": radiologist_id
    }

# Function to upload and display two ultrasound images
def upload_ultrasound_images(image_path):

    if len(image_path)>0:
        # Open and display the images side by side
        image1 = Image.open(image_path[0])
        image2 = Image.open(image_path[1])

        fig, axs = plt.subplots(1, 2, figsize=(10, 5))
        axs[0].imshow(image1)
        axs[0].axis('off')
        axs[0].set_title("Uploaded Ultrasound Scan 1")

        axs[1].imshow(image2)
        axs[1].axis('off')
        axs[1].set_title("Uploaded Ultrasound Scan 2")
        images = [image1, image2]
        # plt.show()
    else:
        images = []

    return images

# Function to analyze ultrasound images
def analyze_ultrasound_images(images,boxes,mm_per_pixel=0.1):

    tumor_details = []
    findings = ""

    if len(images)>0:
        # Iterate over image_paths and add corresponding findings
        for idx, image in enumerate(images):
            if image is None:
                raise ValueError("Could not read the image. Check the path.")
            tumor_details_per_image = []
            x = (boxes[idx][0][0] + boxes[idx][0][2])/2
            y = (boxes[idx][0][1] + boxes[idx][0][3])/2
            w = boxes[idx][0][2] - boxes[idx][0][0]
            h = boxes[idx][0][3] - boxes[idx][0][1]
            width_mm = w * mm_per_pixel
            height_mm = h * mm_per_pixel
            tumor_details_per_image.append({
                "x": x,
                "y": y,
                "width_mm": width_mm,
                "height_mm": height_mm
            })

            # Update the findings to include "Image 1", "Image 2", etc.
            findings += f"The ultrasound scan  {idx + 1} reveals {len(tumor_details_per_image)} suspicious regions :\n"
            for i, detail in enumerate(tumor_details_per_image, start=1):
                findings += (f"Size ({detail['width_mm']:.2f} mm x {detail['height_mm']:.2f} mm)\n")

            tumor_details.append(tumor_details_per_image)

    else:
        findings = f"No suspecious regions found.\n"
    # Recommendations and Correlation text based on scan type and findings
    if tumor_details:  # Only add recommendations if tumors are detected
            recommendations = (
                "* Recommended Tests:"
                "- Biopsy"
                "- Hormone Receptor Testing"
                "- Genetic Testing"
                "- Blood Tests\n"
                "* Recommended Scans:"
                "- Mammogram"
                "- 3D Mammogram"
                "- Breast MRI"
                "- PET/CT Scan\n\n"
                "Correlation: Since the scan is an Ultrasound, it is recommended to follow up with a Mammogram, "
                "3D Mammogram, and PET/CT Scan for further evaluation of the detected regions."
            )
    else:
            recommendations = "No specific recommendations available.\n"

    return findings, tumor_details, recommendations

# Function to generate the PDF report
def generate_pdf_report(patient_info, findings, tumor_details, recommendations, processed_image_paths):
    pdf = PDF()
    pdf.add_page()

    # Set font for text
    pdf.set_font("Arial", size=12)

    # Title centered
    pdf.ln(3)
    pdf.set_font('Arial', 'B', 16)
    pdf.cell(200, 10, "Patient Scan Report", ln=True, align="C")

    # Patient details (formatted as requested)
    pdf.ln(10)
    pdf.set_font("Arial", size=12)

   # Patient and radiologist details with date and time
    current_date = datetime.now().strftime('%Y-%m-%d')
    current_time = datetime.now().strftime('%H:%M:%S')

   # Adjust the width of each column for better alignment
    column_width_left = 110  # Width for the left column
    column_width_right = 110  # Width for the right column

    # Patient Name
    pdf.set_font("Arial", "B", 12)  # Bold
    pdf.cell(column_width_left, 10, f"Patient Name: {patient_info['Name']}", border=0, align="L")
    pdf.set_font("Arial", "B", 12)  # Bold
    pdf.cell(column_width_right, 10, f"Radiologist Name: {patient_info['Radiologist_Name']}", border=0, ln=True, align="L")

    # Patient ID
    pdf.set_font("Arial", "B", 12)  # Bold
    pdf.cell(column_width_left, 10, f"Patient ID: {patient_info['Patient_ID']}", border=0, align="L")
    pdf.set_font("Arial", "B", 12)  # Bold
    pdf.cell(column_width_right, 10, f"Radiologist ID: {patient_info['Radiologist_ID']}", border=0, ln=True, align="L")

    # Other details (Age, Gender, Date, and Time)
    pdf.set_font("Arial", size=12)  # Regular
    pdf.cell(column_width_left, 10, f"Age: {patient_info['Age']}", border=0, align="L")
    pdf.cell(column_width_right, 10, f"Date: {current_date}", border=0, ln=True, align="L")

    pdf.cell(column_width_left, 10, f"Gender: {patient_info['Gender']}", border=0, align="L")
    pdf.cell(column_width_right, 10, f"Time: {current_time}", border=0, ln=True, align="L")


    # Add a line after the patient info for separation
    pdf.ln(3)
    image_height = 0
    if len(processed_image_paths)>0:
        # Display the two images side by side in the report
        pdf.ln(3)
        pdf.set_font("Arial", "B", 12)  # Bold for captions
        pdf.cell(200, 10, "Ultrasound Scan Images:", ln=True, align="L")

        # Ensure both images fit within the page width
        image_width = 90
        image_height = 70

        pdf.ln(5)
        pdf.image(processed_image_paths[0], x=10, y=pdf.get_y(), w=image_width, h=image_height)
        pdf.image(processed_image_paths[1], x=10 + image_width + 5, y=pdf.get_y(), w=image_width, h=image_height)

    # Add the bold "Findings:" text
    pdf.ln(image_height + 5)  # Add space below the images
    pdf.set_font("Arial", "B", 12)  # Bold for the "Findings:" heading
    pdf.cell(0, 10, "Findings:", ln=True)

    # Add findings text (regular font)
    pdf.set_font('Arial', '', 12)
    pdf.multi_cell(0, 10, findings)

    # Add Recommendations section if present
    if recommendations:
        pdf.ln(10)
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(200, 10, "Recommendations:", ln=True)
        pdf.set_font('Arial', '', 12)
        pdf.multi_cell(0, 10, recommendations)

    # Disclaimer section
    pdf.ln(10)
    pdf.set_font("Arial", size=12, style="B")
    pdf.cell(0, 10, "Disclaimer:", ln=True)
    pdf.set_font("Arial", size=12)

    if tumor_details:  # Include tumor-related disclaimer only if tumors are detected
        pdf.cell(0, 10, "The detected regions in the scan are indicative of possible tumors or abnormalities.", ln=True)
        pdf.cell(0, 10, "Clinical correlation with the patient's medical history, physical examination, and further diagnostic tests", ln=True)
        pdf.cell(0, 5, "is necessary for accurate evaluation.", ln=True)
    else:  # General disclaimer when no tumors are detected
        pdf.cell(0, 10, "The scan analysis did not detect any tumors or abnormalities.", ln=True)
        pdf.cell(0, 10, "However, clinical correlation with the patient's medical history and further diagnostic tests", ln=True)
        pdf.cell(0, 5, "may still be necessary for a comprehensive evaluation.", ln=True)

    # Add doctor's comments section
    pdf.ln(10)
    pdf.set_font("Arial", size=12, style="B")
    pdf.cell(0, 10, "Doctor's Comments:", ln=True)
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, "______________")  # Blank line for comments
    pdf.ln(3)

    # Add doctor's signature and details
    pdf.ln(3)
    pdf.set_font("Arial", size=12, style="B")
    pdf.cell(0, 10, "Signature _____________", ln=True)
    pdf.set_font("Arial", size=12)
    pdf.cell(0, 10, "Name of Doctor: Dr. Sree Harsha", ln=True)
    pdf.cell(0, 10, "Designation: Consultant Physician (MD)", ln=True)
    pdf.cell(0, 10, "Contact No: 91xxxxxxx", ln=True)
    pdf.ln(10)

    # End of report
    pdf.set_font("Arial", size=12, style="B")
    pdf.cell(0, 10, "***End of Report***", ln=True, align="C")

    # Build the document
    pdf_output_path = "Breast_Cancer_Report.pdf"
    return pdf_output_path, pdf

def preview_pdf(pdf):
    # Generate the PDF as a byte string
    pdf_data = pdf.output(dest='S').encode('latin1')  # 'latin1' to match PDF binary encoding

    # Convert PDF to base64
    pdf_base64 = base64.b64encode(pdf_data).decode('utf-8')

    # Return data URL for inline display
    pdf_data_url = f"data:application/pdf;base64,{pdf_base64}"
    return f'<iframe src="{pdf_data_url}" width="100%" height="600px"></iframe>'

def download_pdf(pdf,pdf_output_path):
    # Save the PDF to a file
    pdf.output(pdf_output_path)
    out = f"\nReport generated successfully: {pdf_output_path}"    
    return out

def generate_findings(image_path, boxes):

    # Upload and display ultrasound images
    images = upload_ultrasound_images(image_path)

    # Analyze ultrasound images
    findings, tumor_details, recommendations = analyze_ultrasound_images(images,boxes)
    return findings, tumor_details, recommendations

def generate_report(image_path, name, patient_id, age, gender, findings, tumor_details, recommendations):

    # Capture patient info
    patient_info = get_patient_info(name, patient_id, age, gender)

    # Generate the PDF report
    pdf_path, pdf = generate_pdf_report(patient_info, findings, tumor_details, recommendations, image_path)
    preview = preview_pdf(pdf)

    return preview, pdf, pdf_path

#--------------------------------------------------------------------------------------------------------------------------#
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
            print("True")
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

#--------------------------------------------------------------------------------------------------------------------------#
'''Gradio Interface'''

# Gradio interface function to analyze video and display results in real-time
with gr.Blocks() as demo:
    gr.HTML(logo_html)

    gr.HTML("""
    <div style="text-align: center;">
        <h1>Breast Cancer Detection</h1>
    </div>
    """)
    
    with gr.Row():
        video_input = gr.File(label="Upload Video", type="binary")
    analyze_button = gr.Button("Analyze Video")
    
    with gr.Row():
        video_frames = gr.Image(label="Processed Video", type="numpy")  # Use Image for real-time display
        with gr.Column():
            with gr.Row():
                class_name = gr.Textbox(label="Detection")
                confidence = gr.Textbox(label="Confidence")
            num_detections = gr.Textbox(label="Number of detections")
            num_malignant = gr.Textbox(label="Malignant detections")
            num_benign = gr.Textbox(label="Benign detections")
    with gr.Row():
        malign_frames = gr.Gallery(label="Malignant Video Frames", elem_id="gallery", columns=3)
        benign_frames = gr.Gallery(label="Benign Video Frames", elem_id="gallery", columns=3)

    with gr.Row():
        final_frames = gr.Gallery(label="Final frames for report", elem_id="gallery", columns=2)

    with gr.Row():
        reject_button = gr.Button("Reject and Select Manually")

    # Define state variables to hold the results from process_video
    final_images = gr.State() 
    box = gr.State()
    final_class_name = gr.State()

    with gr.Row(visible=False) as manual_selection_row:
        index_input = gr.Textbox(label="Enter Indices (comma-separated)")
        submit_button = gr.Button("Submit")
        status = gr.Textbox(label="Status", interactive=False)
        final_images = gr.State() 
        box = gr.State()

    # Define analyze_button click event
    analyze_button.click(
        process_video,
        inputs=[video_input],
        outputs=[
            video_frames, class_name, num_detections, num_malignant, num_benign, confidence,
            malign_frames, benign_frames, final_frames, final_images, box, final_class_name
        ]
    )

    # accept_button.click(handle_accept, outputs=[status, final_frames, manual_selection_row])
    reject_button.click(handle_reject, outputs=[manual_selection_row])
    submit_button.click(
        handle_manual_selection,
        inputs=[index_input,final_class_name],
        outputs=[status, final_frames,final_images,box, manual_selection_row],
    )

    # Row for the Generate Report button, initially hidden
    with gr.Row():
        generate_findings_button = gr.Button("See findings and recommendations")

    with gr.Row():
        recommendations = gr.TextArea(label="Recommendations", placeholder="Recommendations")
        findings = gr.TextArea(label="Findings", placeholder="Findings")

    gr.HTML("<h1>Patient Information</h1>")
    
    # Input fields for patient details
    with gr.Row():
        name_input = gr.Textbox(label="Patient name", placeholder="Patient name")
        patient_id_input = gr.Textbox(label="Patient ID", placeholder="Patient ID")
    
    with gr.Row():
        age_input = gr.Textbox(label="Patient age", placeholder="Patient age")
        gender_input = gr.Radio(choices=["Male", "Female"], label="Patient gender")

    with gr.Row():
        generate_report_button = gr.Button("Generate Report")

    preview = gr.HTML(label="PDF Preview")
    download_btn = gr.Button("Download PDF", visible=False)

    pdf = gr.State()
    pdf_path = gr.State()
    tumor_details = gr.State()
    out = gr.Textbox(label="Status")
    # Define generate_report_button click event
    generate_findings_button.click(
        generate_findings,
        inputs=[final_images, box],
        outputs=[findings, tumor_details, recommendations]
    )

    generate_report_button.click(
        generate_report,
        inputs=[final_images, name_input, patient_id_input, age_input, gender_input,findings, tumor_details, recommendations],
        outputs=[preview,pdf,pdf_path]
    )

    download_btn.click(
        download_pdf,
        inputs=[pdf,pdf_path],
        outputs=[out]
    )

    generate_report_button.click(lambda: gr.update(visible=True), inputs=[], outputs=download_btn)

# Launch the Gradio interface
demo.launch()