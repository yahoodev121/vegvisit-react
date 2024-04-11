import multer from 'multer';
const crypto = require('crypto');
const fs = require('fs');
import bodyParser from 'body-parser';
import sharp from 'sharp';
import { PutObjectCommand } from '@aws-sdk/client-s3';

import { auth, spacesEndpoint, contentManagementuploadDir } from '../config';
import { whoAmI } from '../config';
import sendUnauthorized from './sendUnauthorized';
import logger from './logger';
import { s3Client } from '../helpers/s3Client';

var storage = multer.diskStorage({
  destination: contentManagementuploadDir,
  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return cb(err);

      let ext;

      switch (file.mimetype) {
        case 'image/jpeg':
          ext = '.jpeg';
          break;
        case 'image/png':
          ext = '.png';
          break;
      }

      cb(null, raw.toString('hex') + ext);
    });
  },
});

var upload = multer({ storage: storage });

const contentUpload = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.post(
    '/contentUpload',
    function(req, res, next) {
      if (!(req.user && req.user.admin)) {
        sendUnauthorized(req, res, '/contentUpload');
      } else {
        next();
      }
    },
    upload.array('file'),
    async (req, res, next) => {
      const files = req.files;

      try {
        const url = await new Promise((resolve, reject) => {
          sharp(files[0].path)
            .rotate()
            .toBuffer(async (error, data, info) => {
              if (error) {
                reject(error);
                return;
              }
  
              let params = {
                ACL: 'public-read',
                Body: data,
                Bucket: 'vegvisits',
                ContentType: files[0].mimetype,
                Key:
                  whoAmI +
                  contentManagementuploadDir.replace('./', '') +
                  files[0].filename,
              };

              try {
                const data = await s3Client.send(new PutObjectCommand(params));
                logger.info(`core.contentUpload.contentUpload.post(/contentUpload): [User ${JSON.stringify(req.user)}] Successfully uploaded content ${files[0].filename} to s3 storage with result: ${JSON.stringify(data)}`);
                const fileUrl =
                  'https://vegvisits.' +
                  spacesEndpoint +
                  '/' +
                  (whoAmI || '') +
                  contentManagementuploadDir.replace('./', '') +
                  files[0].filename;
                logger.info('core.contentUpload.contentUpload.post(/contentUpload): Success. Returned file url is: ' + fileUrl);
                resolve(fileUrl);
              } catch (error) {
                logger.error(`core.contentUpload.contentUpload.post(/contentUpload): [User ${JSON.stringify(req.user)}] Error when uploading document ${files[0].filename} to s3 storage: ${error.message}`, error);
                reject(error);
              }
            });
        });
        res.send({ status: 'Successfully uploaded!', files, url });
      } catch (error) {
        logger.error(`/contentUpload: Error during S3 image upload: ${error.message}`, error);
        res.sendStatus(500);
      }
    }
  );
};

export default contentUpload;
