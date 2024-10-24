import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DefaultLayout from "@src/components/Layout/Layout";
import { useTranslation } from "next-i18next";
import HeadSEO from "@src/components/SEO/HeadSEO";
import ExchangeGift from "@src/modules/event/ExchangeGift/ExchangeGift";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default function ExchangeRewards() {
  const { t } = useTranslation();

  return (
    <>
      <HeadSEO title={t("Exchange rewards")} />
      <DefaultLayout allowAnonymous bgGray>
        <ExchangeGift />
      </DefaultLayout>
    </>
  );
}
