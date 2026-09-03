async function test() {
  try {
    const res = await fetch('https://fintrack-backend-zubt.onrender.com/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'income',
        amount: '541.44',
        category: 'Food',
        description: 'Test post',
        date: '2026-09-03'
      })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}
test();
