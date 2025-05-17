/***
 * BACKEND APIs
 * 
 * This file contains the API functions for managing user favorites.
 * 
 * These functions interact with the backend to perform CRUD operations on user favorites.
 * 
// add to favorites
curl -X 'POST' \
  'http://127.0.0.1:8000/api/favorites/' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJ2VyX3R5cGeGx3iyaausO6TA' \
  -H 'Content-Type: application/json' \
  -d '{
  "user_id": 1,
  "doll_id": 3
}'

response:
{
  "user_id": 1,
  "doll_id": 3,
  "id": 1,
  "created_at": "2025-05-17T21:35:47.190698"
}

// get all favorites
curl -X 'GET' \
  'http://127.0.0.1:8000/api/favorites/?skip=0&limit=10' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1Ni

// delete / remove favorite
curl -X 'DELETE' \
  'http://127.0.0.1:8000/api/favorites/3' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI'

// check if is favorite
curl -X 'GET' \
  'http://127.0.0.1:8000/api/favorites/check/3' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR'

	
Response body
{
  "message": "Favorite status for doll 3",
  "user_id": 1,
  "is_favorite": false
}


 */