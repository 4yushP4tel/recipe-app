import os
from flask import Flask, request, jsonify
import psycopg2
import sys
from flask_restful import Resource, Api

print(sys.executable)