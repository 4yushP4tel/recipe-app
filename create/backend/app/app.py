import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import psycopg2
import sys
from datetime import datetime
from flask_restful import Resource, Api

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

load_dotenv()

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
    status = False
    return jsonify({'auth_status' : status})


@app.route('/create_user', methods=['POST'])
def create_user():
    data = request.get_json()
    user_name = data.get('user_name')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    print(f"password: {password}, confirm_password: {confirm_password}")
    if password != confirm_password:
        print("error passwords do not match")
        return jsonify({"error": "passwords do not match"}), 400
    
    existing_user = User.query.filter(
        (User.email == email) | (User.user_name == user_name)
    ).first()

    if existing_user:
        print("duplicate users")
        return jsonify({"error": "User with this email or username already exists"}), 409

    new_user = User(user_name=user_name, email=email, created_at = datetime.now())
    new_user.set_password(password)

    try:
        db.session.add(new_user)
        db.session.commit()
        print('user created')
        return jsonify({"message": "User created successfully"}), 201
        #change the status here once the user is created
    except Exception as e:
        db.session.rollback()
        print('unexpected error')
        return jsonify({"error": str(e)}), 500




@app.route('/login', methods=['POST'])
def login():
    pass

if __name__ == "__main__":
    app.run(debug=True)
