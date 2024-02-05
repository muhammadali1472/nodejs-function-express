const express = require('express');
const https = require('https');
const querystring = require('querystring');
const app = express();
const port = process.env.PORT || 8080; // Updated to use Heroku's port or 8080 as fallback

// Enable JSON body parsing middleware
app.use(express.json());

const requestCheckoutId = async () => {
    const path = '/v1/checkouts';
    const data = querystring.stringify({
        'entityId': '8a8294174d0595bb014d05d829cb01cd',
        'amount': '92.00',
        'currency': 'EUR',
        'paymentType': 'DB'
    });
    const options = {
        port: 443,
        host: 'eu-test.oppwa.com',
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length,
            'Authorization': 'Bearer OGE4Mjk0MTc0ZDA1OTViYjAxNGQwNWQ4MjllNzAxZDF8OVRuSlBjMm45aA=='
        }
    };
    return new Promise((resolve, reject) => {
        const postRequest = https.request(options, function (res) {
            const buf = [];
            res.on('data', chunk => {
                buf.push(Buffer.from(chunk));
            });
            res.on('end', () => {
                const jsonString = Buffer.concat(buf).toString('utf8');
                try {
                    resolve(JSON.parse(jsonString));
                } catch (error) {
                    reject(error);
                }
            });
        });
        postRequest.on('error', reject);
        postRequest.write(data);
        postRequest.end();
    });
};

// Define the /getCheckoutId endpoint
app.post('/getCheckoutId', async (req, res) => {
    try {
        const checkoutIdResponse = await requestCheckoutId();
        res.json(checkoutIdResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Add a new route for the root URL
app.get('/', (req, res) => {
    res.send('The app is running!');
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
