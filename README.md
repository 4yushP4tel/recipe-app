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
