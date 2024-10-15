import { AppIcon } from "@src/components/cms/core/Icons";
import { Card, Modal } from "components/cms";
import { activityCodeTypes } from "constants/cms/activity-code/activity-code.constant";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const TypeCodeActivityPopup = (props: any) => {
  const { t } = useTranslation();
  // const { onClose } = props;
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const router = useRouter();
  const parts = router.asPath.split("?");
  const leftPart = parts ? parts[0] : router.asPath;
  const params = parts ? new URLSearchParams(parts[1]) : new URLSearchParams();

  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);

  const chooseType = (idx: any) => {
    params.set("type", idx);
    router.push({ pathname: leftPart, search: params.toString() });
    setIsOpen(false);
  };

  return (
    <>
      <Modal
        opened={isOpen}
        // hideCloseButton={true}
        onClose={() => {
          setIsOpen(false);
          router.back();
        }}
        closeOnClickOutside={false}
        title={t("Type of code activity")}
        size="lg"
      >
        <div className="grid lg:grid-cols-2 gap-5">
          {activityCodeTypes
            .filter((x) => !x.hideInModal)
            .map((x: any, idx: any) => {
              return (
                <div onClick={() => chooseType(idx)} key={idx}>
                  <a>
                    <Card
                      className="rounded bg-smoke text-sm font-semibold flex items-center gap-5 hover:shadow cursor-pointer"
                      padding="lg"
                      style={{ height: "100%" }}
                    >
                      <AppIcon name={x.icon} size="lg" />
                      <div>{t(x.label)}</div>
                    </Card>
                  </a>
                </div>
              );
            })}
        </div>
      </Modal>
    </>
  );
};
