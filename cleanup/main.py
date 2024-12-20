import os
import cv2
import shutil
from sklearn.model_selection import train_test_split

# Define AQI categories and thresholds
aqi_categories = {
    "Good": range(0, 51),
    "Moderate": range(51, 101),
    "Sensitive": range(101, 151),
    "Unhealthy": range(151, 201),
    "VeryUnhealthy": range(201, 301),
    "Hazardous": range(301, 500)
}

# Source and destination folders
source_folder = "screenshots"
cleaned_folder = "cleanshots"
train_folder = os.path.join(cleaned_folder, "train")
test_folder = os.path.join(cleaned_folder, "test")

# Helper function to determine AQI category
def get_aqi_category(aqi):
    for category, aqi_range in aqi_categories.items():
        if aqi in aqi_range:
            return category
    return None

# Ensure destination folders exist
for folder in [train_folder, test_folder]:
    for category in aqi_categories.keys():
        os.makedirs(os.path.join(folder, category), exist_ok=True)

# Gather all images and their metadata
images = []
for date_folder in os.listdir(source_folder):
    date_path = os.path.join(source_folder, date_folder)
    if not os.path.isdir(date_path):
        continue
    for webcam_folder in os.listdir(date_path):
        webcam_path = os.path.join(date_path, webcam_folder)
        if not os.path.isdir(webcam_path):
            continue
        for image_name in os.listdir(webcam_path):
            if image_name.endswith(('.png', '.jpg', '.jpeg')):
                image_path = os.path.join(webcam_path, image_name)
                try:
                    # Extract AQI and other info from the filename
                    parts = image_name.split("_")
                    aqi = int(parts[2][3:])  # Extract AQI value
                    category = get_aqi_category(aqi)
                    if category:
                        images.append((image_path, category, webcam_folder))
                except (IndexError, ValueError):
                    print(f"Skipping file with invalid name format: {image_name}")

# Split images into train and test sets
train_images, test_images = train_test_split(images, test_size=0.2, random_state=42)

# Function to process and save images
def process_and_save_images(image_list, destination_folder):
    for image_path, category, webcam_folder in image_list:
        try:
            # Read and process the image
            img = cv2.imread(image_path)
            height, width = img.shape[:2]
            crop_size = min(height, width)
            left = (width - crop_size) // 2
            right = left + crop_size
            img_cropped = img[:, left:right]
            img_resized = cv2.resize(img_cropped, (224, 224))

            # Create new filename
            image_name = os.path.basename(image_path)
            new_name = f"{os.path.splitext(image_name)[0]}_{webcam_folder.replace(' ', '_')}.jpg"
            save_path = os.path.join(destination_folder, category, new_name)

            # Save the processed image
            cv2.imwrite(save_path, img_resized)
        except Exception as e:
            print(f"Error processing {image_path}: {e}")

# Process and save train and test images
process_and_save_images(train_images, train_folder)
process_and_save_images(test_images, test_folder)

print("Image processing and organization complete.")
