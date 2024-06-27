import * as tls from 'tls';
import {Logger} from "../lib/logger";

const SMTP_SERVER = 'smtp.gmail.com';
const SMTP_PORT = 465;
const USERNAME = process.env.ADMIN_EMAIL || '';
const PASSWORD = process.env.ADMIN_PASSWORD || '';

export async function send(RECIPIENT: string, message: string, SUBJECT: string) {
    const options: tls.ConnectionOptions = {
        host: SMTP_SERVER,
        port: SMTP_PORT,
        rejectUnauthorized: false,
    };

    const socket = tls.connect(options, () => {
        socket.once('data', handleServerGreeting);
        socket.once('error', handleError);
    });

    const handleServerGreeting = () => {
        socket.write('HELO localhost\r\n');
        socket.once('data', handleHelloResponse);
        socket.once('error', handleError);
    };

    const handleHelloResponse = () => {
        socket.write('AUTH LOGIN\r\n');
        socket.once('data', handleAuthLoginResponse);
        socket.once('error', handleError);
    };

    const handleAuthLoginResponse = () => {
        socket.write(`${Buffer.from(USERNAME).toString('base64')}\r\n`);
        socket.once('data', handleUsernameResponse);
        socket.once('error', handleError);
    };

    const handleUsernameResponse = () => {
        socket.write(`${Buffer.from(PASSWORD).toString('base64')}\r\n`);
        socket.once('data', handlePasswordResponse);
        socket.once('error', handleError);
    };

    const handlePasswordResponse = () => {
        socket.write(`MAIL FROM:<${USERNAME}>\r\n`);
        socket.once('data', handleMailFromResponse);
        socket.once('error', handleError);
    };

    const handleMailFromResponse = () => {
        socket.write(`RCPT TO:<${RECIPIENT}>\r\n`);
        socket.once('data', handleRcptToResponse);
        socket.once('error', handleError);
    };

    const handleRcptToResponse = () => {
        socket.write('DATA\r\n');
        socket.once('data', handleDataResponse);
        socket.once('error', handleError);
    };

    const handleDataResponse = () => {
        const emailData = `From: ${USERNAME}\r\nTo: ${RECIPIENT}\r\nSubject: ${SUBJECT}\r\n\r\n${message}\r\n.\r\n`;
        socket.write(emailData);
        socket.once('data', handleEmailSent);
        socket.once('error', handleError);
    };

    const handleEmailSent = () => {
        socket.write('QUIT\r\n');
        socket.end();
    };

    const handleError = (err: Error) => {
        console.error('Error sending email:', err);
        socket.destroy();
    };

    socket.on('end', () => {
        Logger.info(`Email sent to ${RECIPIENT}`);
        Logger.info(`Connection closed`);
    });
}