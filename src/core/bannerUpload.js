import { banneruploadDir } from '../config';
import sendUnauthorized from './sendUnauthorized';
import multer from 'multer';
const crypto = require('crypto');
const fs = require('fs');
const fse = require('fs-extra');
import bodyParser from 'body-parser';
import sharp from 'sharp';


var storage = multer.diskStorage({
  destination: banneruploadDir,
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

function removeFiles(fileName, filePath ) {

    if(fs.existsSync(filePath + fileName)) {
      // Original
      fs.unlink(filePath + fileName, (err) => {
        if (err) throw err;
      });
    }

    if(fs.existsSync(filePath + 'x_' + fileName)) {
      // Resized Image
      fs.unlink(filePath + 'x_' + fileName, (err) => {
        if (err) throw err;
      });
    }

}

const bannerUpload = app => {

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.post('/uploadBanner', function (req, res, next) {
    if (!req.user) {
      sendUnauthorized(req, res, '/uploadBanner');
    } else {
      next();
    }
  },upload.single('file'), async (req, res, next) => {
    let file = req.file;
    // Resized for home page - 655 * 345
    sharp(file.path)
      .resize(655, 345)
      .toFile(banneruploadDir + 'x_' + file.filename, function(err) {
        console.log("Error from resizing files", err);
    });

    res.send({ status: 'SuccessFully uploaded!', file });

  });

  app.post('/deleteBanner', function (req, res, next) {
    if (!req.user) {
      sendUnauthorized(req, res, '/deleteBanner');
    } else {
      next();
    }
  }, async (req, res) => {
    let filePath = banneruploadDir;
    let fileName = req.body.fileName;

    await removeFiles(fileName, filePath);
    res.send({ status: 'Got your file to remove!' }); 
  });

};

export default bannerUpload;
