
import { SecretsManager } from 'aws-sdk';


export class SecretHelper {
    secret_name = "Electronics-retailer-mtls-credentials";
    secretsManager = new SecretsManager({ region: 'eu-west-1' });


    async getSecret(secretName: string): Promise<string> {
        try {
            const response = await this.secretsManager.getSecretValue({ SecretId: secretName }).promise();
            if (response.SecretString) {
                return response.SecretString;
            } else if (response.SecretBinary) {
                return response.SecretBinary.toString('utf-8');
            } else if (response.SecretString && response.SecretBinary) {
                throw new Error('Both SecretString and SecretBinary found');
            } else {
                throw new Error('Secret value not found');
            }
        } catch (error) {
            console.error('Error retrieving secret:', error);
            throw error;
        }
    }


async getMTLSCredentials(): Promise<{ certificate: string, key: string }> {
    try {
        const secret = await this.getSecret(this.secret_name);
        const { certificate, key } = JSON.parse(secret);
        return { certificate, key };
    } catch (error) {
        console.error('Error retrieving MTLSCredentials:', error);
        throw error;
    }
}
}




