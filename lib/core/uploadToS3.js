async function s3(app) {
  try {
    if (app.config.uploaders
      && app.config.uploaders.s3
      && app.config.uploaders.s3.accessKeyId
      && app.config.uploaders.s3.secretAccessKey) {
      const { thumbWidth, thumbHeigth } = app.config.uploaders.s3;
      if (!app.AWS) {
        await app.pluginManager.install('aws-sdk');
        await app.pluginManager.install('sharp');
        app.modules.AWS = app.pluginManager.require('aws-sdk');
        app.modules.AWS.config.update({
          accessKeyId: app.config.uploaders.s3.accessKeyId,
          secretAccessKey: app.config.uploaders.s3.secretAccessKey,
        });
        app.modules.Sharp = app.pluginManager.require('sharp');
      }
      app.s3Bucket = new app.AWS.S3({
        params: {
          Bucket: process.env.PGFY_AWS_S3_DEFAULT_BUCKET || 'public',
          timeout: process.env.PGFY_AWS_S3_TIMEOUT || 6000000,
        },
      });

      const sendToS3 = (bucket, key, fileName, buffer, acl) => {
        function fileExtension(filename, opts) {
          if (!opts) opts = {};
          if (!filename) return '';
          const ext = (/[^./\\]*$/.exec(filename) || [''])[0];
          return opts.preserveCase ? ext : ext.toLowerCase();
        }
        return new Promise((resolve, reject) => {
          const params = {
            Bucket: bucket,
            ACL: acl || 'public-read',
            Key: `${key}.${fileExtension(fileName)}`,
            Body: buffer,
            ContentType: 'binary',
          };
          app.s3Bucket.upload(params, async (error, data) => {
            if (error) reject(error);
            resolve(data);
          });
        });
      };

      app.uploadToS3 = async (bucket, key, fileName, buffer, acl, makeThumb = false) => {
        const uploadFiles = [];
        const fileUploaded = sendToS3(
          bucket,
          key,
          fileName,
          buffer,
          acl,
        );
        uploadFiles.push(fileUploaded);
        if (makeThumb) {
          const thumbBuffer = await app.modules.Sharp(buffer)
            .resize(thumbWidth, thumbHeigth)
            .toBuffer();
          const thumbUploaded = sendToS3(
            bucket,
            `${key}-${thumbWidth}x${thumbHeigth}`,
            fileName,
            thumbBuffer,
            acl,
          );
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
