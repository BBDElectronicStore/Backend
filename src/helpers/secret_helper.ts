import { S3 } from 'aws-sdk';

const bucket: string = process.env.CERT_BUCKET || '';
const path = "electronics_retailer";
export class S3Helper {
    s3 = new S3({ region: 'eu-west-1' });

    async getObject(key: string) {
        try {
            const response = await this.s3.getObject({ Bucket: bucket, Key: key }).promise();
            return response.Body?.toString('utf-8');
        } catch (error) {
            console.error('Error retrieving object:', error);
            throw error;
        }
    }

    async getMTLSCredentials() {
        try {
            const certificate = await this.getObject(`${path}.crt`);
            const key = await this.getObject(`${path}.key`);
            return {
                certificate: certificate,
                key: key
            };
        } catch (error) {
            console.error('Error retrieving MTLSCredentials:', error);
            throw error;
        }
    }
}




