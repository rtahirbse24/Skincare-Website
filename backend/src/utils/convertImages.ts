import fs from 'fs';
import path from 'path';
import cloudinary from '../config/cloudinary';

const filePath = path.join(__dirname, '../../data/store.json');

const uploadBase64 = (base64: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      base64,
      { folder: 'products' },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
  });
};

const convertImages = async () => {
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(rawData);

    console.log(`🔍 Found ${data.products.length} products`);

    for (let i = 0; i < data.products.length; i++) {
      const product = data.products[i];

      console.log(`\n🚀 Processing product ${i + 1}/${data.products.length}`);

      const newImages: string[] = [];

      for (const img of product.images) {
        if (img.startsWith('data:image')) {
          console.log('⬆️ Uploading image to Cloudinary...');
          const url = await uploadBase64(img);
          newImages.push(url);
        } else {
          newImages.push(img);
        }
      }

      product.images = newImages;
    }

    // Save new file
    const newFilePath = path.join(__dirname, '../../data/store-fixed.json');
    fs.writeFileSync(newFilePath, JSON.stringify(data, null, 2));

    console.log('\n✅ DONE! New file created: store-fixed.json');

  } catch (error) {
    console.error('❌ Conversion failed:', error);
  }
};

convertImages();