import { ActionIcon, clsx } from "@mantine/core";
import { getAccessToken } from "@src/api/axiosInstance";
import { ChatBubbleOval } from "@src/components/Svgr/components";
import { selectCount, selectOpenDrawerChat, setOpenDrawerChat } from "@src/store/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";

const ChatBtn = (props: any) => {
  const dispatch = useDispatch();
  const count = useSelector(selectCount);
  const opened = useSelector(selectOpenDrawerChat);

  const token = getAccessToken();

  if (!token) return null;

  return (
    <div className="relative">
      <ActionIcon
        onClick={() => {
          dispatch(setOpenDrawerChat(!opened));
        }}
        className={clsx("relative bg-navy-light5 rounded-full w-8 transition", {
          "text-[#2C31CF]": opened,
          "text-gray-primary": !opened,
        })}
        variant="transparent"
      >
        <ChatBubbleOval width={14} height={14} />
        {count > 0 ? (
          <div className="absolute z-10 px-1 min-w-[16px] h-4 rounded-full flex items-center justify-center bg-[#f1646c] top-[-5px] right-1.5 translate-x-[50%] text-white text-[11px] font-semibold">
            {count > 9 ? "9+" : count}
          </div>
        ) : null}
      </ActionIcon>
    </div>
  );
};

export default ChatBtn;
