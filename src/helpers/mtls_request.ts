import https from 'https';
// import fs from 'fs';
import axios, { Axios, AxiosResponse } from "axios";
import { SecretHelper } from './secret_helper';

export async function makeSecureRequest(data: any, path: string, method: string, hostname: string) {
    try {
        const secretHelper = new SecretHelper();
        const { certificate, key } = await secretHelper.getMTLSCredentials();
        const httpsAgent = new https.Agent({
            // cert: fs.readFileSync('./.creds/electronics_retailer.crt', 'utf-8'),
            // key: fs.readFileSync('./.creds/electronics_retailer.key', 'utf-8'),
            cert: certificate,
            key: key,
        });
        

        const response = await axios.request({
            method: method,
            url: `https://${hostname}${path}`,
            data: data ? JSON.stringify(data) : null,
            httpsAgent: httpsAgent
        });

        console.log('Response:', response.data);
        return response;
    } catch (error) {
        console.error('Error:', error);
    }
}
