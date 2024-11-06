from flask import Flask, redirect, url_for, render_template, request, jsonify
import pandas as pd
# from model import CSVGenerator
# csv_generator = CSVGenerator()

app = Flask(__name__)
# app.register_blueprint(views, url_prefix='/')

@app.route('/')
def index():
    return render_template('JSON.html')

@app.route("/JSON")
def JSON():
    return render_template('JSON.html')

@app.route("/CSV")
def CSV():
    return render_template('csv.html')

@app.route('/generate_csv', methods=['POST'])
@app.route("/generate_csv", methods=["POST"])
def generate_csv():
    # prompt = request.json.get("prompt")
    # csv_data = csv_generator.generate_csv_data(prompt)
    # print(csv_data)
    # return jsonify({"csv_data": csv_data})
    return -1


@app.route("/XML")
def XML():
    return render_template('XML.html')

if __name__ == "__main__":
    app.run(debug=True, port=5000)