import { axiosInstance } from "@src/api/axiosInstance";
import { PAYMENT_API } from "@src/config";

export const OrderStatus = {
  /// <summary>
  /// Status when create order
  /// </summary>
  Pending: 0,

  /// <summary>
  /// Status when call to fox pay
  /// </summary>
  Sent: 1,

  /// <summary>
  /// Success payment
  /// </summary>
  Success: 2,

  /// <summary>
  /// Fail payments
  /// </summary>
  Fail: 3,
};

export enum TransactionStatus {
  UNKNOWN = -1,
  CANCELED = 0,
  EXPIRED = 1,
  PENDING = 2,
  SUCCESS = 3,
  ENDED = 4,
  FAILED = 5,
}

export class PaymentService {
  static voucherDelete(data: any) {
    return axiosInstance.post(PAYMENT_API + `/payment/vouchermanage/delete`, data);
  }
  static voucherGenerate(data: any) {
    return axiosInstance.post(PAYMENT_API + `/payment/vouchermanage/generate`, data);
  }
  static voucher(params: any) {
    return axiosInstance.get(PAYMENT_API + `/payment/vouchermanage`, {
      params,
    });
  }
  static getVoucherWithContext(params: any) {
    return axiosInstance.get(PAYMENT_API + `/payment/get-voucher-with-context`, {
      params,
    });
  }
  static deleteOrderCart(params: any) {
    return axiosInstance.get(PAYMENT_API + `/payment/delete-cart`, {
      params,
    });
  }
  static listOrder(params: any) {
    return axiosInstance.get(PAYMENT_API + `/payment/list-order`, {
      params,
    });
  }
  static myVoucher(params: any) {
    return axiosInstance.get(PAYMENT_API + `/payment/my-voucher`, {
      params,
    });
  }
  static listCart(params: any) {
    return axiosInstance.get(PAYMENT_API + `/payment/list-cart`, {
      params,
    });
  }
  static countCart(params?: any) {
    return axiosInstance.get(PAYMENT_API + `/payment/count-cart`, {
      params,
    });
  }
  static payCart(data: any) {
    return axiosInstance.post(PAYMENT_API + `/payment/pay-cart`, data);
  }
  static createQrContent(data: any) {
    return axiosInstance.post(PAYMENT_API + `/payment/create-qr-content/`, data);
  }
  static getOrderDetail(id: string | string[]) {
    return axiosInstance.get(PAYMENT_API + `/payment/ordermanage/get-order-detail?orderId=${id}`);
  }
  static postUpdateOrderStatus(body: { orderId: string }) {
    return axiosInstance.post(PAYMENT_API + `/payment/ordermanage/update-order-status`, body);
  }
  static getOrderDetailMarkTest(params: { orderId: string; isTest: boolean }) {
    return axiosInstance.get(PAYMENT_API + `/payment/ordermanage/mark-test`, { params });
  }
  static getTransaction(params) {
    return axiosInstance.get(PAYMENT_API + `/payment/get-transaction?progress=false`, {params});
  }
  static applyVoucher(data): any {
    return axiosInstance.post(PAYMENT_API + `/payment/apply-voucher`, data);
  }
  static getStatusName(status: number) {
    let statusName = "";
    switch (status) {
      case OrderStatus.Pending:
        statusName = "Pending";
        break;
      case OrderStatus.Sent:
        statusName = "Processing";
        break;
      case OrderStatus.Fail:
        statusName = "Failured";
        break;
      case OrderStatus.Success:
        statusName = "Successfully";
        break;
      default:
        break;
    }
    return statusName;
  }
  static voucherExport(params: any) {
    return axiosInstance.get(PAYMENT_API + `/payment/vouchermanage/export`, {
      params,
    });
  }
  static orderExport(params: any) {
    return axiosInstance.get(PAYMENT_API + `/payment/ordermanage/export`, {
      params,
    });
  }

  static courseEnrollReport(params: any) {
    return axiosInstance.get(PAYMENT_API + `/payment/vouchermanage/get-course-enroll-report`, {
      params,
    });
  }

  static getVoucherByCode(params: any) {
    return axiosInstance.get(PAYMENT_API + "/payment/vouchermanage/get-voucher-by-code", {
      params,
    });
  }

  static searchManager(params: any) {
    return axiosInstance.get(PAYMENT_API + "/payment/vouchermanage/search-manager", {
      params,
    });
  }

  static saveVoucherManager(data): any {
    return axiosInstance.post(PAYMENT_API + "/payment/vouchermanage/save-manager", data);
  }

  static deleteVoucherManager(id): any {
    return axiosInstance.delete(PAYMENT_API + `/payment/vouchermanage/delete-manager/${id}`);
  }

  static getVoucherManagerInfo(id: any) {
    return axiosInstance.get(PAYMENT_API + `/payment/vouchermanage/get-voucher-manager/${id}`);
  }
}
