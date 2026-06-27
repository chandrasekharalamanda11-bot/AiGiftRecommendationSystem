async function test() {
  const query = "custom star map";
  const url = `https://unsplash.com/s/photos/${encodeURIComponent(query)}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, reject; v=1.0) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!res.ok) {
      console.log(`Failed to fetch: ${res.status} ${res.statusText}`);
      return;
    }
    
    const text = await res.text();
    
    // Unsplash photo URLs format: https://images.unsplash.com/photo-1517841905240-472988babdf9
    // Let's use a regex to find photo URLs in the HTML source
    const regex = /https:\/\/images\.unsplash\.com\/photo-([a-zA-Z0-9-]+)\b/g;
    const matches = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      const fullUrl = match[0];
      if (!matches.includes(fullUrl)) {
        matches.push(fullUrl);
      }
    }
    
    console.log(`Found ${matches.length} images!`);
    console.log("First 5 matches:");
    console.log(matches.slice(0, 5));
    
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
