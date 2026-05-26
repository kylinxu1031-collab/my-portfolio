const https = require('https');
https.get('https://img.cdn1.vip/i/69e4f663105bc_1776612963.webp', (res) => {
  console.log(res.statusCode);
  console.log(res.headers);
});
