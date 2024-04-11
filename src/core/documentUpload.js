import { auth, spacesEndpoint, documentuploadDir, documentsSignedUrlExpiration } from '../config';
import { whoAmI } from '../config'
import sendUnauthorized from './sendUnauthorized';
import multer from 'multer';
const crypto = require('crypto');
const fs = require('fs');
const fse = require('fs-extra');
import bodyParser from 'body-parser';
import sharp from 'sharp';
import logger from './logger';

import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { s3Client } from '../helpers/s3Client';

var storage = multer.diskStorage({
  destination: documentuploadDir,
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err);

      let ext;

      switch (file.mimetype) {
        case 'image/jpeg':
          ext = '.jpeg';
          break;
        case 'image/png':
          ext = '.png';
          break;
        case 'application/pdf':
          ext='.pdf';
          break;
      }

      cb(null, raw.toString('hex') + ext);
    })
  }
});

var upload = multer({ storage: storage });

function removeFile(fileName, filePath) {
  if (fs.existsSync(filePath + fileName)) {
    // Original
    fs.unlinkSync(filePath + fileName);
    logger.debug(`core.documentUpload.removeFile: File ${fileName} in directory ${filePath} successfully deleted`);
  } else {
    logger.warn(`core.documentUpload.removeFile: File ${fileName} in directory ${filePath} was not found`);
  }
  return;
}

const documentUpload = app => {

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.post('/documents', function (req, res, next) {
    if (!req.user) {
      sendUnauthorized(req, res, '/documents');
    } else {
      next();
    }
  }, upload.array('file'), async (req, res, next) => {
    let files = req.files;

    fs.readFile(files[0].path, async function(err, data) {
      if (err) throw err;

      let params = {
        ACL: 'private',
        Body: data,
        Bucket: 'vegvisits',
        ContentType: files[0].mimetype,
        Key: whoAmI + documentuploadDir.replace('./', '') + files[0].filename
      };

      try {
        const data = await s3Client.send(new PutObjectCommand(params));
        logger.info(`core.documentUpload.documentUpload.post(/documents): [User ${JSON.stringify(req.user)}] Successfully uploaded document ${files[0].filename} to s3 storage with result: ${JSON.stringify(data)}`);
        res.send({ status: 'Successfully uploaded!', files });
      } catch (error) {
        logger.error(`core.documentUpload.documentUpload.post(/documents): [User ${JSON.stringify(req.user)}] Error when uploading document ${files[0].filename} to s3 storage: ${error.message}`, error);
        res.sendStatus(500);
      }
    });
  });

  app.post('/deleteDocuments', function (req, res, next) {
    if (!req.user) {
      sendUnauthorized(req, res, '/deleteDocuments');
    } else {
      next();
    }
  }, async (req, res) => {
    const filePath = documentuploadDir;
    const fileName = req.body.fileName;

    // Remove file from s3 storage
    const bucketParams = {
      Bucket: 'vegvisits',
      Key: (whoAmI || '') + documentuploadDir.replace('./', '') + fileName
    };
    try {
      const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
      logger.info(`core.documentUpload.documentUpload.post(/deleteDocuments): [User ${JSON.stringify(req.user)}] Successfully deleted document ${fileName} from s3 storage with result: ${JSON.stringify(data)}`);
      res.send({ status: 'success' }); 
    } catch (err) {
      logger.error(`core.documentUpload.documentUpload.post(/deleteDocuments): [User ${JSON.stringify(req.user)}] Error when deleting document ${fileName} from s3 storage: ${err.message}`, err);
      res.sendStatus(500);
      return;
    }

    // Remove file locally
    try {
      removeFile(fileName, filePath);
      logger.debug(
        `core.documentUpload.documentUpload.post(/deleteDocuments): Successfully deleted the file ${fileName} in directory ${filePath} after deleting it on s3 for user ${JSON.stringify(req.user)}.`
      );
    } catch (error) {
      logger.warn(
        `core.documentUpload.documentUpload.post(/deleteDocuments): The file ${fileName} in directory ${filePath} could not be deleted for user ${JSON.stringify(req.user)}.`,
        error
      );
    }
  });

  app.get('/documentLink', function(req, res, next) {
    if (!(req.user && req.user.admin)) {
      sendUnauthorized(req, res, '/deleteDocuments');
    } else {
      next();
    }
  }, async (req, res) => {
    const fileName = req.query.fileName;
    if (fileName) {
      const bucketParams = {
        Bucket: 'vegvisits',
        Key: (whoAmI || '') + documentuploadDir.replace('./', '') + fileName
      };
      try {
        const url = await getSignedUrl(s3Client, new GetObjectCommand(bucketParams), { expiresIn: documentsSignedUrlExpiration * 60 }); // Adjustable expiration.
        logger.debug(`core.documentUpload.documentUpload.get(/documentLink): [User ${JSON.stringify(req.user)}] Created temporary URL for document ${JSON.stringify(fileName)}: ${url}`);
        res.send({
          status: 200,
          url
        });
      } catch (err) {
        logger.error(`core.documentUpload.documentUpload.get(/documentLink): [User ${JSON.stringify(req.user)}] Error creating temporary URL for for document ${JSON.stringify(fileName)}: ${err.message}`, err);
        res.sendStatus(500);
      }  
    } else {
      res.sendStatus(400);
    }
  });

};

export default documentUpload;
