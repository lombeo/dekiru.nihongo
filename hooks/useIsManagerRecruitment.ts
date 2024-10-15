import { RecruitmentService } from "@src/services/RecruitmentService/RecruitmentService.ts";
import { useDispatch, useSelector } from "react-redux";
import { selectIsManager, setIsManager } from "@src/store/slices/recruitmentSlice";
import { useEffect, useState } from "react";
import { getAccessToken } from "@src/api/axiosInstance";

const useIsManagerRecruitment = () => {
  const dispatch = useDispatch();
  const token = getAccessToken();
  const isManager = useSelector(selectIsManager);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    if (!token) {
      dispatch(setIsManager(false));
      return;
    }
    const res = await RecruitmentService.recruitmentManagerIsManager();
    if (res?.data) {
      dispatch(setIsManager(res?.data?.data));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [token]);

  if (!token) return { isManager: false, loading: false };

  return { isManager, loading };
};

export default useIsManagerRecruitment;
