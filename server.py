import torch
import cv2
import base64
import numpy as np
from PIL import Image
from io import BytesIO
from diffusers import (
    StableDiffusionControlNetPipeline,
    ControlNetModel,
    UniPCMultistepScheduler,
)
import litserve as ls

controlnet_checkpoint = "lllyasviel/control_v11p_sd15_canny"
stable_diffusion_checkpoint = "benjamin-paine/stable-diffusion-v1-5"
# stable_diffusion_checkpoint = "runwayml/stable-diffusion-v1-5"


# (STEP 1) - DEFINE THE API (compound AI system)
class SimpleLitAPI(ls.LitAPI):
    def setup(self, device):
        # Load ControlNet and Stable Diffusion models
        controlnet = ControlNetModel.from_pretrained(
            controlnet_checkpoint, torch_dtype=torch.float16, use_safetensors=True
        )
        self.pipe = StableDiffusionControlNetPipeline.from_pretrained(
            stable_diffusion_checkpoint,
            controlnet=controlnet,
            safety_checker=None,
            torch_dtype=torch.float16,
            use_safetensors=True,
        )
        self.pipe.scheduler = UniPCMultistepScheduler.from_config(
            self.pipe.scheduler.config
        )
        self.pipe.enable_model_cpu_offload()
        # self.pipe = self.pipe.to(device)

    def decode_request(self, request):
        prompt = request["prompt"]
        image_data = base64.b64decode(request["image"])
        image = Image.open(BytesIO(image_data)).convert("RGB")
        return prompt, image

    def predict(self, inputs):
        prompt, image = inputs

        # Preprocess the image (apply Canny edge detection)
        image = np.array(image)
        image = cv2.Canny(image, 100, 200)
        image = image[:, :, None]
        image = np.concatenate([image, image, image], axis=2)
        image = Image.fromarray(image)

        # Generate image
        with torch.inference_mode():
            output = self.pipe(
                prompt,
                image,
                num_inference_steps=20,
                guidance_scale=7.5,
            ).images[0]

        return output

    def encode_response(self, output):
        buffered = BytesIO()
        output.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return {"image": img_str}


# (STEP 2) - START THE SERVER
if __name__ == "__main__":
    # scale with advanced features (batching, GPUs, etc...)
    server = ls.LitServer(SimpleLitAPI(), accelerator="auto", max_batch_size=1)
    server.run(port=8000)
