const request = require('request');
const cheerio = require('cheerio');
const gbk = require('gbk');

const getDefer = () => {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};

module.exports = () => {
  const deferred = getDefer();

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
    if (err) {
      deferred.reject(err);
    }

    const $ = cheerio.load(gbk.toString('utf-8', body));
    const domains = [];
    $('tr[id]').each((i, ele) => {
      domains.push($(ele).children('td').eq(3).text().trim());
    });

    const arr = [...new Set(domains)];
    deferred.resolve({
      total: domains.length,
      unique: arr.length,
      domains: arr.sort()
    });
  });
  return deferred.promise;
};
