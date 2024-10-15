import { useTranslation } from "next-i18next";

export default function ErrorMessage(props: any) {
  const { text, isVisible } = props;
  const { t } = useTranslation();
  if (!isVisible) {
    return <></>;
  }
  return (
    <p className="text-xs mt-2" style={{ color: "red" }}>
      {t(text)}
    </p>
  );
}
