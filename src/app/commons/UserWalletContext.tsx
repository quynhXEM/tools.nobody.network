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
import { roundDownDecimal } from "@/libs/utils";
import { useNotification } from "./NotificationContext";
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

export type WalletContextType = {
  wallet: WalletInfo;
  isConnected: boolean;
  setWallet: (wallet: WalletInfo) => void;
  disconnect: () => void;
  connectWallet: () => void;
  sendTransaction: (params: SendTxParams) => Promise<any>;
  getBalance: (
    address: string,
    chainId?: number,
    tokenAddress?: string
  ) => Promise<string>;
  balance: { ids: string; usdt: string };
  account: {
    id: string;
    status: string;
    app_id: string;
    email: string;
    password: unknown;
    username: string;
    country_code: string | null;
    email_verified: boolean;
    wallet_address: string;
    referrer_id: string | null;
    avatar: string | null;
  } | null;
  getVipStatus: (user_id: string) => Promise<any>;
  checkChainExists: (chainId: string) => Promise<boolean>;
  loading: boolean;
  setAccount: (account: any) => void;
  addNewMember: (wallet: WalletInfo) => Promise<void>;
  setLoading: (loading: boolean) => void;
};

const UserWalletContext = createContext<WalletContextType | undefined>(
  undefined
);

export function UserWalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletInfo>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    custom_fields: {
      usdt_payment_wallets,
      usdt_payment_wallets_testnet,
      ids_distribution_wallet,
    },
  } = useAppMetadata();
  const t = useTranslations("home");
  const [balance, setBalance] = useState<{ ids: string; usdt: string }>({
    ids: "0",
    usdt: "0",
  });
  const [account, setAccount] = useState<{
    id: string;
    status: string;
    app_id: string;
    email: string;
    password: unknown;
    username: string;
    country_code: string | null;
    email_verified: boolean;
    wallet_address: string;
    referrer_id: string | null;
    avatar: string | null;
    isVip: boolean;
    stake_history: any[];
  } | null>(null);
  const isConnected = !!wallet;
  const path = usePathname();
  const { notify } = useNotification();
  const isCreatingMemberRef = useRef(false);

  useEffect(() => {
    if (!wallet) return;
    const getWalletInfo = async () => {
      // Lấy số dư coin => (fix) xóa địa chỉ token
      await getBalance(wallet.address, ids_distribution_wallet.chain_id);
    };
    getWalletInfo();
  }, [wallet]);

  useEffect(() => {
    console.log("loading", loading);
  }, [loading]);

  const disconnect = () => setWallet(null);

  // Lỗi thêm 2 ví cùng lúc ( khôgn có ví, co người giới thiệu)
  const addNewMember = async (wallet: WalletInfo) => {
    if (isCreatingMemberRef.current) return; // Ngăn gọi lặp
    isCreatingMemberRef.current = true;
    try {
      // Check user is exist
      const exist = await fetch("/api/directus/request", {
        method: "POST",
        body: JSON.stringify({
          type: "readItems",
          collection: "member",
          params: {
            filter: {
              wallet_address: wallet?.address?.toLocaleLowerCase(),
              status: "active",
              app_id:
                process.env.NEXT_PUBLIC_APP_ID ??
                "db2a722c-59e2-445c-b89e-7b692307119a",
            },
          },
        }),
      })
        .then((data) => data.json())
        .then((data) => data.result[0])
        .catch(() => null);
      if (exist) {
        const [vipReponse, stakeHistory, f1, commission, stake] =
          await Promise.all([
            await getVipStatus(exist.id),
            await getStakeHistory(exist.id),
            await fetch("/api/user/f1", {
              method: "POST",
              body: JSON.stringify({
                id: exist.id,
              }),
            }).then((data) => data.json()),
            await fetch("/api/user/commission", {
              method: "POST",
              body: JSON.stringify({
                id: exist.id,
              }),
            }).then((data) => data.json()),
            await fetch("/api/user/stake", {
              method: "POST",
              body: JSON.stringify({
                id: exist.id,
              }),
            }).then((data) => data.json()),
          ]);

        setAccount({
          ...exist,
          f1: f1?.result || 0,
          isVip: vipReponse ? true : false,
          commission: commission?.result || {
            all: 0,
            day: 0,
            month: 0,
            withdraw: 0,
          },
          stake_history: stakeHistory,
          stake: stake?.result || {
            stake_dont_claw: 0,
            stake_dont_claw_24h: 0,
            stake_dont_claw_week: 0,
            stake_dont_claw_month: 0,
            stake_in: 0,
            stake_out: 0,
            stake_reward: 0,
          },
        });
        return;
      }

      let ref = null;
      if (!path.includes("/home")) {
        ref = await fetch("/api/directus/request", {
          method: "POST",
          body: JSON.stringify({
            type: "readItems",
            collection: "member",
            params: {
              filter: {
                username: path.split("/")[1],
                status: "active",
                app_id:
                  process.env.NEXT_PUBLIC_APP_ID ??
                  "db2a722c-59e2-445c-b89e-7b692307119a",
              },
              fields: ["id"],
            },
          }),
        })
          .then((data) => data.json())
          .then((data) => data.result[0]?.id)
          .catch(() => null);
      }
      const newusser = await fetch("/api/directus/request", {
        method: "POST",
        body: JSON.stringify({
          type: "createItem",
          collection: "member",
          ct_code: true,
          items: {
            status: "active",
            app_id:
              process.env.NEXT_PUBLIC_APP_ID ??
              "db2a722c-59e2-445c-b89e-7b692307119a",
            wallet_address: wallet?.address?.toLocaleLowerCase(),
            referrer_id: ref,
          },
          fields: ["*"],
        }),
      }).then((data) => data.json());
      setAccount({
        ...newusser.result,
        f1: 0,
        isVip: false,
        commission: {
          all: 0,
          day: 0,
          month: 0,
          withdraw: 0,
        },
        stake_history: [],
        stake: {
          stake_dont_claw: 0,
          stake_dont_claw_24h: 0,
          stake_dont_claw_week: 0,
          stake_dont_claw_month: 0,
          stake_in: 0,
          stake_out: 0,
          stake_reward: 0,
        },
      });
    } finally {
      isCreatingMemberRef.current = false;
      setLoading(false);
    }
  };

  const getVipStatus = async (user_id: string) => {
    const response = await fetch("/api/directus/request", {
      method: "POST",
      body: JSON.stringify({
        type: "readItems",
        collection: "txn",
        params: {
          filter: {
            member_id: user_id,
            app_id: process.env.NEXT_PUBLIC_APP_ID,
            type: "vip_upgrade",
            status: "completed",
          },
          limit: 1,
          fields: ["id", "date_created"],
        },
      }),
    })
      .then((data) => data.json())
      .then((data) => (data.ok ? data.result[0] : null))
      .catch((err) => {
        return null;
      });

    return response;
  };

  const getStakeHistory = async (user_id: string) => {
    const response = await fetch("/api/directus/request", {
      method: "POST",
      body: JSON.stringify({
        type: "readItems",
        collection: "txn",
        params: {
          filter: {
            member_id: user_id,
            app_id: process.env.NEXT_PUBLIC_APP_ID,
            type: "stake_in",
            status: "completed",
          },
          sort: "date_created",
          limit: 1000,
          fields: ["id", "date_created", "amount", "type", "member_id", "stake_apy", "stake_lock_days", "description", "children.id"],
        },
      }),
    })
      .then((data) => data.json())
      .then((data) => (data.ok ? data.result : null))
      .catch((err) => {
        return null;
      });

      console.log(response);
      

    return response;
  };

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
      await addNewMember({
        address: accounts[0],
        chainId: parseInt(chainId, 16),
      });
      setWallet({ address: accounts[0], chainId: parseInt(chainId, 16) });
      sessionStorage.setItem("idscoin_connected", "true");
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
        if (parseInt(currentChain, 16) !== chainId) {
          try {
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [
                {
                  chainId:
                    usdt_payment_wallets_testnet[
                      chainId as keyof typeof usdt_payment_wallets_testnet
                    ]?.chainId || "0x" + chainId.toString(16),
                },
              ],
            });
          } catch (switchError: any) {
            if (
              switchError.code === 4902 &&
              usdt_payment_wallets_testnet[
                chainId as keyof typeof usdt_payment_wallets_testnet
              ]
            ) {
              // Nếu chưa có mạng, thêm mạng vào MetaMask
              await provider.request({
                method: "wallet_addEthereumChain",
                params: [
                  usdt_payment_wallets_testnet[
                    chainId as keyof typeof usdt_payment_wallets_testnet
                  ],
                ],
              });
              // Sau khi thêm, thử lại chuyển mạng
              await provider.request({
                method: "wallet_switchEthereumChain",
                params: [
                  {
                    chainId:
                      usdt_payment_wallets_testnet[
                        chainId as keyof typeof usdt_payment_wallets_testnet
                      ]?.chainId,
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
  // Hàm lấy số dư coin hoặc token
  const getBalance = async (
    address: string,
    chainId?: number,
    tokenAddress?: string
  ): Promise<string> => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      throw new Error("Không tìm thấy provider");
    }
    try {
      const provider = (window as any).ethereum;

      // Chuyển chain nếu cần
      if (chainId) {
        const currentChain = await provider.request({ method: "eth_chainId" });
        if (parseInt(currentChain, 16) !== chainId) {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [
              {
                chainId:
                  usdt_payment_wallets_testnet[
                    chainId as keyof typeof usdt_payment_wallets_testnet
                  ]?.chainId || "0x" + chainId.toString(16),
              },
            ],
          });
        }
      }

      if (!tokenAddress) {
        // Lấy số dư coin
        const balanceHex = await provider.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        });
        if (!balanceHex || balanceHex === "0x") {
          setBalance((prev) => ({
            ...prev,
            ids: "0.00",
          }));
          return "0.00";
        }
        setBalance((prev) => ({
          ...prev,
          ids: roundDownDecimal(Number(BigInt(balanceHex)) / 1e18).toString(),
        }));
        return roundDownDecimal(Number(BigInt(balanceHex)) / 1e18).toString();
      } else {
        // Lấy số dư token ERC20
        const methodId = "0x70a08231"; // balanceOf(address)
        const addressPadded = address.replace("0x", "").padStart(64, "0");
        const data = methodId + addressPadded;

        const balanceHex = await provider.request({
          method: "eth_call",
          params: [
            {
              to: tokenAddress,
              data,
            },
            "latest",
          ],
        });
        if (!balanceHex || balanceHex === "0x") {
          // (fix) xóa điều kiện này giữ lại để lấy số dư coin
          setBalance((prev) => ({
            ...prev,
            usdt: "0.00",
          }));
          return "0.00";
        }
        // Lấy số thập phân của token
        const decimalsData = "0x313ce567"; // decimals()
        const decimalsHex = await provider.request({
          method: "eth_call",
          params: [
            {
              to: tokenAddress,
              data: decimalsData,
            },
            "latest",
          ],
        });
        const decimals = parseInt(decimalsHex, 16);
        // (fix) xóa điều kiện này giữ lại để lấy số dư coin
        setBalance((prev) => ({
          ...prev,
          usdt: roundDownDecimal(Number(BigInt(balanceHex)) / 10 ** decimals)
            .toString(),
        }));
        return roundDownDecimal(Number(BigInt(balanceHex)) / 10 ** decimals)
          .toString();
      }
    } catch (error) {
      if (error?.code == "4902") {
        // notify({
        //   title: t("noti.web3Error"),
        //   message: t("noti.web3ChainNotFound", {chain: usdt_payment_wallets_testnet[chainId as keyof typeof usdt_payment_wallets_testnet]?.name}),
        //   type: false,
        // });
      } else {
        notify({
          title: t("noti.web3Error"),
          message: t("noti.web3BalanceError"),
          type: false,
        });
      }
      return "0";
    }
  };

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

  return (
    <UserWalletContext.Provider
      value={{
        wallet,
        isConnected,
        setWallet,
        disconnect,
        connectWallet,
        sendTransaction,
        getBalance,
        balance,
        account,
        checkChainExists,
        getVipStatus,
        loading,
        setAccount,
        addNewMember,
        setLoading,
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
