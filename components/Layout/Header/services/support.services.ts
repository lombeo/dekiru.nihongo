import { axiosInstance } from "api/axiosInstance";
import { HeaderAPIs } from "../apis";

export class HeaderService {
  static postHeader(filter: any) {
    const params = new URLSearchParams(filter).toString();
    return axiosInstance.post(`${HeaderAPIs.UPLOAD_SUPPORT}?${params}`);
  }
}
