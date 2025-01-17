import AWS from 'aws-sdk';
import config from './config/config';
import mime from 'mime-types';

AWS.config.update({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region
});

const s3 = new AWS.S3();

export const backUpToS3 = async (fileBuffer: Buffer, fileName: string, folderName?: string): Promise<string> => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME || '';
    const key = folderName ? `${folderName}/${fileName}` : fileName;
  
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: 'application/gzip',
    };
  
    try {
      const data = await s3.upload(params).promise();
      return data.Location;
    } catch (e:any) {
      console.error(`S3 Upload Error: ${e.message}`);
      throw e;
    }
  };

export const uploadToS3 = (
    file: Express.Multer.File | Buffer,
    filename: string,
    folder?: string,
    ticketId?: string
): Promise<string> => {
    const contentType = mime.contentType(filename) || 'application/octet-stream';

    const params: AWS.S3.PutObjectRequest = {
        Bucket: config.aws.bucketName,
        Key: folder ? `${folder}/${filename}` : filename,
        Body: file instanceof Buffer ? file : file.buffer,
        // ContentType: 'application/pdf',
        ContentType: contentType,
    };

    return new Promise((resolve, reject) => {
        s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
            if (err) {
                console.error('Error uploading file:', err);
                reject(err);
            } else {
                console.log('File uploaded successfully:', data.Location);
                resolve(data.Location);
            }
        });
    });
};

export const deleteFromS3 = (fileUrl: string): Promise<void> => {
    const fileName = fileUrl.split('/').pop(); 
    if (!fileName) {
        throw new Error('Invalid file URL');
    }

    const params: AWS.S3.DeleteObjectRequest = {
        Bucket: config.aws.bucketName,
        Key: fileName
    };

    return new Promise((resolve, reject) => {
        s3.deleteObject(params, (err: Error) => {
            if (err) {
                console.error('Error deleting file from S3:', err);
                reject(err);
            } else {
                console.log('File deleted successfully from S3');
                resolve();
            }
        });
    });
};


export const copyInS3 = async (sourceKey: string, destinationKey: string): Promise<string> => {
    const bucketName = config.aws.bucketName;

    const copyParams = {
        Bucket: bucketName,
        CopySource: `/${bucketName}/${sourceKey}`,
        Key: destinationKey
    };
    
    try {
        await s3.headObject({ Bucket: bucketName, Key: sourceKey }).promise();
        await s3.copyObject(copyParams).promise();
        return `https://${bucketName}.s3.amazonaws.com/${destinationKey}`;
    } catch (e: any) {
        if (e.code === 'NotFound') {
            console.error(`Source file not found: ${sourceKey}`);
        } else {
            console.error(`S3 Copy Error: ${e.message}`);
        }
        throw e;
    }
};