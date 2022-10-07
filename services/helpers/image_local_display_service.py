import io

import matplotlib.pyplot as plt
import torchvision.transforms as transforms
from PIL import Image
import torch
from flask import send_file
from io import StringIO
from io import BytesIO

un_loader = transforms.ToPILImage()


class LocalImageDisplayService:

    def __init__(self):
        super(LocalImageDisplayService, self).__init__()

    # we clone the tensor to not do changes on it
    def im_show(self, _tensor, title=None):
        image = _tensor.cpu().clone()
        image = image.squeeze(0)  # remove the fake batch dimension
        image = un_loader(image)
        plt.imshow(image)
        if title is not None:
            plt.title(title)

        # pause a bit so that plots are updated
        plt.pause(0.001)

    def convert_to_image(self, _tensor):
        image = _tensor.cpu().clone()
        image = image.squeeze(0)  # remove the fake batch dimension
        image = un_loader(image)

        return image

    def serve_pil_image(self, pil_img):
        img_io = BytesIO()
        pil_img = pil_img.resize((512, 512), Image.ANTIALIAS)
        pil_img.save(img_io, 'JPEG', quality=100)
        img_io.seek(0)
        return send_file(img_io, mimetype='image/jpeg')

    def image_loader(self, image_name, image_size, _device):
        image = Image.open(image_name)

        # resize - scale imported image
        # transform it into a torch tensor
        loader = transforms.Compose([transforms.Resize(image_size), transforms.ToTensor()])

        # fake batch dimension required to fit network's input dimensions
        image = loader(image).unsqueeze(0)
        return image.to(_device, torch.float)

    def image_loader_with_image(self, image, image_size, _device):
        pil_image = Image.open(image)

        # resize - scale imported image
        # transform it into a torch tensor
        loader = transforms.Compose([transforms.Resize(image_size), transforms.ToTensor()])

        # fake batch dimension required to fit network's input dimensions
        image = loader(pil_image).unsqueeze(0)
        return image.to(_device, torch.float)

    def display_plot(self, result):
        plt.figure()
        self.im_show(result, title='Output Image')

        # sphinx_gallery_thumbnail_number = 4
        plt.ioff()
        plt.show()
