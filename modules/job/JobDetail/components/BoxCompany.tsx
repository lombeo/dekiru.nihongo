import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Image } from "@mantine/core";
import Link from "@src/components/Link";
import { getCurrentLang } from "@src/helpers/helper";
import { useGetStateLabel } from "@src/hooks/useCountries";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ChevronRight } from "tabler-icons-react";

const BoxCompany = (props: any) => {
  const { data, status } = props;
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;

  const getStateLabel = useGetStateLabel();

  return (
    <div className="rounded-md shadow-md bg-white p-5 pb-4">
      <div className="grid lg:grid-cols-[58px_auto] gap-5">
        <Image
          className="border bg-white h-min mx-auto border-[#e9eaec] rounded-md overflow-hidden"
          src={data?.company?.logo}
          withPlaceholder
          fit="contain"
          width={58}
          height={58}
          alt=""
        />
        <div>
          <div className="font-semibold">{data?.company?.name}</div>
        </div>
      </div>
      <div className="mt-2 text-sm flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="text-[#a6a6a6] flex-none">{t("Company size")}:</div>
          <TextLineCamp className="font-semibold">
            {getCurrentLang(data?.company?.companySize, locale)?.name}
          </TextLineCamp>
        </div>
        <div className="flex gap-2">
          <div className="text-[#a6a6a6] flex-none">{t("Company type")}:</div>
          <TextLineCamp className="font-semibold">
            {getCurrentLang(data?.company?.businessArea, locale)?.name}
          </TextLineCamp>
        </div>
        <div className="flex gap-2">
          <div className="text-[#a6a6a6] flex-none">{t("Address")}:</div>
          <TextLineCamp className="font-semibold">
            {_.uniq(data?.company?.addresses?.map((e) => getStateLabel(e.stateId))).join(", ")}
          </TextLineCamp>
        </div>
      </div>
      <Link
        target="_blank"
        className="flex justify-center font-semibold text-sm text-blue-primary mt-3 items-center gap-1"
        href={`/company/${data?.company?.permalink}`}
      >
        <span>{t("View company page")}</span>
        <ChevronRight width={20} />
      </Link>
    </div>
  );
};

export default BoxCompany;
