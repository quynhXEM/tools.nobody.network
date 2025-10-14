"use client";

import { usePathname } from "@/i18n/navigation";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useContext,
  useState,
  ReactNode,
  createContext,
  useEffect,
  useRef,
} from "react";
import { useTranslations } from "next-intl";
import { useAppMetadata } from "./AppMetadataContext";
import { useNotification } from "./NotificationContext";
import { ethers } from "ethers";
export type SendTxParams = {
  chainId?: number;
  to: string;
  amount: string;
  type: "coin" | "token";
  tokenAddress?: string;
};

export type WalletInfo = {
  address: string;
  chainId?: number;
  [key: string]: any;
} | null;

export type SwapParams = {
  swapData: {
    chainId: string,
    sellToken: string,
    buyToken: string,
    sellAmount: string,
    taker: string
  },
  permitData: { primaryType: any, types: any },
  tx: any
}

export type WalletContextType = {
  wallet: WalletInfo;
  isConnected: boolean;
  setWallet: (wallet: WalletInfo) => void;
  disconnect: () => void;
  connectWallet: () => void;
  sendTransaction: (params: SendTxParams) => Promise<any>;
  swapToken: (params: SwapParams) => Promise<any>;
  // balance: { ids: string; usdt: string };
  // account: {
  //   id: string;
  //   status: string;
  //   app_id: string;
  //   email: string;
  //   password: unknown;
  //   username: string;
  //   country_code: string | null;
  //   email_verified: boolean;
  //   wallet_address: string;
  //   referrer_id: string | null;
  //   avatar: string | null;
  // } | null;
  checkChainExists: (chainId: string) => Promise<boolean>;
  loading: boolean;
  // setAccount: (account: any) => void;
  // addNewMember: (wallet: WalletInfo) => Promise<void>;
  setLoading: (loading: boolean) => void;
  getChainInfo: (chainId: string | number) => any;
  switchChain: (chainId: string) => Promise<void>;
};

const UserWalletContext = createContext<WalletContextType | undefined>(
  undefined
);

export function UserWalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletInfo>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { chain } = useAppMetadata();

  const t = useTranslations("");
  // const [balance, setBalanceState] = useState<{ ids: string; usdt: string }>({
  //   ids: "0",
  //   usdt: "0",
  // });
  // const [account, setAccount] = useState<{
  //   id: string;
  //   status: string;
  //   app_id: string;
  //   email: string;
  //   password: unknown;
  //   username: string;
  //   country_code: string | null;
  //   email_verified: boolean;
  //   wallet_address: string;
  //   referrer_id: string | null;
  //   avatar: string | null;
  //   isVip: boolean;
  //   stake_history: any[];
  // } | null>(null);
  const isConnected = !!wallet;
  const { notify } = useNotification();

  useEffect(() => {
    if (!wallet) {
      const is_connect = localStorage.getItem("is_connect") || false;
      if (is_connect) {
        connectWallet();
      }
      return;
    }
    const getWalletInfo = async () => {
      // Lấy số dư coin => (fix) xóa địa chỉ token
    };
    getWalletInfo();
  }, [wallet]);

  const disconnect = () => {
    localStorage.removeItem("is_connect");
    setWallet(null);
  };

  const getChainInfo = (chainId: string | number) => {
    try {
      const chainData = chain?.find((item: any) => item?.chain_id?.id == chainId);
      return chainData;
    } catch (error) {
      console.log(error);
      
      return null;
    }

  }

  // Lỗi thêm 2 ví cùng lúc ( khôgn có ví, co người giới thiệu)
  // const addNewMember = async (wallet: WalletInfo) => {
  //   if (isCreatingMemberRef.current) return; // Ngăn gọi lặp
  //   isCreatingMemberRef.current = true;
  //   try {
  //     // Check user is exist
  //     const exist = await fetch("/api/directus/request", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         type: "readItems",
  //         collection: "member",
  //         params: {
  //           filter: {
  //             wallet_address: wallet?.address?.toLocaleLowerCase(),
  //             status: "active",
  //             app_id:
  //               process.env.NEXT_PUBLIC_APP_ID ??
  //               "db2a722c-59e2-445c-b89e-7b692307119a",
  //           },
  //         },
  //       }),
  //     })
  //       .then((data) => data.json())
  //       .then((data) => data.result[0])
  //       .catch(() => null);
  //     if (exist) {
  //       setAccount({
  //         ...exist,
  //       });
  //       return;
  //     }

  //     let ref = null;
  //     if (!path.includes("/home")) {
  //       ref = await fetch("/api/directus/request", {
  //         method: "POST",
  //         body: JSON.stringify({
  //           type: "readItems",
  //           collection: "member",
  //           params: {
  //             filter: {
  //               username: path.split("/")[1],
  //               status: "active",
  //               app_id:
  //                 process.env.NEXT_PUBLIC_APP_ID ??
  //                 "db2a722c-59e2-445c-b89e-7b692307119a",
  //             },
  //             fields: ["id"],
  //           },
  //         }),
  //       })
  //         .then((data) => data.json())
  //         .then((data) => data.result[0]?.id)
  //         .catch(() => null);
  //     }
  //     const newusser = await fetch("/api/directus/request", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         type: "createItem",
  //         collection: "member",
  //         ct_code: true,
  //         items: {
  //           status: "active",
  //           app_id:
  //             process.env.NEXT_PUBLIC_APP_ID ??
  //             "db2a722c-59e2-445c-b89e-7b692307119a",
  //           wallet_address: wallet?.address?.toLocaleLowerCase(),
  //           referrer_id: ref,
  //         },
  //         fields: ["*"],
  //       }),
  //     }).then((data) => data.json());
  //     setAccount({
  //       ...newusser.result,
  //     });
  //   } finally {
  //     isCreatingMemberRef.current = false;
  //     setLoading(false);
  //   }
  // };


  const connectWallet = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      notify({
        title: t("noti.web3Error"),
        message: t("noti.web3ErrorSub"),
        type: false,
      });
      return;
    }
    setLoading(true);
    try {
      const provider = (window as any).ethereum;
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      const chainId = await provider.request({ method: "eth_chainId" });
      // await addNewMember({
      //   address: accounts[0],
      //   chainId: parseInt(chainId, 16),
      // });
      setWallet({ address: accounts[0], chainId: parseInt(chainId, 16) });
      localStorage.setItem("is_connect", "true");
    } catch (err) {
      console.error("Kết nối ví thất bại", err);
      setWallet(null);
      setLoading(false);
    }
  };

  // Thêm hàm chờ xác nhận giao dịch
  async function waitForTransactionReceipt(
    provider: any,
    txHash: string,
    interval = 2000,
    maxTries = 60
  ) {
    let tries = 0;
    while (tries < maxTries) {
      const receipt = await provider.request({
        method: "eth_getTransactionReceipt",
        params: [txHash],
      });
      if (receipt && receipt.blockNumber) {
        return receipt.transactionHash; // Đã xác nhận
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
      tries++;
    }
    throw new Error("Giao dịch chưa được xác nhận sau thời gian chờ.");
  }

  const sendTransaction = async (params: SendTxParams) => {
    if (!wallet) return;
    const { chainId, to, amount, type, tokenAddress } = params;
    try {
      const provider = (window as any).ethereum;
      // Chuyển mạng nếu cần
      if (chainId) {
        const currentChain = await provider.request({ method: "eth_chainId" });
        if (parseInt(currentChain, 16) != chainId) {
          try {
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [
                {
                  chainId: "0x" + Number(chainId).toString(16),
                },
              ],
            });
          } catch (switchError: any) {
            if (
              switchError.code === 4902 &&
              getChainInfo(chainId)
            ) {
              // Nếu chưa có mạng, thêm mạng vào MetaMask
              await provider.request({
                method: "wallet_addEthereumChain",
                params: [
                  getChainInfo(chainId)
                ],
              });
              // Sau khi thêm, thử lại chuyển mạng
              await provider.request({
                method: "wallet_switchEthereumChain",
                params: [
                  {
                    chainId: chainId,
                  },
                ],
              });
            } else {
              throw switchError;
            }
          }
        }
      }
      if (type === "coin") {
        // Gửi native coin
        const tx = {
          from: wallet.address,
          to,
          value: BigInt(Math.floor(Number(amount) * 1e18)).toString(16),
        };
        const txHash = await provider.request({
          method: "eth_sendTransaction",
          params: [tx],
        });
        // Chờ xác nhận giao dịch
        const receipt = await waitForTransactionReceipt(provider, txHash);
        return receipt;
      } else if (type === "token" && tokenAddress) {
        // Lấy số decimal thực tế của token
        const decimalsData = "0x313ce567"; // keccak256("decimals()").slice(0,10)
        const decimals = await provider.request({
          method: "eth_call",
          params: [
            {
              to: tokenAddress,
              data: decimalsData,
            },
            "latest",
          ],
        });

        const decimalsNum = parseInt(decimals, 16);
        const amountNumber = Number(amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
          throw new Error("Số lượng không hợp lệ");
        }
        if (isNaN(decimalsNum)) {
          throw new Error("Không lấy được số thập phân của token");
        }
        // Chuẩn bị data cho hàm transfer(address,uint256)
        const methodId = "0xa9059cbb"; // keccak256("transfer(address,uint256)").slice(0,10)
        const toPadded = to.replace("0x", "").padStart(64, "0");
        const amountBN = BigInt(Math.floor(amountNumber * 10 ** decimalsNum));
        const amountHex = amountBN.toString(16).padStart(64, "0");
        const data = methodId + toPadded + amountHex;
        const tx = {
          from: wallet.address,
          to: tokenAddress,
          data,
        };
        const txHash = await provider.request({
          method: "eth_sendTransaction",
          params: [tx],
        });
        // Chờ xác nhận giao dịch
        const receipt = await waitForTransactionReceipt(provider, txHash);
        return receipt;
      } else {
        // throw new Error("Thiếu thông tin gửi token hoặc type không hợp lệ");
      }
    } catch (err) {
      throw err;
    }
  };

  const swapToken = async (params: SwapParams) => {
    if (!wallet) return;
    try {
      const { swapData, permitData, tx } = params
      await switchChain(swapData.chainId as string)
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      await signer.getAddress();

      const { primaryType, types } = permitData;

      const cleanTypes = {
        [primaryType]: types[primaryType],
        TokenPermissions: types.TokenPermissions,
      };
      await signer.signTypedData(
        permitData.domain,
        cleanTypes,
        permitData.message
      );

      // Gửi transaction swap
      const receipt = await signer.sendTransaction({
        to: tx.to,
        data: tx.data,
        value: tx.value ?? 0,
        gasLimit: tx.gas,
        gasPrice: tx.gasPrice
      });

      await receipt.wait();
    } catch (error) {

    }
  }

  const checkChainExists = async (chainId: string): Promise<boolean> => {
    if (typeof window === "undefined" || !(window as any).ethereum)
      return false;
    const provider = (window as any).ethereum;
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
      return true; // Nếu switch thành công, chain đã tồn tại
    } catch (error: any) {
      if (error.code === 4902) {
        return false;
      }
      throw error; // Lỗi khác thì throw ra ngoài
    }
  };

  const switchChain = async (chainId: string) => {
    if (!wallet) return;
    const provider = (window as any).ethereum;
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + Number(chainId).toString(16) }],
    });
  }

  return (
    <UserWalletContext.Provider
      value={{
        wallet,
        isConnected,
        setWallet,
        disconnect,
        connectWallet,
        sendTransaction,
        swapToken,
        // balance,
        // account,
        checkChainExists,
        loading,
        // setAccount,
        // addNewMember,
        setLoading,
        getChainInfo,
        switchChain
      }}
    >
      {children}
    </UserWalletContext.Provider>
  );
}

export function useUserWallet() {
  const context = useContext(UserWalletContext);
  if (!context) {
    throw new Error("useUserWallet must be used within a UserWalletProvider");
  }
  return context;
}
