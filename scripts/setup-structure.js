const fs = require('fs');
const path = require('path');

const folders = [
  'src',
  'src/config',
  'src/controllers',
  'src/middleware',
  'src/models',
  'src/routes',
  'src/services',
  'src/utils',
  'tests',
  'src/database',
  'src/database/migrations',
  'src/database/seeders'
];

folders.forEach((folder) => {
  const fullPath = path.join(__dirname, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

console.log('Estrutura base criada com sucesso.');
