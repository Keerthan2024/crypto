# API Specification

Because SecureShare is built with FastAPI, it automatically generates a fully interactive OpenAPI (Swagger) specification.

## Viewing the Live Documentation
1. Run the application via `docker-compose up` or `npm run dev` / `uvicorn`.
2. Open your browser and navigate to: **http://localhost:8000/docs**
*(Or `http://localhost/docs` if accessing through the Nginx proxy depending on routing config).*

From there, you can interactively test every endpoint, view request/response schemas, and see exactly which routes require Bearer token authentication.

## Core Endpoint Overview

### Authentication (`/auth`)
*   `POST /auth/register`: Creates a new user.
*   `POST /auth/login`: Accepts OAuth2 form data and returns a JWT access token.
*   `GET /auth/me`: Returns the currently authenticated user's profile.
*   `POST /auth/keys/generate`: Generates an RSA keypair for the user, storing the public key in the database and returning the private key to the client.

### Files (`/files`)
*   `POST /files/upload`: (Requires JWT) Uploads a file. The backend encrypts it with AES, encrypts the AES key with the recipient's RSA public key, and returns a share token.
*   `GET /files/share/{token}/status`: Returns public status (valid, used, expired) of a link without exposing data.
*   `GET /files/share/{token}/qr`: Generates a base64 encoded PNG of a QR code containing the share URL.
*   `POST /files/share/{token}/download`: (Requires JWT) Accepts the user's private key, decrypts the AES key, decrypts the file, marks the token as used, and streams the file back.
*   `DELETE /files/{file_id}`: Allows a sender to permanently revoke and delete a file from the server.

### Dashboard (`/users`)
*   `GET /users/me/files/sent`: Returns a paginated list of all files the current user has uploaded.
*   `GET /users/me/files/received`: Returns a paginated list of all files sent to the current user.
