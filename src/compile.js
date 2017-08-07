const ba = require('./');
const fs = require('fs');
const path = require('path');

(async () => {
  const result = await ba();
  const template = fs.readFileSync(path.join(__dirname, '../.template.md'), 'utf8');
  const md = template.replace('{{DATE}}', new Date().toLocaleDateString())
    .replace('{{TOTAL}}', result.total)
    .replace('{{UNIQUE}}', result.unique)
    .replace('{{DOMAINS}}', `- ${result.domains.join('\n- ')}`);
  fs.writeFileSync(path.join(__dirname, '../README.md'), md, 'utf8');
})();
