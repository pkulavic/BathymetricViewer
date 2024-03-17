export function createBufferGeometry(header, data) {
    const { ncols, nrows, NODATA_value } = header;
    const cellsize = 450; // Assuming each cell is 450 meters by 450 meters

  
    const positions = [];
    const indices = [];
  
    for (let i = 0; i < nrows; i++) {
      for (let j = 0; j < ncols; j++) {
        const elevation = data[i][j];
        const x = j * cellsize;
        const elevationScale = 10; // Adjust the scaling factor as needed
        const y = elevation * elevationScale;
        const z = (nrows - i - 1) * cellsize;
  
        positions.push(x, y, z);
  
        if (i < nrows - 1 && j < ncols - 1) {
          const index = i * ncols + j;
        indices.push(index, index + 1, index + ncols);
        indices.push(index + 1, index + ncols + 1, index + ncols);
        }
      }
    }
  
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const colors = [];
    for (let i = 0; i < positions.length; i += 3) {
        const elevation = positions[i + 1];
        const color = new THREE.Color();
        if (elevation == NODATA_value) {
            color.setRGB(1, 0, 0) // red if no data
        }
        else if (elevation > 0) {
            color.setRGB(0, 0.5, 0) // green = land
        }
        else if (elevation < 0) {
            color.setRGB(0, 0, 0.75) // blue = ocean
        }
        colors.push(color.r, color.g, color.b);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    return geometry;
  }