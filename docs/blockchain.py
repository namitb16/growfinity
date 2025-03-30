import hashlib
import json
from time import time


class Blockchain:
    def __init__(self):
        self.chain = []
        self.pending_transactions = []
        self.all_transactions = []  # Stores all transactions (ledger)
        self.users = {}  # Store user balances
        self.create_block(proof=100, previous_hash="1")  # Genesis block

    def create_user(self, public_key, pin):
        """Register a user with a hashed PIN and give initial balance."""
        if public_key in self.users:
            return "User already exists."
        self.users[public_key] = {
            "pin": hashlib.sha256(pin.encode()).hexdigest(),
            "balance": 100  # Default starting balance
        }
        return "User created successfully."

    def verify_pin(self, public_key, pin):
        """Check if the PIN is correct."""
        if public_key not in self.users:
            return False
        return self.users[public_key]["pin"] == hashlib.sha256(pin.encode()).hexdigest()

    def create_block(self, proof, previous_hash):
        """Create a new block and add it to the chain."""
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time(),
            'transactions': self.pending_transactions,
            'proof': proof,
            'previous_hash': previous_hash,
        }
        self.pending_transactions = []  # Clear pending transactions after adding to block
        self.chain.append(block)
        return block

    def add_transaction(self, sender, receiver, amount):
        """Add a new transaction if users exist and sender has sufficient balance."""
        if sender not in self.users:
            return "Sender does not exist."
        if receiver not in self.users:
            return "Receiver does not exist."
        if self.users[sender]["balance"] < amount:
            return "Insufficient balance."

        # Deduct and credit balance
        self.users[sender]["balance"] -= amount
        self.users[receiver]["balance"] += amount

        transaction = {
            'sender': sender,
            'receiver': receiver,
            'amount': amount,
            'timestamp': time()
        }
        self.pending_transactions.append(transaction)  # Add to current block
        self.all_transactions.append(transaction)  # Store in full ledger

        return self.last_block['index'] + 1  # Return index of next block

    def proof_of_work(self, previous_proof):
        """Simple Proof of Work algorithm to validate a new block."""
        new_proof = 1
        while not self.valid_proof(previous_proof, new_proof):
            new_proof += 1
        return new_proof

    def valid_proof(self, previous_proof, new_proof):
        """Check if proof is valid (simple hash condition)."""
        guess = f'{previous_proof}{new_proof}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:4] == "0000"  # Condition: Hash must start with "0000"
    
    def get_balance(self, public_key):
        """Check the balance of a user."""
        if public_key not in self.users:
            return "User not found."
        return self.users[public_key]["balance"]

    def get_transactions(self):
        """Return all transactions as a public ledger."""
        return self.all_transactions

    @property
    def last_block(self):
        """Returns the last block in the chain."""
        return self.chain[-1]


# Testing the blockchain
if __name__ == "__main__":
    blockchain = Blockchain()

    # Create test users
    blockchain.create_user("Alice", "1234")
    blockchain.create_user("Bob", "5678")

    # Alice sends 50 to Bob
    blockchain.add_transaction("Alice", "Bob", 50)

    # Mining a new block
    proof = blockchain.proof_of_work(blockchain.last_block['proof'])
    blockchain.create_block(proof, blockchain.last_block['previous_hash'])

    print(json.dumps(blockchain.chain, indent=4))
    print("Ledger:", json.dumps(blockchain.get_transactions(), indent=4))

    print("Current Chain:", blockchain.chain)
    print("Pending Transactions:", blockchain.pending_transactions)
    print("All Transactions:", blockchain.all_transactions) 
