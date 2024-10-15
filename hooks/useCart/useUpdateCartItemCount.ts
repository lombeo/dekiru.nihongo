import { selectItems, setItems } from "@src/store/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const useUpdateCartItemCount = () => {
  const items = useSelector(selectItems);
  const dispatch = useDispatch();

  return (id: number, count: number) => {
    let _count = count;
    if (count > 10000) {
      _count = 10000;
    }
    if (count <= 0) {
      _count = 1;
    }
    dispatch(setItems(items?.map((item) => (item.id === id ? { ...item, count: _count } : item))));
  };
};

export default useUpdateCartItemCount;
