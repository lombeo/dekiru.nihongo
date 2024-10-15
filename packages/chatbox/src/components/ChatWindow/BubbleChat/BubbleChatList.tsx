import { selectProfile } from "@src/store/slices/authSlice";
import { selectOpenDrawerChat } from "@src/store/slices/chatSlice";
import clsx from "clsx";
import { useSelector } from "react-redux";
import styles from "../ChatWindow.module.scss";
import BubbleChatIem from "./BubbleChatIem";

const BubbleChatList = (props: any) => {
  const { listActiveRoom } = props;

  const profile = useSelector(selectProfile);

  const openDrawerChat = useSelector(selectOpenDrawerChat);

  //Check is show more
  let isShowMore = listActiveRoom.length > 0 && listActiveRoom.filter((item) => item?.isMinimize).length > 6;
  let listBubbleChat,
    listBubbleShowMore = [];
  if (isShowMore) {
    listBubbleChat = listActiveRoom.length > 0 && listActiveRoom.filter((item) => item?.isMinimize).slice(0, 5);
    listBubbleShowMore = listActiveRoom.length > 0 && listActiveRoom.filter((item) => item?.isMinimize).slice(5);
  } else {
    listBubbleChat = listActiveRoom.length > 0 && listActiveRoom.filter((item) => item?.isMinimize);
  }

  return (
    <div
      className={clsx("z-[200] fixed ", styles["bubble-chat-list"], {
        "right-[398px] bottom-0": openDrawerChat,
        "right-3 bottom-[120px]": !openDrawerChat,
      })}
    >
      {listBubbleChat.length > 0 &&
        listBubbleChat.map((item: any) => <BubbleChatIem currentUserId={profile?.userId} key={item.id} data={item} />)}
      {listBubbleShowMore.length > 0 && (
        <div className={`${styles["show-more-bubble"]} bg-white`}>
          <span className={` font-semibold text-sm`}>+{listBubbleShowMore.length}</span>
          <div className={styles["show-more-wrap"]}>
            {listBubbleShowMore.map((item: any) => (
              <BubbleChatIem currentUserId={profile?.userId} isShowMoreItem={true} key={item.id} data={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BubbleChatList;
