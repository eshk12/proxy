const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio'); // npm install cheerio
const app = express();

app.get('/proxy', async (req, res) => {
    const externalUrl = 'https://www.video-cdn.com/embed/iframe/7a6ef9419ab1850868d09ad6046ef6d5/4f0dea5893b9f7992392e42faa35cfee/?type=mp4';

    try {
        // Fetch the iframe content with additional headers
        const response = await axios.get(externalUrl, {
            headers: {
                'Referer': 'https://karaoke.co.il/',
                'Origin': 'https://karaoke.co.il/',
                'User-Agent': req.headers['user-agent'], // Use the same User-Agent as the client
                // Add other headers if necessary
            }
        });
        const html = response.data;

        // Load the HTML content into Cheerio for manipulation
        const $ = cheerio.load(html);

        // Add <base> tag to <head>
        $('head').prepend('<base href="https://www.video-cdn.com/">');

        // Serve the modified HTML content
        res.send($.html());
    } catch (error) {
        console.error('Error fetching external content:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
            console.error('Data:', error.response.data);
        }
        res.status(500).send('Error fetching external content');
    }
});

app.listen(3000, () => {
    console.log('Proxy server is running on http://localhost:3000');
});
