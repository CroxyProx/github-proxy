const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve the frontend
app.use(express.static('public'));

// Proxy Middleware
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

// Create proxy middleware
app.use('/proxy', createProxyMiddleware({
    target: 'http://localhost',
    changeOrigin: true,
    router: (req) => `${req.targetUrl.protocol}//${req.targetUrl.host}`,
    pathRewrite: (path, req) => req.targetUrl.pathname + req.targetUrl.search
}));

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Proxy & Frontend running at http://localhost:${PORT}`);
});
