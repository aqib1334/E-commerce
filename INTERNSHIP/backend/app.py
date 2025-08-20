# app.py
from flask import Flask, render_template, send_from_directory
import os
import json

app = Flask(__name__)

# --- Firebase Configuration Placeholder ---
# IMPORTANT: Replace these with your actual Firebase project configuration.
# You can find this in your Firebase project settings -> Project settings -> General -> Your apps -> Web app -> Firebase SDK snippet -> Config.
# For security, in a production environment, you would load these from environment variables
# or a secure configuration management system, NOT hardcoded here.
FIREBASE_CONFIG = {
    "apiKey": "AIzaSyByDTGw-EVSczOfLPUQjyC_eaWdfJYDnA4",
    "authDomain": "e-commerce-website-ed65f.firebaseapp.com",
    "projectId": "e-commerce-website-ed65f",
    "storageBucket": "e-commerce-website-ed65f.firebasestorage.app",
    "messagingSenderId": "781385774428",
    "appId": "1:781385774428:web:68fac415d83162aefd7d99",
    "measurementId": "G-S85N3PQ0HY"
}
# --- End Firebase Configuration Placeholder ---


@app.route('/')
def serve_frontend():
    """
    Serves the main index.html file for the e-commerce frontend.
    It passes the Firebase configuration to the frontend as a global JavaScript variable.
    """
    # In a real setup, you might serve a static index.html and then fetch config via a separate API call.
    # For this setup, we're injecting the config directly into the template.
    return render_template('index.html',
                           firebase_config=json.dumps(FIREBASE_CONFIG),
                           app_id=FIREBASE_CONFIG.get("projectId", "default-app-id"))

@app.route('/static/<path:filename>')
def serve_static(filename):
    """
    Serves static files like main.js, CSS, images, etc.
    This route is necessary if you externalize your JavaScript (main.js)
    or other assets into a 'static' folder.
    """
    return send_from_directory(app.static_folder, filename)

if __name__ == '__main__':
    # Create a 'templates' directory if it doesn't exist and put your index.html inside it.
    template_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
    if not os.path.exists(template_dir):
        os.makedirs(template_dir)
        print(f"Created templates directory: {template_dir}")
        print("Please move your index.html file into this 'templates' directory.")

    # Create a 'static' directory if it doesn't exist.
    # If you extract main.js, place it here.
    static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
    if not os.path.exists(static_dir):
        os.makedirs(static_dir)
        print(f"Created static directory: {static_dir}")
        print("If you extract main.js or have other external JS/CSS/image files, place them in this 'static' directory.")

    # Run the Flask application
    app.run(debug=True, host='0.0.0.0', port=5000)
