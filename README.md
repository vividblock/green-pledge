# Green Pledge Platform

A web application empowering individuals and organizations to create, track, and share carbon reduction pledges. Users can detail the steps they'll take, set timelines, and generate shareable documents/certificates.

## Tech Stack

*   **Backend:** Python, Django, Django Rest Framework (DRF)
*   **Database:** PostgreSQL (Initially configured for SQLite for development)
*   **Frontend:** React (with TypeScript)
*   **Styling:** Tailwind + ShadcnUI
*   **Build Tool (Frontend):** Vite (or Create React App if you used that)
*   **API Communication:** Axios

## Project Structure

The project is organized into two main directories:

*   `backend/`: Contains the Django API project.
*   `frontend/`: Contains the React frontend application.

## Prerequisites

Before you begin, ensure you have the following installed:

*   Python (3.8+ recommended)
*   Node.js (LTS version recommended) & npm (or yarn)
*   Git
*   PostgreSQL Server (Optional for initial development, required for production/advanced features)

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone URL
    cd green-pledge-platform
    ```

2.  **Backend Setup:**
    ```bash
    cd backend

    # Create and activate a virtual environment
    python -m venv .venv
    # On Windows: .\venv\Scripts\activate
    # On macOS/Linux: source .venv/bin/activate

    # Install Python dependencies
    pip install -r requirements.txt

    # Create a .env file for environment variables (copy from a .env.example if provided)
    # Example .env contents:
    # SECRET_KEY='your-django-secret-key' # Generate a strong key!
    # DEBUG=True
    # DATABASE_URL='sqlite:///db.sqlite3' # Initial setup
    # # DATABASE_URL='postgres://user:password@host:port/dbname' # For PostgreSQL
    # CORS_ALLOWED_ORIGINS='http://localhost:5173,http://127.0.0.1:5173' # Adjust port if needed (Vite default: 5173, CRA default: 3000)

    # Apply database migrations
    python manage.py migrate

    # (Optional) Create a superuser for Django Admin
    # python manage.py createsuperuser
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend

    # Install Node dependencies
    npm install
    # or: yarn install

    # Create environment variable files (e.g., .env.development)
    # Example .env.development contents:
    # VITE_API_BASE_URL=http://127.0.0.1:8000/api # Use /api suffix if your Django API urls are namespaced
    # (If using Create React App, prefix with REACT_APP_ instead of VITE_)

    ```

## Running the Application

1.  **Start the Backend Server:**
    *   Make sure you are in the `backend/` directory with the virtual environment activated.
    *   Run:
        ```bash
        python manage.py runserver
        ```
    *   The Django API will typically run on `http://127.0.0.1:8000/`.

2.  **Start the Frontend Development Server:**
    *   Open a *new terminal* and navigate to the `frontend/` directory.
    *   Run:
        ```bash
        npm run dev
        # or: yarn dev
        # (If using Create React App: npm start or yarn start)
        ```
    *   The React app will typically run on `http://localhost:5173/` (Vite) or `http://localhost:3000/` (CRA). Open this URL in your browser.

## Environment Variables

*   **Backend (`backend/.env`):** Contains sensitive keys, database URLs, and CORS settings. **Never commit this file to Git.**
*   **Frontend (`frontend/.env*`):** Contains configuration like the API base URL. See Vite/CRA documentation for loading rules. **Do not commit sensitive keys here either.** Consider creating `.env.example` files to show required variables.

## Database

*   The project is configured to use SQLite (`db.sqlite3`) by default for easy development setup. This file is included in `.gitignore`.
*   To switch to PostgreSQL:
    1.  Install the necessary driver: `pip install psycopg2-binary` (or `psycopg2` if compiling).
    2.  Update the `DATABASE_URL` in your `backend/.env` file to your PostgreSQL connection string.
    3.  Ensure your PostgreSQL server is running and the database exists.
    4.  Run `python manage.py migrate` again.

## API Endpoints (Example)

The following are examples of API endpoints provided by the backend:

*   `/api/auth/register/`: User registration
*   `/api/auth/login/`: User login (token authentication)
*   `/api/auth/user/`: Get current user details
*   `/api/pledges/`: List user's pledges (GET), Create a new pledge (POST)
*   `/api/pledges/<id>/`: Retrieve (GET), Update (PUT/PATCH), Delete (DELETE) a specific pledge
*   `/api/pledges/<id>/document/`: Generate pledge document PDF (GET)
*   `/api/pledges/<id>/certificate/`: Generate pledge certificate PDF (GET)
*   `/api/public/pledges/<id>/`: View a public pledge (GET)


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
