def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "TestPassword123",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "Test User"
    assert data["email"] == "test@example.com"
    assert "password" not in data
    assert "hashed_password" not in data


def test_register_duplicate_email(client):
    user_data = {
        "name": "Test User",
        "email": "duplicate@example.com",
        "password": "TestPassword123",
    }

    first_response = client.post(
        "/auth/register",
        json=user_data,
    )

    assert first_response.status_code == 201

    second_response = client.post(
        "/auth/register",
        json=user_data,
    )

    assert second_response.status_code == 409

    assert second_response.json() == {
        "detail": "Email already registered"
    }


def test_login_user(client):
    client.post(
        "/auth/register",
        json={
            "name": "Login User",
            "email": "login@example.com",
            "password": "TestPassword123",
        },
    )

    response = client.post(
        "/auth/login",
        data={
            "username": "login@example.com",
            "password": "TestPassword123",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_password(client):
    client.post(
        "/auth/register",
        json={
            "name": "Login User",
            "email": "wrongpassword@example.com",
            "password": "TestPassword123",
        },
    )

    response = client.post(
        "/auth/login",
        data={
            "username": "wrongpassword@example.com",
            "password": "WrongPassword123",
        },
    )

    assert response.status_code == 401

    assert response.json() == {
        "detail": "Invalid email or password"
    }
    
def test_get_current_user(client):
    client.post(
        "/auth/register",
        json={
            "name": "Current User",
            "email": "current@example.com",
            "password": "TestPassword123",
        },
    )

    login_response = client.post(
        "/auth/login",
        data={
            "username": "current@example.com",
            "password": "TestPassword123",
        },
    )

    token = login_response.json()["access_token"]

    response = client.get(
        "/auth/me",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Current User"
    assert data["email"] == "current@example.com"
    assert data["is_active"] is True


def test_get_current_user_without_token(client):
    response = client.get("/auth/me")

    assert response.status_code == 401