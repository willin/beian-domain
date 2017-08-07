const request = require('request');
const cheerio = require('cheerio');
const gbk = require('gbk');

request({
  url: 'http://www.miibeian.gov.cn/basecode/query/queryDomain.action',
  method: 'POST',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3175.4 Safari/537.36'
  },
  form: {
    domainName: '',
    domainBlur: 0,
    domainType: 0,
    'page.pageSize': 1000,
    pageNo: 1,
    jumpPageNo: ''
  },
  encoding: null
}, (err, httpResponse, body) => {
  const $ = cheerio.load(gbk.toString('utf-8', body));
  const domains = [];

  $('tr[id]').each((i, ele) => {
    domains.push($(ele).children('td').eq(3).text().trim());
  });
  console.log('-------');
  console.log('total domains:', domains.length);
  const arr = [...new Set(domains)];
  console.log('unique domains:', arr.length);
  console.log('-------');
  console.log(arr.sort().join('\n'));
  process.exit();
});
