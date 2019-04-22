async function s3(app) {
  try {
    if (app.config.uploaders
      && app.config.uploaders.s3
      && app.config.uploaders.s3.accessKeyId
      && app.config.uploaders.s3.secretAccessKey) {
      const { thumbWidth } = app.config.uploaders.s3;
      if (!app.AWS) {
        const AWS = require('aws-sdk');
        const Sharp = require('sharp');
        if (!app.modules) app.modules = {};
        app.modules.AWS = AWS;
        app.modules.AWS.config.update({
          accessKeyId: app.config.uploaders.s3.accessKeyId,
          secretAccessKey: app.config.uploaders.s3.secretAccessKey,
        });
        app.modules.Sharp = Sharp;
      }
      app.s3Bucket = new  app.modules.AWS.S3({
        params: {
          Bucket: process.env.PGFY_AWS_S3_DEFAULT_BUCKET || 'public',
          timeout: process.env.PGFY_AWS_S3_TIMEOUT || 6000000,
        },
      });

      const sendToS3 = (...args) => {
        const options = { ...args[0] };
        return new Promise((resolve, reject) => {
          const params = {
            Bucket: options.bucket || 'public',
            ACL: options.acl || 'public-read',
            Key: `${options.key}`,
            Body: options.buffer,
            ContentType: 'binary',
          };
          app.s3Bucket.upload(params, async (error, data) => {
            if (error) reject(error);
            resolve(data);
          });
        });
      };

      app.uploadToS3 = async (params) => {
        const uploadFiles = [];
        const fileUploaded = sendToS3(params);
        uploadFiles.push(fileUploaded);
        if (params.thumbnail) {
          const thumbBuffer = await app.modules.Sharp(params.buffer)
            .resize({ width: thumbWidth })
            .toBuffer();
          const paramsThumbs = app.modules._.cloneDeep(params);
          paramsThumbs.buffer = thumbBuffer;
          paramsThumbs.key = `${params.key}-${thumbWidth}x${thumbWidth}`;
          const thumbUploaded = sendToS3(paramsThumbs);
          uploadFiles.push(thumbUploaded);
        }
        const filesUploaded = await Promise.all(uploadFiles);
        return filesUploaded;
      };
    }
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = s3;
