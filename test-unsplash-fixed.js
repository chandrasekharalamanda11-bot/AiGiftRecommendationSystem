async function test() {
  const query = "custom star map";
  const url = `https://unsplash.com/s/photos/${encodeURIComponent(query)}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    
    console.log(`Status: ${res.status}`);
    if (!res.ok) {
      return;
    }
    
    const text = await res.text();
    
    // Let's use a regex to look for photo objects in the HTML
    // Unsplash pages contain links like href="/photos/something-xyz" or images like src="https://images.unsplash.com/photo-1234567-xyz?..."
    const regex = /https:\/\/images\.unsplash\.com\/photo-([a-zA-Z0-9-]+)\b/g;
    const matches = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      const photoId = match[1];
      const imageUrl = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=600&q=80`;
      if (!matches.includes(imageUrl)) {
        matches.push(imageUrl);
      }
    }
    
    console.log(`Found ${matches.length} image URLs!`);
    console.log("First 3 images:");
    console.log(matches.slice(0, 3));
    
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
