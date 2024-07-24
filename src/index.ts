import { Command } from "commander";
import {
  Keypair,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import fs from "fs/promises";

const program = new Command();

program
  .name("solana-keypair-generator")
  .description("CLI to generate and save Solana keypairs, and airdrop SOL")
  .version("1.0.0");

program
  .command("generate")
  .description("Generate a new Solana keypair and save it as JSON")
  .option("-o, --output <filename>", "output file name", "keypair.json")
  .action(async (options) => {
    const keypair = new Keypair();
    const secret = keypair.secretKey;

    const keypairJson = {
      publicKey: keypair.publicKey.toBase58(),
      secretKey: Array.from(secret),
    };

    const jsonString = JSON.stringify(keypairJson, null, 2);

    try {
      await fs.writeFile(options.output, jsonString);
      console.log(`Keypair saved to ${options.output}`);
    } catch (err) {
      console.error("Error writing file:", err);
    }
  });

program
  .command("airdrop")
  .description("Airdrop SOL to the public key stored in a JSON file")
  .option(
    "-f, --file <filename>",
    "JSON file containing the keypair",
    "keypair.json"
  )
  .option("-a, --amount <amount>", "Amount of SOL to airdrop", "1")
  .action(async (options) => {
    try {
      const fileContent = await fs.readFile(options.file, "utf-8");
      const keypairJson = JSON.parse(fileContent);

      if (!keypairJson.publicKey) {
        throw new Error("Invalid JSON file format. Public key not found.");
      }

      const publicKey = new PublicKey(keypairJson.publicKey);
      const connection = new Connection("https://api.devnet.solana.com");

      const amountLamports = parseFloat(options.amount) * 1e9;

      console.log(
        `Requesting airdrop of ${
          options.amount
        } SOL to ${publicKey.toBase58()}...`
      );

      const txhash = await connection.requestAirdrop(publicKey, amountLamports);

      console.log(`Airdrop successful. Transaction hash: ${txhash}`);
    } catch (err) {
      console.error("Error:", err);
    }
  });

program
  .command("balance")
  .description("Check the balance of the keypair stored in a JSON file")
  .option(
    "-f, --file <filename>",
    "JSON file containing the keypair",
    "keypair.json"
  )
  .action(async (options) => {
    try {
      const fileContent = await fs.readFile(options.file, "utf-8");
      const keypairJson = JSON.parse(fileContent);

      if (!keypairJson.publicKey) {
        throw new Error("Invalid JSON file format. Public key not found.");
      }

      const publicKey = new PublicKey(keypairJson.publicKey);
      const connection = new Connection("https://api.devnet.solana.com");

      const balance = await connection.getBalance(publicKey);
      console.log(`Balance for ${publicKey.toBase58()}: ${balance / 1e9} SOL`);
    } catch (err) {
      console.error("Error:", err);
    }
  });

program
  .command("transfer")
  .description(
    "Transfer SOL from the keypair in the JSON file to another public key"
  )
  .option(
    "-f, --file <filename>",
    "JSON file containing the sender's keypair",
    "keypair.json"
  )
  .requiredOption("-r, --recipient <publicKey>", "Recipient's public key")
  .requiredOption("-a, --amount <amount>", "Amount of SOL to transfer")
  .action(async (options) => {
    try {
      const fileContent = await fs.readFile(options.file, "utf-8");
      const keypairJson = JSON.parse(fileContent);

      if (!keypairJson.publicKey || !keypairJson.secretKey) {
        throw new Error(
          "Invalid JSON file format. Public key or secret key not found."
        );
      }

      const senderKeypair = Keypair.fromSecretKey(
        new Uint8Array(keypairJson.secretKey)
      );

      const connection = new Connection("https://api.devnet.solana.com");
      const recipientPublicKey = new PublicKey(options.recipient);

      const balance = await connection.getBalance(senderKeypair.publicKey);
      const amountLamports = parseFloat(options.amount) * 1e9;

      if (balance < amountLamports) {
        throw new Error(
          `Insufficient balance. Current balance: ${
            balance / 1e9
          } SOL, Attempted transfer: ${options.amount} SOL`
        );
      }

      const transferInstruction = SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: recipientPublicKey,
        lamports: amountLamports,
      });

      const transaction = new Transaction().add(transferInstruction);

      console.log(
        `Transferring ${
          options.amount
        } SOL from ${senderKeypair.publicKey.toBase58()} to ${recipientPublicKey.toBase58()}...`
      );
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [senderKeypair]
      );

      console.log(`Transfer successful. Transaction signature: ${signature}`);
    } catch (err) {
      console.error("Error:", err);
    }
  });

program.parse(process.argv);
