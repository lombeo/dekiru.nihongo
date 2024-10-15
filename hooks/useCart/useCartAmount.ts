import { selectCount, selectItems } from "@src/store/slices/cartSlice";
import _ from "lodash";
import { useSelector } from "react-redux";

const useCartAmount = () => {
  const items = useSelector(selectItems);
  const count = useSelector(selectCount);
  return {
    totalItems: count,
    totalAmountBeforeDiscount: _.sumBy(items, (item: any) => item.price * item.count),
    totalDiscount: _.sumBy(items, (item: any) => item.discount * item.count),
    totalAmount: _.sumBy(items, (item: any) => (item.price - item.discount) * item.count),
  };
};

export default useCartAmount;
