const bcrypt = require('bcrypt');

async function createAdminPassword() {
  const password = 'admin@123';
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log('Password:', password);
  console.log('Hashed:', hashedPassword);
}

createAdminPassword().catch(console.error);