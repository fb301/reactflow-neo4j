from dotenv import load_dotenv
from typing import cast
from textwrap import dedent
from typing_extensions import LiteralString
import os

import neo4j
from neo4j import GraphDatabase, basic_auth

from flask import Flask, request, jsonify
from flask_cors import CORS


load_dotenv()
app = Flask(__name__)
CORS(app)

"""
Connect to database
"""
url = os.getenv("NEO4J_URI")
username = os.getenv("NEO4J_USER")
password = os.getenv("NEO4J_PASSWORD")
neo4j_version = os.getenv("NEO4J_VERSION")
database = os.getenv("NEO4J_DATABASE")

with GraphDatabase.driver(url, auth=basic_auth(username, password)) as driver:
    try:
        driver.verify_connectivity()
        print("Connection established.")
    except Exception as e:
        print(f"Error connecting: {e}")

def query(q: LiteralString) -> LiteralString:
    return cast(LiteralString, dedent(q).strip())


"""
SAVE
"""
saved_flow_data = None

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


"""
RESTORE
"""
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
    host = os.environ.get('FLASK_RUN_HOST')
    port = int(os.environ.get('FLASK_RUN_PORT'))
    debug = os.environ.get('FLASK_DEBUG')
    try:
        app.run(host=host, port=port, debug=debug)
    finally:
        driver.close()