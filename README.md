# recipe_app
This app helps you discover new recipes according to what is at your disposal.
Also allows you to track your pantry/fridge and allows you to chat with an expert
AI chef at all times

Fixed the login issue by making session_cookie_secure = True

Tested APIs using Postman and ensured proper data storage and transfer using 
pgAdmin4

I am using the openAI API for the chefai feature

For the recipe search, I will be using the free tier of the spoonacular api. 
With this API, I could potentially also add new featues to this app in the future
like a nutrition feature. With the use of this API, I ran into a CORS error, which
I fixed by using a proxy for the url that I will be accessing (spoonacular api) in 
the vite.config.js file. You can find YouTube videos directly from the app now.

Added Oauth to allow users to sign in with their Google account.

Hosted the frontend using Vercel.

Hosted the backend and database using Render.

## Issues during deployment and how they were fixed:
- Was not able to properly build and run the backend: Had to us gunicorn instead of flask run.
- Spoonacular API ran into some CORS issues: Had to move requests to the backend,
- Google Oauth was not working once deployed: Had to allow the deployed URL to work with my clientID.
