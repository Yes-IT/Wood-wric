// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

// Nunjucks-like template function
function renderTemplate(templatePath, data) {
    const template = fs.readFileSync(templatePath, 'utf-8');
    return template.replace(/\{\{(\s*[\w.]+\s*)\}\}/g, (_, key) => {
        const keys = key.split('.');
        return keys.reduce((acc, curr) => acc && acc[curr], data) || '';
    });
}

// Function to fetch social media data from an API
function fetchSocialMediaLinks(callback) {
    http.get('https://staging.caviarlifestylesadmin.com/api/social_links', (res) => { // Replace with your API URL
        let data = '';
        
        // Collect data
        res.on('data', chunk => {
            data += chunk;
        });

        // On end of response
        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                callback(null, jsonData); // Call the callback with the data
            } catch (error) {
                callback(error); // Handle JSON parse error
            }
        });
    }).on('error', (err) => {
        callback(err); // Handle request error
    });
}

// Function to handle server requests
function requestHandler(req, res) {
    fetchSocialMediaLinks((err, socialMediaLinks) => {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Error fetching data');
            return;
        }

        const footerData = {
            footer: {
                title: 'Stay Connected',
                url: '/contact',
                btnLabel: 'Contact Us',
            },
            socialMedia: socialMediaLinks,
            facebook: 'https://facebook.com',
            instagram: 'https://instagram.com',
            linkedin: 'https://linkedin.com',
            youtube: 'https://youtube.com',
            x: 'https://x.com',
            tiktok: 'https://tiktok.com',
        };

        // Render the footer template
        const footerHtml = renderTemplate(path.join(__dirname, 'layouts', 'partials/footer.njk'), footerData);
        
        // Send the response
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(footerHtml);
    });
}

// Create the server
const server = http.createServer(requestHandler);

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
