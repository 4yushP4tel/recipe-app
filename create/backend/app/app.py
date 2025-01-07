import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_session import Session
import psycopg2
import sys
from datetime import datetime, timedelta
from flask_restful import Resource, Api

KEY = os.getenv("SECRET_KEY")

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

load_dotenv()

app.config['SESSION_TYPE'] = 'filesystem' 
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SECRET_KEY'] = KEY
Session(app)

#connect DB
db_host = os.getenv('dbhost')
db_user = os.getenv('dbuser')
db_password = os.getenv('dbpassword')
db_name = os.getenv('dbname')
db_table_name1 = os.getenv('db_table_name1')
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{db_user}:{db_password}@{db_host}/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

class User(db.Model):
    __tablename__ = db_table_name1
    user_id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(50), unique = True, nullable = False)
    email = db.Column(db.String(250), unique = True, nullable = False)
    password_hash = db.Column(db.String(150), nullable = False)
    created_at = db.Column(db.DateTime, default = datetime.now)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
@app.route('/check_auth', methods=['GET'])
def check_auth():
    print(f"Session in Check:{dict(session)}")
    if 'user_id' in session and session.get('auth_status', False):
        return jsonify({'auth_status':True}), 200
    return jsonify({'auth_status' : False}), 200

@app.route('/create_user', methods=['POST'])
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
        return jsonify({"error": "User with this email or username already exists"}), 400

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

        return jsonify({"message": "User created successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print('unexpected error')
        return jsonify({"error": str(e)}), 500


@app.route('/login', methods=['POST'])
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
        session.permanent = True
        app.permanent_session_lifetime = timedelta(days=1)
        print(f"session data: {session}")
        print(f"Session Directory: {os.environ.get('SESSION_FILE_DIR', '/tmp')}")        
        return jsonify({"message": "Logged in successfully"}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401



if __name__ == "__main__":
    app.run(debug=True)
