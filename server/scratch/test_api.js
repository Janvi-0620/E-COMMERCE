import axios from 'axios';

async function test() {
  try {
    const res = await axios.get('http://localhost:5000/api/v1/products');
    console.log('Status:', res.status);
    console.log('Body:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
    if (err.response) {
      console.error('Response:', err.response.data);
    }
  }
}

test();
