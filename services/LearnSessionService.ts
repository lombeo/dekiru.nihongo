import { axiosInstance } from "@src/api/axiosInstance";

export class LearnSessionService {
  static getSessions = (data: any) => {
    return axiosInstance.post("/learn/session/get-ongoing-and-upcomming-sessions", data);
  };
}
