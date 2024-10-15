import { axiosInstance } from "@src/api/axiosInstance";
import { IDENTITY_API } from "@src/config";

export class IdentityService {
  static authenticationLogon(data: any, recaptcha?: string) {
    return axiosInstance.post(IDENTITY_API + "/authentication/logon", data, {
      headers: {
        recaptcha,
      },
    });
  }
  static setVerifiedUserEmail = async (params?: any) => {
    return axiosInstance.get(IDENTITY_API + `/admin/set-verified-user-email`, {
      params,
    });
  };
  static resendChallengeEmail = async (params?: any) => {
    return axiosInstance.get(IDENTITY_API + `/admin/resend-challenge-email`, {
      params,
    });
  };
  static setUserPassword = (data: any) => {
    return axiosInstance.post(IDENTITY_API + "/admin/set-user-password", data);
  };
  static userGetCurrentUser = () => {
    return axiosInstance.get(IDENTITY_API + "/user/get-current-user?progress=false");
  };
  static userChallengeEmail = (data: any) => {
    return axiosInstance.post(IDENTITY_API + "/user/challenge-email", data);
  };
  static userChangeUsername = async (params: any) => {
    return axiosInstance.get(IDENTITY_API + `/user/change-username`, {
      params,
    });
  };
  static importMember = (data: any) => {
    return axiosInstance.post(IDENTITY_API + "/organization/import-member", data);
  };
  static userRequestLostPassword = async (params: any, recaptcha?: string) => {
    return axiosInstance.post(IDENTITY_API + "/user/request-lost-password", null, {
      params,
      headers: {
        recaptcha,
      },
    });
  };
  static userLostPassword = async (data: any, recaptcha?: string) => {
    return axiosInstance.post(IDENTITY_API + "/user/lost-password", data, {
      headers: {
        recaptcha,
      },
    });
  };
  static userChangePassword = async (data: any, recaptcha?: string) => {
    return axiosInstance.post(IDENTITY_API + `/user/change-password`, data, {
      headers: {
        recaptcha,
      },
    });
  };
  static userFilterUser = async (params?: any) => {
    return axiosInstance.get(IDENTITY_API + `/user/filter-user`, {
      params,
    });
  };
  static loadExpHistory = async (params?: any) => {
    return axiosInstance.get(IDENTITY_API + `/user/load-exp-history`, {
      params,
    });
  };
  static userLoadCpHistory = async (params?: any) => {
    return axiosInstance.get(IDENTITY_API + `/user/load-cp-history`, {
      params,
    });
  };
  static userGetGainingSources = async (params?: any) => {
    return axiosInstance.get(IDENTITY_API + `/user/get-gaining-sources`, {
      params,
    });
  };
  static getOrganizationSetting = async (params?: any) => {
    return axiosInstance.get(IDENTITY_API + `/organization-setting/search`, {
      params,
    });
  };
  static createOrganizationSetting = async (value?: any) => {
    return axiosInstance.post(IDENTITY_API + `/organization-setting/create`, value);
  };
  static deleteOrganizationSetting = async (id?: any) => {
    return axiosInstance.delete(IDENTITY_API + `/organization-setting/delete/${id}`);
  };
  static updateOrganizationSetting = async (value: any) => {
    return axiosInstance.post(IDENTITY_API + `/organization-setting/update`, value);
  };
  static getOrganizationDetail = async (params: any) => {
    return axiosInstance.get(IDENTITY_API + "/organization/get-detail", {
      params,
    });
  };
  static saveOrganization = async (value: any) => {
    return axiosInstance.post(IDENTITY_API + "/organization/save", value);
  };
  static addUserOrganization = async (value: any) => {
    return axiosInstance.post(IDENTITY_API + "/organization/add-members", value);
  };
  static removeUserOrganization = async (value: any) => {
    return axiosInstance.post(IDENTITY_API + "/organization/remove-members", value);
  };
  static organizationGetOrganizationVerify = async (params: any) => {
    return axiosInstance.get(IDENTITY_API + "/organization/get-organization-verify", { params });
  };
  static organizationResponseJoinOrganization = async (data: any) => {
    return axiosInstance.post(IDENTITY_API + "/organization/response-join-organization", data);
  };
  static organizationUpdateRoleMember = async (data: any) => {
    return axiosInstance.post(IDENTITY_API + "/organization/update-role-member", data);
  };
  static deleteOrganization = async (id: number) => {
    return axiosInstance.delete(IDENTITY_API + `/organization/delete/${id}`);
  };
  static checkCreateOrganization = async (value?: any) => {
    return axiosInstance.get(IDENTITY_API + `/organization-setting/check-create-organization`);
  };
  static userLevelSettingGetSettings = (params?: any) => {
    return axiosInstance.get(IDENTITY_API + "/userlevelsetting/get-settings", {
      params,
    });
  };
  static userLevelSettingUpdateSettings = (data: any) => {
    return axiosInstance.post(IDENTITY_API + "/userlevelsetting/update-settings", data);
  };
  static userGetCpStatistic = (params?: any) => {
    return axiosInstance.get(IDENTITY_API + "/user/get-cp-statistic?progress=false", {
      params,
    });
  };
  static userGetListRole = async (params?: any) => {
    return axiosInstance.get(IDENTITY_API + `/user/get-list-role?progress=false`, {
      params,
    });
  };
  static userUpdateUserRoles = (data: any) => {
    return axiosInstance.post(IDENTITY_API + "/user/update-user-roles", data);
  };
  static saveUserAchievement = async (data: any) => {
    return axiosInstance.post(IDENTITY_API + `/user/save-user-achievement`, data);
  };
  static saveUserExperience = async (data: any) => {
    return axiosInstance.post(IDENTITY_API + `/user/save-user-experience`, data);
  };
  static userDeleteUserExperience = async (id: any) => {
    return axiosInstance.delete(IDENTITY_API + `/user/delete-user-experience/${id}`);
  };
  static saveUserEducation = async (data: any) => {
    return axiosInstance.post(IDENTITY_API + `/user/save-user-education`, data);
  };
  static userDeleteUserEducation = async (id: any) => {
    return axiosInstance.delete(IDENTITY_API + `/user/delete-user-education/${id}`);
  };
  static userUpdateUserProfile = async (data: any) => {
    return axiosInstance.post(IDENTITY_API + `/user/update-user-profile`, data);
  };
  static getManagedOrganization = async () => {
    return axiosInstance.get(IDENTITY_API + "/organization/get-managed-organization");
  };
  static userInOrganization = async (id: any) => {
    return axiosInstance.get(IDENTITY_API + `/organization/users-in-organization?organizationId=${id}`);
  };
  static newUserReport = async (params: any) => {
    return axiosInstance.get(IDENTITY_API + `/report/new-user-report`, { params });
  };
  static getUserProfileForContest = async (params: any) => {
    return axiosInstance.get(IDENTITY_API + "/user/get-user-profile", { params });
  };
  static updateUserProfileFromContest = async (data: any) => {
    return axiosInstance.post(IDENTITY_API + "/user/update-user-profile", data);
  };
  static getListUsersSale = async (params: any) => {
    return axiosInstance.get(IDENTITY_API + "/seller/search", { params });
  };
  static deleteUserSale = async (params: any) => {
    return axiosInstance.post(IDENTITY_API + "/seller/remove-seller", params);
  };
  static addUserSale = async (params: any) => {
    return axiosInstance.post(IDENTITY_API + "/seller/add-seller", params);
  };
  static importUser = async (params: any) => {
    return axiosInstance.post(IDENTITY_API + "/user/import-user", params);
  };
  static verifyPhoneNumber = async (params) => {
    return axiosInstance.get(IDENTITY_API + "/sms/test-verify-phonenumber", { params });
  };
  static refreshCacheUsers = async () => {
    return axiosInstance.get(IDENTITY_API + "/user/refresh-cache-users");
  };
  static userGetUserEducation = (params: any) => {
    return axiosInstance.get(IDENTITY_API + "/user/get-user-education", { params });
  };
  static updateUserSocial = (params: any) => {
    return axiosInstance.post(IDENTITY_API + "/user/update-user-social", params);
  };
  static updateUserSummary = (params: any) => {
    return axiosInstance.post(IDENTITY_API + "/user/update-user-summary", params);
  };
  static userGetUserExperience = (params: any) => {
    return axiosInstance.get(IDENTITY_API + "/user/get-user-experience", { params });
  };
  static addUpdateSchoolOrUniversity = async (params) => {
    return axiosInstance.post(IDENTITY_API + "/admin/add-upd-university", params);
  };
  static addNewCountry = async (params) => {
    return axiosInstance.post(IDENTITY_API + "/admin/add-upd-country", params);
  };

  static getSchoolOrUniversity = (params) => {
    return axiosInstance.get(IDENTITY_API + "/user/search-university", { params });
  };
  static deleteSchool = async (params) => {
    return axiosInstance.get(IDENTITY_API + '/admin/delete-university' , { params });
  }
}
