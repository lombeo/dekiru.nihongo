import { Badge } from "@mantine/core";
import RawText from "@src/components/RawText/RawText";
import { useTranslation } from "next-i18next";
import styled from "styled-components";

interface TabInfoProps {
  data: any;
}

const TabInfo = (props: TabInfoProps) => {
  const { data } = props;
  const { t } = useTranslation();

  if (!data) return null;

  return (
    <div className="py-5 flex flex-col">
      {/*<Divider className="mt-5" size={2} />*/}

      {/*<div className="flex justify-between gap-4 mt-5 items-center">*/}
      {/*  <div className="font-semibold text-lg uppercase">{t("Achievement")}</div>*/}
      {/*</div>*/}

      {/*<div className="mt-2 flex flex-col gap-2">*/}
      {/*  <div className="grid gap-2 grid-cols-[24px_1fr] text-[15px]">*/}
      {/*    <CircleCheck color="#30AF38" width={24} />*/}
      {/*    <span>Giải nhất FSOFT CODEWAR 2019</span>*/}
      {/*  </div>*/}
      {/*  <div className="grid gap-2 grid-cols-[24px_1fr] text-[15px]">*/}
      {/*    <CircleCheck color="#30AF38" width={24} />*/}
      {/*    <span>Giải nhất olympic tin học trường Đại học Giao Thông Vận Tải 2018</span>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<Divider className="mt-5" size={2} />*/}

      {/*<div className="flex justify-between gap-4 mt-5 items-center">*/}
      {/*  <div className="font-semibold text-lg uppercase">{t("Experience")}</div>*/}
      {/*</div>*/}
      <div className="flex justify-between gap-4 items-center mt-5">
        <Title>{t("Introduce your self")}</Title>
      </div>

      <div className="mt-3">
        <RawText>{data?.message}</RawText>
      </div>

      {/*<div className="flex justify-between gap-4 mt-5 items-center">*/}
      {/*  <div className="font-semibold text-lg uppercase">{t("Education")}</div>*/}
      {/*</div>*/}

      {/*<div className="flex justify-between gap-4 mt-5 items-center">*/}
      {/*  <div className="font-semibold text-lg uppercase">{t("Skills")}</div>*/}
      {/*</div>*/}

      {/*<div className="flex flex-col gap-3 mt-2 text-[15px]">*/}
      {/*  <div className="grid gap-2 grid-cols-[25px_auto_110px] items-center">*/}
      {/*    <Image*/}
      {/*      src="https://codelearnstorage.s3.amazonaws.com/Themes/TheCodeCampPro/Resources/Images/assets/languages/postgresql.svg"*/}
      {/*      height={25}*/}
      {/*      width={25}*/}
      {/*      alt="Postgresql"*/}
      {/*    />*/}
      {/*    <span>Postgresql</span>*/}
      {/*    <StarRatings size="md" rating={5} />*/}
      {/*  </div>*/}
      {/*</div>*/}

      {data?.certificates && data.certificates.length > 0 ? (
        <>
          <div className="flex justify-between gap-4 mt-5 items-center">
            <Title>{t("Certificate")}</Title>
          </div>

          <div className="flex flex-col gap-3 mt-3 text-[15px]">
            {data?.certificates?.map((item, index) => (
              <div key={item.name} className="text-primary text-base font-semibold">
                {index + 1}.&nbsp;
                <a href={item.uri} className="text-primary hover:underline" target="_blank" rel="noreferrer">
                  {item.name}
                </a>
              </div>
            ))}
          </div>
        </>
      ) : null}
      <div className="flex gap-3 mt-5">
        {data.tags?.map((tag) => (
          <Badge color="gray" size="lg" variant="dot" radius="sm" key={tag}>
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TabInfo;

const Title = styled.div`
  position: relative;
  margin-bottom: 6px;

  font-weight: bold;
  font-size: 18px;
  text-transform: uppercase;

  color: #ff7009;
`;
