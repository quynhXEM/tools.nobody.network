import { BrowserProvider, ethers, JsonRpcProvider } from "ethers";
import { roundDownDecimal } from "./utils";

// Hàm chuyển coin (ETH, BNB, MATIC, ...)
export async function sendCoin({
  amount,
  rpc,
  privateKey,
  to,
  chain_id,
}: {
  amount: string | number;
  rpc: string;
  privateKey: string;
  to: string;
  chain_id: number;
}) {
  const provider = new JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(privateKey, provider);

  // Lấy nonce hiện tại của wallet
  const nonce = await provider.getTransactionCount(wallet.address, "pending");

  // Ước tính gas limit
  const gasEstimate = await provider.estimateGas({
    from: wallet.address,
    to,
    value: ethers.parseEther(amount.toString()),
  });

  const txPromise = wallet.sendTransaction({
    to,
    value: ethers.parseEther(amount.toString()),
    chainId: chain_id,
    nonce: nonce,
    gasLimit: gasEstimate,
  });
  return await waitForTransactionSuccess(txPromise, provider);
}

// Hàm chuyển token ERC20
export async function sendToken({
  amount,
  rpc,
  token_address,
  privateKey,
  to,
  chain_id,
}: {
  amount: string | number;
  rpc: string;
  token_address: string;
  privateKey: string;
  to: string;
  chain_id: number;
}) {
  const provider = new ethers.JsonRpcProvider(rpc, chain_id);
  const wallet = new ethers.Wallet(privateKey, provider);
  const erc20Abi = [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function decimals() view returns (uint8)",
  ];
  const token = new ethers.Contract(token_address, erc20Abi, wallet);
  const decimals = await token.decimals();
  const amountParsed = ethers.parseUnits(amount.toString(), decimals);

  // Lấy nonce hiện tại của wallet
  const nonce = await provider.getTransactionCount(wallet.address, "pending");

  // Ước tính gas limit cho giao dịch transfer token
  const gasEstimate = await token.transfer.estimateGas(to, amountParsed);

  const txPromise = token.transfer(to, amountParsed, {
    nonce: nonce,
    gasLimit: gasEstimate,
  });
  return await waitForTransactionSuccess(txPromise, provider);
}

// Hàm chờ xác nhận giao dịch thành công
export async function waitForTransactionSuccess(
  txPromise: Promise<any>,
  provider?: any
) {
  try {
    const tx = await txPromise;
    // Nếu đã có provider thì dùng provider đó, nếu không thì lấy từ tx
    const usedProvider = provider || tx?.provider;
    if (!usedProvider)
      throw new Error("Không tìm thấy provider để xác nhận giao dịch");
    const receipt = await usedProvider.waitForTransaction(tx.hash, 1, 60000); // timeout 60s
    if (receipt && receipt.status === 1) {
      return receipt.hash;
    } else {
      throw new Error("Transaction failed or rejected on blockchain");
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    throw new Error("Transaction failed: " + errorMsg);
  }
}

export const getBalance = async ({
  address,
  chainId,
  tokenAddress,
  rpc,
}: {
  address: string;
  chainId?: number;
  tokenAddress?: string;
  rpc?: string;
}): Promise<string> => {
  try {
    // Ưu tiên lấy rpc từ tham số, nếu không có thì lấy từ metadata
    const rpcUrl = rpc;
    const provider = new BrowserProvider((window as any).ethereum);

    if (!tokenAddress) {
      // Lấy số dư coin
      const balanceBigInt = await provider.getBalance(address);
      return roundDownDecimal(Number(balanceBigInt) / 1e18).toString();
    } else {
      // Lấy số dư token ERC20
      const erc20Abi = [
        "function balanceOf(address) view returns (uint256)",
        "function decimals() view returns (uint8)",
      ];
      const token = new ethers.Contract(tokenAddress, erc20Abi, provider);
      const [balance, decimals] = await Promise.all([
        token.balanceOf(address),
        token.decimals(),
      ]);
      return roundDownDecimal(
        Number(balance) / Math.pow(10, Number(decimals))
      ).toString();
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log(error);
    }
    return "0";
  }
};

export const getDecimals = async ({
  tokenAddress,
  rpc,
  chainId,
}: {
  tokenAddress: string;
  rpc: string;
  chainId?: number;
}) => {
  try {
    const provider = new ethers.JsonRpcProvider(rpc, chainId);
    const erc20Abi = ["function decimals() view returns (uint8)"];
    const token = new ethers.Contract(tokenAddress, erc20Abi, provider);
    const decimals = await token.decimals();
    return Number(decimals);
  } catch (e) {
    return 18;
  }
};

export const checkTokenIsValid = async ({
  tokenAddress,
  rpc,
  chainId,
}: {
  tokenAddress: string;
  rpc: string;
  chainId: number;
}) => {
  try {
    const provider = new ethers.JsonRpcProvider(rpc, chainId);
    const erc20Abi = ["function symbol() view returns (string)"];
    const token = new ethers.Contract(tokenAddress, erc20Abi, provider);
    const symbol = await token.symbol();
    return symbol;
  } catch (e) {
    return false;
  }
};

export const sendMutiWallet = async ({
  rpc,
  privateKey,
  tokenAddress,
  chain_id,
  type,
  walletlist,
}: {
  chain_id: string;
  tokenAddress?: string;
  rpc: string;
  type: "coin" | "token";
  privateKey: string;
  walletlist: {
    address: string;
    amount: string | number;
  }[];
}) => {
  const provider = new ethers.JsonRpcProvider(rpc, parseInt(chain_id));
  const wallet = new ethers.Wallet(privateKey, provider);

  // Lấy nonce ban đầu
  const startNonce = await provider.getTransactionCount(
    wallet.address,
    "pending"
  );

  if (type === "coin") {
    // Tạo các Promise cho giao dịch coin song song
    const coinPromises = walletlist.map(async (walletItem, index) => {
      try {
        // Ước tính gas limit cho giao dịch coin
        const gasEstimate = await provider.estimateGas({
          from: wallet.address,
          to: walletItem.address,
          value: ethers.parseEther(walletItem.amount.toString()),
        });

        const tx = await wallet.sendTransaction({
          to: walletItem.address,
          value: ethers.parseEther(walletItem.amount.toString()),
          chainId: parseInt(chain_id),
          nonce: startNonce + index,
          gasLimit: gasEstimate,
        });

        return {
          success: true,
          hash: tx.hash,
          address: walletItem.address,
          amount: walletItem.amount,
        };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return {
          success: false,
          error: `Lỗi gửi coin đến ${walletItem.address}: ${errorMsg}`,
          address: walletItem.address,
          amount: walletItem.amount,
        };
      }
    });

    // Thực hiện tất cả giao dịch coin song song
    const results = await Promise.allSettled(coinPromises);

    const transactionHashes: string[] = [];
    const errors: string[] = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        if (result.value.success) {
          transactionHashes.push(result.value.hash!);
        } else {
          errors.push(result.value.error!);
        }
      } else {
        errors.push(`Lỗi giao dịch ${index + 1}: ${result.reason}`);
      }
    });

    return {
      success: transactionHashes.length > 0,
      transactionHashes,
      errors,
      totalTransactions: walletlist.length,
      successfulTransactions: transactionHashes.length,
      failedTransactions: errors.length,
    };
  } else if (type === "token" && tokenAddress) {
    // Tạo contract token
    const erc20Abi = [
      "function transfer(address to, uint256 amount) public returns (bool)",
      "function decimals() view returns (uint8)",
    ];
    const token = new ethers.Contract(tokenAddress, erc20Abi, wallet);
    const decimals = await token.decimals();

    // Tạo các Promise cho giao dịch token song song
    const tokenPromises = walletlist.map(async (walletItem, index) => {
      try {
        const amountParsed = ethers.parseUnits(
          walletItem.amount.toString(),
          decimals
        );

        // Ước tính gas limit cho giao dịch token
        const gasEstimate = await token.transfer.estimateGas(
          walletItem.address,
          amountParsed
        );

        const tx = await token.transfer(walletItem.address, amountParsed, {
          nonce: startNonce + index,
          gasLimit: gasEstimate,
        });

        return {
          success: true,
          hash: tx.hash,
          address: walletItem.address,
          amount: walletItem.amount,
        };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return {
          success: false,
          error: `Lỗi gửi token đến ${walletItem.address}: ${errorMsg}`,
          address: walletItem.address,
          amount: walletItem.amount,
        };
      }
    });

    // Thực hiện tất cả giao dịch token song song
    const results = await Promise.allSettled(tokenPromises);

    const transactionHashes: string[] = [];
    const errors: string[] = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        if (result.value.success) {
          transactionHashes.push(result.value.hash!);
        } else {
          errors.push(result.value.error!);
        }
      } else {
        errors.push(`Lỗi giao dịch ${index + 1}: ${result.reason}`);
      }
    });

    return {
      success: transactionHashes.length > 0,
      transactionHashes,
      errors,
      totalTransactions: walletlist.length,
      successfulTransactions: transactionHashes.length,
      failedTransactions: errors.length,
    };
  }

  return {
    success: false,
    transactionHashes: [],
    errors: ["Loại giao dịch không hợp lệ"],
    totalTransactions: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
  };
};

export const genarateWallet = async ({
  number,
  seed,
}: {
  number: number;
  seed?: string;
}) => {
  try {
    if (!number || number <= 0) throw new Error("Số lượng ví phải > 0");

    // Lấy mnemonic: nếu có seed hợp lệ thì dùng, không thì tạo mới
    const phrase =
      seed && seed.trim().split(" ").length >= 12
        ? seed.trim()
        : (ethers.Wallet.createRandom().mnemonic?.phrase as string);

    if (!phrase) throw new Error("Không thể khởi tạo mnemonic");

    const basePath = "m/44'/60'/0'/0"; // BIP44 chuẩn EVM

    const wallets = Array.from({ length: number }).map((_, index) => {
      const path = `${basePath}/${index}`;
      const child = ethers.HDNodeWallet.fromPhrase(phrase, undefined, path);
      return {
        index,
        path,
        address: child.address,
        privateKey: child.privateKey,
      };
    });

    return {
      mnemonic: phrase,
      wallets,
    };
  } catch (error) {
    return false;
  }
};

export const estimateGasFee = async ({
  rpc,
  chain_id,
  type,
  walletlist,
  privateKey,
  tokenAddress,
}: {
  rpc: string;
  chain_id: number | string;
  type: "coin" | "token";
  walletlist: {
    address: string;
    amount: string | number;
  }[];
  privateKey: string;
  tokenAddress?: string;
}) => {
  try {
    // Chuyển chain_id thành number nếu là string
    const numericChainId =
      typeof chain_id === "string" ? parseInt(chain_id) : chain_id;
    const provider = new ethers.JsonRpcProvider(rpc);
    const wallet = new ethers.Wallet(privateKey, provider);

    // Fallback gas limit mặc định nếu ước lượng thất bại hoặc ví không có đủ coin/token
    const defaultGasLimitCoin = ethers.toBigInt(21000);
    const defaultGasLimitToken = ethers.toBigInt(65000); // thường 50k-80k cho ERC20 transfer

    let gasLimit: bigint = type === "coin" ? defaultGasLimitCoin : defaultGasLimitToken;

    if (type === "coin") {
      try {
        const estimated = await provider.estimateGas({
          from: wallet.address,
          to: walletlist[0].address,
          value: ethers.parseEther(walletlist[0].amount.toString()),
          chainId: numericChainId,
        });
        gasLimit = estimated ?? defaultGasLimitCoin;
      } catch {
        // giữ fallback defaultGasLimitCoin
      }
    } else if (type === "token" && tokenAddress) {
      const abi = [
        "function transfer(address to, uint256 amount) public returns (bool)",
        "function decimals() view returns (uint8)",
      ];
      const token = new ethers.Contract(tokenAddress, abi, wallet);
      let decimals = 18;
      try {
        const tokenDecimals = await token.decimals();
        decimals = Number(tokenDecimals) || 18;
      } catch {
        // fallback 18 nếu không đọc được decimals
      }
      const amountParsed = ethers.parseUnits(
        walletlist[0].amount.toString(),
        decimals
      );

      try {
        const estimated = await token.transfer.estimateGas(
          walletlist[0].address,
          amountParsed,
          { chainId: numericChainId }
        );
        gasLimit = estimated ?? defaultGasLimitToken;
      } catch {
        // giữ fallback defaultGasLimitToken khi ví không có token hoặc ước lượng thất bại
      }
    } else {
      // Trường hợp type không hợp lệ, trả về thông tin mặc định
      gasLimit = defaultGasLimitCoin;
    }

    // 🔹 Lấy giá gas hiện tại (gasPrice hoặc EIP-1559 data)
    const feeData = await provider.getFeeData();

    // Ưu tiên dùng maxFeePerGas nếu có, fallback về gasPrice
    const gasPrice = feeData.maxFeePerGas ?? feeData.gasPrice;
    if (!gasPrice) throw new Error("Cannot fetch gas price");

    // 🔹 Tính tổng phí (wei)
    const totalFeeWei = gasLimit * gasPrice;

    // 🔹 Quy đổi ra native coin (ETH, BNB, MATIC,...)
    const totalFeeNative = ethers.formatEther(totalFeeWei);

    return {
      gasLimit: gasLimit.toString(),
      gasPrice: ethers.formatUnits(gasPrice, "gwei") + " gwei",
      totalFeeWei: totalFeeWei.toString(),
      totalFeeNative, // Ví dụ: 0.00063 BNB
    };
  } catch (error: any) {
    console.error(error);
    return error?.message;
  }
};

export const removeBigInt: any = (value: any) => {
  if (typeof value === "bigint") {
    // Chuyển BigInt sang string để an toàn (vì có thể quá lớn với Number)
    return value.toString() + "n";
    // Nếu chắc chắn nhỏ, có thể dùng Number(value)
    // return Number(value);
  } else if (Array.isArray(value)) {
    return value.map(removeBigInt);
  } else if (value !== null && typeof value === "object") {
    const res: any = {};
    for (const key in value) {
      if (Object.hasOwnProperty.call(value, key)) {
        res[key] = removeBigInt(value[key]);
      }
    }
    return res;
  } else {
    return value; // string, number, boolean, null, undefined
  }
};
