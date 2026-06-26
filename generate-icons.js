const sharp = require('sharp');

const svgBuffer192 = Buffer.from(`<svg xmlns='http://www.w3.org/2000/svg' width='192' height='192' viewBox='0 0 192 192'>
  <rect width='192' height='192' rx='38' fill='#0F6E56'/>
  <text x='50%' y='54%' font-family='Arial Black, sans-serif' font-weight='900' font-size='73' fill='#FFFFFF' text-anchor='middle' dominant-baseline='middle'>HS</text>
</svg>`);

const svgBuffer512 = Buffer.from(`<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'>
  <rect width='512' height='512' rx='102' fill='#0F6E56'/>
  <text x='50%' y='54%' font-family='Arial Black, sans-serif' font-weight='900' font-size='194' fill='#FFFFFF' text-anchor='middle' dominant-baseline='middle'>HS</text>
</svg>`);

sharp(svgBuffer192).png().toFile('icons/icon-192-v2.png', (err) => {
  if(err) console.error('192 error:', err);
  else console.log('✅ icon-192.png créé');
});

sharp(svgBuffer512).png().toFile('icons/icon-512-v2.png', (err) => {
  if(err) console.error('512 error:', err);
  else console.log('✅ icon-512.png créé');
});
