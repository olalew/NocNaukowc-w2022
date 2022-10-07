import torch.nn as nn
import torch
import torch.nn.functional as F


# a = batch size(=1)
# b = number of feature maps
# (c,d) = dimensions of a f. map (N=c*d)
def gram_matrix(_input):
    a, b, c, d = _input.size()
    features = _input.view(a * b, c * d)  # resize F_XL into \hat F_XL

    gram_product = torch.mm(features, features.t())  # compute the gram product

    # we 'normalize' the values of the gram matrix
    # by dividing by the number of element in each feature maps.
    return gram_product.div(a * b * c * d)


class StyleLoss(nn.Module):

    def __init__(self, target_feature):
        super(StyleLoss, self).__init__()
        self.loss = None
        self.target = gram_matrix(target_feature).detach()

    def forward(self, _input):
        gram = gram_matrix(_input)
        self.loss = F.mse_loss(gram, self.target)
        return _input
