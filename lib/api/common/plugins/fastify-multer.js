function main(api, plugin) {
  api.upload = {};
  const multer = require(plugin.name);
  const enableMemoryStorage = process.env.PGFY_UPLOAD_MEMORY_STORAGE === 'true';
  if (enableMemoryStorage) {
    const storage = multer.memoryStorage();
    api.upload.toMemory = multer({
      storage,
    });
    api.register(multer.contentParser);
  }
  return true;
}

module.exports = main;
