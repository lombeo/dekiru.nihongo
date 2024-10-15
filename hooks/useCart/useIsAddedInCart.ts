import { CommentContextType } from "@src/services/CommentService/types";
import { selectItems } from "@src/store/slices/cartSlice";
import { useSelector } from "react-redux";

const useIsAddedInCard = (contextId: any, contextType: CommentContextType) => {
  const items = useSelector(selectItems);
  return items.some((item) => item.contextId === contextId && item.contextType === contextType);
};

export default useIsAddedInCard;
