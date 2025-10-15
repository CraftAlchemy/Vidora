# BuzzCast API Documentation

This document provides a basic overview of the BuzzCast REST API endpoints.

**Base URL**: `/api/v1`

---

## Authentication (`/auth`)

### `POST /auth/register`
- **Description**: Registers a new user.
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "username": "newuser",
    "password": "securepassword123"
  }
  ```
- **Response**:
  - `201 Created`: Returns a JWT token and a user object.
  - `400 Bad Request`: If fields are missing or invalid.

### `POST /auth/login`
- **Description**: Authenticates an existing user.
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**:
  - `200 OK`: Returns a JWT token and a user object.
  - `400 Bad Request`: If fields are missing.
  - `401 Unauthorized`: If credentials are invalid.

### `POST /auth/google-login`
- **Description**: Authenticates a user via a Google Sign-In ID token.
- **Access**: Public
- **Body**:
  ```json
  {
    "credential": "GOOGLE_ID_TOKEN_JWT"
  }
  ```
- **Response**:
  - `200 OK`: If an existing user is found or a new user is created, returns a JWT token and a user object.
  - `400 Bad Request`: If credential is missing or invalid.
  - `500 Server Error`: If server is misconfigured (e.g., missing client ID).

---

## Users (`/users`)

### `GET /users/me`
- **Description**: Retrieves the profile of the currently authenticated user.
- **Access**: Private (Requires Authentication Token)
- **Response**:
  - `200 OK`: Returns the user object.

### `PUT /users/me`
- **Description**: Updates the profile of the currently authenticated user.
- **Access**: Private
- **Body**:
  ```json
  {
    "username": "updated_username",
    "bio": "An updated bio."
  }
  ```
- **Response**:
  - `200 OK`: Returns the updated user object.

### `GET /users/:username`
- **Description**: Retrieves the public profile of a user by their username.
- **Access**: Public
- **Response**:
  - `200 OK`: Returns the public user profile.
  - `404 Not Found`: If the user does not exist.

---

## Videos (`/videos`)

### `POST /videos/upload`
- **Description**: Uploads a new video.
- **Access**: Private
- **Body**: `multipart/form-data` with fields:
  - `video`: The video file.
  - `description`: A text description for the video.
- **Response**:
  - `201 Created`: Returns the newly created video object.

### `POST /videos/:videoId/comments`
- **Description**: Adds a comment to a specific video.
- **Access**: Private
- **Body**:
  ```json
  {
    "text": "This is a great video!",
    "userId": "u1" 
  }
  ```
- **Response**:
  - `201 Created`: Returns the newly created comment object.

### `PUT /videos/:videoId`
- **Description**: Updates the details of a specific video (e.g., description).
- **Access**: Private (Requires Authentication Token, user must be the video owner)
- **Body**:
  ```json
  {
    "description": "An updated description for the video."
  }
  ```
- **Response**:
  - `200 OK`: Returns the updated video object.
  - `400 Bad Request`: If description is missing.
  - `403 Forbidden`: If the user is not the owner of the video.
  - `404 Not Found`: If the video does not exist.
