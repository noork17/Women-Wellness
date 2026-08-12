from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64  # Keep this import
import cv2
from video_analysis import process_video
from video_analysis import process_frames
from generate_report_and_pdf import generate_findings
from fibroidsreport import generate_findings1
from fibroidsdetection import process_frames1
from pcosdetection import process_frames2
from pcosreport import generate_findings2
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


from flask import Response, jsonify
import json

@app.route("/analyze-video/", methods=["POST"])
def analyze_video():
    if "frames" not in request.json:
        return jsonify({"success": False, "error": "No frames provided"}), 400

    frames = request.json["frames"]

    if not frames:
        return jsonify({"success": False, "error": "No frames data"}), 400

    def generate():
        try:
            # Stream each processed frame result incrementally
            for result in process_frames(frames):
                yield f"data: {json.dumps({'success': True, 'result': result})}\n\n"
        except Exception as e:
            # Stream the error message immediately if an exception occurs
            yield f"data: {json.dumps({'success': False, 'error': str(e)})}\n\n"

    # Return a streaming response with the proper content type for server-sent events
    return Response(generate(), content_type="text/event-stream")


# saving the images in required path
UPLOAD_FOLDER = "frames/Report_images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/fibroid-detection/", methods=["POST"])
def fibroid_detection():
    if "frames" not in request.json:
        return jsonify({"success": False, "error": "No frames provided"}), 400

    frames = request.json["frames"]

    if not frames:
        return jsonify({"success": False, "error": "No frames data"}), 400

    def generate():
        try:
            # Stream each processed frame result incrementally
            for result in process_frames1(frames):
                yield f"data: {json.dumps({'success': True, 'result': result})}\n\n"
        except Exception as e:
            # Stream the error message immediately if an exception occurs
            yield f"data: {json.dumps({'success': False, 'error': str(e)})}\n\n"

    # Return a streaming response with the proper content type for server-sent events
    return Response(generate(), content_type="text/event-stream")


# saving the images in required path
UPLOAD_FOLDER = "frames/Report_images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/pcos-detection/", methods=["POST"])
def pcos_detection():
    if "frames" not in request.json:
        return jsonify({"success": False, "error": "No frames provided"}), 400

    frames = request.json["frames"]

    if not frames:
        return jsonify({"success": False, "error": "No frames data"}), 400

    def generate():
        try:
            # Stream each processed frame result incrementally
            for result in process_frames2(frames):
                yield f"data: {json.dumps({'success': True, 'result': result})}\n\n"
        except Exception as e:
            # Stream the error message immediately if an exception occurs
            yield f"data: {json.dumps({'success': False, 'error': str(e)})}\n\n"

    # Return a streaming response with the proper content type for server-sent events
    return Response(generate(), content_type="text/event-stream")


# saving the images in required path
UPLOAD_FOLDER = "frames/Report_images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)



@app.route("/generate-findings/", methods=["POST"])
def generate_report_endpoint():
    data = request.get_json()
    # for index, dictionary in enumerate(data):
    #     print(f"Dictionary {index + 1}: Keys are {list(dictionary.keys())}")
    final_frames = []
    boxes = []
    
    for i in range(len(data)):
        final_frames.append(data[i]['annotated_image'])
        boxes.append(data[i]['boxes'])

    print(final_frames)    

    print(boxes)

    '''if len(final_frames) != 2 or len(boxes) != 2:
        return jsonify({"success": False, "error": "Exactly two images and their bounding boxes are required."}), 400'''

    try:
        image_paths = []

        for idx, frame in enumerate(final_frames):
            image_data = base64.b64decode(frame)
            image_path = os.path.join(UPLOAD_FOLDER, f"image_{idx}.jpg")
            with open(image_path, "wb") as img_file:
                img_file.write(image_data)
            image_paths.append(image_path)

        # Call the generate_findings function with the stored images
        findings, tumor_details, recommendations = generate_findings(image_paths, boxes)

        return jsonify({
            "success": True,
            "findings": findings,
            "tumor_details": tumor_details,
            "recommendations": recommendations
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    
@app.route("/generate-findings1/", methods=["POST"])
def generate_report_endpoint1():
    data = request.get_json()
    # for index, dictionary in enumerate(data):
    #     print(f"Dictionary {index + 1}: Keys are {list(dictionary.keys())}")
    final_frames = []
    boxes = []
    
    for i in range(len(data)):
        final_frames.append(data[i]['annotated_image'])
        boxes.append(data[i]['boxes'])

    print(final_frames)    

    print(boxes)

    '''if len(final_frames) != 2 or len(boxes) != 2:
        return jsonify({"success": False, "error": "Exactly two images and their bounding boxes are required."}), 400'''

    try:
        image_paths = []

        for idx, frame in enumerate(final_frames):
            image_data = base64.b64decode(frame)
            image_path = os.path.join(UPLOAD_FOLDER, f"image_{idx}.jpg")
            with open(image_path, "wb") as img_file:
                img_file.write(image_data)
            image_paths.append(image_path)

        # Call the generate_findings function with the stored images
        findings, tumor_details, recommendations = generate_findings1(image_paths, boxes)

        return jsonify({
            "success": True,
            "findings": findings,
            "tumor_details": tumor_details,
            "recommendations": recommendations
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    

@app.route("/generate-findings2/", methods=["POST"])
def generate_report_endpoint2():
    data = request.get_json()
    # for index, dictionary in enumerate(data):
    #     print(f"Dictionary {index + 1}: Keys are {list(dictionary.keys())}")
    final_frames = []
    boxes = []
    
    for i in range(len(data)):
        final_frames.append(data[i]['annotated_image'])
        boxes.append(data[i]['boxes'])

    print(final_frames)    

    print(boxes)

    '''if len(final_frames) != 2 or len(boxes) != 2:
        return jsonify({"success": False, "error": "Exactly two images and their bounding boxes are required."}), 400'''

    try:
        image_paths = []

        for idx, frame in enumerate(final_frames):
            image_data = base64.b64decode(frame)
            image_path = os.path.join(UPLOAD_FOLDER, f"image_{idx}.jpg")
            with open(image_path, "wb") as img_file:
                img_file.write(image_data)
            image_paths.append(image_path)

        # Call the generate_findings function with the stored images
        findings, tumor_details, recommendations = generate_findings2(image_paths, boxes)

        return jsonify({
            "success": True,
            "findings": findings,
            "tumor_details": tumor_details,
            "recommendations": recommendations
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

