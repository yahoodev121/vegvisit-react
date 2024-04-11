

// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLFloat as FloatType,
} from 'graphql';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import DocumentVerificationType from '../../types/DocumentVerification';
import { DocumentVerification } from '../../../data/models';
import { s3Client } from '../../../helpers/s3Client';
import { documentuploadDir, whoAmI, documentsSignedUrlExpiration } from '../../../config'
import { documentBaseUrl } from '../../../helpers/cdnImages';
import logger from '../../../core/logger';

const ShowDocumentList = {

  //type: DocumentVerificationType,
  type: new List(DocumentVerificationType),

  args: {
    userId: { type: StringType },
  },


  async resolve({ request, response }, { userId }) {

    if (request.user) {
      let userId = request.user.id;
      const verificationDocuments = await DocumentVerification.findAll({
        where: {
          userId
        }
      });
      const verificationDocumentsWithUrl = [];
      for (let index = 0; index < verificationDocuments.length; index++) {
        const document = verificationDocuments[index];
        // Specifies a path within your Space and the file to download.
        const bucketParams = {
          Bucket: 'vegvisits',
          Key: (whoAmI || '') + documentuploadDir.replace('./', '') + document.fileName
        };
        try {
          const url = await getSignedUrl(s3Client, new GetObjectCommand(bucketParams), { expiresIn: documentsSignedUrlExpiration * 60 }); // Adjustable expiration.
          logger.debug(`data.queries.DocumentList.ShowDocumentList.ShowDocumentList.resolve: [User ${JSON.stringify(request.user)}] Created temporary URL for document ${JSON.stringify(document)} and file ${document.fileName}: ${url}`);
          verificationDocumentsWithUrl.push({...document.dataValues, url});
        } catch (err) {
          logger.error(`data.queries.DocumentList.ShowDocumentList.ShowDocumentList.resolve: [User ${JSON.stringify(request.user)}] Error creating temporary URL for for document ${JSON.stringify(document)} and file ${document.fileName}: ${err.message}`, err);
        } finally {
        }        
      }
      logger.debug(`data.queries.DocumentList.ShowDocumentList.ShowDocumentList.resolve: [User ${JSON.stringify(request.user)}] Returning documents with URL: ${JSON.stringify(verificationDocumentsWithUrl)}`);
      return verificationDocumentsWithUrl;
    }
  },
};

export default ShowDocumentList;


/*
query ShowDocumentList{
    ShowDocumentList{
        id
        userId,
        fileName,
        fileType
    }
}
*/