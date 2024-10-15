import { useSelector } from "react-redux";
import { selectProfile } from "store/slices/authSlice";
import { getAccessToken } from "@src/api/axiosInstance";

export const useProfileContext = () => {
  const profile = useSelector(selectProfile);
  const token = getAccessToken();
  return { authorized: !!token, profile };
};
