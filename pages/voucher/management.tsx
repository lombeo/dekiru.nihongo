import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import VoucherManagement from "@src/modules/voucher/VoucherManagement";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Page = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeadSEO title={t("Voucher management")} />
      <DefaultLayout bgGray>
        <VoucherManagement />
      </DefaultLayout>
    </>
  );
};

export default Page;
