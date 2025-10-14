import { BrowserProvider, ethers } from "ethers";
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
  const provider = new ethers.JsonRpcProvider(rpc, chain_id);
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
