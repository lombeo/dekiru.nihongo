import { useTranslation } from "next-i18next";

export interface ItemCounterProps {
  value: any;
  label: string;
  uppercase?: boolean;
  fontWeight?: "bold" | "normal";
  description?: string;
  isAllBold?: boolean;
}

const ItemCounter = (props: ItemCounterProps) => {
  const { t } = useTranslation();
  const { value, label, uppercase, fontWeight, description, isAllBold } = props;
  return (
    <>
      {!isAllBold && (
        <span className={`text-lg font-${fontWeight} ${uppercase ? " uppercase" : ""}`}>
          {label} <span className="font-semibold">{value}</span> {description}
        </span>
      )}
      {isAllBold && (
        <span className={`text-lg font-${fontWeight} ${uppercase ? " uppercase" : ""}`}>
          <span className="font-semibold">{t(description)}</span>
        </span>
      )}
    </>
  );
};

export default ItemCounter;
