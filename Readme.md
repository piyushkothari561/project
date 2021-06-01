

run "npm install" in the same folder as app.js


run "npm run dev"

All are post requests for Postman

Rest api routes
1. http://localhost:3000/routes/register

{
  "email": "user2@gmail.com",
  "password": "123456",
  "passwordConfirm": "123456"
}


2. http://localhost:3000/routes/login

{
  "email": "user2@gmail.com",
  "password": "123456",
}

3. http://localhost:3000/routes/refreshToken

{
    "refreshToken" : "[THE refresh token accessed after registering or logging in]"
}


4. http://localhost:3000/routes/getCountry

After inserting the refresh token in Authorization as "Bearer [TOKEN]"

{
  "countryName": "Greece"
}


5. http://localhost:3000/routes/getAllCountryDetail


After inserting the refresh token in Authorization as "Bearer [TOKEN]"

send.
