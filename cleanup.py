import os
import re

# Define the base directory of the dataset
base_dir = "screenshots"

# Function to rename files
def rename_files(base_dir):
    # Walk through the directory structure
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            # Match the second file naming format
            match = re.match(r"AQI(\d+)_([a-zA-Z]+)_(\d{2}-\d{2})_(\w+)\.png", file)
            if match:
                # Extract components from the filename
                aqi = match.group(1)
                day_night = match.group(2)
                time = match.group(3)
                weather = match.group(4)

                # Construct the new filename
                new_filename = f"{time}_{day_night}_AQI{aqi}_{weather}.png"

                # Get full paths for renaming
                old_path = os.path.join(root, file)
                new_path = os.path.join(root, new_filename)

                # Rename the file
                os.rename(old_path, new_path)
                print(f"Renamed: {old_path} -> {new_path}")

# Run the function
rename_files(base_dir)
