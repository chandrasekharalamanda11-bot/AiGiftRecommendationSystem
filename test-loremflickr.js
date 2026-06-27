async function test() {
  const query = "star,map";
  const url = `https://loremflickr.com/600/400/${query}`;
  
  try {
    const res = await fetch(url, {
      method: 'HEAD', // just get the headers to see the redirect URL
      redirect: 'manual'
    });
    
    console.log(`Status: ${res.status}`);
    console.log(`Location header: ${res.headers.get('location')}`);
    
    // Let's do a follow redirect to see if it works
    const resFollow = await fetch(url);
    console.log(`Follow redirect status: ${resFollow.status}`);
    console.log(`Final URL: ${resFollow.url}`);
    
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
