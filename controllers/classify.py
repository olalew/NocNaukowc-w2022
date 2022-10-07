from torch.optim import SGD, Adam
import torch
import torch.nn as nn
from flask import send_file
from flask import request
from io import BytesIO
from flask import Blueprint, render_template, abort
from PIL import Image
from services.helpers.image_local_display_service import LocalImageDisplayService
import numpy as np
import base64
import json
from torchvision import datasets, transforms
import lime
from lime import lime_image
from skimage.segmentation import mark_boundaries
import torch.nn.functional as F
import matplotlib.pyplot as plt
import matplotlib
import numpy

matplotlib.use('Agg')

classify_controller = Blueprint('classify_controller', __name__)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def get_model():
    model = nn.Sequential(nn.Conv2d(3, 64, kernel_size=3), nn.MaxPool2d(2), nn.ReLU(),
                          nn.Conv2d(64, 128, kernel_size=3),
                          nn.MaxPool2d(2), nn.ReLU(), nn.Flatten(),
                          nn.Linear(67712, 256), nn.ReLU(),
                          nn.Linear(256, 131)).to(device)

    loss_fn = nn.CrossEntropyLoss()
    optimizer = Adam(model.parameters(), lr=1e-5)
    return model, loss_fn, optimizer


classification_model, loss, opt = get_model()


def predict(image):
    img = torch.from_numpy(image).permute(0, 3, 1, 2).float().to(device)
    return classification_model(img).cpu().detach().numpy()


def generate_prediction_sample(exp, exp_class, originalImage, weight = 0.1, show_positive = True, hide_background = True):
    '''
    Method to display and highlight super-pixels used by the black-box model to make predictions
    '''
    image, mask = exp.get_image_and_mask(exp_class,
                                         positive_only=show_positive,
                                         num_features=4,
                                         hide_rest=hide_background,
                                         min_weight=weight
                                        )
    # plt.imshow(mark_boundaries(image, mask))
    # plt.axis('off')
    # plt.show()

    # loader = transforms.Compose([transforms.Resize(100), transforms.ToTensor()])
    # image = loader(originalImage)
    # image = image.squeeze(0)
    # image = transforms.ToPILImage()(image)

    if hide_background:
        _image = originalImage.copy().resize((100, 100))
        return mark_boundaries(numpy.array(_image), mask)
    else:
        return mark_boundaries(image, mask)

def explanation_heatmap(exp, exp_class):
    '''
    Using heat-map to highlight the importance of each super-pixel for the model prediction
    '''
    dict_heatmap = dict(exp.local_exp[exp_class])
    heatmap = np.vectorize(dict_heatmap.get)(exp.segments)
    plt.imshow(heatmap, cmap = 'RdBu', vmin  = -heatmap.max(), vmax = heatmap.max())
    plt.colorbar()
    # plt.show()

    buff = BytesIO()
    plt.savefig(buff, format="JPEG")

    plt.close()

    return "data:image/jpeg;base64," + base64.b64encode(buff.getvalue()).decode()


def encode_to_base_64_image(image):
    buff = BytesIO()
    pil_image = Image.fromarray((image * 255).astype('uint8'), 'RGB')
    pil_image.save(buff, format="JPEG")

    return "data:image/jpeg;base64," + base64.b64encode(buff.getvalue()).decode()


def encode_pil_to_base_64_image(image):
    buff = BytesIO()
    image.save(buff, format="JPEG")

    return "data:image/jpeg;base64," + base64.b64encode(buff.getvalue()).decode()


def get_label(selected_category):
    with open('./data_models/classes.json', encoding='utf-8') as json_file:
        data = json.load(json_file)
        for key in {key: value for (key, value) in data.items() if value == selected_category}.keys():
            return key


def classify(pil_image):
    loader = transforms.Compose([transforms.Resize(100), transforms.ToTensor(),
                                 transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])

    # fake batch dimension required to fit network's input dimensions
    torch_image = loader(pil_image).unsqueeze(0)
    classification_model.load_state_dict(
        torch.load('./data_models/target_model', map_location=torch.device(device)))

    results_tensor = classification_model(torch_image.to(device=device))
    predicted_value = torch.argmax(results_tensor)

    print(predicted_value)
    #
    label = ""
    with open('./data_models/classes.json') as json_file:
        data = json.load(json_file)
        for key in {key: value for (key, value) in data.items() if value == predicted_value}.keys():
            label = key

    print(torch_image.shape)

    explainer = lime_image.LimeImageExplainer()
    explanation = explainer.explain_instance(np.array(torch_image[0].permute(1, 2, 0).double()), predict,
                                             # classification function
                                             top_labels=3,
                                             hide_color=0,
                                             num_samples=500)

    lime_results = []

    for i in range(3):
        print(f'------------ explanation {i} ------------')
        print(explanation.top_labels[i])

        image1 = generate_prediction_sample(explanation, explanation.top_labels[i], pil_image,
                                            show_positive=True, hide_background=True)
        image2 = generate_prediction_sample(explanation, explanation.top_labels[i], pil_image,
                                            show_positive=True, hide_background=False)
        image3 = generate_prediction_sample(explanation, explanation.top_labels[i], pil_image,
                                            show_positive=False, hide_background=False)

        lime_results.append({
            "image1": encode_to_base_64_image(image1),
            "image2": encode_to_base_64_image(image2),
            "image3": encode_to_base_64_image(image3),
            "label": get_label(explanation.top_labels[i]),
            "heatmap": explanation_heatmap(explanation, explanation.top_labels[i])
        })

    return {
        "explanations": lime_results,
        "original": encode_pil_to_base_64_image(pil_image)
    }


@classify_controller.route('/api/classify', methods=['POST'])
def classify_with_image():
    content_img_input = BytesIO(base64.b64decode(request.json['content']))

    classification_image = Image.open(content_img_input)
    return classify(classification_image)


@classify_controller.route('/api/classifyByName', methods=['GET'])
def classify_by_name():
    name = "apple_golden"
    if "name" in request.args:
        name = request.args["name"]

    pil_image = Image.open(f"./images/fruits/{name}.jpg")
    return classify(pil_image)




