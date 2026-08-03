def test_register_user(client):
    response = client.post("/auth/register", json={
        "username": "testuser",
        "email": "test@test.com",
        "password": "testpassword"
    })
    assert response.status_code == 201
    assert response.json()["username"] == "testuser"

def test_duplicate_registration(client):
    client.post("/auth/register", json={
        "username": "testuser2",
        "email": "test2@test.com",
        "password": "testpassword"
    })
    
    response2 = client.post("/auth/register", json={
        "username": "testuser2",
        "email": "test2@test.com",
        "password": "newpassword"
    })
    assert response2.status_code == 400

def test_login_success(client):
    client.post("/auth/register", json={
        "username": "testuser3",
        "email": "test3@test.com",
        "password": "testpassword"
    })
    
    response = client.post("/auth/login", data={
        "username": "testuser3",
        "password": "testpassword"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_failure(client):
    response = client.post("/auth/login", data={
        "username": "unknownuser",
        "password": "badpassword"
    })
    assert response.status_code == 401

def test_protected_route(client):
    # Without token
    response = client.get("/auth/me")
    assert response.status_code == 401
    
    # With token
    client.post("/auth/register", json={"username": "testuser4", "email": "test4@test.com", "password": "pw"})
    login_res = client.post("/auth/login", data={"username": "testuser4", "password": "pw"})
    token = login_res.json()["access_token"]
    
    me_res = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["username"] == "testuser4"
