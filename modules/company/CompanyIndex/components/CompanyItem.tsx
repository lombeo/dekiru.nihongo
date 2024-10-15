import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Image } from "@mantine/core";
import Link from "@src/components/Link";
import { Bookmark, BookmarkFilled } from "@src/components/Svgr/components";
import { getCurrentLang } from "@src/helpers/helper";
import { useGetStateLabel } from "@src/hooks/useCountries";
import { RecruitmentService } from "@src/services/RecruitmentService";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import _, { isNil } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Building, MapPin, Users } from "tabler-icons-react";

const CompanyItem = (props: any) => {
  const { data } = props;
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);

  const router = useRouter();
  const locale = router.locale;

  const getStateLabel = useGetStateLabel();

  const [loadingBookmark, setLoadingBookmark] = useState(false);
  const [isBookmark, setIsBookmark] = useState(data.isBookmarked);

  const dispatch = useDispatch();

  const handleSave = async (e) => {
    if (!profile) {
      dispatch(setOpenModalLogin(true));
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setLoadingBookmark(true);
    const res = await RecruitmentService.candidateFollowCompany(data?.id, isBookmark);
    setLoadingBookmark(false);
    if (res.data?.success) {
      setIsBookmark((prev) => !prev);
    } else if (res.data?.message) {
      Notify.error(t(res.data?.message));
    }
  };

  return (
    <Link
      href={`/company/${data.permalink}`}
      className="bg-white hover:opacity-100 hover:shadow-xl rounded-md shadow-md"
    >
      <div className="relative">
        <img
          src={isNil(data?.banner) ? "/images/bg-company.png" : data.banner}
          width="100%"
          className="aspect-[1920/400] object-cover rounded-t-md overflow-hidden"
        />
        <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-[40px] z-10">
          <Image
            className="border bg-white h-min border-[#e9eaec] rounded-md overflow-hidden"
            src={data?.logo}
            withPlaceholder
            fit="contain"
            width={80}
            height={80}
            alt=""
          />
        </div>
      </div>
      <div className="p-4 mt-8 flex flex-col">
        <div className="relative pr-[22px]">
          <TextLineCamp line={2} className="font-semibold">
            {data.name}
          </TextLineCamp>
          <ActionIcon
            size="md"
            loading={loadingBookmark}
            onClick={handleSave}
            className="absolute top-0 -right-1 z-10"
            variant="transparent"
            color="#2B31CF"
          >
            {isBookmark ? <BookmarkFilled width={24} height={24} /> : <Bookmark width={24} height={24} />}
          </ActionIcon>
        </div>
        <div className="text-sm flex flex-col pt-1 mt-auto gap-1">
          <div className="flex gap-2 items-center">
            <Users color="#51595c" height={16} width={16} />
            <TextLineCamp className="font-semibold">{getCurrentLang(data.companySize, locale)?.name}</TextLineCamp>
          </div>
          <div className="flex gap-2 items-center">
            <Building color="#51595c" height={16} width={16} />
            <TextLineCamp className="font-semibold">{getCurrentLang(data.businessArea, locale)?.name}</TextLineCamp>
          </div>
          <div className="flex gap-2 items-center">
            <MapPin color="#51595c" height={16} width={16} />
            <TextLineCamp className="font-semibold">
              {_.uniq(data?.addresses?.map((e) => getStateLabel(e.stateId))).join(", ")}
            </TextLineCamp>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompanyItem;
