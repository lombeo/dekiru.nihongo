import { Notify } from "@edn/components/Notify/AppNotification";
import { LearnCourseService } from "@src/services";
import { CartItem } from "@src/store/slices/cartSlice";
import { useTranslation } from "next-i18next";
import useFetchCart from "./useFetchCart";

const useAddItemCart = () => {
  const { t } = useTranslation();

  const fetchCart = useFetchCart();

  return async (data: CartItem) => {
    const res = await LearnCourseService.addCart({
      contextId: data.contextId,
      number: data.count,
      ...(data?.data || {}),
    });
    if (res?.data?.data) {
      fetchCart();
      return true;
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
    return false;
  };
};

export default useAddItemCart;
