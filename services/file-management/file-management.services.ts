import { Order } from "@src/components/cms/widgets/file-management/constant/common.constant";
import { CMS_API } from "@src/config";
import { axiosInstance } from "api/axiosInstance";

export class FileManagementService {
  static async getFiles(id?: number, fileType?: string, pageIndex = 0, pageSize = 20, orderByFile = Order.createOn) {
    const param =
      `?pageSize=${pageSize}` +
      (pageIndex ? `&pageIndex=${pageIndex}` : ``) +
      (!!fileType ? `&ExtensionType=${fileType}` : ``) +
      (id ? `&parentId=${id}` : ``) +
      (orderByFile ? `&orderBy=${orderByFile}` : ``);
    return axiosInstance.get<any>(`${CMS_API}/filemanagement${param}`);
  }

  static async addFile(data: any) {
    if (data.id) {
      return axiosInstance.put<any>(`${CMS_API}/filemanagement`, data);
    } else {
      return axiosInstance.post<any>(`${CMS_API}/filemanagement`, data);
    }
  }
  static async deleteFile(id: number) {
    return axiosInstance.delete<any>(`${CMS_API}/filemanagement?id=${id}`);
  }

  static async updateOwnerId() {
    return axiosInstance.post<any>(`${CMS_API}/filemanagement/update-owner-id`);
  }
}
