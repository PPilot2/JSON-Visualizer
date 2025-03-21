from flask import Flask, redirect, url_for, render_template, request, jsonify
import pandas as pd
from openai import OpenAI
import openai
import os
from dotenv import load_dotenv
load_dotenv()

# Set your API key

os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')

openai.api_key = os.getenv('OPENAI_API_KEY')

client = OpenAI()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('JSON.html')

@app.route("/JSON")
def JSON():
    return render_template('JSON.html')

# @app.route("/generate_json", methods=["POST"])
# def generate_json():
#     print("Received prompt for JSON generation")
#     prompt = request.json.get('prompt')
#     response = client.chat.completions.create(
#         model="gpt-4",
#         messages=[
#             {"role": "system", "content": "You will be provided with instructions to generate JSON data. Please only return the raw JSON and nothing else."},
#             {"role": "user", "content": prompt}
#         ],
#         temperature=0.7, 
#         top_p=0.9,
#     )
#     json_data = response.choices[0].message.content
#     print(json_data)
#     return jsonify({"json_data": json_data})

@app.route("/CSV")
def CSV():
    return render_template('csv.html')

# @app.route("/generate_csv", methods=["POST"])
# def generate_csv():
#     print("received prompt")
#     prompt = request.json.get('prompt')
#     response = client.chat.completions.create(
#         model="gpt-4",
#         messages=[
#             {"role": "system", "content": "You will be provided with instructions on what to fill into a csv file. Create csv based on the description and do not add anything else. Please do not add a description or any additional text such as the prompt. Also put all entries in quotation marks."},
#             {"role": "user", "content": prompt}
#         ],
#         temperature=0.7,  # Adjust for creativity
#         top_p=0.9,        # Adjust for diversity
#     )
#     csv_data = response.choices[0].message.content
#     print(csv_data)
#     return jsonify({"csv_data": csv_data})

@app.route("/XML")
def XML():
    return render_template('XML.html')

if __name__ == "__main__":
    app.run(port=10000)