const bcrypt = require('bcrypt');

async function testPassword() {
  const password = 'admin@123';
  const hash = '$2b$10$qkLs0.rewh.AesQjvd0Gbe4snV8R2r.LHGYU1eIpxoSrbE7VnLN.q';
  
  console.log('Testing password:', password);
  console.log('Against hash:', hash);
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('Password valid:', isValid);
}

testPassword().catch(console.error);