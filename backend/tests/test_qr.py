def test_qr_generation(client):
    # Register and login Receiver
    client.post("/auth/register", json={"username": "qr_receiver", "email": "qr1@test.com", "password": "pw"})
    receiver_login = client.post("/auth/login", data={"username": "qr_receiver", "password": "pw"})
    receiver_token = receiver_login.json()["access_token"]
    
    # Generate keys for receiver
    client.post("/auth/keys/generate", headers={"Authorization": f"Bearer {receiver_token}"})
    
    # Register and login Sender to upload
    client.post("/auth/register", json={"username": "qr_sender", "email": "qr2@test.com", "password": "pw"})
    login_res = client.post("/auth/login", data={"username": "qr_sender", "password": "pw"})
    token = login_res.json()["access_token"]
    
    # Upload File to get a valid share_token
    file_content = b"QR Test"
    files = {'file': ('test.txt', file_content, 'text/plain')}
    data = {'recipient_username': 'qr_receiver', 'expiry_hours': 24}
    
    upload_res = client.post(
        "/files/upload",
        files=files,
        data=data,
        headers={"Authorization": f"Bearer {token}"}
    )
    share_token = upload_res.json()["share_token"]
    
    # Now get the QR code for the valid share_token
    response = client.get(f"/files/share/{share_token}/qr", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    
    # Check that the response content is indeed a PNG signature
    assert response.content.startswith(b"\x89PNG\r\n\x1a\n")
