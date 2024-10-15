import { axiosInstance } from "@src/api/axiosInstance";

export class LearnMentorService {
  static createMentor(data: any) {
    return axiosInstance.post("/learn/mentor/create-mentor", data);
  }
  static updateMentor(data: any) {
    return axiosInstance.put("/learn/mentor/update-mentor", data);
  }
  static getMyMentorRequest() {
    return axiosInstance.get("/learn/mentor/get-my-mentor-request", {
      headers: {
        errorHandle: false,
      },
    });
  }
  static getMentorDetail(params: any) {
    return axiosInstance.get("learn/mentor/get-mentor-detail", {
      params: params,
    });
  }
  static registerMentee(data: any) {
    return axiosInstance.post(`/learn/mentor/register-mentee`, data);
  }
  static cancelMentee(id: any) {
    return axiosInstance.put(`/learn/mentor/cancel-mentee`, { id: id });
  }
  static cancelMentorRequest() {
    return axiosInstance.put(`/learn/mentor/cancel-mentor-request`);
  }
  static updateMenteeState(data: any) {
    return axiosInstance.put(`/learn/mentor/update-mentee-state`, data);
  }
  static deleteMentee(id: any) {
    return axiosInstance.delete(`/learn/mentor/delete-mentee/${id}`);
  }
  static changeMentorState(data: any) {
    return axiosInstance.put(`/learn/mentor/change-mentor-state`, data);
  }
  static deleteMentorRequest(id: any) {
    return axiosInstance.delete(`/learn/mentor/delete-mentor-request/${id}`);
  }
  static getUserMentors(params: any) {
    return axiosInstance.get("learn/mentor/get-user-mentors", {
      params: params,
    });
  }
  static getUserMentees(params: any) {
    return axiosInstance.get("learn/mentor/get-user-mentees", {
      params: params,
    });
  }
  static searchMentors(params: any) {
    return axiosInstance.get("/learn/mentor/search-mentors", {
      params,
    });
  }
  static vote(data: any) {
    return axiosInstance.post("/learn/mentor/vote-mentor", data);
  }
}
