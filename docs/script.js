// Fetch user balance
async function fetchBalance() {
    try {
        const publicKey = document.getElementById("senderNumber").value;
        if (!publicKey) {
            document.querySelector('.balance').innerText = 'Balance: $0';
            return;
        }

        const response = await fetch(`http://127.0.0.1:5000/balance/${publicKey}`);
        const data = await response.json();

        if (response.ok) {
            document.querySelector('.balance').innerText = `Balance: ${data.balance} Coins`;
        } else {
            document.querySelector('.balance').innerText = 'Balance: $0 (Error)';
        }
    } catch (error) {
        console.error("Error fetching balance:", error);
        document.querySelector('.balance').innerText = 'Balance: $0 (Error)';
    }
}

// Call balance fetch when page loads
document.addEventListener("DOMContentLoaded", fetchBalance);

// Toggle menu
function toggleMenu() {
    const menu = document.getElementById('menu');
    const overlay = document.getElementById('overlay');
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
}
document.getElementById('overlay').addEventListener('click', toggleMenu);

// Login system
async function loginUser() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        alert("Please enter username and password.");
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("publicKey", data.publicKey); // Store public key
            alert("Login successful!");
            window.location.href = "main.html"; // Redirect to main page
        } else {
            alert(`Login failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login.");
    }
}

// Sign-up function
async function signUpUser() {
    const username = document.getElementById('signUpUsername').value;
    const password = document.getElementById('signUpPassword').value;

    if (!username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Sign-up successful! Your public key is:\n${data.publicKey}\nPlease log in.`);
            toggleForm(); // Switch to login form
        } else {
            alert(`Sign-up failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Sign-up error:", error);
        alert("An error occurred during sign-up.");
    }
}

// Toggle between login and sign-up forms
function toggleForm() {
    document.getElementById('loginForm').classList.toggle('hidden');
    document.getElementById('signUpForm').classList.toggle('hidden');
}

// Generate public and private keys (for new users)
function generateKeys() {
    let publicKey = "0000";
    let privateKey = "0000";

    for (let i = 0; i < 31; i++) {
        publicKey += Math.floor(Math.random() * 10);
        privateKey += Math.floor(Math.random() * 10);
    }

    document.getElementById("randomNumber1").innerText = publicKey;
    document.getElementById("randomNumber2").innerText = privateKey;

    document.getElementById("publicKeyLabel").style.display = "block";
    document.getElementById("privateKeyLabel").style.display = "block";
    document.getElementById("Continue").style.display = "block";

    document.getElementById("randomNumber1").classList.add("show");
    document.getElementById("randomNumber2").classList.add("show");

    document.getElementById("generateBtn").disabled = true;
}

// Transfer funds
async function transferFunds() {
    const senderNumber = document.getElementById('senderNumber').value;
    const receiverNumber = document.getElementById('receiverNumber').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const transactionPin = document.getElementById('pin').value;
    const moneyFlow = document.getElementById('moneyFlow');

    if (!senderNumber || !receiverNumber || isNaN(amount) || !transactionPin) {
        alert("Please fill in all fields with valid numbers.");
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/transfer', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({
                sender: senderNumber,
                receiver: receiverNumber,
                amount: amount,
                pin: transactionPin
            })
        });

        const data = await response.json();

        if (response.ok) {
            document.querySelector('.balance').innerText = `Balance: ${data.new_balance} Coins`;
            moneyFlow.innerHTML = `<span style="color: green;">Transaction Successful!</span>`;
            alert(`Transfer successful!\nTransaction ID: ${data.transactionId}`);
        } else {
            moneyFlow.innerHTML = `<span style="color: red;">Transaction Failed: ${data.message}</span>`;
            alert(`Transaction failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while processing the transaction.");
    }
}

// Fetch all transactions (for ledger feature)
async function fetchTransactions() {
    try {
        const response = await fetch("http://127.0.0.1:5000/transactions");
        const data = await response.json();

        if (response.ok) {
            const transactionList = document.getElementById("transactionList");
            transactionList.innerHTML = "";

            data.transactions.forEach(tx => {
                const item = document.createElement("li");
                item.innerText = `From: ${tx.sender} → To: ${tx.receiver} | Amount: ${tx.amount} | TxID: ${tx.txid}`;
                transactionList.appendChild(item);
            });
        } else {
            console.error("Error fetching transactions:", data.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }

// Fetch transactions on page load
document.addEventListener("DOMContentLoaded", fetchTransactions);


    // Coin animation
    coin.style.display = 'block';
    coin.style.animation = 'none';
    void coin.offsetWidth;
    coin.style.animation = 'transferCoin 2s forwards';

    // SVG animation
    moneyFlow.style.display = 'block';
    moneyFlow.style.strokeDasharray = '0,200';
    void moneyFlow.offsetWidth;
    moneyFlow.style.animation = 'none'
    moneyFlow.style.animation = 'dash 2s linear forwards'

    const styleSheet = document.createElement("style")
    styleSheet.innerHTML = `@keyframes dash { to { stroke-dashoffset: 1000; } }`
    document.head.appendChild(styleSheet)

    setTimeout(() => {
        coin.style.display = 'none';
        styleSheet.remove();
        moneyFlow.style.animation = 'none';

        balance -= amount;
        document.querySelector('.balance').innerText = 'Balance: $' + balance;

        alert(`Transfer successful!\nFrom: ${senderNumber}\nTo: ${receiverNumber}\nAmount: $${amount}`);

    }, 2000);
}

// Cursor light effect
document.addEventListener("mousemove", (event) => {
    const cursorLight = document.getElementById("cursorLight");
    cursorLight.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
});