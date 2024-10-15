import { fileType, UPLOAD_API } from "@src/config";
import { axiosInstance } from "api/axiosInstance";

export const UploadService = {
  upload: (data: any, type?: number, recaptcha?: any, isSubmit = true) => {
    const fileTypeUpload = type ? type : fileType.attFileComment;
    const formData = new FormData();
    formData.append("files", data);
    return axiosInstance.post<any>(UPLOAD_API + `/upload/uploadFile?type=${fileTypeUpload}&isSubmit=${isSubmit}`, formData, {
      headers: {
        recaptcha,
      },
    });
  },
};
