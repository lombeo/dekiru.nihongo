import { Breadcrumbs } from "@edn/components";
import { ActionIcon, Flex, Text } from "@mantine/core";
import { Container } from "@src/components";
import Avatar from "@src/components/Avatar";
import Comment from "@src/components/Comment/Comment";
import ExternalLink from "@src/components/ExternalLink";
import RawText from "@src/components/RawText/RawText";
import UserRole from "@src/constants/roles";
import { convertDate } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import { CommentService } from "@src/services/CommentService";
import SharingService from "@src/services/Sharing/SharingService";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import moment from "moment";
import "moment/locale/vi";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CaretDown, CaretUp, Pencil } from "tabler-icons-react";

export default function DiscussionDetailIndex() {
  const { t } = useTranslation();

  const router = useRouter();
  const id = router.query.id;
  const locale = router.locale;

  const [dataTopic, setDataTopic] = useState({} as any);
  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const dispatch = useDispatch();

  moment.locale(locale);

  const tags = dataTopic?.tags?.map((tag) => {
    return (
      <div key={tag} className="bg-[#ebebeb] text-[#898980] border border-[#ddd] rounded-md px-3 py-1 text-xs">
        {tag}
      </div>
    );
  });
  const fetchDataTopic = async () => {
    const res = await SharingService.getTopicDetail(id);
    if (res?.data.success) {
      setDataTopic(res.data.data);
    }
  };
  const handleVote = async (isUp: boolean) => {
    let point = 0;

    if (
      isUp &&
      (dataTopic?.rateSummary?.userRate == 0 ||
        dataTopic?.rateSummary == null ||
        dataTopic?.rateSummary?.userRate == -1)
    ) {
      point = 1;
    } else if (
      !isUp &&
      (dataTopic?.rateSummary?.userRate == 0 || dataTopic?.rateSummary == null || dataTopic?.rateSummary?.userRate == 1)
    ) {
      point = -1;
    } else {
      point = 0;
    }

    const res = await CommentService.vote({
      contextId: dataTopic.id,
      contextType: 9,
      point: point,
    });
    if (res?.data?.success) {
      fetchDataTopic();
    }
  };

  useEffect(() => {
    fetchDataTopic();
  }, []);

  const profile = useSelector(selectProfile);
  return (
    <div className="pb-20">
      <Container>
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                href: "/discussion",
                title: t("Discussion"),
              },
              {
                title: t("Topic"),
              },
            ]}
          />
        </Flex>
        <div className="bg-white w-full p-5 mt-6">
          <div className="flex items-start gap-3">
            <div className="w-[10%] min-w-[90px] flex flex-col gap-10 items-center">
              <Avatar
                size="lg"
                userId={dataTopic?.ownerId}
                userExpLevel={dataTopic?.ownerExpLevel}
                src={dataTopic?.ownerAvatar}
              />
              {profile ? (
                <div>
                  <div className="flex items-center text-[#b7b7b7] gap-1">
                    <ActionIcon
                      size={32}
                      color={dataTopic?.rateSummary?.userRate == 1 ? "blue" : "gray"}
                      onClick={() => handleVote(true)}
                    >
                      <CaretUp className="w-8 h-8" />
                    </ActionIcon>
                    <Text size="sm">{dataTopic?.rateSummary?.totalPoint ?? 0}</Text>
                  </div>
                  <div className="flex items-center text-[#b7b7b7] gap-1">
                    <ActionIcon
                      color={dataTopic?.rateSummary?.userRate == -1 ? "blue" : "gray"}
                      size={32}
                      onClick={() => handleVote(false)}
                    >
                      <CaretDown className="w-8 h-8" />
                    </ActionIcon>
                    <Text size="sm">{dataTopic?.rateSummary?.totalNegativePoint ?? 0}</Text>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center text-[#b7b7b7] gap-1">
                    <CaretUp />
                    <Text size="sm">{dataTopic?.rateSummary?.totalPoint ?? 0}</Text>
                  </div>
                  <div className="flex items-center text-[#b7b7b7] gap-1">
                    <CaretDown />
                    <Text size="sm">{dataTopic?.rateSummary?.totalNegativePoint ?? 0}</Text>
                  </div>
                </div>
              )}
            </div>
            <div className="w-[85%] flex flex-col gap-2">
              <div>
                <Text className="text-xl font-semibold break-words">{dataTopic?.title}</Text>
                <div className="flex gap-6 mt-2">
                  <Text size={12}>
                    By{" "}
                    <ExternalLink className="text-[#337ab7]" href={`/profile/${dataTopic?.ownerId}`}>
                      {dataTopic?.ownerName}
                    </ExternalLink>
                  </Text>
                  <Text size={12}>{`${t("Last update")}: ${moment(convertDate(dataTopic.updatedAt)).fromNow()}`} </Text>
                </div>
              </div>
              <div className="gap-6 hidden md:block">
                <RawText>{dataTopic?.content}</RawText>
              </div>
              <div className="flex gap-2 mt-5 flex-wrap">{tags}</div>
            </div>
            {dataTopic?.canEdit || isManagerContent ? (
              <div className="w-[5%] min-w-[45px] flex items-center justify-end gap-1 text-[#898989]">
                <ActionIcon size={28} color="blue" onClick={() => router.push(`/discussion/edit/${id}`)}>
                  <Pencil size={28} />
                </ActionIcon>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="md:hidden">
            <RawText>{dataTopic?.content}</RawText>
          </div>
          {profile ? (
            <div className="pt-8">
              <Comment
                isManager={isManagerContent}
                contextId={dataTopic.id}
                contextType={dataTopic.contextType}
                detailedLink={router.asPath}
                title={dataTopic.title}
              />
            </div>
          ) : (
            <Text
              c="red"
              className="italic cursor-pointer hover:underline mt-10"
              onClick={() => dispatch(setOpenModalLogin(true))}
            >
              {t("Please login to comment")}
            </Text>
          )}
        </div>
      </Container>
    </div>
  );
}
