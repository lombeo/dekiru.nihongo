import { axiosInstance } from "@src/api/axiosInstance";

export class LearnPaymentService {
  static getListOrderHistory(params: any) {
    return axiosInstance.get("/learn/payment/order", {
      params,
    });
  }

  static getOrderDetail = async (id: any) => {
    return axiosInstance.get(`/learn/payment/order/${id}`);
  };

  static getListMyOrders(params: any) {
    return axiosInstance.get("/learn/payment/myorder", {
      params,
    });
  }

  static getListVoucher(params: any) {
    return axiosInstance.get("/learn/payment/get-list-vouchers", {
      params: params,
    });
  }

  static getMyVoucher(params: any) {
    return axiosInstance.get("/learn/payment/get-my-vouchers", {
      params: params,
    });
  }

  static deleteVoucher(data: any) {
    return axiosInstance.post("/learn/payment/delete-list-vouchers", data);
  }

  static generateVoucher(data: any) {
    return axiosInstance.post("/learn/payment/generate-vouchers", data);
  }
}
