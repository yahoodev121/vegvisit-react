import { auth, spacesEndpoint, fileuploadDir } from '../config';
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
import { PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const imageNamePrefixes = ['', 'small_', 'x_small_', 'x_medium_', 'x_large_', 'xx_large_'];

var storage = multer.diskStorage({
  destination: fileuploadDir,
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

function removeLocalFiles(fileName, filePath) {
  if (fs.existsSync(filePath + fileName)) {
    // Original
    fs.unlinkSync(filePath + fileName);
    logger.debug(`core.fileUpload.removeLocalFiles: File ${fileName} in directory ${filePath} successfully deleted`);
  } else {
    logger.warn(`core.fileUpload.removeLocalFiles: File ${fileName} in directory ${filePath} was not found`);
  }

  return;

  if (fs.existsSync(filePath + 'small_' + fileName)) {
    // small
    fs.unlink(filePath + 'small_' + fileName, (err) => {
      if (err) throw err;
      logger.debug('successfully deleted');
    });
  }

  if (fs.existsSync(filePath + 'x_small_' + fileName)) {
    // x_small
    fs.unlink(filePath + 'x_small_' + fileName, (err) => {
      if (err) throw err;
      logger.debug('successfully deleted');
    });
  }

  if (fs.existsSync(filePath + 'x_medium_' + fileName)) {
    // x_medium
    fs.unlink(filePath + 'x_medium_' + fileName, (err) => {
      if (err) throw err;
      logger.debug('successfully deleted');
    });
  }

  if (fs.existsSync(filePath + 'x_large_' + fileName)) {
    // x_large
    fs.unlink(filePath + 'x_large_' + fileName, (err) => {
      if (err) throw err;
      logger.debug('successfully deleted');
    });
  }

  if (fs.existsSync(filePath + 'xx_large_' + fileName)) {
    // xx_large
    fs.unlink(filePath + 'xx_large_' + fileName, (err) => {
      if (err) throw err;
      logger.debug('successfully deleted');
    });
  }
}

function removeRemoteFiles(fileName) {
  const objects = imageNamePrefixes.map((prefix) => {
    return {
      Key:   
        whoAmI +
        fileuploadDir.replace('./', '') +
        prefix + fileName
    }
  });
  logger.debug(`core.fileUpload.removeRemoteFiles: Trying to delete following objects: ${JSON.stringify(objects)}`);
  const params = {
    Bucket: 'vegvisits', 
    Delete: {
     Objects: objects, 
     Quiet: false
    }
   };
  const deletePromise = new Promise(async function(resolve, reject) {
    try {
      const data = await s3Client.send(new DeleteObjectsCommand(params));
      logger.info(
        `core.fileUpload.removeRemoteFiles: Successfully deleted s3 objects: ${JSON.stringify(
          data
        )}`
      );
      resolve();
    } catch (err) {
      logger.error(
        `core.fileUpload.removeRemoteFiles: Error deleting s3 objects: ${err.message}`,
        err.stack
      );
      reject();
    }
  });
  return deletePromise;
}

const fileUpload = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.post(
    '/photos',
    function(req, res, next) {
      if (!req.user) {
        sendUnauthorized(req, res, '/photos');
      } else {
        next();
      }
    },
    upload.array('file'),
    async (req, res, next) => {
      let files = req.files;

      if (files && files[0] && files[0].path && files[0].filename) {
        // the original sized image
        try {
          await new Promise((resolve, reject) => {
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
                    fileuploadDir.replace('./', '') +
                    files[0].filename,
                };
                try {
                  const data = await s3Client.send(new PutObjectCommand(params));
                  resolve(files);
                } catch (error) {
                  logger.error('[original] Error from saving files', error);
                  reject(error);
                }
              });
          });

          // small - 101 * 67
          await new Promise((resolve, reject) => {
            sharp(files[0].path)
              .rotate()
              .resize(101, null)
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
                    fileuploadDir.replace('./', '') +
                    'small_' +
                    files[0].filename,
                };
                try {
                  const data = await s3Client.send(new PutObjectCommand(params));
                  resolve(files);
                } catch (error) {
                  logger.error('[small_] Error from saving files', error);
                  reject(error);
                }
              });
          });

          // x_small - 216 * 144
          await new Promise((resolve, reject) => {
            sharp(files[0].path)
              .rotate()
              .resize(216, null)
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
                    fileuploadDir.replace('./', '') +
                    'x_small_' +
                    files[0].filename,
                };
                try {
                  const data = await s3Client.send(new PutObjectCommand(params));
                  resolve(files);
                } catch (error) {
                  logger.error('[x_small_] Error from saving files', error);
                  reject(error);
                }
              });
          });

          if (files[0].mimetype === 'image/jpeg') {
            // x_medium - 450 * 300
            await new Promise((resolve, reject) => {
              sharp(files[0].path)
                .rotate()
                .resize(450, null)
                .jpeg({ quality: 50 })
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
                      fileuploadDir.replace('./', '') +
                      'x_medium_' +
                      files[0].filename,
                  };
                  try {
                    const data = await s3Client.send(new PutObjectCommand(params));
                    resolve(files);
                  } catch (error) {
                    logger.error('[x_medium] Error from saving files', error);
                    reject(error);
                  }
                });
            });

            // x_large - 900 * 650
            await new Promise((resolve, reject) => {
              sharp(files[0].path)
                .rotate()
                .resize(900, null)
                .jpeg({ quality: 50 })
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
                      fileuploadDir.replace('./', '') +
                      'x_large_' +
                      files[0].filename,
                  };
                  try {
                    const data = await s3Client.send(new PutObjectCommand(params));
                    resolve(files);
                  } catch (error) {
                    logger.error('[x_large] Error from saving files', error);
                    reject(error);
                  }
                });
            });

            // xx_large - 1280 * 960
            await new Promise((resolve, reject) => {
              sharp(files[0].path)
                .rotate()
                .resize(1280, null)
                .jpeg({ quality: 50 })
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
                      fileuploadDir.replace('./', '') +
                      'xx_large_' +
                      files[0].filename,
                  };
                  try {
                    const data = await s3Client.send(new PutObjectCommand(params));
                    resolve(files);
                  } catch (error) {
                    logger.error('[xx_large] Error from saving files', error);
                    reject(error);
                  }
                });
            });
          } else if (files[0].mimetype === 'image/png') {
            // x_medium - 450 * 300
            await new Promise((resolve, reject) => {
              sharp(files[0].path)
                .rotate()
                .resize(450, null)
                .png({
                  compressionLevel: 5,
                  adaptiveFiltering: true,
                  force: true,
                })
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
                      fileuploadDir.replace('./', '') +
                      'x_medium_' +
                      files[0].filename,
                  };
                  try {
                    const data = await s3Client.send(new PutObjectCommand(params));
                    resolve(files);
                  } catch (error) {
                    logger.error('[x_medium] Error from saving files', error);
                    reject(error);
                  }
                });
            });

            // x_large - 900 * 650
            await new Promise((resolve, reject) => {
              sharp(files[0].path)
                .rotate()
                .resize(900, null)
                .png({
                  compressionLevel: 5,
                  adaptiveFiltering: true,
                  force: true,
                })
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
                      fileuploadDir.replace('./', '') +
                      'x_large_' +
                      files[0].filename,
                  };
                  try {
                    const data = await s3Client.send(new PutObjectCommand(params));
                    resolve(files);
                  } catch (error) {
                    logger.error('[x_large] Error from saving files', error);
                    reject(error);
                  }
                });
            });

            // xx_large - 1280 * 960
            await new Promise((resolve, reject) => {
              sharp(files[0].path)
                .rotate()
                .resize(1280, null)
                .png({
                  compressionLevel: 5,
                  adaptiveFiltering: true,
                  force: true,
                })
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
                      fileuploadDir.replace('./', '') +
                      'xx_large_' +
                      files[0].filename,
                  };
                  try {
                    const data = await s3Client.send(new PutObjectCommand(params));
                    resolve(files);
                  } catch (error) {
                    logger.error('[xx_large] Error from saving files', error);
                    reject(error);
                  }
                });
            });
          }
          res.send({ status: 'Successfully uploaded!', files });
          logger.debug(
            `core.fileUpload.fileUpload.post(/photos): The file ${files[0].filename} in directory ${fileuploadDir} was successfully converted and uploaded for user ${JSON.stringify(req.user)}.`
          );
        } catch (error) {
          logger.error(
            `core.fileUpload.fileUpload.post(/photos): The file ${files[0].filename} in directory ${fileuploadDir} could not be converted and uploaded for user ${JSON.stringify(req.user)}.`,
            error
          );
          res.sendStatus(500);
        } finally {
          try {
            removeLocalFiles(files[0].filename, fileuploadDir);
            logger.debug(
              `core.fileUpload.fileUpload.post(/photos): Successfully deleted the file ${files[0].filename} in directory ${fileuploadDir} after upload for user ${JSON.stringify(req.user)}.`
            );
          } catch (error) {
            logger.warn(
              `core.fileUpload.fileUpload.post(/photos): The file ${files[0].filename} in directory ${fileuploadDir} could not be deleted for user ${JSON.stringify(req.user)}.`,
              error
            );
          }
        }
      } else {
        res.sendStatus(500);
      }
    }
  );

  app.post(
    '/deletePhotos',
    function(req, res, next) {
      if (!req.user) {
        sendUnauthorized(req, res, '/deletePhotos');
      } else {
        next();
      }
    },
    async (req, res) => {
      try {
        let filePath = fileuploadDir;
        let fileName = req.body.fileName;
  
        // await removeLocalFiles(fileName, filePath);
        await removeRemoteFiles(fileName);
        logger.info(
          `core.fileUpload.fileUpload.post(/deletePhotos): Deleted all related files for ${fileName}. User is ${JSON.stringify(req.user)}`
        );
        res.send({ status: 'Successfully removed!' });
      } catch (error) {
        logger.error(
          `core.fileUpload.fileUpload.post(/deletePhotos): The related files for ${fileName} could not be deleted for user ${JSON.stringify(req.user)}, error message is: ${error.message}`,
          error
        );
        res.sendStatus(500);
      }
    }
  );

  app.post(
    '/removeMultiFiles',
    function(req, res, next) {
      if (!req.user) {
        sendUnauthorized(req, res, '/removeMultiFiles');
      } else {
        next();
      }
    },
    async (req, res) => {
      var files = req.body.files;
      let filePath = fileuploadDir;

      if (files != undefined && files.length > 0) {
        try {
          files.map(async function(item) {
            // await removeLocalFiles(item.name, filePath);
            await removeRemoteFiles(item.name);
          });
          logger.info(
            `core.fileUpload.fileUpload.post(/removeMultiFiles): Deleted all files: ${JSON.stringify(files)}. User is ${JSON.stringify(req.user)}`
          );
          res.send({ status: 'Successfully removed all items!' });
        } catch (error) {
          logger.error(
            `core.fileUpload.fileUpload.post(/removeMultiFiles): There was an error deleting following files: ${JSON.stringify(files)} for user ${JSON.stringify(req.user)}, error message is: ${error.message}`,
            error
          );
          res.sendStatus(500);
        }
      } else {
        res.send({ status: 'No items to remove' });
      }
    }
  );
};

export default fileUpload;
