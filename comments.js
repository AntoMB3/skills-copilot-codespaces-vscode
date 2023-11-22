// create web server
// 1. create http object
const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const comments = [];

// 2. create web server object
const server = http.createServer(function (req, res) {
    // 3.1 get url
    const url = req.url;
    // 3.2 get method
    const method = req.method;
    // 3.3 set header
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    // 3.4 set router
    if (url === '/') {
        fs.readFile('./views/index.html', function (err, data) {
            if (err) {
                return res.end('404 Not Found');
            }
            // 3.4.1 get comments
            let commentStr = '';
            comments.forEach(function (item) {
                commentStr += `
                <li>
                    <h3>${item.name}</h3>
                    <p>${item.message}</p>
                    <p>${item.dateTime}</p>
                </li>
                `;
            });
            // 3.4.2 replace comments
            data = data.toString().replace('<!-- comments -->', commentStr);
            // 3.4.3 response
            res.end(data);
        });
    } else if (url === '/post') {
        fs.readFile('./views/post.html', function (err, data) {
            if (err) {
                return res.end('404 Not Found');
            }
            res.end(data);
        });
    } else if (url.indexOf('/public/') === 0) {
        fs.readFile('.' + url, function (err, data) {
            if (err) {
                return res.end('404 Not Found');
            }
            res.end(data);
        });
    } else if (url === '/comment' && method === 'POST') {
        // 3.4.4 parse post data
        let postData = '';
        req.on('data', function (chunk) {
            postData += chunk;
        });
        req.on('end', function (err) {
            if (err) {
                return res.end('404 Not Found');
            }
        });
    }
});
