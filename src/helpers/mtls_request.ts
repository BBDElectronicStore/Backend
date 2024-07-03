import https from 'https';
import axios from "axios";
import {S3Helper} from './secret_helper';

export async function makeSecureRequest<T>(data: T, path: string, method: string, hostname: string) {
    try {

        const s3Helper = new S3Helper();
        const certificate = await s3Helper.getObject(`electronics_retailer.crt`);
        const key = await s3Helper.getObject(`electronics_retailer.key`);
        const httpsAgent = new https.Agent({
            cert: certificate,
            key: key,
        });


        return await axios.request({
            method: method,
            headers: {
              "X-Origin": "electronics_retailer"
            },
            url: `https://${hostname}${path}`,
            data: data ? JSON.stringify(data) : null,
            httpsAgent: httpsAgent
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

