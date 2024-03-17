export async function loadESRIASCII(url) {
    try {
      const response = await fetch(url);
      const text = await response.text();
      const lines = text.split('\n');
  
      const header = {};
      for (let i = 0; i < 6; i++) {
        const [key, value] = lines[i].split(/\s+/);
        header[key] = parseFloat(value);
      }
      const data = [];
      for (let i = 6; i < lines.length - 1; i++) {
        const row = lines[i].split(/\s+/).map(parseFloat);
        row.shift()
        data.push(row);
      }
  
      return { header, data };
    } catch (error) {
      console.error('Error loading ESRI ASCII file:', error);
      return null;
    }
  }