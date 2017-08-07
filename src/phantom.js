const driver = require('node-phantom-simple');
const phantom = require('phantomjs-prebuilt');

driver.create({
  path: phantom.path
}, (err, browser) => {
  browser.createPage((err2, page) => {
    page.set('settings.userAgent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3175.4 Safari/537.36');
    page.open('http://www.miibeian.gov.cn/basecode/query/queryDomain.action', (err3, status) => {
      console.log('opened site? ', status);
      /* global nextPage,previousPage */
      let n = 0;
      const domains = [];
      const fib = () => {
        // eslint-disable-next-line
        page.evaluate(function () {
          /* eslint-disable */
          var i = 1;
          var ele;
          var result = [];
          while (ele = document.getElementById(i)) {
            result.push(ele.children[3].innerText.trim());
            i++;
          }
          return {
            data: result,
            cur: ~~previousPage.toString().split(' = ')[2].split(';')[0] + 1
          };
        }, (err4, result) => {
          /* eslint-enable */
          const { data, cur } = result;
          console.log('page %d done', cur);
          if (cur === n + 1) {
            domains.push(...data);
            n += 1;
          }
          if (data.length === 0) {
            console.log('-------');
            console.log('total domains:', domains.length);
            const arr = [...new Set(domains)];
            console.log('unique domains:', arr.length);
            console.log('-------');
            console.log(arr.sort().join('\n'));
            browser.exit();
            process.exit();
          }
        });
        setTimeout(() => {
          // eslint-disable-next-line
          page.evaluate(function () {
            nextPage();
          }, () => {
            setTimeout(fib, 3000);
          });
        }, 3000);
      };
      fib();
    });
  });
});

