from flask import Flask, render_template, jsonify, request
from yt import *

app = Flask(__name__)

@app.route('/')
def home():
  return render_template('index.html')
  
@app.route('/search', methods=['GET'])
def search():
  try:
    query = request.args.get('q')
    searchInfo = topResult(query)
    if not searchInfo or searchInfo == '':
      print('Error from yt.py')
    return jsonify(searchInfo)
  except Exception as e:
    return jsonify({'error': str(e)}), 500

@app.route('/search', methods=["POST"])
def searchURL():
  data = request.get_json()
  query = data.get("query", "").strip()
  if not query or query == 0 :
    return jsonify([])
  return jsonify(getStreamUrl(query))
  
if __name__ == '__main__':
  app.run(host='0.0.0.0', port =5000, debug=False)
