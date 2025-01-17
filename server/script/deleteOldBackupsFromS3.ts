import AWS from 'aws-sdk';
import config from '../utils/config/config';

AWS.config.update({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region
});

const s3 = new AWS.S3();

const deleteObject = (Key: string): Promise<void> => {
    const params: AWS.S3.DeleteObjectRequest = {
        Bucket: config.aws.bucketName,
        Key: Key
    };

    return new Promise((resolve, reject) => {
        s3.deleteObject(params, (err: Error) => {
            if (err) {
                console.error('Error deleting file from S3:', err);
                reject(err);
            } else {
                console.log(`File '${Key}' deleted successfully from S3`);
                resolve();
            }
        });
    });
};

export const deleteOldBackupsFromS3 = async () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    try {
        const data = await s3.listObjectsV2({
            Bucket: config.aws.bucketName,
            Prefix: 'db-backup/'
        }).promise();

        if (data.Contents) {
            const deletePromises = [];
            for (const content of data.Contents) {
                if (content.Key && content.LastModified && content.LastModified < oneWeekAgo) {
                    deletePromises.push(deleteObject(content.Key));
                }
            }

            await Promise.all(deletePromises);
            console.log('Old backup files deleted successfully.');
        } else {
            console.log('No backup files found in the specified directory.');
        }
    } catch (error) {
        console.error('Error deleting old backup files from S3:', error);
    }
};
