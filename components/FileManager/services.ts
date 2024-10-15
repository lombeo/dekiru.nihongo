import { axiosInstance } from "api/axiosInstance";
import { CMS_API } from "@src/config";
import { Order } from "@src/constants/common.constant";

export class FileManagementService {
  static getFiles(id?: number, fileType?: string, pageIndex = 0, pageSize = 20, orderByFile = Order.createOn) {
    const param =
      `?pageSize=${pageSize}` +
      (pageIndex ? `&pageIndex=${pageIndex}` : ``) +
      (!!fileType ? `&ExtensionType=${fileType}` : ``) +
      (id ? `&parentId=${id}` : ``) +
      (orderByFile ? `&orderBy=${orderByFile}` : ``);
    return axiosInstance.get<any>(CMS_API + `/filemanagement${param}`);
  }

  static addFile(data: any) {
    if (data.id) {
      return axiosInstance.put(CMS_API + `/filemanagement`, data);
    } else {
      return axiosInstance.post(CMS_API + `/filemanagement`, data);
    }
  }
  static deleteFile(id: number) {
    return axiosInstance.delete(CMS_API + `/filemanagement?id=${id}`);
  }
}
