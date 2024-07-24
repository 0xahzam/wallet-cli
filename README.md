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

### Available Commands

1. Generate a new keypair
   bun run start generate -o <output-file>

2. Airdrop SOL (devnet)
   bun run start airdrop -f <keypair-file> -a <amount>

3. Check wallet balance
   bun run start balance -f <keypair-file>

4. Transfer SOL
   bun run start transfer -f <sender-keypair-file> -r <recipient-public-key> -a <amount>

### Options

- -V, --version: Output the version number
- -h, --help: Display help for command

## Examples

Generate a new keypair:
bun run start generate -o my-wallet.json

Airdrop 1 SOL:
bun run start airdrop -f my-wallet.json -a 1

Check balance:
bun run start balance -f my-wallet.json

Transfer 0.5 SOL:
bun run start transfer -f my-wallet.json -r 9izkL55ivV51yZovUiyMmZv8gr6Yd4uZ4QCfNLHPeVeu -a 0.5
