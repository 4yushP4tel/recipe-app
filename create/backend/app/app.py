import os
from flask import Flask, request, jsonify
#Bcrypt s useful for password security
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import psycopg2
import sys
from flask_restful import Resource, Api

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello World"

if __name__ == "__main__":
    app.run(debug=True)