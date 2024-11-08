import { Connection } from "@solana/web3.js";
import dotenv from "dotenv";
dotenv.config();
const HELIUS_NETWORK = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;

export const connection = new Connection(HELIUS_NETWORK, "confirmed");
