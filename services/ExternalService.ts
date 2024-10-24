import { axiosInstance } from "@src/api/axiosInstance";

export class ExternalService {
  static getQr = (params: any) => {
    return axiosInstance.post(`https://lombeo-api-authorize.azurewebsites.net/authen/course/create-and-get-qr-transaction?language=vn&courseId=${params}`, {
      responseType: "blob",
    });
  };
}
