def test_file_upload_and_download(client):
    # 1. Register Receiver and login
    client.post("/auth/register", json={"username": "receiver", "email": "r@r.com", "password": "pw"})
    login_res2 = client.post("/auth/login", data={"username": "receiver", "password": "pw"})
    receiver_token = login_res2.json()["access_token"]
    
    # 2. Receiver generates keys
    keys_res = client.post("/auth/keys/generate", headers={"Authorization": f"Bearer {receiver_token}"})
    priv_pem = keys_res.json()["private_key"]
    
    # 3. Register Sender and login
    client.post("/auth/register", json={"username": "sender", "email": "s@s.com", "password": "pw"})
    login_res = client.post("/auth/login", data={"username": "sender", "password": "pw"})
    sender_token = login_res.json()["access_token"]
    
    # 4. Upload File from Sender to Receiver
    file_content = b"This is a secret file."
    files = {'file': ('secret.txt', file_content, 'text/plain')}
    data = {'recipient_username': 'receiver', 'expiry_hours': 24}
    
    upload_res = client.post(
        "/files/upload",
        files=files,
        data=data,
        headers={"Authorization": f"Bearer {sender_token}"}
    )
    assert upload_res.status_code == 200
    share_token = upload_res.json()["share_token"]
    
    # 5. Check Status (Public)
    status_res = client.get(f"/files/share/{share_token}/status")
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "valid"
    
    # 6. Receiver Downloads (Decryption)
    download_res = client.post(
        f"/files/share/{share_token}/download",
        json={"private_key": priv_pem},
        headers={"Authorization": f"Bearer {receiver_token}"}
    )
    assert download_res.status_code == 200
    assert download_res.content == file_content
    
    # 7. Check one-time use
    status_res2 = client.get(f"/files/share/{share_token}/status")
    assert status_res2.json()["status"] == "used"
    
    # 8. Try to download again (should fail)
    download_res2 = client.post(
        f"/files/share/{share_token}/download",
        json={"private_key": priv_pem},
        headers={"Authorization": f"Bearer {receiver_token}"}
    )
    assert download_res2.status_code == 400
    assert "already been used" in download_res2.json()["detail"]
