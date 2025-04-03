const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Validate URL Middleware
app.use('/proxy', (req, res, next) => {
    try {
        if (!req.query.url) throw new Error('Missing "url" query parameter');
        const targetUrl = new URL(req.query.url);
        req.targetUrl = targetUrl;
        next();
    } catch (error) {
        return res.status(400).json({ error: 'Invalid URL' });
    }
});

// Proxy Middleware
app.use('/proxy', createProxyMiddleware({
    target: 'http://localhost',
    changeOrigin: true,
    router: (req) => `${req.targetUrl.protocol}//${req.targetUrl.host}`,
    pathRewrite: (path, req) => req.targetUrl.pathname + req.targetUrl.search
}));

// Home Page
app.get('/', (req, res) => {
    res.send(`<h1>GitHub Proxy Running!</h1>`);
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Proxy running at http://localhost:${PORT}`);
});
