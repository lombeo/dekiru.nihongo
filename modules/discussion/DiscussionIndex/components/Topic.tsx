import { Button, Text } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import { Overlay } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import ExternalLink from "@src/components/ExternalLink";
import Link from "@src/components/Link";
import UserRole from "@src/constants/roles";
import { convertDate } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import SharingService from "@src/services/Sharing/SharingService";
import moment from "moment";
import "moment/locale/vi";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { CaretDown, CaretUp, MessageDots } from "tabler-icons-react";
import DOMPurify from "isomorphic-dompurify";
import RawText from "@src/components/RawText/RawText";

export default function Topic(props: any) {
  const { t } = useTranslation();
  const { topic, filter, fetch } = props;
  const router = useRouter();
  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);
  const locale = router.locale;
  moment.locale(locale);

  const handleHide = async () => {
    confirmAction({
      message: t("Are you sure?"),
      title: t("Notice"),
      labelConfirm: t("Ok"),
      allowCancel: true,
      onConfirm: async () => {
        const res = await SharingService.hideTopic(topic.id);
        if (res?.data?.success) {
          fetch();
        }
      },
      withCloseButton: false,
    });
  };

  return (
    <div className="w-full h-auto border-b-2 pt-[30px] pb-[30px] md:px-5 pr-5 relative">
      {topic?.hideByAdmin == true ? (
        <Overlay opacity={0.05} blur={1} zIndex={180}>
          <Text className="absolute bottom-4 right-4 text-gray-500 font-semibold">
            {t("This thread was hidden by administrator")}
          </Text>
        </Overlay>
      ) : (
        <></>
      )}
      <div className="flex items-start  md:gap-3">
        <div className="w-[10%] min-w-[90px] flex flex-col gap-10 items-center">
          <Avatar size="lg" userId={topic?.ownerId} userExpLevel={topic?.ownerExpLevel} src={topic.ownerAvatar} />
          <div>
            <div className="flex items-center text-[#b7b7b7] gap-1">
              <CaretUp />
              <Text size="sm" color={topic?.rateSummary?.userRate == 1 ? "blue" : "gray"}>
                {topic?.rateSummary?.totalPoint ?? 0}
              </Text>
            </div>
            <div className="flex items-center text-[#b7b7b7] gap-1">
              <CaretDown />
              <Text size="sm" color={topic?.rateSummary?.userRate == -1 ? "blue" : "gray"}>
                {topic?.rateSummary?.totalNegativePoint ?? 0}
              </Text>
            </div>
          </div>
        </div>

        <div className="w-[85%]">
          <div className="h-24">
            <Link href={`/discussion/topic/${topic.id}`} className="">
              <TextLineCamp
                className="w-[87%] text-lg font-semibold overflow-hidden text-ellipsis hover:text-[#23527c] hover:underline"
                line={1}
              >
                {topic.title}
              </TextLineCamp>
            </Link>
            <RawText className="text-sm w-[87%]" line={3}>
              {DOMPurify.sanitize(topic?.content, { ALLOWED_TAGS: ["#text"] })}
            </RawText>
          </div>
          <div className="flex md:flex-row flex-col gap-6">
            <Text size={12}>
              By{" "}
              <ExternalLink className="text-[#337ab7]" href={`/profile/${topic.ownerId}`}>
                {topic.ownerName}
              </ExternalLink>
            </Text>
            <Text size={12}>{`${t("Last update")}: ${moment(convertDate(topic.updatedAt)).fromNow()}`} </Text>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {topic?.tags?.map((tag) => {
              return (
                <div
                  key={tag}
                  className="bg-[#ebebeb] border-[#ddd] text-[#898980] border rounded-md px-3 py-1 text-xs"
                >
                  {tag}
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-[5%] min-w-[45px] flex items-center justify-end gap-1 text-[#898989]">
          <MessageDots />
          <Text>{topic?.commentCount}</Text>
        </div>
      </div>
      {filter.isPublic && isManagerContent && (
        <div className="flex items-center justify-end gap-1 mt-3 sm:mt-0">
          <Button
            bg="none"
            size="sm"
            className="hover:bg-[#dc3545] text-[#dc3545] hover:text-white text-sm"
            onClick={handleHide}
          >
            <Icon name="eye-off" size={16}></Icon>
            {t("Hide this thread")}
          </Button>
        </div>
      )}
    </div>
  );
}
