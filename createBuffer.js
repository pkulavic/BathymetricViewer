export function createBufferGeometry(header, data) {
    const { ncols, nrows, xllcorner, yllcorner, cellsize } = header;
  
    const positions = [];
    const indices = [];
  
    for (let i = 0; i < nrows; i++) {
      for (let j = 0; j < ncols; j++) {
        const elevation = data[i][j];
        if (elevation !== header.NODATA_value) {
          const x = j;
          const y = i;
          const z = elevation;
  
          positions.push(x, y, z);
  
          if (i < nrows - 1 && j < ncols - 1) {
            const index = i * ncols + j;
            indices.push(index, index + 1, index + ncols + 1);
            indices.push(index + 1, index + ncols + 1, index + ncols);
          }
        }
      }
    }
  
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
  
    return geometry;
  }
