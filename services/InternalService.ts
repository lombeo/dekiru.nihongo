import { axiosInstance } from "@src/api/axiosInstance";
import { INTERNAL_API } from "@src/config";

export class InternalService {
  static voucher = (params: any, voucherUrl?: string) => {
    if (voucherUrl) return axiosInstance.get(INTERNAL_API + voucherUrl, { responseType: "blob" });
    return axiosInstance.get(INTERNAL_API + "/api/voucher.png", { params, responseType: "blob" });
  };
  static activationCode = (params: any) => {
    return axiosInstance.get(INTERNAL_API + "/api/activation-code.png", { params, responseType: "blob" });
  };
  static getFileS3 = (url: string) => {
    return axiosInstance.get(INTERNAL_API + "/api/forward", {
      params: {
        url,
      },
      responseType: "arraybuffer",
    });
  };
}
