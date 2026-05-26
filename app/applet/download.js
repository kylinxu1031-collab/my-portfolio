import fs from 'fs';

async function download() {
  try {
    const cdnUrl = 'https://img.cdn1.vip/i/69e4f663105bc_1776612963.webp';
    console.log('Fetching CDN URL...');
    let res = await fetch(cdnUrl, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://img.cdn1.vip/'
      } 
    });

    if (!res.ok) {
      console.log('CDN failed, trying Gitee fallback...');
      const giteeUrl = 'https://gitee.com/kylinxux/my-portfolio/raw/master/pic/k1-1.jpg';
      res = await fetch(giteeUrl, {
        headers: { 
          'User-Agent': 'Mozilla/5.0'
        }
      });
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch images. Status: ${res.status}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public', { recursive: true });
    }
    
    fs.writeFileSync('public/hero-bg.webp', buffer);
    console.log('Image successfully downloaded to public/hero-bg.webp');
  } catch (error) {
    console.error('Download error:', error);
  }
}

download();
