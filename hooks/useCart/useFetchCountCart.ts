import { getAccessToken } from "@src/api/axiosInstance";
import { PaymentService } from "@src/services/PaymentService";
import { setCount } from "@src/store/slices/cartSlice";
import { useDispatch } from "react-redux";

const useFetchCountCart = () => {
  const dispatch = useDispatch();

  return async () => {
    const token = getAccessToken();
    if (!token) {
      dispatch(setCount(0));
      return;
    }
    const res = await PaymentService.countCart();
    let count = 0;
    if (res?.data?.data) {
      count = res.data.data;
    }
    dispatch(setCount(count));
  };
};

export default useFetchCountCart;
