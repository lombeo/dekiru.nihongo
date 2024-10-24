import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import RawText from "@src/components/RawText/RawText";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

interface BoxIntroduceProps {
  data: any;
}

const BoxIntroduce = (props: BoxIntroduceProps) => {
  const { data } = props;

  return (
    <div className="pt-6" id="introduce">
      <div className="w-full max-w-[calc(100vw_-_32px)]">
        <div className="flex flex-col gap-8">
          <RawText className="min-h-[260px] leading-[1.8]">{data?.about}</RawText>
          <Objectives data={data?.objectives} />
          <Skill data={data?.skill} />
        </div>
      </div>
    </div>
  );
};

export default BoxIntroduce;

interface ObjectivesProps {
  data: any;
}

const Objectives = (props: ObjectivesProps) => {
  const { data } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;

  if (!data || data.length <= 0) return null;

  return (
    <div className="bg-navy-light5 p-6 rounded-[12px] flex flex-col gap-4">
      <h3 className="font-semibold my-0 text-[24px] leading-[30px]">{t("What you will learn")}</h3>
      <div className="flex flex-col gap-4">
        {data?.map((item: string, index: number) => {
          return (
            <div key={item + locale + index}>
              <div className="flex gap-2 items-start text-navy-primary">
                <span className="text-inherit">
                  <Icon name="done" size={24} />
                </span>
                <TextLineCamp line={2}>{item}</TextLineCamp>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface SkillProps {
  data: any;
}

const Skill = (props: SkillProps) => {
  const { data } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;

  if (!data || data.length <= 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-semibold my-0 text-[24px] leading-[30px]">{t("Skills you'll gain")}</h3>
      <div className="flex flex-wrap gap-3">
        {data?.map((item: string, index: number) => (
          <div
            key={item + locale + index}
            className="border border-[#111928] px-3 py-1 min-h-[38px] flex items-center rounded-[4px]"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
