# from services.transfer_style_service import transfer_style
# from services.helpers.image_local_display_service import LocalImageDisplayService
import json

# image_size = 512
# # if not torch.cuda.is_available():
# image_size = 256
#
#
# style_img = LocalImageDisplayService().image_loader(image_name="./images/monaliza.jpg", image_size=image_size, _device=None)
# content_img = LocalImageDisplayService().image_loader(image_name="./images/justyna_2.jpg", image_size=image_size, _device=None)
#
# result = transfer_style(style_img, content_img)
# LocalImageDisplayService().display_plot(result)

with open('./data_models/classes.json') as json_file:
    data = json.load(json_file)
    for key in {key: value for (key, value) in data.items() if value == 62}.keys():
        print(key)