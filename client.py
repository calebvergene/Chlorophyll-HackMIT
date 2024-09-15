# Copyright The Lightning AI team.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import base64
from io import BytesIO
import cv2
import numpy as np
import requests
from diffusers.utils import loading_utils
from PIL import Image

image = loading_utils.load_image(
    # "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/controlnet-img2img.jpg"
    "https://huggingface.co/lllyasviel/control_v11p_sd15_canny/resolve/main/images/input.png"
)
image = np.array(image)
prompt = "a blue paradise bird in the jungle"

low_threshold = 100
high_threshold = 200

image = cv2.Canny(image, low_threshold, high_threshold)
image = image[:, :, None]
image = np.concatenate([image, image, image], axis=2)
control_image = Image.fromarray(image)

control_image.save("./control.png")

# Convert the image to a base64-encoded string
buffered = BytesIO()
control_image.save(buffered, format="PNG")
img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

# Second request with base64-encoded image
response = requests.post(
    "http://127.0.0.1:8000/predict",
    json={"prompt": prompt, "image": img_str},
)

# Decode the base64 string back to an image
response_img = response.json()["image"]
response_img = base64.b64decode(response_img)
response_img = Image.open(BytesIO(response_img))
response_img.save("./response.png")
