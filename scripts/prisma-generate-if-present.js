const { existsSync } = require('fs');
const { execSync } = require('child_process');

if (existsSync('prisma/schema.prisma')) {
  execSync('prisma generate', { stdio: 'inherit' });
}
