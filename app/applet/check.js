const res = await fetch('https://img.cdn1.vip/i/69e4f663105bc_1776612963.webp');
console.log('Status Code:', res.status);
console.log('Headers:', Object.fromEntries(res.headers.entries()));
