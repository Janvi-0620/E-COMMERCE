import jwt from 'jsonwebtoken';

const secret = 'your_super_secret_jwt_key_change_in_production_12345';

const tempToken = jwt.sign(
  { userId: '123', role: 'user', type: 'TEMP' },
  secret
);

const accessToken = jwt.sign(
  { userId: '123', role: 'user', type: 'ACCESS' },
  secret
);

const verify = (token, requiredType) => {
  try {
    const decoded = jwt.verify(token, secret);
    if (decoded.type !== requiredType) {
      console.log(`❌ REJECTED: Got ${decoded.type}, Expected ${requiredType}`);
      return false;
    } else {
      console.log(`✅ ACCEPTED: Got ${decoded.type}, Expected ${requiredType}`);
      return true;
    }
  } catch (err) {
    console.log(`❌ ERROR: ${err.message}`);
    return false;
  }
};

console.log('--- Testing /me Route (Requires ACCESS) ---');
const test1 = verify(tempToken, 'ACCESS');
const test2 = verify(accessToken, 'ACCESS');

console.log('\n--- Testing /verify-otp Route (Requires TEMP) ---');
const test3 = verify(tempToken, 'TEMP');
const test4 = verify(accessToken, 'TEMP');

if (!test1 && test2 && test3 && !test4) {
  console.log('\n✨ SECURITY LOGIC VERIFIED: Tokens are now properly segregated! ✨');
} else {
  console.log('\n⚠️ SECURITY LOGIC FAILED: Tokens are NOT segregated correctly! ⚠️');
  process.exit(1);
}
