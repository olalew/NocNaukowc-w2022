from flask import Blueprint, render_template, abort
from services.transfer_style_service import transfer_style
from services.helpers.image_local_display_service import LocalImageDisplayService
import torch
from flask import send_file
from flask import request
from io import BytesIO
import base64
import re

pattern = '^[a-zA-Z0-9_]+$'
transfer_style_controller = Blueprint('transfer_style_controller', __name__)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

image_size = 256
# if not torch.cuda.is_available():
#     image_size = 256
#     pass


@transfer_style_controller.route('/api/test-style-transfer')
def test_style_transfer():
    style_img = LocalImageDisplayService().image_loader(image_name="./images/krzyk.jpg", image_size=image_size,
                                                        _device=device)
    content_img = LocalImageDisplayService().image_loader(image_name="./images/politechnika.jpg", image_size=image_size,
                                                          _device=device)
    result = transfer_style(style_img, content_img)
    result_image = LocalImageDisplayService().convert_to_image(result)
    return LocalImageDisplayService().serve_pil_image(result_image)


@transfer_style_controller.route('/api/transfer-style', methods=['POST'])
def transfer_style_method():
    name = "krzyk"
    if "name" in request.args and re.match(pattern, request.args["name"]):
        name = request.args["name"]

    style_img = LocalImageDisplayService().image_loader(image_name=f"./images/{name}.jpg", image_size=image_size,
                                                        _device=device)

    # print(request.json)

    content_img_input = BytesIO(base64.b64decode(request.json['content']))
    content_img = LocalImageDisplayService().image_loader_with_image(image=content_img_input, image_size=image_size,
                                                                     _device=device)
    result = transfer_style(style_img, content_img, num_steps=25)
    result_image = LocalImageDisplayService().convert_to_image(result)

    buff = BytesIO()
    result_image.save(buff, format="JPEG")

    return {
        "image": "data:image/jpeg;base64," + base64.b64encode(buff.getvalue()).decode()
    }


@transfer_style_controller.route('/api/transfer-style-by-name', methods=['GET'])
def transfer_style_by_name_method():
    name = "krzyk"
    if "name" in request.args and re.match(pattern, request.args["name"]):
        name = request.args["name"]

    from_name = "coffee"
    if "from_name" in request.args and re.match(pattern, request.args["from_name"]):
        from_name = request.args["from_name"]

    print(f"from name {from_name}")
    print(f"name {name}")

    result_img = LocalImageDisplayService().convert_to_image(
        LocalImageDisplayService().image_loader(f"./images/transfer/result/{from_name}_{name}.jpg",
                                                image_size=image_size, _device=device))

    buff = BytesIO()
    result_img.save(buff, format="JPEG")
    return {
        "image": "data:image/jpeg;base64," + base64.b64encode(buff.getvalue()).decode()
    }
