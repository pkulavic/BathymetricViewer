



async function getFirstLine(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      const firstLine = text.split('\n')[0];
      console.log('First line:', firstLine);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Usage
  const url = 'data/gebco_2023_n22.6189_s18.2704_w-160.8926_e-153.9642.asc';
  getFirstLine(url).catch(error => console.error('Uncaught Error:', error));
  
  // Usage

  getFirstLine(url);