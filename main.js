import { loadESRIASCII } from "./load_data.js";
import { createBufferGeometry } from "./createBuffer.js";


const url = 'data/gebco_2023_n22.6189_s18.2704_w-160.8926_e-153.9642.asc';
loadESRIASCII(url)
  .then(result => {
    if (result) {
      const { header, data } = result;
      // Process the header and data as needed
      console.log(result);
      const geometry = createBufferGeometry(result.header, result.data)
      const colors = [];
      for (let i = 0; i < geometry.attributes.position.array.length; i += 3) {
        const elevation = geometry.attributes.position[i + 1]; // Assuming y-coordinate represents elevation
        const color = new THREE.Color();
        // Map elevation to a color gradient
        if (elevation < 0) {
          // Below sea level (negative values)
          color.setHSL(0.6, 1, 0.5 + Math.min(elevation / -1000, 0)); // Blue to black
        } else {
          // Above sea level (positive values)
          color.setHSL(0.3, 1, 0.5 + Math.min(elevation / 1000, 0.5)); // Green to white
        }
        colors.push(color.r, color.g, color.b);
      }
      console.log(colors);
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      console.log(geometry)

    }
  });


