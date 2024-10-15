import Link from "@src/components/Link";
import { AppIcon } from "@src/components/cms/core/Icons";
import { questionTypes } from "@src/constants/cms/question-bank/question.constant";
import { Card, Modal } from "components/cms";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";

export const CreateQuestionPopup = (props: any) => {
  const { questionBankId } = props;
  const { t } = useTranslation();
  const { isOpen, onClose } = props;

  return (
    <>
      <Modal
        opened={isOpen}
        onClose={onClose}
        closeOnClickOutside={false}
        title={t(LocaleKeys["Type of question"])}
        size="xl"
      >
        <div className={"grid grid-cols-3 gap-5"}>
          {questionTypes
            // .filter((x) => !x.hideInModal)
            .map((x: any, idx: any) => {
              return (
                <Link key={idx} href={`/cms/question-bank/${questionBankId}/question/create?type=${x.type}`}>
                  <Card
                    className="rounded bg-smoke text-sm font-semibold flex items-center gap-5 hover:shadow cursor-pointer"
                    padding="lg"
                  >
                    <AppIcon name={x.icon} size="lg" />
                    <div>{t(x.label)}</div>
                  </Card>
                </Link>
              );
            })}
        </div>
      </Modal>
    </>
  );
};
