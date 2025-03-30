const API_BASE_URL = "https://your-api.com"; // Change this to your actual backend API URL

// Function to fetch user balance
async function fetchBalance(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/balance?user=${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch balance");
        }

        const data = await response.json();
        return data.balance;
    } catch (error) {
        console.error("Error fetching balance:", error);
        return null;
    }
}

// Function to log in user
async function loginUser(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userId", data.userId); // Store user ID
            return { success: true, message: "Login successful!" };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "An error occurred during login." };
    }
}

// Function to sign up a new user
async function signUpUser(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, message: "Sign-up successful! Please log in." };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error("Sign-up error:", error);
        return { success: false, message: "An error occurred during sign-up." };
    }
}

// Function to transfer funds
async function transferFunds(sender, receiver, amount, coin, transactionPin) {
    try {
        const response = await fetch(`${API_BASE_URL}/transfer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({
                sender,
                receiver,
                amount,
                coin,
                pin: transactionPin
            })
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, transactionId: data.transactionId, message: "Transfer successful!" };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error("Transaction error:", error);
        return { success: false, message: "An error occurred while processing the transaction." };
    }
}

// Function to generate public and private keys
function generateKeys() {
    let publicKey = "0000";
    let privateKey = "0000";

    for (let i = 0; i < 31; i++) {
        publicKey += Math.floor(Math.random() * 10);
        privateKey += Math.floor(Math.random() * 10);
    }

    return { publicKey, privateKey };
}

// Export functions (for use in other JavaScript files)
export { fetchBalance, loginUser, signUpUser, transferFunds, generateKeys };

