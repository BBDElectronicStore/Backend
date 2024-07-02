import https from 'https';
import axios, { Axios, AxiosResponse } from "axios";
import { S3Helper } from './secret_helper';

export async function makeSecureRequest(data: any, path: string, method: string, hostname: string) {
    try {

        const s3Helper = new S3Helper();
        const certificate = await s3Helper.getObject(`electronics_retailer.crt`);
        const key = await s3Helper.getObject(`electronics_retailer.key`);
        const httpsAgent = new https.Agent({
            cert: certificate,
            key: key,
        });
        

        const response = await axios.request({
            method: method,
            url: `https://${hostname}${path}`,
            data: data ? JSON.stringify(data) : null,
            httpsAgent: httpsAgent
        });
        return response;
    } catch (error) {
        console.error('Error:', error);
    }
}

