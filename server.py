from flask import Flask, jsonify, request
from blockchain import Blockchain
from flask_cors import CORS

# Initialize Flask app and blockchain
app = Flask(__name__)
blockchain = Blockchain()


@app.route('/signup', methods=['POST'])
def signup():
    """Register a new user with a public key and PIN."""
    data = request.get_json()
    public_key = data.get("public_key")
    pin = data.get("pin")

    if not public_key or not pin:
        return jsonify({"message": "Public key and PIN are required."}), 400

    result = blockchain.create_user(public_key, pin)
    return jsonify({"message": result})


@app.route('/login', methods=['POST'])
def login():
    """Verify user PIN during login."""
    data = request.get_json()
    public_key = data.get("public_key")
    pin = data.get("pin")

    if not public_key or not pin:
        return jsonify({"message": "Public key and PIN are required."}), 400

    if blockchain.verify_pin(public_key, pin):
        return jsonify({"message": "Login successful!"})
    return jsonify({"message": "Invalid credentials."}), 401


@app.route('/balance/<public_key>', methods=['GET'])
def get_balance(public_key):
    """Return the balance of a specific user."""
    balance = blockchain.get_balance(public_key)
    return jsonify({"balance": balance})


@app.route('/transactions/new', methods=['POST'])
def new_transaction():
    """Create a new transaction between users."""
    data = request.get_json()
    sender = data.get("sender")
    receiver = data.get("receiver")
    amount = data.get("amount")

    if not sender or not receiver or not amount:
        return jsonify({"message": "Missing transaction details."}), 400

    result = blockchain.add_transaction(sender, receiver, amount)
    if isinstance(result, str):  # Error message case
        return jsonify({"message": result}), 400
    return jsonify({"message": "Transaction added.", "block_index": result})


@app.route('/mine', methods=['GET'])
def mine_block():
    """Mine a new block (Proof of Work)."""
    last_block = blockchain.last_block
    proof = blockchain.proof_of_work(last_block['proof'])
    previous_hash = hashlib.sha256(json.dumps(last_block, sort_keys=True).encode()).hexdigest()
    block = blockchain.create_block(proof, previous_hash)

    response = {
        "message": "New block mined!",
        "block": block
    }
    return jsonify(response)


@app.route('/chain', methods=['GET'])
def full_chain():
    """Return the full blockchain."""
    return jsonify({"chain": blockchain.chain, "length": len(blockchain.chain)})


@app.route('/ledger', methods=['GET'])
def ledger():
    """Return all transactions ever made."""
    return jsonify({"transactions": blockchain.get_transactions()})


# Run Flask server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
