import { axiosInstance } from "@src/api/axiosInstance";

export class ExternalService {
  static getQr = (params: any) => {
    return axiosInstance.get("https://img.vietqr.io/image/tpbank-00666868149-qr_only.jpg", {
      params,
      responseType: "blob",
    });
  };
}
