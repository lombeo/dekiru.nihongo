import { getAccessToken } from "@src/api/axiosInstance";
import { IdentityService } from "@src/services/IdentityService";
import { setProfile } from "@src/store/slices/authSlice";
import { useDispatch } from "react-redux";

const useFetchProfile = () => {
  const dispatch = useDispatch();
  const token = getAccessToken();

  return async () => {
    if (!token) {
      return;
    }
    const res = await IdentityService.userGetCurrentUser();
    if (res?.data?.success) {
      const data = res?.data?.data;
      if (data) {
        dispatch(setProfile(data));
      }
    }
  };
};
export default useFetchProfile;
