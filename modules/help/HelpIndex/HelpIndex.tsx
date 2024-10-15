import { Breadcrumbs } from "@edn/components";
import { ActionIcon, Collapse } from "@mantine/core";
import { Container } from "@src/components";
import RawText from "@src/components/RawText/RawText";
import { useRouter } from "@src/hooks/useRouter";
import SharingService from "@src/services/Sharing/SharingService";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Help } from "tabler-icons-react";

const HelpIndex = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const [activeItem, setActiveItem] = useState(null);

  const dataMultiLang = activeItem?.multiLang?.find((e) => e.languageKey === keyLocale) || activeItem?.multiLang?.[0];

  useEffect(() => {
    if (activeItem) {
      if (activeItem?.parentId) {
        window.history.pushState(null, "", `?activityId=${activeItem?.parentId}&childrenId=${activeItem?.id}`);
      } else {
        window.history.pushState(null, "", `?activityId=${activeItem?.id}`);
      }
    }
  }, [activeItem]);

  const fetch = async () => {
    const res = await SharingService.helpSearch({
      pageIndex: 1,
      pageSize: 100,
    });
    if (res?.data?.success) {
      let data = res?.data?.data;
      if (data.length) {
        const params = new URLSearchParams(window.location.search);
        const activityIdTemp = params.get("activityId");
        const childrenIdTemp = params.get("childrenId");
        let activeItemTemp;

        if (childrenIdTemp) {
          activeItemTemp = data.find((item) => item.id == childrenIdTemp);
        } else if (activityIdTemp) {
          activeItemTemp = data.find((item) => item.id == activityIdTemp);
        }

        if (activeItemTemp) {
          setActiveItem(activeItemTemp);
        } else {
          setActiveItem(data[0]);
        }

        data?.forEach((e) => {
          if (e.parentId) {
            const parent = data.find((subE) => subE.id === e.parentId);
            if (!parent) return;
            if (parent.children) {
              parent.children.push(e);
            } else {
              parent.children = [e];
            }
          }
        });
        return data?.filter((e) => !e.parentId && e.multiLang?.some((e) => e.languageKey === keyLocale));
      }
    }
    return null;
  };

  const { data } = useQuery({ queryKey: ["helpGetList"], queryFn: () => fetch() });

  return (
    <div className="mb-20">
      <Container>
        <Breadcrumbs
          data={[
            {
              href: "/",
              title: t("Home"),
            },
            {
              title: t("Help"),
            },
          ]}
        />

        <div className="grid gap-5 lg:grid-cols-[290px_auto]">
          <div className="bg-white min-h-[800px] flex flex-col py-5 px-6 shadow-lg rounded-md">
            <div className="font-semibold text-lg flex gap-2">
              <ActionIcon className="bg-[#33485f]">
                <Help color="white" width={16} />
              </ActionIcon>
              {t("Popular Question(s)")}
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {data?.map((e) => (
                <Item parentId={e?.id} activeItem={activeItem} onSelect={setActiveItem} data={e} key={e.id} />
              ))}
            </div>
          </div>

          <div className="p-5 bg-white shadow-lg rounded-md">
            <RawText>{dataMultiLang?.description}</RawText>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HelpIndex;

const Item = (props: any) => {
  const { data, activeItem, onSelect } = props;

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    if (data?.id === activeItem?.parentId) setCollapse(true);
  }, []);

  const dataMultiLang = data.multiLang?.find((e) => e.languageKey === keyLocale) || data.multiLang?.[0];
  const isHaveChildren = data.children?.length > 0;

  return (
    <div>
      <div
        className={clsx("cursor-pointer text-[#666] hover:opacity-80", {
          "!text-[#172b4d] font-semibold": activeItem?.id === data.id,
        })}
        onClick={() => {
          onSelect(data);
          if (isHaveChildren) {
            setCollapse((prev) => !prev);
          }
        }}
      >
        {dataMultiLang?.title}
      </div>
      {isHaveChildren && (
        <Collapse in={collapse}>
          <div className={"flex mt-1 gap-2 ml-8 flex-col"}>
            {data.children?.map((item) => {
              const dataMultiLang = item.multiLang?.find((e) => e.languageKey === keyLocale) || item.multiLang?.[0];
              return (
                <div
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className={clsx("cursor-pointer hover:opacity-80", {
                    "text-[#172b4d] font-semibold": activeItem?.id === item.id,
                  })}
                >
                  {dataMultiLang?.title}
                </div>
              );
            })}
          </div>
        </Collapse>
      )}
    </div>
  );
};
