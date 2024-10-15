import { forwardRef, useMemo } from "react";
import { Group, Image, Text, Select } from "@mantine/core";
import { useTranslation } from "next-i18next";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ image, label, description, ...others }: ItemProps, ref) => (
  <div ref={ref} {...others}>
    <Group noWrap>
      <Image src={image} alt={image} width={32} />
      <div>
        <Text size="sm">{label}</Text>
        <Text size="xs" opacity={0.65}>
          {description}
        </Text>
      </div>
    </Group>
  </div>
));

interface IProps {
  currentMethod: string;
  setCurrentMethod: (value: string) => void;
}

const PaymentMethods = (props: IProps) => {
  const { currentMethod, setCurrentMethod } = props;
  const { t } = useTranslation();
  const data = [
    {
      image: "/images/payment/vietqr_2.png",
      label: t("VietQR"),
      value: "2",
    },
    {
      image: "/images/payment/international-card.png",
      label: t("International card"),
      value: "5",
    },
    {
      image: "/images/payment/card.png",
      label: t("Domestic card"),
      value: "4",
    },
    // {
    //   image: "/images/payment/sp-pay.png",
    //   label: t("Shopee Pay"),
    //   value: "7",
    // },
    {
      image: "/images/payment/mobile.png",
      label: t("Mobile Banking"),
      value: "6",
    },
    {
      image: "/images/payment/fpt_pay_2.png",
      label: t("FPT Pay"),
      value: "1",
    },
  ];

  const CurrentIcon = useMemo(() => {
    const imgUrl = data.find((item) => item.value === currentMethod);
    if (!currentMethod) return;
    return <Image src={imgUrl.image} alt={imgUrl.image} width={32} />;
  }, [currentMethod]);

  return (
    <Select
      placeholder={t("Choose payment method")}
      itemComponent={SelectItem}
      data={data}
      searchable
      clearable
      value={currentMethod}
      size="lg"
      radius={8}
      icon={CurrentIcon}
      onChange={(value) => setCurrentMethod(value)}
      maxDropdownHeight={600}
      nothingFound={t("No result found")}
      filter={(value, item) => item.label.toLowerCase().includes(value.toLowerCase().trim())}
    />
  );
};

export default PaymentMethods;
