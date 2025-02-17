import os
from openai import OpenAI
from dotenv import load_dotenv
from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from flask_session import Session
from datetime import datetime, timedelta
from google.oauth2 import id_token
from google.auth.transport import requests


KEY = os.getenv("SECRET_KEY")

app = Flask(__name__)
CORS(app, origins=["https://whats4dinner.vercel.app"], supports_credentials=True)
load_dotenv()

app.config['SESSION_TYPE'] = 'filesystem' 
app.config['SESSION_FILE_DIR'] = '/tmp/flask_session'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_Name'] = 'session'
app.config['SESSION_COOKIE_SECURE'] = True
app.permanent_session_lifetime = timedelta(days=1)
app.secret_key = KEY
Session(app)

#connect DB
db_host = os.getenv('dbhost')
db_user = os.getenv('dbuser')
db_password = os.getenv('dbpassword')
db_name = os.getenv('dbname')
db_table_name1 = os.getenv('db_table_name1')
db_table_name2 = os.getenv('db_table_name2')
db_table_name3 = os.getenv("db_table_name3")
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{db_user}:{db_password}@{db_host}/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)


#user Routes

class User(db.Model):
    __tablename__ = db_table_name1
    user_id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(50), unique = True, nullable = False)
    email = db.Column(db.String(250), unique = True, nullable = False)
    password_hash = db.Column(db.String(150))
    created_at = db.Column(db.DateTime, default = datetime.now)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
@app.route('/check_auth', methods=['GET'])
@cross_origin(origins=["https://whats4dinner.vercel.app"], supports_credentials=True)
def check_auth():
    print(f"Session in Check:{dict(session)}")
    if 'user_id' in session:
        user = User.query.filter_by(user_id=session['user_id']).first()
        print(session['user_id'])
        session['auth_status'] = True
        if user:
            print(f"User in Check: {user}")
            return jsonify({'auth_status': True,
                            'user_id': session['user_id'],
                            'user_name': session['user_name']
                            }), 200
    print("Current status: Logged out")
    return jsonify({'auth_status' : False, 'error': 'Session not found'}), 200

@app.route('/create_user', methods=['POST'])
@cross_origin(origins=["https://whats4dinner.vercel.app"], supports_credentials=True)
def create_user():
    data = request.get_json()
    user_name = data.get('user_name')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    # print(f"password: {password}, confirm_password: {confirm_password}")
    if password != confirm_password:
        print("error passwords do not match")
        return jsonify({"error": "Passwords do not match"}), 400
    
    existing_user = User.query.filter(
        (User.email == email) | (User.user_name == user_name)).first()

    if existing_user:
        print("duplicate users found")
        return jsonify({"error": "User with this email or username already exists"}), 409

    new_user = User(user_name=user_name, email=email, created_at = datetime.now())
    new_user.set_password(password)

    try:
        db.session.add(new_user)
        db.session.commit()

        session['auth_status'] = True
        session['user_id'] = new_user.user_id
        session['user_name'] = new_user.user_name
        print('user created')
        print(session)

        return jsonify({"message": "User created successfully",
                        "user_id": session['user_id'],
                        "user_name": session['user_name'],
                        "auth_status": session['auth_status']
                        }), 201
    except Exception as e:
        db.session.rollback()
        print('unexpected error when creating user')
        return jsonify({"error": str(e)}), 500


@app.route('/login', methods=['POST'])
@cross_origin(origins=["https://whats4dinner.vercel.app"], supports_credentials=True)
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        #setting a session
        session['auth_status'] = True
        session['user_id'] = user.user_id
        session['user_name'] = user.user_name
        session['email'] = user.email
        print(f"session data: {session}")
        return jsonify({"message": "Logged in successfully",
                        "user_id": session['user_id'],
                        "user_name": session['user_name'],
                        "auth_status": session['auth_status']
                        }), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401
    
    

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200


#pantry routes:

class Ingredient(db.Model):
    __tablename__ = db_table_name2
    id = db.Column(db.Integer, primary_key=True)
    ingredient_name = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(f"{db_table_name1}.user_id"), nullable=False)
    added_at = db.Column(db.DateTime, default = datetime.now)

@app.route('/pantry', methods=['POST'])
@cross_origin(origins=["https://whats4dinner.vercel.app"], supports_credentials=True)
def add_ingredient():
    if "user_id" not in session:
        return jsonify({"error": "User not logged in"}), 401
    data = request.get_json()
    ingredient_name = data.get('ingredient_name')
    user_id = session['user_id']
    if not ingredient_name:
        return jsonify({"error": "Ingredient name is required"}), 400
    new_ingredient = Ingredient(ingredient_name=ingredient_name, user_id=user_id, added_at = datetime.now())
    try:
        db.session.add(new_ingredient)
        db.session.commit()
        return jsonify({"message": "Ingredient added successfully",
                        "ingredient_id": new_ingredient.id,
                        "ingredient_name": new_ingredient.ingredient_name,
                        "user_id": new_ingredient.user_id,
                        'user_name': session['user_name']
                        }), 201
    except Exception as e:
        db.session.rollback()
        print('unexpected error when adding ingredient')
        return jsonify({"error": str(e)}), 500
    
@app.route('/pantry', methods=['GET'])
@cross_origin(origins=["https://whats4dinner.vercel.app"], supports_credentials=True)
def get_ingredients():
    if "user_id" not in session:
        return jsonify({"error": "User not logged in"}), 401
    user_id = session['user_id']
    ingredients = Ingredient.query.filter_by(user_id=user_id).all()
    ingredients_list = [{"ingredient_name": ingredient.ingredient_name,
                        "id": ingredient.id,} for ingredient in ingredients]
    
    return jsonify({"ingredients": ingredients_list,
                    "user_id": user_id,
                    "user_name": session['user_name']
                    }), 200

@app.route('/pantry/<int:ingredient_id>', methods=['DELETE'])
@cross_origin(origins=["https://whats4dinner.vercel.app"], supports_credentials=True)
def delete_ingredient(ingredient_id):
    if "user_id" not in session:
        return jsonify({"error": "User not logged in"}), 401
    user_id = session['user_id']
    ingredient = Ingredient.query.filter_by(id=ingredient_id, user_id=user_id).first()
    if not ingredient:
        return jsonify({"error": "Ingredient not found"}), 404
    db.session.delete(ingredient)
    db.session.commit()
    return jsonify({"message": "Ingredient deleted successfully"}), 200

#chef ai routes

openai_key = os.getenv('openai_key')
client = OpenAI(api_key= openai_key)
content = os.getenv('open_ai_content')

def get_openai_response(prompt, chat_history):
    completion = client.chat.completions.create(
        model= "gpt-4o",
        messages= [{"role": "system", "content": content}] + chat_history + [{"role": "user", "content": prompt}],
        temperature = 0.05
    )
    return completion.choices[0].message.content

@app.route('/chefai', methods=['POST'])
@cross_origin(origins=["https://whats4dinner.vercel.app"], supports_credentials=True)
def get_response():
    data = request.get_json()
    prompt = data.get('prompt')
    user_name = session['user_name']
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    if "chat_history" not in session:
        session['chat_history'] = []

    user_id = session['user_id']
    ingredients = Ingredient.query.filter_by(user_id=user_id).all()
    ingreidents_list = [ingredient.ingredient_name for ingredient in ingredients]
    ingredients_str = ", ".join(ingreidents_list)
    prompt = f"{prompt} Ingredients in the pantry are: {ingredients_str}. If you get something not related to food. Just let the user know that you only discuss about food."

    chat_history = session['chat_history']
    response = get_openai_response(prompt, chat_history)
    chat_history.append({"role": "user", "content": prompt})
    chat_history.append({"role": "assistant", "content": response})
    session['chat_history'] = chat_history

    return jsonify({"response_message": response,
                    "response_history": chat_history,
                    "user_name": user_name}), 200

#recipes routes

SPOONACULAR_API_KEY = os.getenv('SPOONACULAR_API_KEY')

class Recipes(db.Model):
    __tablename__ = db_table_name3
    id = db.Column(db.Integer, primary_key=True)
    recipe_name = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(f"{db_table_name1}.user_id"), nullable=False)
    added_at = db.Column(db.DateTime, default = datetime.now)
    id_from_api = db.Column(db.Integer)

@app.route("/spoonacular_search", methods=['POST'])
@cross_origin(origins=["https://whats4dinner.vercel.app"], supports_credentials=True)
def spoonacular_search():
    data = request.get_json()
    ingredients = data.get('ingredients')
    url = f"https://api.spoonacular.com/recipes/findByIngredients?apiKey={SPOONACULAR_API_KEY}&ingredients={ingredients}&number=5"
    response = requests.get(url)
    return response.json()

@app.route("/id_spoonacular_search", methods=['POST'])
@cross_origin(origins=["https://whats4dinner.vercel.app"], supports_credentials=True)
def id_spoonacular_search():
    data = request.get_json()
    id = data.get('id')
    url = f'https://api.spoonacular.com/recipes/{id}/information?apiKey={SPOONACULAR_API_KEY}&includeNutrition=false'
    response = requests.get(url)
    return response.json()


@app.route("/recipes", methods = ['POST'])
@cross_origin(origins=["https://whats4dinner.vercel.app"], supports_credentials=True)
def save_recipes():
    data = request.get_json()
    user_id = data.get('user_id')
    recipe_name = data.get('recipe_name')
    id_from_api = data.get('id_from_api')

    try:
        new_recipe = Recipes(recipe_name=recipe_name, user_id=user_id, added_at = datetime.now(), id_from_api = id_from_api)
        db.session.add(new_recipe)
        db.session.commit()
        return jsonify({
            "message": "recipe saved successfully",
            "user_id": user_id, 
            "recipe_name": recipe_name,
            "id_from_api": id_from_api

        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": str(e)
        }), 400



@app.route("/recipes", methods=['GET'])
@cross_origin(origins=["https://whats4dinner.vercel.app"], supports_credentials=True)
def view_recipes():
    if 'user_id' not in session:
        return jsonify({
            "error": " No user in session"
        }), 400
    user_id = session['user_id']
    recipes = Recipes.query.filter_by(user_id=user_id).all()
    saved_recipes = [{
                    "ingredient_name": recipe.recipe_name,
                    "id_from_api": recipe.id_from_api,
                    "id" : recipe.id
                    } for recipe in recipes]
    
    return jsonify({
        "saved_recipes" : saved_recipes,
        "user_id": user_id
    }), 201



@app.route("/recipes/<int:recipe_id>", methods=['DELETE'])
@cross_origin(origins=["https://whats4dinner.vercel.app"], supports_credentials=True)
def delete_recipe(recipe_id):
    user_id = session['user_id']
    recipe = Recipes.query.filter_by(id=recipe_id, user_id=user_id).first()
    if not recipe:
        return jsonify({
            "message": "Failed to delete recipe from saved"
        }), 404
    db.session.delete(recipe)
    db.session.commit()

    return jsonify({
        "message": "recipe successfully removed from saved"
    }), 200


# google routes

GOOGLE_CLIENT_ID = os.getenv('VITE_GOOGLE_CLIENT_ID')

@app.route("/google_login", methods = ["POST"])
@cross_origin(origins=["https://whats4dinner.vercel.app"], supports_credentials=True)
def google_login():
    response = request.get_json()
    token = response.get('token')
    try:
        id_info = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        email = id_info.get('email')
        user_name = id_info.get('name')
        user = User.query.filter_by(email=email, user_name = user_name).first()
        if user:
            session['auth_status'] = True
            session['user_id'] = user.user_id
            session['user_name'] = user.user_name
            session['email'] = user.email
            return jsonify({"message": "Logged in successfully",
                            "user_id": session['user_id'],
                            "user_name": session['user_name'],
                            "email" : session['email'],
                            "auth_status": session['auth_status']
                            }), 200
        else:
            new_user = User(user_name=user_name, email=email, created_at = datetime.now())
            db.session.add(new_user)
            db.session.commit()
            session['auth_status'] = True
            session['user_id'] = new_user.user_id
            session['user_name'] = new_user.user_name
            session['email'] = new_user.email
            return jsonify({"message": "User created successfully",
                            "user_id": session['user_id'],
                            "email" : session['email'],
                            "user_name": session['user_name'],
                            "auth_status": session['auth_status']
                            }), 200
    except Exception as e:
        return jsonify({"error": str}), 400

if __name__ == "__main__":
    app.run(debug=True)
