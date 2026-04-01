const https = require('https');

https.get('https://query1.finance.yahoo.com/v8/finance/chart/TSLA?range=1mo&interval=1d', {
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'DATA:', data.substring(0, 100)));
}).on('error', err => console.error(err));
