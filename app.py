from flask import Flask, redirect, url_for, render_template, request

app = Flask(__name__)
# app.register_blueprint(views, url_prefix='/')

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/JSON")
def JSON():
    return render_template('JSON.html')

@app.route("/CSV")
def CSV():
    return render_template('csv.html')

@app.route("/XML")
def XML():
    return render_template('XML.html')

if __name__ == "__main__":
    app.run(debug=True, port=5000)