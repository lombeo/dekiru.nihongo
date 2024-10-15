import { Badge, Image, Skeleton } from "@mantine/core";
import RawText from "@src/components/RawText/RawText";
import { getCurrentLang } from "@src/helpers/helper";
import { useGetStateLabel } from "@src/hooks/useCountries";
import { isEmpty, isNil } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { MapPin } from "tabler-icons-react";

const BoxDescription = (props: any) => {
  const { data, status } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = router;

  const getStateLabel = useGetStateLabel();

  const socials = [
    { image: "/images/website-icon.svg", color: "#40B9F6", label: "Website", href: data?.website },
    { image: "/images/linkedin-icon.svg", color: "#0077B5", label: "LinkedIn", href: data?.linkedIn },
    { image: "/images/facebook-icon.svg", color: "#37599E", label: "Facebook", href: data?.facebook },
    { image: "/images/twitter-icon.svg", color: "#00A2F9", label: "Twitter", href: data?.twitter },
  ].filter((e) => !isEmpty(e.href));

  return (
    <div className="rounded-md bg-white p-5">
      <div className="font-semibold text-xl mb-4">{t("Description")}</div>

      {status === "success" ? <RawText>{data?.description}</RawText> : <Skeleton height={240} />}

      <div>
        <div className="font-semibold text-xl">{t("Company.Industry")}</div>
        <div className="mt-2 flex-wrap flex gap-2 overflow-hidden">
          {data?.industries?.map((item) => (
            <Badge key={item.id} className="text-[#3E4043] bg-[#F8F8F8]" color="gray" radius="3px">
              {getCurrentLang(item, locale)?.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="font-semibold text-xl mt-10">{t("Workplace")}</div>
      <div className="flex flex-col gap-1 mt-2">
        {data?.addresses?.map((workplace) => (
          <div key={`${workplace.stateId}-${workplace.address}`} className="flex items-center gap-2">
            <MapPin height={16} width={16} />
            <span>{[workplace.address, getStateLabel(workplace.stateId)].filter((e) => !isNil(e)).join(", ")}</span>
          </div>
        ))}
      </div>

      <div className="font-semibold text-xl mt-10">{t("Information")}</div>
      <div className="flex flex-col gap-1 mt-2 text-sm">
        <div>
          {t("Email")}:&nbsp;<strong>{data?.email}</strong>
        </div>
        <div>
          {t("Phone number")}:&nbsp;<strong>{data?.phoneNumber}</strong>
        </div>
        <div>
          {t("Tax code")}:&nbsp;<strong>{data?.taxCode}</strong>
        </div>
      </div>

      {socials.length > 0 && (
        <>
          <div className="font-semibold text-xl mt-10">{t("Socials")}</div>
          <div className="flex items-center gap-3 mt-2">
            {socials.map((item) => (
              <a
                key={item.href}
                href={item.href}
                title={item.label}
                target="_blank"
                style={{ backgroundColor: item.color }}
                className="inline-block p-1 bg-[#ccc] rounded-sm"
                rel="noreferrer"
              >
                <Image alt={item.label} src={item.image} width={24} height={24} />
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BoxDescription;
