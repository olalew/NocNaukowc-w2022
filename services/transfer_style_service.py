import os
import torch
import torchvision.transforms as transforms
import torchvision.models as models
from models.gradient_descent import run_style_transfer

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"


def transfer_style(style_img, content_img, num_steps=500, style_weight=1000000, content_weight=1):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    print(device)

    cnn = models.vgg19(pretrained=True).features.to(device).eval()

    cnn_normalization_mean = torch.tensor([0.485, 0.456, 0.406]).to(device)
    cnn_normalization_std = torch.tensor([0.229, 0.224, 0.225]).to(device)

    input_img = content_img.clone()

    output = run_style_transfer(cnn, cnn_normalization_mean, cnn_normalization_std, content_img, style_img, input_img,
                                device, num_steps, style_weight, content_weight)
    return output


if __name__ == '__main__':
    # transfer_style()
    pass


