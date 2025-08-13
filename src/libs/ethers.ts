import { ethers } from "ethers";

type DecodeTransactionParams = {
  txHex: string;
};

type DecodedParameter = {
  name: string;
  type: string;
  value: string;
};

type DecodedMethod = {
  methodName: string;
  methodId: string;
  parameters: DecodedParameter[];
};

type GasInfo = {
  gasLimit: string;
  maxFeePerGas?: string | null;
  maxPriorityFeePerGas?: string | null;
  gasPrice?: string | null;
  baseFeePerGas?: string | null;
  effectiveGasPrice?: string | null;
  gasUsed?: string | null;
  feeWei?: string | null;
  feeNative?: string | null;
};

type DecodedTransactionResult = {
  transactionType: string;
  gasInfo: GasInfo;
  decodedData: Record<string, unknown> & { decoded?: DecodedMethod };
};

function formatGwei(value: bigint | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  try {
    return `${ethers.formatUnits(value, "gwei")} gwei`;
  } catch {
    return null;
  }
}

function formatEther(value: bigint | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  try {
    return ethers.formatEther(value);
  } catch {
    return null;
  }
}

function minBigInt(a: bigint, b: bigint): bigint {
  return a < b ? a : b;
}

function toJsonSafe(value: any): any {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map((v) => toJsonSafe(v));
  if (value && typeof value === "object") {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = toJsonSafe(v);
    }
    return out;
  }
  return value;
}

export const decodeTransaction = async ({ txHex }: DecodeTransactionParams) => {
  if (!txHex) {
    throw new Error("Missing required params: txHex");
  }
  const tx = ethers.Transaction.from(txHex);
  if (!tx) {
    throw new Error("Transaction not found");
  }

  return tx
};
