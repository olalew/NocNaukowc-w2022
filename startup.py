from flask import (Flask, render_template, abort, jsonify, request,
                   redirect, url_for, send_from_directory, make_response)
from controllers.transfer_style_controller import transfer_style_controller
from controllers.classify import classify_controller
from flask_cors import CORS

application = Flask(__name__)
CORS(application, resources={r"/api/*": {"origins": "*"}})
application.register_blueprint(transfer_style_controller)
application.register_blueprint(classify_controller)


@application.route('/', methods=['GET'])
def root():
    # Return index.html
    return render_template('index.html')


@application.route('/home', methods=['GET'])
def root_home():
    # Return index.html
    return render_template('index.html')


@application.route("/static/<path>")
def static_dir(path):
    return send_from_directory("static", path)


@application.errorhandler(404)
def not_found(path):
    """Page not found."""
    return make_response(render_template('index.html'), 200)
