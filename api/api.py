import time
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 


saved_flow_data = None

@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/api/save', methods=['POST'])
def save_flow():
    global saved_flow_data
    try:
        flow_data = request.get_json()
        if flow_data:
            saved_flow_data = flow_data  
            print("Received and saved flow data:", flow_data)
            return jsonify({'status': 'success', 'message': 'Flow data saved successfully'}), 200
        else:
            return jsonify({'status': 'error', 'message': 'No data received'}), 400
    except Exception as e:
        print(f"Error saving flow data: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/restore', methods=['GET'])
def restore_flow():
    global saved_flow_data
    try:
        if saved_flow_data:
            print("Restoring flow data:", saved_flow_data)
            return jsonify({'status': 'success', 'data': saved_flow_data}), 200
        else:
            return jsonify({'status': 'error', 'message': 'No saved data found'}), 404
    except Exception as e:
        print(f"Error restoring flow data: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)