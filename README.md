# Solana Wallet CLI
A command-line interface for managing Solana wallets, built with Bun.

## Features
- Generate new Solana keypairs and save them as JSON
- Airdrop SOL to a wallet (on devnet)
- Check wallet balance
- Transfer SOL between wallets

## Installation
Ensure you have Bun (https://bun.sh/) installed on your system.

Clone the repository and install dependencies:
git clone https://github.com/yourusername/solana-wallet-cli.git
cd solana-wallet-cli
bun install

## Usage
Run the CLI using:
bun run start [command] [options]

### Create an Alias (Recommended)
To make using the CLI easier, create an alias in your shell configuration file (e.g., .bashrc, .zshrc):

alias soylana="bun run start"

After adding the alias, reload your shell configuration or restart your terminal. Now you can use 'soylana' instead of 'bun run start' for all commands.

### Available Commands
1. Generate a new keypair
   soylana generate -o <output-file>

2. Airdrop SOL (devnet)
   soylana airdrop -f <keypair-file> -a <amount>

3. Check wallet balance
   soylana balance -f <keypair-file>

4. Transfer SOL
   soylana transfer -f <sender-keypair-file> -r <recipient-public-key> -a <amount>

### Options
- -V, --version: Output the version number
- -h, --help: Display help for command

## Examples
Generate a new keypair:
`soylana generate -o my-wallet.json`

Airdrop 1 SOL:
`soylana airdrop -f my-wallet.json -a 1`

Check balance:
`soylana balance -f my-wallet.json`

Transfer 0.5 SOL:
`soylana transfer -f my-wallet.json -r 9izkL55ivV51yZovUiyMmZv8gr6Yd4uZ4QCfNLHPeVeu -a 0.5`

<img width="836" alt="soylana" src="https://github.com/user-attachments/assets/3cdf2f9e-31da-4fc6-b593-e21f6bfe14ca">
