import os
from datetime import datetime
import base64
from fpdf import FPDF
from PIL import Image
import matplotlib.pyplot as plt


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
    images = []
    if len(image_path)>0:
        # Open and display the images side by side
        for i in range(len(image_path)):
            
            image = Image.open(image_path[i])
       

            fig, axs = plt.subplots(1, 2, figsize=(10, 5))
            axs[i].imshow(image)
            axs[i].axis('off')
            axs[i].set_title(f"Uploaded Ultrasound Scan {i + 1}")

            images.append(image)
        # plt.show()

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
         # Ultrasound
           recommendations = (
            "* Recommended Tests:"
            "- Hormonal Profile Testing "
            "- Glucose Tolerance Test"
            "-  AHM Test"
            "- Lipid Profile\n"
            "* Recommended Scans:"
            "- Pelvic MRI\n\n"
            "Correlation: Since the scan is an Ultrasound, it is recommended to follow up with a Pelvic MRI"
            "for further evaluation of the detected regions."
        )
    else:
            recommendations = "No specific recommendations available."

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
    pdf.multi_cell(0, 10, "______")  # Blank line for comments
    pdf.ln(3)

    # Add doctor's signature and details
    pdf.ln(3)
    pdf.set_font("Arial", size=12, style="B")
    pdf.cell(0, 10, "Signature _____", ln=True)
    pdf.set_font("Arial", size=12)
    pdf.cell(0, 10, "Name of Doctor: Dr. Sree Harsha", ln=True)
    pdf.cell(0, 10, "Designation: Consultant Physician (MD)", ln=True)
    pdf.cell(0, 10, "Contact No: 91xxxxxxx", ln=True)
    pdf.ln(10)

    # End of report
    pdf.set_font("Arial", size=12, style="B")
    pdf.cell(0, 10, "**End of Report**", ln=True, align="C")

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

def generate_findings2(image_path, boxes):

    # Upload and display ultrasound images
    images = upload_ultrasound_images(image_path)

    # Analyze ultrasound images
    findings, tumor_details, recommendations = analyze_ultrasound_images(images,boxes)
    print(findings, tumor_details, recommendations)
    return findings, tumor_details, recommendations

def generate_report(image_path, name, patient_id, age, gender, findings, tumor_details, recommendations):

    # Capture patient info
    patient_info = get_patient_info(name, patient_id, age, gender)

    # Generate the PDF report
    pdf_path, pdf = generate_pdf_report(patient_info, findings, tumor_details, recommendations, image_path)
    preview = preview_pdf(pdf)

    return preview, pdf, pdf_path


