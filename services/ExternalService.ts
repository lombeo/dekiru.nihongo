import { axiosInstance } from "@src/api/axiosInstance";

export class ExternalService {
  static getQr = (params: any) => {
    return axiosInstance.post(`https://localhost:7233/authen/course/create-and-get-qr-transaction?language=vn&courseId=${params}`, {
      responseType: "blob",
    });
  };
}
