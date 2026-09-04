def register_and_login(
    client,
    email="propertyuser@example.com",
):
    client.post(
        "/auth/register",
        json={
            "name": "Property User",
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


def test_create_property(client):
    headers = register_and_login(client)

    response = client.post(
        "/properties",
        headers=headers,
        json={
            "title": "Test Apartment",
            "location": "Tambaram",
            "city": "Chennai",
            "price": 2500000,
            "bedrooms": 2,
            "bathrooms": 2,
            "property_type": "flat",
            "area_sqft": 850,
            "description": "A clean test apartment created for automated testing.",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "Test Apartment"
    assert data["city"] == "Chennai"
    assert data["price"] == 2500000
    assert data["owner"]["name"] == "Property User"


def test_create_property_without_login(client):
    response = client.post(
        "/properties",
        json={
            "title": "Unauthorized Property",
            "location": "Tambaram",
            "city": "Chennai",
            "price": 2000000,
            "bedrooms": 2,
            "bathrooms": 2,
            "property_type": "flat",
            "area_sqft": 700,
            "description": "This property should not be created without authentication.",
        },
    )

    assert response.status_code == 401


def test_get_properties(client):
    headers = register_and_login(
        client,
        email="listuser@example.com",
    )

    client.post(
        "/properties",
        headers=headers,
        json={
            "title": "Chennai Flat",
            "location": "Velachery",
            "city": "Chennai",
            "price": 3000000,
            "bedrooms": 2,
            "bathrooms": 2,
            "property_type": "flat",
            "area_sqft": 900,
            "description": "A property created to test the property listing endpoint.",
        },
    )

    response = client.get("/properties")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 1


def test_invalid_property_price(client):
    headers = register_and_login(
        client,
        email="validationuser@example.com",
    )

    response = client.post(
        "/properties",
        headers=headers,
        json={
            "title": "Invalid Property",
            "location": "Tambaram",
            "city": "Chennai",
            "price": -1000,
            "bedrooms": 2,
            "bathrooms": 2,
            "property_type": "flat",
            "area_sqft": 700,
            "description": "This property should fail because the price is invalid.",
        },
    )

    assert response.status_code == 422
    
def test_user_cannot_update_another_users_property(client):
    owner_headers = register_and_login(
        client,
        email="owner@example.com",
    )

    create_response = client.post(
        "/properties",
        headers=owner_headers,
        json={
            "title": "Owner Property",
            "location": "Tambaram",
            "city": "Chennai",
            "price": 2500000,
            "bedrooms": 2,
            "bathrooms": 2,
            "property_type": "flat",
            "area_sqft": 800,
            "description": "A property used for testing ownership authorization.",
        },
    )

    property_id = create_response.json()["id"]

    other_user_headers = register_and_login(
        client,
        email="otheruser@example.com",
    )

    response = client.patch(
        f"/properties/{property_id}",
        headers=other_user_headers,
        json={
            "price": 9999999
        },
    )

    assert response.status_code == 403


def test_user_cannot_delete_another_users_property(client):
    owner_headers = register_and_login(
        client,
        email="deleteowner@example.com",
    )

    create_response = client.post(
        "/properties",
        headers=owner_headers,
        json={
            "title": "Protected Property",
            "location": "Velachery",
            "city": "Chennai",
            "price": 3500000,
            "bedrooms": 3,
            "bathrooms": 2,
            "property_type": "flat",
            "area_sqft": 1100,
            "description": "A property used for testing delete authorization.",
        },
    )

    property_id = create_response.json()["id"]

    other_user_headers = register_and_login(
        client,
        email="deleteother@example.com",
    )

    response = client.delete(
        f"/properties/{property_id}",
        headers=other_user_headers,
    )

    assert response.status_code == 403
    
def test_search_properties(client):
    headers = register_and_login(
        client,
        email="searchuser@example.com",
    )

    client.post(
        "/properties",
        headers=headers,
        json={
            "title": "Tambaram Apartment",
            "location": "Tambaram",
            "city": "Chennai",
            "price": 2300000,
            "bedrooms": 2,
            "bathrooms": 2,
            "property_type": "flat",
            "area_sqft": 700,
            "description": "A property created specifically for testing search.",
        },
    )

    response = client.get(
        "/properties?search=Tambaram"
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) >= 1
    assert any(
        property_data["location"] == "Tambaram"
        for property_data in data
    )


def test_price_filter(client):
    headers = register_and_login(
        client,
        email="pricefilter@example.com",
    )

    client.post(
        "/properties",
        headers=headers,
        json={
            "title": "Affordable Apartment",
            "location": "Velachery",
            "city": "Chennai",
            "price": 2000000,
            "bedrooms": 2,
            "bathrooms": 2,
            "property_type": "flat",
            "area_sqft": 750,
            "description": "An affordable property created for price filter testing.",
        },
    )

    response = client.get(
        "/properties?min_price=1500000&max_price=2500000"
    )

    assert response.status_code == 200

    for property_data in response.json():
        assert 1500000 <= property_data["price"] <= 2500000


def test_invalid_pagination(client):
    response = client.get(
        "/properties?page=0"
    )

    assert response.status_code == 422


def test_invalid_price_range(client):
    response = client.get(
        "/properties?min_price=5000000&max_price=1000000"
    )

    assert response.status_code == 400

    assert response.json() == {
        "detail": "min_price cannot be greater than max_price"
    }