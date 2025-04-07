from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route("/")
def index():
    return render_template('about.html')

@app.route("/images")
def images():
    return render_template('images.html')

@app.route("/registration")
def regist():
    return render_template('regist.html')

@app.route('/save_data', methods=['POST'])
def save_time():
    data = request.get_json()
    return jsonify(message="Информация сохраненна!")

@app.route("/table")
def table():
    return render_template('table.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)