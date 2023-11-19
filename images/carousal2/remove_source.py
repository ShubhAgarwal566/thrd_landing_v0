from PIL import Image
import os
from tqdm import tqdm

parent_dir = './drop2'

for filename in tqdm(os.listdir(parent_dir)):
    if filename.endswith('.webp'):
        img = Image.open(os.path.join(parent_dir, filename))
        width, height = img.size
        img = img.crop((0, 0, width, height - 100))
        img.save(os.path.join(parent_dir, filename))

