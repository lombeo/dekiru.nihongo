import { Skeleton } from "@mantine/core";
import RawText from "@src/components/RawText/RawText";
import { useGetStateLabel } from "@src/hooks/useCountries";
import { useTranslation } from "next-i18next";
import { Mail, MapPin, Phone, User } from "tabler-icons-react";

const BoxDescription = (props: any) => {
  const { data, status } = props;
  const { t } = useTranslation();
  const getStateLabel = useGetStateLabel();

  return (
    <div className="rounded-md shadow-md bg-white p-5">
      <div className="font-semibold text-xl mb-4 text-[#FF4D00]">{t("Job description")}</div>

      {status === "success" ? <RawText>{data?.fullDescription}</RawText> : <Skeleton height={240} />}

      <div className="font-semibold text-xl mt-14 mb-4 text-[#FF4D00]">{t("Job requirements")}</div>
      {status === "success" ? <RawText>{data?.requirement}</RawText> : <Skeleton height={240} />}

      <div className="font-semibold text-xl mt-14 mb-4 text-[#FF4D00]">{t("Benefits")}</div>
      {status === "success" ? <RawText>{data?.benefits}</RawText> : <Skeleton height={200} />}

      {/*<div className="font-semibold text-xl mt-14">{t("Location")}</div>*/}
      {/*<div className="flex flex-col gap-1 mt-2">*/}
      {/*  {data?.workplaces?.map((workplace) => (*/}
      {/*    <div key={`${workplace.stateId}-${workplace.address}`} className="flex items-center gap-2">*/}
      {/*      <MapPin height={16} width={16} />*/}
      {/*      <span>*/}
      {/*        {workplace.address}, {getStateLabel(workplace.stateId)}*/}
      {/*      </span>*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*</div>*/}
      <div className="font-semibold text-xl mt-14 text-[#FF4D00]">{t("Contact")}</div>
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-2">
          <User height={20} width={20} />
          <span>{data?.contactInfo?.fullName}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin height={20} width={20} />
          <span>{data?.contactInfo?.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone height={20} width={20} />
          <span>{data?.contactInfo?.phoneNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail height={20} width={20} />
          <span>{data?.contactInfo?.email}</span>
        </div>
      </div>

      {data?.externalink && (
        <>
          <div className="font-semibold text-xl mt-14 text-[#FF4D00]">{t("Source")}</div>
          <a href={data.externalink}>{data.externalink}</a>
        </>
      )}
    </div>
  );
};

export default BoxDescription;
