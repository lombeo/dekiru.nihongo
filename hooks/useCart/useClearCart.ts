import { setItems } from "@src/store/slices/cartSlice";
import { useDispatch } from "react-redux";

const useClearCart = () => {
  const dispatch = useDispatch();

  return () => {
    dispatch(setItems([]));
  };
};

export default useClearCart;
