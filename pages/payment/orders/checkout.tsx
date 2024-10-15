import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import PaymentView from "@src/modules/payment/PaymentView";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const CheckoutPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeadSEO title={t("Payment")} />
      <DefaultLayout bgGray allowAnonymous>
        <PaymentView />
      </DefaultLayout>
    </>
  );
};
export default CheckoutPage;
