import { Visible } from "@edn/components";
import { Button } from "components/cms/core";
import { useTranslation } from "next-i18next";

interface FormActionButtonProps {
  onDiscard?: any;
  onSave?: any;
  extra?: any;
  textDiscard?: any;
  textSave?: any;
  size?: any;
  discardDisabled?: any;
  saveDisabled?: any;
  enableSave?: boolean;
  enableDiscard?: boolean;
  enableRuntest?: boolean;
  enableRelease?: boolean;
  releaseDisabled?: boolean;
  runTestDisabled?: boolean;
  textRunTest?: any;
  externalHref?: string;
  onRelease?: () => any;
  disabled?: boolean;
}

export const FormActionButton = (props: FormActionButtonProps) => {
  const { t } = useTranslation();
  const {
    onDiscard,
    onSave,
    extra,
    textDiscard = t("Discard"),
    textSave = t("Save"),
    size = "sm",
    discardDisabled = false,
    saveDisabled = false,
    enableSave = true,
    enableDiscard = true,
    enableRuntest = false,
    enableRelease,
    releaseDisabled,
    runTestDisabled = false,
    textRunTest = t("Run test"),
    onRelease,
    externalHref,
    disabled,
  } = props;
  return (
    <div className="flex justify-end gap-3 mb-6">
      {extra}
      {!disabled && (
        <>
          <Visible visible={enableRelease && !onSave ? true : false}>
            <Button preset="secondary" disabled={releaseDisabled} size={size} onClick={onRelease}>
              {t("Release")}
            </Button>
          </Visible>
          <Visible visible={enableDiscard}>
            <Button preset="secondary" size={size} disabled={discardDisabled} onClick={onDiscard}>
              {textDiscard}
            </Button>
          </Visible>
        </>
      )}
      <Visible visible={enableRuntest && !onSave ? true : false}>
        <Button
          component="a"
          target={"_blank"}
          preset="secondary"
          disabled={runTestDisabled}
          size={size}
          href={externalHref}
        >
          {textRunTest}
        </Button>
      </Visible>
      {!disabled && (
        <>
          <Visible visible={enableSave && !onSave ? true : false}>
            <Button preset="primary" disabled={saveDisabled} type="submit" size={size}>
              {textSave}
            </Button>
          </Visible>
          <Visible visible={enableSave && onSave ? true : false}>
            <Button preset="primary" disabled={saveDisabled} onClick={onSave} size={size}>
              {textSave}
            </Button>
          </Visible>
        </>
      )}
    </div>
  );
};
