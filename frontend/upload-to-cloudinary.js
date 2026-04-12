const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: 'db2tuzuim',
  api_key: '179647694267337',
  api_secret: 'OsGjOuZ7wfj-SZgD2FZxxznqAmA',
});

const publicDir = path.join(__dirname, 'public');

async function uploadAll() {
  const getAllFiles = (dir) => {
    const files = [];
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        files.push(...getAllFiles(fullPath));
      } else if (/\.(jpg|jpeg|png|webp|svg)$/i.test(file)) {
        files.push(fullPath);
      }
    });
    return files;
  };

  const files = getAllFiles(publicDir);
  console.log(`Found ${files.length} images to upload`);

  const results = {};

  for (const filePath of files) {
    const relativePath = path.relative(publicDir, filePath);
    try {
      console.log(`Uploading: ${relativePath}`);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'skincare',
        public_id: path.parse(relativePath).name,
        overwrite: true,
      });
      results[relativePath] = result.secure_url;
      console.log(`Done: ${result.secure_url}`);
    } catch (e) {
      console.error(`Failed: ${relativePath} - ${e.message}`);
    }
  }

  fs.writeFileSync('cloudinary-urls.json', JSON.stringify(results, null, 2));
  console.log('All done! URLs saved to cloudinary-urls.json');
}

uploadAll();