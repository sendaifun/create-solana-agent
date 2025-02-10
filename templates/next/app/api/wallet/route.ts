import { NextRequest, NextResponse } from "next/server";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

// get the wallet address from the user
export async function GET(req: NextRequest) {
    const keypair = Keypair.fromSecretKey(
        bs58.decode(process.env.SOLANA_PRIVATE_KEY!)
    );
    const walletAddress = keypair.publicKey.toBase58();
    let wallets = [
        {
            name: "Default Agent Wallet",
            subTxt: walletAddress.slice(0, 4) + "..." + walletAddress.slice(-4)
        }
    ]
    return NextResponse.json({ wallets });
}