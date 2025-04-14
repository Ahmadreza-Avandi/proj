from flask import Flask, jsonify, request
import os
import logging

# تنظیم لاگینگ
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/')
def home():
    logger.info("درخواست به صفحه اصلی")
    return jsonify({
        'status': 'running',
        'service': 'face-detection',
        'version': '1.0',
        'mode': 'simple-server'
    })

@app.route('/health')
def health():
    logger.info("بررسی سلامت سرویس")
    return jsonify({
        'status': 'healthy',
        'message': 'سرویس ساده تشخیص چهره فعال است'
    })

@app.route('/api/detect', methods=['POST'])
def detect_face():
    logger.info("درخواست تشخیص چهره دریافت شد")
    return jsonify({
        'detected': True,
        'faces': 1,
        'message': 'چهره با موفقیت شناسایی شد (حالت تست)',
        'mode': 'simple-server'
    })

@app.route('/api/face-data', methods=['GET', 'POST'])
def face_data():
    logger.info("درخواست داده‌های چهره دریافت شد")
    return jsonify({
        'success': True,
        'data': {
            'faces': 1,
            'timestamp': '2023-01-01 12:00:00',
            'mode': 'simple-server'
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    logger.info(f"سرور ساده در حال راه‌اندازی روی پورت {port}")
    app.run(host='0.0.0.0', port=port, debug=False) 