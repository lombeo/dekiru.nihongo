import { getAccessToken } from "@src/api/axiosInstance";
import { CommentContextType } from "@src/services/CommentService/types";
import { PaymentService } from "@src/services/PaymentService";
import { CartItem, setCount, setIsFetched, setItems } from "@src/store/slices/cartSlice";
import { useDispatch } from "react-redux";

const useFetchCart = () => {
  const dispatch = useDispatch();

  return async () => {
    const token = getAccessToken();
    if (!token) {
      dispatch(setItems([]));
      return;
    }
    const res = await PaymentService.listCart({
      contextType: CommentContextType.Course,
      pageIndex: 1,
      pageSize: 20,
      progress: false,
    });
    const orders = res?.data?.data?.results;
    if (orders) {
      const items: CartItem[] =
        orders?.map((item) => ({
          contextId: item.contextId,
          contextType: item.contextType,
          isVoucher: item.isVoucher,
          price: item.price,
          discount: item.price - item.actualPrice,
          thumbnail: item.thumbnail,
          link: `/learning/${item.permalink}`,
          title: item.title,
          id: item.id,
          count: item.number,
          data: item,
        })) || [];
      dispatch(setItems(items));
      dispatch(setCount(items.length));
    }
    dispatch(setIsFetched(true));
  };
};

export default useFetchCart;
