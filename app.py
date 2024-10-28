from flask import Flask, redirect, url_for, render_template, request, jsonify
import pandas as pd
import random

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
def generate_csv():
    prompt = request.json.get("prompt", "").lower()
    data = []

    # Basic prompt-based data generation
    if "sales" in prompt:
        data = generate_sales_data()
    elif "inventory" in prompt:
        data = generate_inventory_data()
    else:
        data = generate_generic_data()

    # Convert data to CSV string
    df = pd.DataFrame(data)
    csv_data = df.to_csv(index=False)
    return jsonify({"csv_data": csv_data})

# Helper function for generating sample data
def generate_sales_data():
    return [
        {"Customer Name": random.choice(["Alice", "Bob", "Charlie"]),
         "Product": random.choice(["Laptop", "Phone", "Tablet"]),
         "Quantity": random.randint(1, 5),
         "Total Price": round(random.uniform(100, 1000), 2)}
        for _ in range(10)
    ]

def generate_inventory_data():
    return [
        {"Product ID": f"PID-{random.randint(1000, 9999)}",
         "Product Name": random.choice(["Laptop", "Monitor", "Keyboard"]),
         "Stock": random.randint(10, 100),
         "Price": round(random.uniform(20, 500), 2)}
        for _ in range(10)
    ]

def generate_generic_data():
    return [
        {"Field 1": random.randint(1, 100),
         "Field 2": random.uniform(1.0, 100.0),
         "Field 3": random.choice(["A", "B", "C"])}
        for _ in range(10)
    ]


@app.route("/XML")
def XML():
    return render_template('XML.html')

if __name__ == "__main__":
    app.run(debug=True, port=5000)