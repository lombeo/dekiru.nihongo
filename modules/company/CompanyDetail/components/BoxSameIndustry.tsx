import { Text } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Image } from "@mantine/core";
import Link from "@src/components/Link";
import { RecruitmentService } from "@src/services/RecruitmentService";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";

const BoxSameIndustry = (props: any) => {
  const { t } = useTranslation();

  const { data, status } = useQuery({
    queryKey: ["companyList", props.data?.id],
    queryFn: async () => {
      if (!props.data?.id) return null;
      const res = await RecruitmentService.companyList({
        pageIndex: 1,
        pageSize: 10,
        industryIds: props.data?.industries?.map((e) => e.id),
        excludedIds: [props.data.id],
      });
      return res?.data;
    },
  });

  return (
    <div className="rounded-md bg-white p-5 pb-2">
      <div className="font-semibold text-xl mb-2">{t("Companies in the same industry")}</div>
      <div className="flex flex-col divide-y">
        {data?.data?.map((item) => (
          <div key={item.id} className="py-3 grid lg:grid-cols-[50px_auto_40px] gap-4">
            <Link href={`/company/${item.permalink}`}>
              <Image
                className="border bg-white h-min mx-auto border-[#e9eaec] rounded-md overflow-hidden"
                src={item?.logo}
                withPlaceholder
                fit="contain"
                width={50}
                height={50}
                alt=""
              />
            </Link>
            <div className="text-sm flex flex-col justify-center gap-2">
              <Link href={`/company/${item.permalink}`}>
                <TextLineCamp className="font-semibold">{item.name}</TextLineCamp>
              </Link>
              <div>
                {item.jobCount || 0} {t("job are opening")}
              </div>
            </div>
            <div></div>
          </div>
        ))}
      </div>
      {status === "success" && !data?.data?.length && (
        <Text className="p-12 bg-white text-center text-gray-secondary">{t("No results found")}</Text>
      )}
    </div>
  );
};

export default BoxSameIndustry;
