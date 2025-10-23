# The froglib project

This project is a web-based information system for publishing and viewing articles about animals. It allows users to create, view, search, and manage animal articles with easy text formatting.

## Features

- **View Articles**: Browse and read all published articles about animals
- **Easy Text Formatting**: Format article text using prepared CSS styles without coding knowledge
- **Search Functionality**: Search articles by name
- **Image Support**: Upload and display PNG and JPG images with articles

## Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/nexxy06/misis_react_app.git
    cd misis-react-app
    ```

2. **Install dependencies**:
    ```sh
    pip install -r requirements.txt
    ```

3. **Frontend Setup:**
    ```sh
    cd client
    npm install
    cd ..
    ```

4. **Db Configuration:**  
    In ./server/db_main.py change the configuration for yourself
    ```
    app.config["DATABASE_CONFIG"] = {
        "host": "localhost",
        "database": "frogs_db",
        "user": "postgres",
        "password": "12345678",
        "port": 5432,
    }
    ```


## Usage

1. **Run the application**:
    ```sh
    python3 ./server/db_main.py
    ```

2. **In a new terminal, start the React frontend:**
    ```sh
    cd client
    npm start
    ```

3. **Access the application:**  
    Open your web browser and go to `http://localhost:3000`.

> This will run the app in debug mode.

## License

This project is licensed under the MIT License.