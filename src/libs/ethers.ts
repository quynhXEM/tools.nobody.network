import { ethers } from "ethers";

type DecodeTransactionParams = {
  txHash: string;
  rpcUrl: string;
  chainId?: number;
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

export const decodeTransaction = async ({
  txHash,
  rpcUrl,
  chainId,
}: DecodeTransactionParams): Promise<DecodedTransactionResult> => {
  if (!txHash || !rpcUrl) {
    throw new Error("Missing required params: txHash, rpcUrl");
  }

  // Không truyền chainId vào constructor để tránh lỗi "unknown network" với các chain tuỳ biến (ví dụ 97 - BSC Testnet)
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const tx = await provider.getTransaction(txHash);
  if (!tx) {
    throw new Error("Transaction not found");
  }

  // Nếu caller cung cấp chainId, đối chiếu với chainId từ RPC
  // tx.chainId là bigint trong ethers v6; chuyển về number để so sánh an toàn
  if (typeof chainId === "number" && chainId > 0 && Number(tx.chainId) !== chainId) {
    throw new Error(`ChainId mismatch: expected ${chainId}, got ${tx.chainId}`);
  }

  const isSimpleTransfer = !tx.data || tx.data === "0x" || tx.data === "0x0";

  // Fetch receipt and block for computed fields
  const [receipt, block] = await Promise.all([
    provider.getTransactionReceipt(txHash),
    tx.blockNumber ? provider.getBlock(tx.blockNumber) : Promise.resolve(null),
  ]);
  

  let decoded: DecodedMethod | undefined = undefined;
  let transactionType = isSimpleTransfer ? "Native Transfer" : "Contract Interaction";

  // Basic ERC-20 function detection and decoding
  if (!isSimpleTransfer && typeof tx.data === "string" && tx.data.length >= 10) {
    const methodId = tx.data.slice(0, 10).toLowerCase();

    const ERC20_ABI = [
      "function transfer(address to, uint256 amount)",
      "function approve(address spender, uint256 amount)",
      "function transferFrom(address from, address to, uint256 amount)",
    ];

    const iface = new ethers.Interface(ERC20_ABI);

    const knownSelectors: Record<string, { name: string; fragment: string; paramNames: string[]; paramTypes: string[] }> = {
      // ERC-20
      "0xa9059cbb": { name: "transfer", fragment: "transfer(address,uint256)", paramNames: ["to", "amount"], paramTypes: ["address", "uint256"] },
      "0x095ea7b3": { name: "approve", fragment: "approve(address,uint256)", paramNames: ["spender", "amount"], paramTypes: ["address", "uint256"] },
      "0x23b872dd": { name: "transferFrom", fragment: "transferFrom(address,address,uint256)", paramNames: ["from", "to", "amount"], paramTypes: ["address", "address", "uint256"] },
    };

    const match = knownSelectors[methodId];

    if (match) {
      try {
        const decodedArgs = iface.decodeFunctionData(match.fragment, tx.data);
        const parameters: DecodedParameter[] = match.paramNames.map((name, idx) => {
          const type = match.paramTypes[idx];
          const raw = decodedArgs[idx];
          let valueStr: string;
          if (type === "uint256" || type === "uint128" || type === "uint64" || type === "uint32") {
            valueStr = raw?.toString?.() ?? String(raw);
          } else if (type === "address") {
            valueStr = String(raw);
          } else {
            valueStr = String(raw);
          }
          return { name, type, value: valueStr };
        });

        decoded = {
          methodName: match.name,
          methodId,
          parameters,
        };

        // Refine transaction type for common ERC-20 ops
        if (match.name === "transfer") transactionType = "ERC-20 Transfer";
        if (match.name === "approve") transactionType = "ERC-20 Approve";
        if (match.name === "transferFrom") transactionType = "ERC-20 TransferFrom";
      } catch {
        // keep as generic contract interaction
      }
    }
  }

  const typeNameMap: Record<number, string> = {
    0: "legacy",
    1: "eip-2930",
    2: "eip-1559",
    3: "eip-4844",
    4: "eip-7702",
  };

  const decodedData: Record<string, unknown> & { decoded?: DecodedMethod } = {
    hash: tx.hash,
    type: tx.type,
    typeName: typeNameMap[Number(tx.type)] ?? "unknown",
    chainId: Number(tx.chainId),
    nonce: tx.nonce,
    blockNumber: tx.blockNumber ?? null,
    from: tx.from,
    to: tx.to ?? null,
    value: tx.value ? formatEther(tx.value) : null,
    data: tx.data,
    accessList: (tx as any).accessList ?? [],
    authorizationList: (tx as any).authorizationList ?? null,
    blobVersionedHashes: (tx as any).blobVersionedHashes ?? null,
    maxFeePerBlobGas: formatGwei((tx as any).maxFeePerBlobGas ?? null),
    gasLimit: tx.gasLimit ? tx.gasLimit.toString() : null,
    gasPrice: formatGwei(tx.gasPrice ?? null),
    maxFeePerGas: formatGwei((tx as any).maxFeePerGas ?? null),
    maxPriorityFeePerGas: formatGwei((tx as any).maxPriorityFeePerGas ?? null),
    serialized: (tx as any).raw ?? null,
    unsignedHash: (tx as any).unsignedHash ?? null,
    signature: {
      r: (tx as any).r ?? (tx as any).signature?.r ?? null,
      s: (tx as any).s ?? (tx as any).signature?.s ?? null,
      yParity: ((): number | null => {
        const yp = (tx as any).yParity ?? (tx as any).signature?.yParity;
        return yp == null ? null : Number(yp);
      })(),
      v: ((): number | null => {
        const vv = (tx as any).v ?? (tx as any).signature?.v;
        return vv == null ? null : Number(vv);
      })(),
    },
    v: ((): number | null => {
      const vv = (tx as any).v;
      return vv == null ? null : Number(vv);
    })(),
    r: (tx as any).r ?? null,
    s: (tx as any).s ?? null,
    kzg: null,
    status: receipt?.status ?? null,
    contractAddress: receipt?.contractAddress ?? null,
  };

  if (decoded) {
    decodedData.decoded = decoded;
  }

  // Compute gas related values
  const baseFeePerGas: bigint | null = (block as any)?.baseFeePerGas ?? null;
  let effectiveGasPriceBigInt: bigint | null = null;
  if ((receipt as any)?.effectiveGasPrice != null) {
    effectiveGasPriceBigInt = (receipt as any).effectiveGasPrice as bigint;
  } else {
    const maxFee = (tx as any).maxFeePerGas as bigint | undefined;
    const maxPriority = (tx as any).maxPriorityFeePerGas as bigint | undefined;
    if (maxFee != null && maxPriority != null && baseFeePerGas != null) {
      effectiveGasPriceBigInt = minBigInt(maxFee, baseFeePerGas + maxPriority);
    } else if (tx.gasPrice != null) {
      effectiveGasPriceBigInt = tx.gasPrice as bigint;
    }
  }

  const gasUsedBigInt: bigint | null = (receipt as any)?.gasUsed ?? null;
  const totalFeeWei: bigint | null = gasUsedBigInt != null && effectiveGasPriceBigInt != null
    ? gasUsedBigInt * effectiveGasPriceBigInt
    : null;

  const gasInfo: GasInfo = {
    gasLimit: tx.gasLimit ? tx.gasLimit.toString() : "",
    maxFeePerGas: formatGwei((tx as any).maxFeePerGas ?? null),
    maxPriorityFeePerGas: formatGwei((tx as any).maxPriorityFeePerGas ?? null),
    gasPrice: formatGwei(tx.gasPrice ?? null),
    baseFeePerGas: formatGwei(baseFeePerGas),
    effectiveGasPrice: formatGwei(effectiveGasPriceBigInt ?? null),
    gasUsed: gasUsedBigInt != null ? gasUsedBigInt.toString() : null,
    feeWei: totalFeeWei != null ? totalFeeWei.toString() : null,
    feeNative: totalFeeWei != null ? ethers.formatEther(totalFeeWei) : null,
  };

  // If ERC-20 interaction, try getting token metadata and normalized amounts
  if (decoded && tx.to) {
    try {
      const erc20MetaIface = new ethers.Interface([
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)",
        "function name() view returns (string)",
      ]);
      const contract = new ethers.Contract(tx.to, erc20MetaIface, provider);
      const [decimals, symbol, name] = await Promise.all([
        contract.decimals().catch(() => null),
        contract.symbol().catch(() => null),
        contract.name().catch(() => null),
      ]);

      (decodedData as any).tokenInfo = {
        address: tx.to,
        decimals: decimals ?? null,
        symbol: symbol ?? null,
        name: name ?? null,
      };

      const amountParam = decoded.parameters.find(p => p.name === "amount" && p.type.startsWith("uint"));
      if (amountParam) {
        const raw = amountParam.value;
        if (decimals != null && !isNaN(Number(decimals))) {
          try {
            const formatted = ethers.formatUnits(BigInt(raw), Number(decimals));
            (decodedData as any).tokenInfo.formattedAmount = formatted;
          } catch {}
        }
      }
    } catch {
      // ignore token metadata failures
    }
  }

  const result = {
    transactionType,
    gasInfo,
    decodedData,
  };

  // Đảm bảo không còn BigInt trong kết quả trả về
  return toJsonSafe(result);
};

type EvmNetworkCandidate = { chainId: number; name: string; rpcUrl: string };

export const DEFAULT_EVM_NETWORKS: EvmNetworkCandidate[] = [
  { chainId: 1, name: "Ethereum Mainnet", rpcUrl: "https://ethereum-rpc.publicnode.com" },
  { chainId: 56, name: "BNB Smart Chain", rpcUrl: "https://bsc-dataseed.binance.org" },
  { chainId: 137, name: "Polygon", rpcUrl: "https://polygon-rpc.com" },
  { chainId: 42161, name: "Arbitrum One", rpcUrl: "https://arb1.arbitrum.io/rpc" },
  { chainId: 10, name: "Optimism", rpcUrl: "https://mainnet.optimism.io" },
  { chainId: 8453, name: "Base", rpcUrl: "https://base-rpc.publicnode.com" },
  { chainId: 43114, name: "Avalanche C-Chain", rpcUrl: "https://api.avax.network/ext/bc/C/rpc" },
  { chainId: 250, name: "Fantom", rpcUrl: "https://rpc.ftm.tools" },
  { chainId: 59144, name: "Linea", rpcUrl: "https://rpc.linea.build" },
  { chainId: 534352, name: "Scroll", rpcUrl: "https://rpc.scroll.io" },
  { chainId: 97, name: "BSC Testnet", rpcUrl: "https://bsc-testnet-rpc.publicnode.com" },
  { chainId: 11155111, name: "Sepolia", rpcUrl: "https://sepolia-rpc.publicnode.com" },
  { chainId: 80002, name: "Polygon Amoy", rpcUrl: "https://rpc-amoy.polygon.technology" },
  { chainId: 84532, name: "Base Sepolia", rpcUrl: "https://base-sepolia-rpc.publicnode.com" },
  { chainId: 421614, name: "Arbitrum Sepolia", rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc" },
  { chainId: 11155420, name: "OP Sepolia", rpcUrl: "https://sepolia.optimism.io" },
];

export const autoDecodeTransaction = async (
  txHash: string,
  candidates: EvmNetworkCandidate[] = DEFAULT_EVM_NETWORKS
): Promise<DecodedTransactionResult & { detected: EvmNetworkCandidate } > => {
  for (const candidate of candidates) {
    try {
      const result = await decodeTransaction({ txHash, rpcUrl: candidate.rpcUrl, chainId: candidate.chainId });
      return { ...result, detected: candidate };
    } catch {
      // continue
    }
  }
  throw new Error("Transaction not found on known EVM networks");
};
