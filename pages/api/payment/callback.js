import crypto from 'crypto';

export default async function handler(req, res) {
    const receivedChecksum = req.headers['x-verify'];
    const responseBody = req.body;
    const apiEndpoint = '/pg/v1/status';
    const saltKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399'; // Replace with your actual salt key

    const calculatedChecksum = generateChecksum(responseBody, apiEndpoint, saltKey);

    if (receivedChecksum === calculatedChecksum) {
        // Process payment status
        // Update order status in your database
        res.status(200).send('Callback received and verified');
    } else {
        res.status(400).send('Invalid checksum');
    }
}

function generateChecksum(responseBody, apiEndpoint, saltKey) {
    const base64EncodedPayload = Buffer.from(JSON.stringify(responseBody)).toString('base64');
    const concatenatedString = base64EncodedPayload + apiEndpoint + saltKey;
    const hash = crypto.createHash('sha256').update(concatenatedString).digest('hex');
    return `${hash}###1`;
}
