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
            Key: `${options.key}.${options.extension}`,
            Body: options.buffer,
            ContentType: 'binary',
          };
          if (options.ContentEncoding) params.ContentEncoding = options.ContentEncoding;
          app.s3Bucket.upload(params, async (error, data) => {
            if (error) reject(error);
            resolve(data);
          });
        });
      };

      const validateParams = (params) => {
        const { fileExtension, isBase64 } = app.modules;
        if (!params.key) return { status: false, message: 'File key required!' };
        if (!params.ContentEncoding && params.ContentEncoding !== 'base64') {
          if (!params.fileName) return { status: false, message: 'File name required!' };
          params.extension = fileExtension(params.fileName);
          if (!params.buffer || !Buffer.isBuffer(params.buffer)) return { status: false, message: 'File buffer required!' };
        } else {
          if (!isBase64(params.buffer, { mime: true })) return { status: false, message: 'Base64 file invalid!' };
          params.extension = params.buffer.substring(params.buffer.indexOf('/') + 1, params.buffer.indexOf(';base64'));
          params.buffer = Buffer.from(params.buffer.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        }
        return { status: true, message: 'Ok' };
      };

      app.uploadToS3 = async (params) => {
        const validation = validateParams(params);
        if (validation.status === false) return validation.message;
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
    } else {
      app.uploadToS3 = async (params) => {
        throw new Error('You need to set the variables PGFY_AWS_ACCESS_KEY and PGFY_AWS_SECRET_ACCESS to use the Uploader to S3');
      };
    }
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = s3;
