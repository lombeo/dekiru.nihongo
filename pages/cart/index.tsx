import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import useFetchCart from "@src/hooks/useCart/useFetchCart";
import CartIndex from "@src/modules/cart/CartIndex";
import { selectIsFetched } from "@src/store/slices/cartSlice";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Page = () => {
  const { t } = useTranslation();

  const isFetched = useSelector(selectIsFetched);

  const fetchCart = useFetchCart();

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <>
      <HeadSEO title={t("Cart")} />
      <DefaultLayout bgGray>{isFetched && <CartIndex />}</DefaultLayout>
    </>
  );
};

export default Page;
