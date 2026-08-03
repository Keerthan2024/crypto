# SecureShare

SecureShare is an end-to-end encrypted file sharing platform engineered with a hybrid cryptography system (AES-256 + RSA-2048) and QR-code enabled access. It is designed to provide secure, one-time-use file transfers with guaranteed data integrity and tamper detection.

## Core Features
*   **Hybrid Cryptography**: Files are encrypted symmetrically with AES-256 (GCM mode) for speed, while the AES keys are securely transmitted using RSA-2048 asymmetric encryption.
*   **One-Time Use Links**: Share tokens are automatically invalidated immediately upon a successful download, preventing replay attacks.
*   **QR Code Sharing**: Easily scan and access encrypted payloads via mobile devices.
*   **Data Integrity**: SHA-256 hashing is used to detect any tampering or corruption of the payload.
*   **Containerized**: Fully Dockerized with an Nginx reverse proxy for seamless, zero-configuration deployment.

## Technology Stack
*   **Frontend**: React, Vite, Tailwind CSS, Axios.
*   **Backend**: Python, FastAPI, SQLAlchemy, Pytest.
*   **Cryptography**: `cryptography` (Hazmat primitives), `python-jose` (JWT).
*   **Database**: SQLite (mounted via Docker volume for persistence).
*   **Infrastructure**: Docker, Docker Compose, Nginx.

## Quickstart Guide

The easiest way to run the project is using Docker. This ensures you do not need to manually install Python, Node.js, or configure proxy settings.

### Prerequisites
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Setup & Run
1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd secureshare
    ```

2.  **Environment Variables (Optional but recommended):**
    By default, the backend falls back to standard configurations, but you can create a `.env` file in the `backend/` directory:
    ```env
    PROJECT_NAME="SecureShare API"
    SECRET_KEY="your_super_secret_jwt_key_here"
    DATABASE_URL="sqlite:///./secureshare.db"
    ```

3.  **Boot the containers:**
    ```bash
    docker compose up --build
    ```
    *Note: On older Docker installations, use `docker-compose up --build`.*

4.  **Access the application:**
    Open your browser and navigate to: [http://localhost](http://localhost) (No port needed, Nginx handles it!).

## Documentation
For a deep dive into the system design, security models, and API usage, please see the `docs/` folder:
*   [Architecture Diagram & System Design](docs/architecture.md)
*   [Security Analysis & Threat Model](docs/security-analysis.md)
*   [API Specification](docs/api-spec.md)
*   [User Manual](docs/user-manual.md)
