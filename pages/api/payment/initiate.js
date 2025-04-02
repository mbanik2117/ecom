import axios from 'axios';
import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { amount, mobile } = req.body;

    try {
        const paymentRequest = {
            merchantId: 'PGTESTPAYUAT',
            merchantTransactionId: `MT7850590068188104`,
            merchantUserId: 'MUID123',
            amount: amount, // in paise
            redirectUrl: 'https://shopstrider.com/Order',
            redirectMode: 'REDIRECT',
            callbackUrl: 'https://shopstrider.com/api/payment/callback',
            mobileNumber: mobile,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };

        const apiEndpoint = '/pg/v1/pay';
        const saltKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399'; // Replace with your actual salt key
        const checksum = generateChecksum(paymentRequest, apiEndpoint, saltKey);

        const response = await axios.post(`https://api-preprod.phonepe.com/apis/pg-sandbox${apiEndpoint}`, paymentRequest, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/plain',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': 'PGTESTPAYUAT'
            }
        });

        const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;
        res.status(200).json({ redirectUrl });
    } catch (error) {
        console.error('Payment initiation failed:', error.response?.data || error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

function generateChecksum(requestBody, apiEndpoint, saltKey) {
    const base64EncodedPayload = Buffer.from(JSON.stringify(requestBody)).toString('base64');
    const concatenatedString = base64EncodedPayload + apiEndpoint + saltKey;
    const hash = crypto.createHash('sha256').update(concatenatedString).digest('hex');
    return `${hash}###1`;
}
