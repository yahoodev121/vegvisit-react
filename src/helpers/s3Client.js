import { S3 } from "@aws-sdk/client-s3";
import { auth, spacesEndpoint, documentuploadDir } from '../config';

const s3Client = new S3({
    endpoint: `https://${spacesEndpoint}`,
    region: "us-east-1",
    credentials: {
      accessKeyId: auth.aws.accessKeyId,
      secretAccessKey: auth.aws.secretAccessKey
    }
});

export { s3Client };
