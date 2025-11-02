from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os, uuid
from ibm_watson import DiscoveryV2, NaturalLanguageUnderstandingV1
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt
from datetime import timedelta

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

db = SQLAlchemy(app)
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    
    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

def parse_multipart_form_data(req):
    if "file" not in req.files:
        raise ValueError("Missing file field")
    file = req.files["file"]
    metadata = req.form
    fname = secure_filename(file.filename or "upload.zip")
    tmp_path = os.path.join("/tmp", fname)
    file.save(tmp_path)
    return tmp_path, metadata

def trigger_analysis(path, meta):
    deploy_type = meta.get("deploymentType", "gpt")
    orchestration_id = str(uuid.uuid4())
    if deploy_type == "discovery":
        discovery = DiscoveryV2(
            version="2022-01-01",
            iam_apikey=os.getenv("DISCOVERY_API_KEY","demo"),
            url=os.getenv("DISCOVERY_URL","https://api.us-south.discovery.watson.cloud.ibm.com"),
        )
        result = {"service": "Discovery", "status": "mock success"}
    elif deploy_type == "nlu":
        nlu = NaturalLanguageUnderstandingV1(
            version="2022-01-01",
            iam_apikey=os.getenv("NLU_API_KEY","demo"),
            url=os.getenv("NLU_URL","https://api.us-south.natural-language-understanding.watson.cloud.ibm.com"),
        )
        result = {"service": "NLU", "status": "mock success"}
    else:
        result = {"service": "GPT", "status": "mock success"}
    return {"orchestrationId": orchestration_id, "result": result}

@app.route("/api/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({"status": "error", "message": "Username and password required"}), 400
        
        if User.query.filter_by(username=username).first():
            return jsonify({"status": "error", "message": "Username already exists"}), 400
        
        user = User(username=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        access_token = create_access_token(identity=username)
        return jsonify({"status": "success", "access_token": access_token, "username": username}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({"status": "error", "message": "Username and password required"}), 400
        
        user = User.query.filter_by(username=username).first()
        
        if not user or not user.check_password(password):
            return jsonify({"status": "error", "message": "Invalid username or password"}), 401
        
        access_token = create_access_token(identity=username)
        return jsonify({"status": "success", "access_token": access_token, "username": username}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/upload", methods=["POST"])
@jwt_required()
def upload_file():
    try:
        current_user = get_jwt_identity()
        tmp_path, meta = parse_multipart_form_data(request)
        result = trigger_analysis(tmp_path, meta)
        return jsonify({"status": "success", "user": current_user, **result}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 8080)))
