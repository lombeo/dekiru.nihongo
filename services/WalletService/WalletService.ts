import { WALLET_API } from "@src/config";
import { axiosInstance } from "api/axiosInstance";

export class WalletService {
  static getUserWallets = (params?: any) => {
    return axiosInstance.get(WALLET_API + "/api/userwallet/get-all-user-wallet", {
      params,
    });
  };

  static getWithDrawSetting = (params?: any) => {
    return axiosInstance.get(WALLET_API + "/api/withdrawSetting/get-withdraw-setting", {
      params,
    });
  };

  static getUserWallet = (params?: any) => {
    return axiosInstance.get(WALLET_API + "/api/UserWallet/Get-user-wallet-by-userId", {
      params,
    });
  };

  static getWalletTracking = (params?: any) => {
    return axiosInstance.get(WALLET_API + "/api/WalletTracking/get-wallet-tracking", {
      params,
    });
  };

  static getAllWalletTracking = (params?: any) => {
    return axiosInstance.get(WALLET_API + "/api/WalletTracking/get-all-wallet-tracking", {
      params,
    });
  };

  static withDraw = (data: any) => {
    return axiosInstance.post(WALLET_API + "/api/Withdraw/withdraw", data);
  };

  static updateSetting = (data: any) => {
    return axiosInstance.post(WALLET_API + "/api/WithdrawSetting/update-withdraw-setting", data);
  };

  static estimateWithdraw = (params: any) => {
    return axiosInstance.get(WALLET_API + "/api/Withdraw/get-estimate-withdraw", {
      params,
    });
  };

  static getEventRewardDetail = (params?: any) => {
    return axiosInstance.get(WALLET_API + "/api/WalletTracking/get-event-reward-detail", {
      params,
    });
  };

  static getWithdrawDetail = (params?: any) => {
    return axiosInstance.get(WALLET_API + "/api/WalletTracking/get-withdraw-detail", {
      params,
    });
  };
}
