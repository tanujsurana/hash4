def register_and_login(
    client,
    email="favoriteuser@example.com",
):
    client.post(
        "/auth/register",
        json={
            "name": "Favorite User",
            "email": email,
            "password": "TestPassword123",
        },
    )

    login_response = client.post(
        "/auth/login",
        data={
            "username": email,
            "password": "TestPassword123",
        },
    )

    token = login_response.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}"
    }


def create_property(client, headers):
    response = client.post(
        "/properties",
        headers=headers,
        json={
            "title": "Favorite Test Property",
            "location": "Tambaram",
            "city": "Chennai",
            "price": 2800000,
            "bedrooms": 2,
            "bathrooms": 2,
            "property_type": "flat",
            "area_sqft": 850,
            "description": "A property created for testing the favorites feature.",
        },
    )

    return response.json()["id"]


def test_add_favorite(client):
    headers = register_and_login(client)

    property_id = create_property(
        client,
        headers,
    )

    response = client.post(
        f"/favorites/{property_id}",
        headers=headers,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["property_id"] == property_id


def test_duplicate_favorite_is_blocked(client):
    headers = register_and_login(
        client,
        email="duplicatefavorite@example.com",
    )

    property_id = create_property(
        client,
        headers,
    )

    first_response = client.post(
        f"/favorites/{property_id}",
        headers=headers,
    )

    assert first_response.status_code == 201

    second_response = client.post(
        f"/favorites/{property_id}",
        headers=headers,
    )

    assert second_response.status_code == 400


def test_get_favorites(client):
    headers = register_and_login(
        client,
        email="getfavorites@example.com",
    )

    property_id = create_property(
        client,
        headers,
    )

    client.post(
        f"/favorites/{property_id}",
        headers=headers,
    )

    response = client.get(
        "/favorites",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["property_id"] == property_id


def test_remove_favorite(client):
    headers = register_and_login(
        client,
        email="removefavorite@example.com",
    )

    property_id = create_property(
        client,
        headers,
    )

    client.post(
        f"/favorites/{property_id}",
        headers=headers,
    )

    delete_response = client.delete(
        f"/favorites/{property_id}",
        headers=headers,
    )

    assert delete_response.status_code == 204

    get_response = client.get(
        "/favorites",
        headers=headers,
    )

    assert get_response.status_code == 200
    assert get_response.json() == []