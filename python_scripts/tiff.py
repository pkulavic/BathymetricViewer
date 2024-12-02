# Import necessary libraries
from PIL import Image
import numpy as np

# Open the TIFF file
file_path = 'data/exportImage (3).tiff'
image = Image.open(file_path)

# Convert the image to a NumPy array
image_array = np.array(image)

# Print the shape of the array to verify
print(image_array.shape)

# Calculate and print the minimum and maximum values
min_value = np.min(image_array)
max_value = np.max(image_array)

print(f"Minimum value: {min_value}")
print(f"Maximum value: {max_value}")
# Import matplotlib for visualization
import matplotlib.pyplot as plt

# Create a scatter plot
plt.figure(figsize=(10, 8))
height, width = image_array.shape
x, y = np.meshgrid(np.arange(width), np.arange(height))
plt.scatter(x.flatten(), y.flatten(), c=image_array.flatten(), cmap='viridis', s=1)

# Customize the plot
plt.colorbar(label='Pixel Value')
plt.title('TIFF Image Visualization')
plt.xlabel('Width')
plt.ylabel('Height')

# Invert y-axis to match image coordinates
plt.gca().invert_yaxis()

# Display the plot
# plt.show()

# Count the number of zero values in the image array
zero_count = np.count_nonzero(image_array == 0)

# Print the result
print(f"Number of zero values: {zero_count}")


def tiff_to_esri_ascii(image_array, output_file):
    # Get the dimensions of the image
    nrows, ncols = image_array.shape

    # Open the output file for writing
    with open(output_file, 'w') as f:
        # Write the header
        f.write(f"ncols         {ncols}\n")
        f.write(f"nrows         {nrows}\n")
        f.write("xllcorner     \n")
        f.write("yllcorner     \n")
        f.write("cellsize      \n")
        f.write("NODATA_value  0.0\n")

        # Write the data
        for row in image_array:
            f.write(' '.join(map(str, row)) + '\n')

# Use the function to convert the TIFF to ESRI ASCII format
output_file = 'output.asc'
tiff_to_esri_ascii(image_array, output_file)
print(f"ESRI ASCII file created: {output_file}")
