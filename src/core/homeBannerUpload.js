
import { homebanneruploadDir } from '../config';
import sendUnauthorized from './sendUnauthorized';
import multer from 'multer';
const crypto = require('crypto');
const fs = require('fs');
const fse = require('fs-extra');
import bodyParser from 'body-parser';
import sharp from 'sharp';

var storage = multer.diskStorage({
  destination: homebanneruploadDir,
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
        console.log('successfully deleted');
      });
    }

    if(fs.existsSync(filePath + 'x_' + fileName)) {
      // Resized Image
      fs.unlink(filePath + 'x_' + fileName, (err) => {
        if (err) throw err;
        console.log('successfully deleted');
      });
    }

    if(fs.existsSync(filePath + 'xx_large_' + fileName)) {
      // Resized Image
      fs.unlink(filePath + 'xx_large_' + fileName, (err) => {
        if (err) throw err;
        console.log('successfully deleted');
      });
    }

}

const homeBannerUpload = app => {

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

app.post('/uploadHomeBanner', function (req, res, next) {
  if (!req.user) {
    sendUnauthorized(req, res, '/uploadHomeBanner');
  } else {
    next();
  }
},upload.single('file'), async (req, res, next) => {
  let file = req.file;
  // Resized for home page - 655 * 345
    if (file.mimetype === 'image/jpeg') {
      sharp(file.path)
        .resize(1280, null)
        .jpeg({ quality: 50 })
        .toFile(homebanneruploadDir +'xx_large_' + file.filename, function (err) {
          console.log("Error from resizing files", err);
        });
    } else if (file.mimetype === 'image/png') {
      sharp(file.path)
        .resize(1280, null)
        .png({ compressionLevel: 5, adaptiveFiltering: true, force: true })
        .toFile(homebanneruploadDir + 'xx_large_' + file.filename, function (err) {
          console.log("Error from resizing files", err);
        });
    }

  res.send({ status: 'SuccessFully uploaded!', file });

});

app.post('/deleteHomeBanner', function (req, res, next) {
  if (!req.user) {
    sendUnauthorized(req, res, '/deleteHomeBanner');
  } else {
    next();
  }
}, async (req, res) => {
  let filePath = homebanneruploadDir;
  let fileName = req.body.fileName;

  await removeFiles(fileName, filePath);
  res.send({ status: 'Got your file to remove!' }); 
});

};

export default homeBannerUpload;
