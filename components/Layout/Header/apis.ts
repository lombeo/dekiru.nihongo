import { NEXT_PUBLIC_UPLOAD } from "@src/config";
import { ApiHelper } from "@src/helpers/api.helper";

export enum UploadHeaderAPIEnums {
  UPLOAD_SUPPORT = "/learn/course/get-filter-course",
}

export const HeaderAPIs = ApiHelper.getListUri(NEXT_PUBLIC_UPLOAD, UploadHeaderAPIEnums);
