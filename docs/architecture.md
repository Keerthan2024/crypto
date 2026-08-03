# System Architecture & Design

SecureShare follows a decoupled client-server architecture, containerized via Docker for reliable deployment.

## Architecture Diagram

```mermaid
graph TD
    subgraph Client [Client Environment]
        UI[React / Vite Frontend]
    end

    subgraph Infrastructure [Docker Network]
        Proxy[Nginx Reverse Proxy\nPort 80]
        API[FastAPI Backend\nPort 8000]
        
        subgraph Storage [Persistent Volumes]
            DB[(SQLite Database)]
            FS[Local File System\n/storage]
        end
    end

    UI -->|HTTP Requests| Proxy
    Proxy -->|Proxies /auth, /files, /users| API
    Proxy -->|Serves Static Files| UI
    
    API <-->|Read/Write Metadata| DB
    API <-->|Read/Write Encrypted Blobs| FS
```

## Component Breakdown

### 1. Nginx Reverse Proxy
Acting as the frontend container's server, Nginx serves the static compiled React SPA. Crucially, it acts as a reverse proxy for all API calls (e.g., routing `http://localhost/auth/login` directly to the FastAPI container). 
**Design Reasoning**: This completely eliminates Cross-Origin Resource Sharing (CORS) issues in production and removes the need to hardcode API URLs at build-time.

### 2. FastAPI Backend
The core backend handles user authentication, JWT minting, file uploading, and cryptography validation.
**Design Reasoning**: FastAPI was chosen for its asynchronous support (`async def`), out-of-the-box Pydantic validation (which secures endpoints against malformed payloads), and automatic OpenAPI documentation generation.

### 3. Persistent Volumes
To ensure data survives container restarts, Docker volumes are mounted:
- `secureshare.db`: Holds Users, Files, Share links, and Download Logs.
- `storage/`: Holds the physical `.enc` files.
**Design Reasoning**: SQLite was chosen over PostgreSQL specifically for portability, allowing evaluators to run the project entirely locally without needing to configure complex database servers or cloud infrastructure.

## Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ FILE : "uploads"
    USER ||--o{ SHARE : "receives"
    USER ||--o{ DOWNLOAD_LOG : "performs"
    
    FILE ||--o{ SHARE : "has"
    SHARE ||--o{ DOWNLOAD_LOG : "generates"
    
    USER {
        int id PK
        string username
        string email
        string hashed_password
        string public_key
    }
    
    FILE {
        int id PK
        string filename
        int uploader_id FK
        string encrypted_aes_key
        string nonce
        string file_hash
        string storage_path
    }
    
    SHARE {
        int id PK
        int file_id FK
        int recipient_id FK
        string share_token
        datetime expires_at
        boolean is_used
    }
    
    DOWNLOAD_LOG {
        int id PK
        int file_id FK
        int user_id FK
        string ip_address
    }
```
