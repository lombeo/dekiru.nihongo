import { axiosInstance } from "@src/api/axiosInstance";
import { COMMENT_API } from "@src/config";

export class CommentService {
  static filter(params: any) {
    return axiosInstance.get(COMMENT_API + "/comment/comment/get-comments?progress=false", {
      params: params,
    });
  }
  static hide(data: {
    commentId: number,
    userId: number,
  }) {
    return axiosInstance.post(COMMENT_API + "/comment/comment/toggle-hidden?progress=false", data)
  }
  static vote(data: any) {
    return axiosInstance.post(COMMENT_API + `/comment/rate/change-rate`, data);
  }

  static delete(id: any) {
    return axiosInstance.delete(COMMENT_API + `/comment/comment/delete-comment/${id}?progress=false`);
  }

  static post(data: any) {
    return axiosInstance.post(COMMENT_API + "/comment/comment/create-update-comment?progress=false", data);
  }
}
