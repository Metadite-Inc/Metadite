/*

backend apis

curl -X 'POST' \
  'http://127.0.0.1:8000/api/cart/' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGc2zB1DWsH1Rs' \
  -H 'Content-Type: application/json' \
  -d '{
  "user_id": 0,
  "doll_id": 0,
  "quantity": 1
}'

curl -X 'GET' \
  'http://127.0.0.1:8000/api/cart/?skip=0&limit=10' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzDWsH1Rs'

curl -X 'PUT' \
  'http://127.0.0.1:8000/api/cart/1' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzIyrKRea2zB1DWsH1Rs' \
  -H 'Content-Type: application/json' \
  -d '{
  "quantity": 3
}'

curl -X 'DELETE' \
  'http://127.0.0.1:8000/api/cart/1' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOi1DWsH1Rs'

//clear everything in cart

curl -X 'DELETE' \
  'http://127.0.0.1:8000/api/cart/' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOi2zB1DWsH1Rs'

*/
