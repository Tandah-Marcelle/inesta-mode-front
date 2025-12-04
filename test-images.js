const https = require('https');

// Image URLs from your comments data
const imageUrls = [
  'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' // Default image for new comments
];

console.log('Testing image URL accessibility...\n');

function testImageUrl(url, index) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`✅ Image ${index + 1}: Status ${res.statusCode} - ${res.statusCode < 400 ? 'OK' : 'ERROR'}`);
      console.log(`   Content-Type: ${res.headers['content-type']}`);
      console.log(`   Content-Length: ${res.headers['content-length']} bytes`);
      console.log(`   URL: ${url}\n`);
      resolve();
    }).on('error', (err) => {
      console.log(`❌ Image ${index + 1}: ERROR - ${err.message}`);
      console.log(`   URL: ${url}\n`);
      resolve();
    });
  });
}

async function testAllImages() {
  for (let i = 0; i < imageUrls.length; i++) {
    await testImageUrl(imageUrls[i], i);
  }
  console.log('Image accessibility test completed.');
}

testAllImages().catch(console.error);