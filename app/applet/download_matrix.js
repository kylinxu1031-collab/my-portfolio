import fs from 'fs';

async function download() {
  const images = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1633398939762-cbcae91c53d1?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?q=80&w=1600&auto=format&fit=crop'
  ];
  
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }

  for (let i = 0; i < images.length; i++) {
    console.log(`Downloading ${i+1}...`);
    const res = await fetch(images[i]);
    const arrayBuffer = await res.arrayBuffer();
    fs.writeFileSync(`public/matrix-${i+1}.webp`, Buffer.from(arrayBuffer));
  }
  console.log('All done!');
}
download();
