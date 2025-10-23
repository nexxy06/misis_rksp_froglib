from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from pathlib import Path

app = Flask(__name__)
CORS(app)

app.config["UPLOAD_FOLDER"] = "uploads"
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB

# Конфигурация PostgreSQL
app.config["DATABASE_CONFIG"] = {
    "host": "localhost",
    "database": "frogs_db",
    "user": "postgres",
    "password": "12345678",
    "port": 5432,
}

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


def get_db_connection():
    """Создает соединение с базой данных"""
    try:
        conn = psycopg2.connect(
            host=app.config["DATABASE_CONFIG"]["host"],
            database=app.config["DATABASE_CONFIG"]["database"],
            user=app.config["DATABASE_CONFIG"]["user"],
            password=app.config["DATABASE_CONFIG"]["password"],
            port=app.config["DATABASE_CONFIG"]["port"],
        )
        return conn
    except Exception as e:
        print(f"Ошибка подключения к БД: {e}")
        raise


def create_database_if_not_exists():
    """Создает базу данных если она не существует"""
    try:
        conn = psycopg2.connect(
            host=app.config["DATABASE_CONFIG"]["host"],
            database="postgres",  # подключаемся к стандартной БД
            user=app.config["DATABASE_CONFIG"]["user"],
            password=app.config["DATABASE_CONFIG"]["password"],
            port=app.config["DATABASE_CONFIG"]["port"],
        )
        conn.autocommit = True
        cur = conn.cursor()

        cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'frogs_db'")
        exists = cur.fetchone()

        if not exists:
            cur.execute("CREATE DATABASE frogs_db")
            print("База данных frogs_db создана")
        else:
            print("База данных frogs_db уже существует")

        cur.close()
        conn.close()

    except Exception as e:
        print(f"Ошибка при создании базы данных: {e}")


def init_database():
    """Инициализирует базу данных и создает таблицу если она не существует"""
    try:
        create_database_if_not_exists()

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS frogs (
                id SERIAL PRIMARY KEY,
                image VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                habitat VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """
        )

        cur.execute("SELECT COUNT(*) FROM frogs")
        count = cur.fetchone()[0]

        # Если таблица пустая, добавляем начальные данные
        if count == 0:
            initial_data = [
                (
                    "/static/images/1image.jpg",
                    "Озерная лягушка",
                    "<h1>Озерная лягушка (Rana ridibunda)</h1><b>Знакомьтесь: озерная лягушка </b> - самый крупный вид бесхвостых земноводных отечественной фауны. <p>Озерные лягушки вырастают в длину до <b>15-17 сантиметров</b>, а вес их может достигать 200 граммов. Продолжительность жизни от 6 до 8 лет. Лягушки по праву считаются одними из самых удивительных земноводных, обитающих на планете. В Древнем Египте их мумифицировали вместе с умершими членами царствующей семьи и жрецами, т.к. они считались символом воскрешения. В Японии лягушки – символ удачи, а в Китае - богатства. Интересно, что видовое латинское название Rana ridibunda в переводе на русский язык означает «хохотунья». Для озерной лягушки характерно классическое кваканье или громкое урчание \"уоррр ...\" или \"кроуу ...\". В период размножения самцы очень подвижны и громкоголосы. Кожа земноводных лягушек обладает бактерицидными свойствами, наши предки бросали их в молоко, чтобы оно дольше не скисало: лягушки выполняли функцию своеобразного живого холодильника. <b>Профессор Н.П. Синицын</b> впервые в мире провел успешную операцию по пересадке сердца холоднокровным в эксперименте. Экспонат озерной лягушки в учебно-историческом центре появился благодаря участию зав. кафедрами биологии и нормальной анатомии ПИМУ.</p>",
                    "Австралия",
                ),
                (
                    "/static/images/2image.jpg",
                    "Лягушка 2",
                    "Краткое описание лягушки 2. Ядовитый вид.",
                    "Индонезия",
                ),
            ]

            cur.executemany(
                """
                INSERT INTO frogs (image, title, description, habitat)
                VALUES (%s, %s, %s, %s)
            """,
                initial_data,
            )
            print("Начальные данные добавлены")

        conn.commit()
        print("База данных инициализирована успешно")

    except Exception as e:
        print(f"Ошибка инициализации БД: {e}")
        if "conn" in locals():
            conn.rollback()
    finally:
        if "cur" in locals():
            cur.close()
        if "conn" in locals():
            conn.close()


def load_frogs_data():
    """Загружает данные из базы данных"""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("SELECT * FROM frogs ORDER BY id")
    frogs = cur.fetchall()

    frogs_list = []
    for frog in frogs:
        frogs_list.append(dict(frog))

    cur.close()
    conn.close()

    return frogs_list


def save_frog_data(image_path, title, description, habitat):
    """Сохраняет данные о новой статье в базу данных"""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cur.execute(
            """
            INSERT INTO frogs (image, title, description, habitat)
            VALUES (%s, %s, %s, %s)
            RETURNING *
        """,
            (image_path, title, description, habitat),
        )

        new_frog = cur.fetchone()
        conn.commit()

        return dict(new_frog) if new_frog else None
    except Exception as e:
        conn.rollback()
        print(f"Ошибка при сохранении: {e}")
        return None
    finally:
        cur.close()
        conn.close()


def get_next_image_number():
    """Получает следующий номер для изображения"""
    upload_path = Path(app.config["UPLOAD_FOLDER"])
    existing_files = list(upload_path.glob("*image.*"))

    if not existing_files:
        return 1

    numbers = []
    for file in existing_files:
        try:
            num = int(file.name.split("image")[0])
            numbers.append(num)
        except ValueError:
            continue

    return max(numbers) + 1 if numbers else 1


@app.route("/api/upload", methods=["POST", "OPTIONS"])
def upload_file():
    if request.method == "OPTIONS":
        return jsonify({"success": "Загружено"}), 200

    if "photo" not in request.files:
        return jsonify({"error": "Фото не загружено"}), 400

    file = request.files["photo"]
    if file.filename == "":
        return jsonify({"error": "Файл не выбран"}), 400

    next_num = get_next_image_number()
    file_ext = os.path.splitext(file.filename)[1]
    filename = f"{next_num}image{file_ext}"
    image_path = f"/static/images/{filename}"

    new_frog = save_frog_data(
        image_path=image_path,
        title=request.form.get("name", f"Лягушка {next_num}"),
        description=request.form.get("description", "Описание отсутствует"),
        habitat=request.form.get("habitat", "Место обитания не указано"),
    )

    if new_frog:
        file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
        return jsonify({"message": "Файл загружен!", "data": new_frog}), 200
    else:
        return jsonify({"error": "Ошибка при сохранении данных"}), 500


@app.route("/api/frogs", methods=["GET"])
def get_frogs():
    return jsonify(load_frogs_data())


@app.route("/api/frogs/<int:frog_id>", methods=["GET"])
def get_frog(frog_id):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("SELECT * FROM frogs WHERE id = %s", (frog_id,))
    frog = cur.fetchone()

    cur.close()
    conn.close()

    if frog:
        return jsonify(dict(frog))
    return jsonify({"error": "Лягушка не найдена"}), 404


@app.route("/static/images/<filename>")
def serve_image(filename):
    print("", filename)
    return send_from_directory("../uploads/", filename)


if __name__ == "__main__":
    init_database()
    app.run(debug=True, port=5000)
