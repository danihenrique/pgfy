function main(api, plugin) {
  api.upload = {};
  const multer = require(plugin.name);
  if (Boolean(process.env.PGFY_UPLOAD_MEMORY_STORAGE) === true) {
    const storage = multer.memoryStorage();
    api.upload.toMemory = multer({
      storage,
    });
    api.register(multer.contentParser);
  }
  return true;
}

module.exports = main;
