import { auth, spacesEndpoint, profilePhotouploadDir } from '../config';
import { whoAmI } from '../config';
import sendUnauthorized from './sendUnauthorized';
import logger from './logger';
import { s3Client } from '../helpers/s3Client';

import multer from 'multer';
const crypto = require('crypto');
const fs = require('fs');
const fse = require('fs-extra');
import bodyParser from 'body-parser';
import sharp from 'sharp';
import { PutObjectCommand } from '@aws-sdk/client-s3';

var storage = multer.diskStorage({
  destination: profilePhotouploadDir,
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
      }

      cb(null, raw.toString('hex') + ext);
    })
  }
});

var upload = multer({ storage: storage });

function removeFiles(fileName, filePath) {

  return

  if(fs.existsSync(filePath + fileName)) {
      // Original
      fs.unlink(filePath + fileName, (err) => {
        if (err) throw err;
        
      });
    }
    if(fs.existsSync(filePath + 'small_' + fileName)) {
      // small
      fs.unlink(filePath + 'small_' + fileName, (err) => {
        if (err) throw err;
        
      });
    }
    if(fs.existsSync(filePath + 'medium_' + fileName)) {
      // medium
      fs.unlink(filePath + 'medium_' + fileName, (err) => {
        if (err) throw err;
        
      });
    }
}

const profilePhotoUpload = app => {

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.post('/uploadProfilePhoto', function (req, res, next) {
    if (!req.user) {
      sendUnauthorized(req, res, '/uploadProfilePhoto');
    } else {
      next();
    }
  }, upload.single('file'), async (req, res, next) => {
    let file = req.file;

    // small - 100 * 100
    await new Promise((resolve, reject) => {
      sharp(file.path)
        .rotate()
        .resize(100, 100)
        .toBuffer(async (error, data, info) => {
          if (error) {
            reject(error)
            return
          }

          let params = {
            ACL: 'public-read',
            Body: data,
            Bucket: 'vegvisits',
            ContentType: file.mimetype,
            Key: whoAmI + profilePhotouploadDir.replace('./', '') + 'small_' + file.filename
          };
          try {
            const data = await s3Client.send(new PutObjectCommand(params));
            resolve(file);
          } catch (error) {
            logger.error('[small_] Error from saving files', error);
            reject(error);
          }
        });
    });
      
    // medium - 255 * 255
    await new Promise((resolve, reject) => {
      sharp(file.path)
        .rotate()
        .resize(255, 255)
        .toBuffer(async (error, data, info) => {
          if (error) {
            reject(error)
            return
          }

          let params = {
            ACL: 'public-read',
            Body: data,
            Bucket: 'vegvisits',
            ContentType: file.mimetype,
            Key: whoAmI + profilePhotouploadDir.replace('./', '') + 'medium_' + file.filename
          };
          try {
            const data = await s3Client.send(new PutObjectCommand(params));
            resolve(file);
          } catch (error) {
            logger.error('[medium_] Error from saving files', error);
            reject(error);
          }
        });
    });

    res.send({ status: 'Successfully uploaded!', file });
  });

  app.post('/deleteProfilePicture', function (req, res, next) {
    if (!req.user) {
      sendUnauthorized(req, res, '/deleteProfilePicture');
    } else {
      next();
    }
  }, async (req, res) => {
    let filePath = profilePhotouploadDir;
    let fileName = req.body.fileName;

    await removeFiles(fileName, filePath);
    res.send({ status: 'Successfully removed!' }); 
  });
  
};

export default profilePhotoUpload;
