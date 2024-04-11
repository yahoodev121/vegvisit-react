const request = require('request');
const fs = require('fs');
const crypto = require('crypto');
import sharp from 'sharp';
import { PutObjectCommand } from '@aws-sdk/client-s3';

import { auth, spacesEndpoint, profilePhotouploadDir, whoAmI } from '../../config';
import logger from '../logger';
import checkAuthorizedOrLocalHostRequest from '../checkAuthorizedOrLocalHostRequest';
import { s3Client } from '../../helpers/s3Client';

const downloadRoute = app => {
	app.post('/uploadRemoteImage', function (req, res, next) {
		if (checkAuthorizedOrLocalHostRequest (req, res, '/uploadRemoteImage')) {
			next();
		} else {
			res.sendStatus(401);
		}
	}, function (req, res) {
		const url = req.body.url;
		request(url, { encoding: 'binary' }, async function (error, response, body) {
			if (error) {
				logger.error(`downloadRoute /uploadRemoteImage: Requesting image from ${url} failed with error ${error.message}`, error);
				res.send({ status: 400 });
			}
			try {
				// var random = Math.random().toString(36).substring(9);
				const random = crypto.randomBytes(16).toString('hex');
	
				var contentType = response.headers['content-type'];
				let ext;
				switch (contentType) {
					case 'image/jpeg':
						ext = '.jpeg';
						break;
					case 'image/png':
						ext = '.png';
						break;
				}
				if (random && ext) {
					var filename = 'sl' + random + ext; // sl for social log-ins, by that we can distinguish these pictures (length of name 34)
					var destination = profilePhotouploadDir + filename;
					fs.writeFileSync(destination, body, 'binary');
					// small - 100 * 100
					const smallImage = await new Promise((resolve, reject) => {
						sharp(destination)
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
									ContentType: contentType,
									Key: whoAmI + profilePhotouploadDir.replace('./', '') + 'small_' + filename
								};
								try {
									const data = await s3Client.send(new PutObjectCommand(params));
									resolve(filename);
								} catch (error) {
									logger.error('[small_] Error from saving file', error);
									reject(error);
								}
							});
					});

					// medium - 255 * 255
					const mediumImage = await new Promise((resolve, reject) => {
						sharp(destination)
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
									ContentType: contentType,
									Key: whoAmI + profilePhotouploadDir.replace('./', '') + 'medium_' + filename
								};
								try {
									const data = await s3Client.send(new PutObjectCommand(params));
									resolve(filename);
								} catch (error) {
									logger.error('[medium_] Error from saving file', error);
									reject(error);
								}
							});
					});
					logger.info(`downloadRoute /uploadRemoteImage: Successfully processed and uploaded image from ${url} to destination ${destination}`);
					res.send({ filename, status: 200 });
				} else {
					logger.error(`downloadRoute /uploadRemoteImage: No file extension (${ext}) or name (${random}) could be defined for the image from ${url}`);
					res.send({ status: 400 });
				}
			} catch (error) {
				logger.error(`downloadRoute /uploadRemoteImage: Processing and uploading the image from ${url} failed with error ${error.message}`, error);
				res.send({ status: 400 });
			}
		});
	});
};

export default downloadRoute;