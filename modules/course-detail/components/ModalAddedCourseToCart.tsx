import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import { Button, Image, Modal } from "@mantine/core";
import StarRatings from "@src/components/StarRatings";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useRef, useEffect } from "react";

interface ModalAddedCourseToCartProps {
  onClose: () => void;
  thumbnail: string;
  title: string;
  owner: string;
  rating: any;
  duration: number;
  totalStudent: number;
  price: number;
  discount: number;
  actualPrice: number;
}

const ModalAddedCourseToCart = (props: ModalAddedCourseToCartProps) => {
  const { onClose, thumbnail, title, owner, rating, duration, totalStudent, price, discount, actualPrice } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const { asPath } = router;

  const urlParams = useRef(null);

  useEffect(() => {
    if (asPath) {
      const arr = asPath.split("?");
      if (arr.length > 1) urlParams.current = arr[1];
    }
  }, [asPath]);

  const handleGoToCart = () => {
    let path = "/cart";
    if (urlParams.current) path += `?${urlParams.current}`;
    router.push(`${path}`);
  };

  return (
    <Modal
      classNames={{ title: "font-bold text-lg" }}
      opened
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          {t("Added to cart")} <Icon className="text-green-500" name="check-circle" size="xl" />
        </div>
      }
      size="lg"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-row gap-4 items-start">
          <Image
            height={80.34}
            width={146}
            alt="thumbnail"
            src={thumbnail}
            className="rounded-[6px] object-fit overflow-hidden min-w-fit"
          />
          <div className="flex flex-col gap-1">
            <TextLineCamp className="font-bold text-sm">{title}</TextLineCamp>
            <div className="flex flex-wrap sm:flex-row text-sm items-start sm:items-center gap-4">
              <div className="flex flex-row items-center gap-1">
                <StarRatings rating={rating?.averageRating} size="sm" /> <span>{rating?.averageRating}</span>
              </div>
              <div className="flex flex-row items-center gap-1">
                <Image
                  src="/images/learning/watch-circle-time-dark.png"
                  width={12}
                  height={12}
                  alt="watch-circle-time"
                />
                {t("course_sticky.learning_hours", {
                  count: duration,
                })}
              </div>
              <div className="flex flex-row items-center gap-1">
                <Image
                  src="/images/learning/user-multiple-group-dark.png"
                  width={12}
                  height={12}
                  alt="user-multiple-group"
                />
                {FunctionBase.formatNumber(totalStudent || 0)} {t(totalStudent > 1 ? "students" : "student")}
              </div>
            </div>
            <div className="flex flex-row gap-[6px] text-sm">
              <TextLineCamp className="font-bold">
                {FunctionBase.formatNumber(actualPrice, {
                  style: "currency",
                  currency: "VND",
                })}
              </TextLineCamp>
              {discount > 0 && (
                <div className="flex flex-row gap-2">
                  <TextLineCamp className="font-semibold text-[#637381] line-through">
                    {FunctionBase.formatNumber(price, {
                      style: "currency",
                      currency: "VND",
                    })}
                  </TextLineCamp>
                  <div className="rounded-[2px] font-semibold w-[36px] h-[24px] flex items-center justify-center text-xs text-[#F23030] bg-[#FBBF24]">
                    {discount}%
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Button radius="md" color="dark" className="w-full" onClick={handleGoToCart}>
          {t("Go to cart")}
        </Button>
      </div>
    </Modal>
  );
};

export default ModalAddedCourseToCart;
