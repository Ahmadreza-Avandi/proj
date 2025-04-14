from flask import Flask, jsonify, request
import os

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        'status': 'running',
        'service': 'face-detection',
        'version': '1.0'
    })

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'message': 'سرویس تشخیص چهره فعال است'
    })

@app.route('/api/detect', methods=['POST'])
def detect_face():
    # این یک پاسخ مصنوعی است تا سیستم بدون نیاز به کتابخانه‌های تشخیص چهره کار کند
    return jsonify({
        'detected': True,
        'faces': 1,
        'message': 'چهره با موفقیت شناسایی شد (حالت تست)'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False) 