import { axiosInstance } from "@src/api/axiosInstance";
import { SHARING_API } from "@src/config";

class SharingService {
  static getTopicList = (params: any) => {
    return axiosInstance.get(SHARING_API + "/discussion/search", {
      params,
    });
  };
  static getTopicDetail = async (id: any) => {
    return axiosInstance.get(SHARING_API + `/discussion/detail/${id}`);
  };
  static editTopic = async (value: any) => {
    return axiosInstance.put(SHARING_API + "/discussion/update", value);
  };
  static postTopic = async (value: any) => {
    return axiosInstance.post(SHARING_API + "/discussion/create", value);
  };

  static hideTopic = async (idTopic: any) => {
    return axiosInstance.patch(SHARING_API + `/discussion/switch-visibility/${idTopic}`);
  };

  static checkCreateTopic = async () => {
    return axiosInstance.get(SHARING_API + `/discussion/check-create-topic`);
  };

  static getBlogList = async (params: any) => {
    return axiosInstance.get(SHARING_API + `/blog/search`, {
      params,
    });
  };

  static getBlogDetail = async (params: any) => {
    return axiosInstance.get(SHARING_API + `/blog/detail`, {
      params,
    });
  };

  static getTopBloggers = async (params) => {
    return axiosInstance.get(SHARING_API + `/blog/get-top-blogger`, {
      params,
    });
  };

  static getOwnerInfor = async (params) => {
    return axiosInstance.get(SHARING_API + `/blog/get-owner-info`, {
      params,
    });
  };

  static followUser = async (value: any) => {
    return axiosInstance.post(SHARING_API + "/blog/follow-user", value);
  };

  static blogSearchBlogger = async (params: any) => {
    return axiosInstance.get(SHARING_API + `/blog/search-blogger`, {
      params,
    });
  };
  static blogUpdateBloggerStatus = async (data: any) => {
    return axiosInstance.put(SHARING_API + "/blog/update-blogger-status", data);
  };
  static blogDeleteBlogger = async (params: any) => {
    return axiosInstance.delete(SHARING_API + "/blog/delete-blogger", {
      params,
    });
  };
  static blogAddBlogger = async (data: any) => {
    return axiosInstance.post(SHARING_API + "/blog/add-blogger", data);
  };
  static blogRegisterBlogger = async (data: any) => {
    return axiosInstance.post(SHARING_API + `/blog/register-blogger`, data);
  };
  static updateAuthor = async (value: any) => {
    return axiosInstance.post(SHARING_API + "/blog/update-author", value);
  };

  static unOrPublishBlog = async (value: any) => {
    return axiosInstance.patch(SHARING_API + "/blog/un-or-publish-blog", value);
  };

  static createBlog = async (data: any) => {
    return axiosInstance.post(SHARING_API + "/blog/create", data);
  };

  static updateBlog = async (data: any) => {
    return axiosInstance.put(SHARING_API + "/blog/update", data);
  };
  static blogCheckCreateBlog = async () => {
    return axiosInstance.get(SHARING_API + `/blog/check-create-blog`);
  };

  static getBlogById = async (params: any) => {
    return axiosInstance.get(SHARING_API + `/blog/get-blog-by-id`, {
      params,
    });
  };

  static manageBlog = async (params: any) => {
    return axiosInstance.get(SHARING_API + `/blog/manage-blog`, {
      params,
    });
  };

  static exportBlog = async () => {
    return axiosInstance.get(SHARING_API + `/blog/export`);
  };

  static synchronySocialNetwork = async () => {
    return axiosInstance.put(SHARING_API + "/blog/synchrony-social-network");
  };
  static helpSearch = async (params?: any) => {
    return axiosInstance.get(SHARING_API + `/help/search`, {
      params,
    });
  };
  static helpDetail = async (id: any) => {
    return axiosInstance.get(SHARING_API + `/help/detail/${id}`);
  };
  static helpCreate = async (data: any) => {
    return axiosInstance.post(SHARING_API + `/help/save`, data);
  };
  static helpDelete = async (id: string) => {
    return axiosInstance.delete(SHARING_API + `/help/delete/${id}`);
  };
  static discussionGetUserDiscussionStatistic = async (params: any) => {
    return axiosInstance.get(SHARING_API + `/discussion/get-user-discussion-statistic`, { params });
  };
  static blogGetHomeBlogs = async (params: any) => {
    return axiosInstance.get(SHARING_API + `/blog/get-home-blogs`, { params });
  };
  static blogGetBloggerInfo = async (data: any) => {
    return axiosInstance.post(SHARING_API + `/blog/get-blogger-info?progress=false`, data);
  };
}

export default SharingService;
