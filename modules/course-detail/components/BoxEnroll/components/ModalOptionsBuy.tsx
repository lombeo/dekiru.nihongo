import { Button, Card, CloseButton, Modal, Title, Image, CheckIcon, clsx } from "@mantine/core";
import { useProfileContext } from "@src/context/Can";
import useAddItemCart from "@src/hooks/useCart/useAddItemCart";
import { CommentContextType } from "@src/services/CommentService/types";
import { useTranslation } from "next-i18next";
import ModalBuyCode from "../../ModalBuyCode";
import { useState } from "react";

interface ModalOptionBuyProps {
  onClose: () => void;
  onAddedToCart: () => void;
  onBuyNow: () => void;
  data: any;
  priceAfterDiscount: number;
  isBuyCode: boolean;
}

const ModalOptionBuy = (props: ModalOptionBuyProps) => {
  const { data, priceAfterDiscount, onClose, onBuyNow, onAddedToCart, isBuyCode } = props;

  const { t } = useTranslation();

  const addItemCart = useAddItemCart();

  const { authorized } = useProfileContext();

  const [selectedTab, setSelectedTab] = useState(authorized ? (isBuyCode ? 2 : 1) : 2);

  const handleAddToCart = async (count?: number, otherData?: any) => {
    const params: any = {
      contextId: data.id,
      thumbnail: data.thumbnail,
      title: data.title,
      contextType: CommentContextType.Course,
      link: `/learning/${data.permalink}`,
      count: 1,
      price: data.price,
      discount: data.price - priceAfterDiscount,
    };
    if (selectedTab === 2) {
      params.count = count ?? 1;
      params.data = {
        ...otherData,
        isVoucher: true,
      };
    }
    const success = await addItemCart(params);
    if (success) {
      onAddedToCart();
    }
  };

  return (
    <Modal opened size="xl" onClose={onClose} radius={12} withCloseButton={false}>
      <div className="relative space-y-6 px-6 -mt-4">
        <CloseButton onClick={onClose} className="absolute -top-1 -right-1" />
        <Title size={24} className="text-center ">
          {t("Transaction information")}
        </Title>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="w-full text-center space-y-6">
            <div
              className={clsx("relative flex flex-col justify-center items-center cursor-pointer  rounded-2xl", {
                "border-[#506CF0] border-2": selectedTab === 1,
                " opacity-30 cursor-not-allowed pointer-events-none": !authorized || isBuyCode,
              })}
              onClick={() => setSelectedTab(1)}
            >
              <Card radius={16} className="w-full ">
                <Card.Section>
                  <Image src={data.thumbnail} alt="Dekiru" height={172} withPlaceholder />
                </Card.Section>
              </Card>
              <Button
                variant="outline"
                className={clsx("absolute -bottom-5 z-10 bg-white hover:bg-slate-50 pointer-events-none", {
                  "bg-[#506CF0] text-white": selectedTab === 1,
                })}
                radius={100}
              >
                {t("Payments")}
              </Button>
              <CheckIcon
                className={clsx("w-8 h-8 absolute top-2 right-2 text-white bg-green-600 rounded-full p-2", {
                  hidden: selectedTab === 2,
                })}
              />
            </div>
            <div className="italic ">{authorized ? t("Buy and activate for me") : t("Please login to continue")}</div>
          </div>
          <div className="w-full text-center space-y-6">
            <div
              className={clsx("relative flex flex-col justify-center items-center cursor-pointer rounded-2xl", {
                "border-[#506CF0] border-2": selectedTab === 2,
              })}
              onClick={() => setSelectedTab(2)}
            >
              <Card
                radius={16}
                className="w-full flex justify-center items-center h-[172px] cursor-pointer"
                bg={"#EDF0FD"}
              >
                <Card.Section>
                  <Image src={"/images/payment/buy-code.png"} alt="buy-code" width={150} fit="cover" withPlaceholder />
                </Card.Section>
              </Card>
              <Button
                variant="outline"
                className={clsx("absolute -bottom-5 z-10 bg-white hover:bg-slate-50 pointer-events-none", {
                  "bg-[#506CF0] text-white": selectedTab === 2,
                })}
                radius={100}
              >
                {t("Buy activation code")}
              </Button>
              <CheckIcon
                className={clsx("w-8 h-8 absolute top-2 right-2 text-white bg-green-600 rounded-full p-2", {
                  hidden: selectedTab === 1,
                })}
              />
            </div>
            <div className="italic ">{t("Buy activation code for another account")}</div>
          </div>
        </div>
        {selectedTab === 2 && <ModalBuyCode courseId={data?.id} handleAddToCart={handleAddToCart} />}
        <div
          className={clsx("grid items-center gap-4 !mt-10", {
            "lg:grid-cols-2": authorized,
            hidden: selectedTab === 2,
          })}
        >
          {authorized && (
            <Button onClick={() => handleAddToCart()} className="text-base" size="lg" radius="md" color="dark">
              {t("Add to cart")}
            </Button>
          )}
          <Button onClick={onBuyNow} className="text-base" size="lg" radius="md">
            {t("Payment")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalOptionBuy;
