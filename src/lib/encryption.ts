import { Buffer } from 'buffer';

export async function encryptPassword(password: string, publicKeyBase64: string): Promise<string> {
    try {
        console.log('Starting encryption process...');
        console.log('Password length:', password.length);
        console.log('Public key length:', publicKeyBase64.length);
        console.log('Public key (first 50 chars):', publicKeyBase64.substring(0, 50));
        
        // Convert base64 public key to a format that the Web Crypto API can use
        const publicKeyDer = Buffer.from(publicKeyBase64, 'base64');
        console.log('Public key DER length:', publicKeyDer.length);
        
        const publicKey = await window.crypto.subtle.importKey(
            'spki',
            publicKeyDer,
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256',
            },
            false,
            ['encrypt']
        );
        console.log('Public key imported successfully');

        // Encrypt the password
        const encodedPassword = new TextEncoder().encode(password);
        console.log('Encoded password length:', encodedPassword.length);
        
        const encryptedPassword = await window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP'
            },
            publicKey,
            encodedPassword
        );
        console.log('Password encrypted successfully, length:', encryptedPassword.byteLength);

        // Convert the encrypted password to base64
        const result = Buffer.from(encryptedPassword).toString('base64');
        console.log('Final encrypted password length:', result.length);
        console.log('Final encrypted password (first 50 chars):', result.substring(0, 50));
        
        return result;
    } catch (error) {
        console.error('Encryption failed:', error);
        throw error;
    }
} 