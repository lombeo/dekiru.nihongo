import { CMS_API } from "@src/config";
import { axiosInstance } from "api/axiosInstance";

export class QuestionBankService {
  static async saveOrUpdateQuestionBank(data: any) {
    if (data.id) {
      return updateQuestionBank(data);
    }
    return saveQuestionBank(data);
  }

  static deleteQuestionBank(questionBankId: any) {
    return axiosInstance.delete(CMS_API + "/questionbank/bank/?id=" + questionBankId + "&skipErrorPage=true");
  }

  static importQuestion(data: any) {
    return axiosInstance.post(CMS_API + "/questionbank/bank/question/import", data);
  }
}

const saveQuestionBank = (data: any) => {
  return axiosInstance.post(CMS_API + "/questionbank/bank", data);
};

const updateQuestionBank = (data: any) => {
  return axiosInstance.put(CMS_API + "/questionbank/bank", data);
};
