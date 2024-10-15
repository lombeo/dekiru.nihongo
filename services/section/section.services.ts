import { CMS_API } from "@src/config";
import { axiosInstance } from "api/axiosInstance";

export class SectionService {
  static getSections(filter: any) {
    const params = new URLSearchParams(filter).toString();
    return axiosInstance.get(CMS_API + `/section/?${params}`);
  }

  static getSectionsByIds(data: any) {
    return axiosInstance.post<any>(CMS_API + `/section/get-section-by-ids`, data);
  }

  static getSection(id: any) {
    return axiosInstance.get(CMS_API + `/section/details?id=${id}`);
  }

  static getSectionDetail(query: any) {
    var params = new URLSearchParams(query).toString();
    return axiosInstance.get(CMS_API + `/section/details?${params}`);
  }

  static saveSection(data: any) {
    return axiosInstance.post(CMS_API + `/section`, data);
  }

  static acttactActivity(data: any) {
    return axiosInstance.put<boolean>(CMS_API + "/section/attach", data);
  }

  static detachActivity(data: any) {
    return axiosInstance.put(CMS_API + "/section/detach", data);
  }

  static moveActivity(arg0: { sectionId: any; activityId: any; up: boolean }) {
    return axiosInstance.put<boolean>(CMS_API + "/section/move", arg0);
  }

  static moveSection(payload: { id: number | undefined; up: boolean }) {
    return axiosInstance.put<boolean>(CMS_API + "/section/move-section", payload);
  }

  static setMajorActivity(data: any) {
    return axiosInstance.put(CMS_API + "/section/setmajor", data);
  }

  static updateActivityAllowPreview(data: any) {
    return axiosInstance.post(CMS_API + "/section/update-activity-allow-preview", data);
  }
}
