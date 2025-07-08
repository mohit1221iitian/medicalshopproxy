import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
// Increase the limit for JSON payloads
app.use(express.json({ limit: '50mb' }));
// Increase the limit for URL-encoded payloads
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = process.env.PORT || 3000;

// The single endpoint to proxy all requests to Google Apps Script
app.all('/proxy', async (req, res) => {
    const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbyr4vwtcSsOPWEFceYWiihHMN6V3J5jPk5BnJeJt_zyysgd8MC_dBh4yw1SZRKi5Vug/exec';
    try {
        const requestOptions = {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // Only include a body for methods that typically have one
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            requestOptions.body = JSON.stringify(req.body);
        }

        const response = await fetch(googleScriptUrl, requestOptions);
        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error('Error proxying request:', error);
        res.status(500).json({ status: 'error', message: 'Failed to proxy request to Google Sheets API.', details: error.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
