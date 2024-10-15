import { PaymentService } from "@src/services/PaymentService";
import useFetchCart from "./useFetchCart";

const useDeleteItemCart = () => {
  // const dispatch = useDispatch();
  // const items = useSelector(selectItems);

  const fetchCart = useFetchCart();

  // return (contextId: any, contextType: CommentContextType) => {
  //   dispatch(setItems(items.filter((item) => !(item.contextType === contextType && item.contextId === contextId))));
  // };

  return async (ids: number[]) => {
    await PaymentService.deleteOrderCart({
      ids,
    });
    await fetchCart();
    return true;
  };
};

export default useDeleteItemCart;
