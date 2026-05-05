async function test() {
    try {
        const authReq = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'testuser' + Date.now(),
                email: 'test' + Date.now() + '@test.com',
                password: 'password123',
                confirmPassword: 'password123',
                phoneNumber: '1234567890'
            })
        });
        const authData = await authReq.json();
        const token = authData.token;
        console.log("Logged in");

        const resReq = await fetch('http://localhost:5000/api/payment-accounts', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                type: 'bank',
                accountName: 'My Bank',
                bankName: 'Chase',
                accountNumber: '1234567890'
            })
        });
        const resData = await resReq.json();
        console.log("Response:", resData);
    } catch(err) {
        console.error("Error:", err.message);
    }
}
test();
