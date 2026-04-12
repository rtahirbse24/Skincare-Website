const fs = require('fs');
const path = require('path');

// Load cloudinary URLs
const cloudinaryUrls = JSON.parse(
  fs.readFileSync('cloudinary-urls.json', 'utf-8')
);

// Load store
const storePath = path.join(__dirname, 'data', 'store.json');
const store = JSON.parse(fs.readFileSync(storePath, 'utf-8'));

let updatedCount = 0;

store.products = store.products.map(product => {
  const updatedImages = (product.images || []).map(img => {
    // Already a Cloudinary URL
    if (img.startsWith('https://res.cloudinary.com')) return img;

    // Extract filename from path
    const fileName = path.basename(img);

    // Search in cloudinary URLs
    const match = Object.entries(cloudinaryUrls).find(([key]) => {
      return path.basename(key) === fileName;
    });

    if (match) {
      updatedCount++;
      return match[1]; // Return Cloudinary URL
    }

    return img; // Keep original if no match
  });

  return { ...product, images: updatedImages };
});

fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
console.log(`Done! Updated ${updatedCount} image URLs to Cloudinary.`);