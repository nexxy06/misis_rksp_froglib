from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from pathlib import Path

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['DATA_FILE'] = 'frogs_data.json'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


def load_frogs_data():
    """Загружает данные о лягушках из JSON-файла"""
    try:
        with open(app.config['DATA_FILE'], 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        # Возвращает начальные данные, если файла нет или он поврежден
        return [
            {
                "id": 1,
                "image": "/static/images/1image.jpg",
                "title": "Лягушка 1",
                "description": "<h1>Краткое описание лягушки 1.</h1> Обитает в тропических лесах.",
                "habitat": "Австралия"
            },
            {
                "id": 2,
                "image": "/static/images/2image.jpg",
                "title": "Лягушка 2",
                "description": "Краткое описание лягушки 2. Ядовитый вид.",
                "habitat": "Индонезия"
            },
        ]


def save_frogs_data(data):
    """Сохраняет данные в JSON-файл"""
    with open(app.config['DATA_FILE'], 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def get_next_image_number():
    """Получает следующий номер для изображения"""
    upload_path = Path(app.config['UPLOAD_FOLDER'])
    existing_files = list(upload_path.glob('*image.*'))

    if not existing_files:
        return 1

    numbers = []
    for file in existing_files:
        try:
            num = int(file.name.split('image')[0])
            numbers.append(num)
        except ValueError:
            continue

    return max(numbers) + 1 if numbers else 1


@app.route('/api/upload', methods=['POST', 'OPTIONS'])
def upload_file():
    if request.method == 'OPTIONS':
        return jsonify({"success": "Загружено"}), 200

    if 'photo' not in request.files:
        return jsonify({"error": "Фото не загружено"}), 400

    file = request.files['photo']
    if file.filename == '':
        return jsonify({"error": "Файл не выбран"}), 400

    # Загружаем текущие данные
    frogs_data = load_frogs_data()

    next_num = get_next_image_number()
    file_ext = os.path.splitext(file.filename)[1]
    filename = f"{next_num}image{file_ext}"
    image_path = f"/static/images/{filename}"

    # Добавляем запись
    new_frog = {
        "id": len(frogs_data) + 1,
        "image": image_path,
        "title": request.form.get('name', f"Лягушка {len(frogs_data) + 1}"),
        "description": request.form.get('description', 'Описание отсутствует'),
        "habitat": request.form.get('habitat', 'Место обитания не указано')
    }
    frogs_data.append(new_frog)
    save_frogs_data(frogs_data)

    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    return jsonify({
        "message": "Файл загружен!",
        "data": new_frog
    }), 200


@app.route('/api/frogs', methods=['GET'])
def get_frogs():
    return jsonify(load_frogs_data())


@app.route('/api/frogs/<int:frog_id>', methods=['GET'])
def get_frog(frog_id):
    frogs_data = load_frogs_data()
    frog = next((f for f in frogs_data if f['id'] == frog_id), None)
    if frog:
        return jsonify(frog)
    return jsonify({"error": "Лягушка не найдена"}), 404


@app.route('/static/images/<filename>')
def serve_image(filename):
    print("", filename)
    return send_from_directory('../uploads/', filename)


if __name__ == '__main__':
    # Инициализация файла с данными при первом запуске
    if not os.path.exists(app.config['DATA_FILE']):
        save_frogs_data(load_frogs_data())
    app.run(debug=True, port=5000)