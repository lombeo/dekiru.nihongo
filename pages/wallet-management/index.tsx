import DefaultLayout from "@src/components/Layout/Layout";
import WalletManagement from "@src/modules/wallet/WalletManagement";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const WalletManagementPage = () => {
  return (
    <DefaultLayout bgGray>
      <WalletManagement />
    </DefaultLayout>
  );
};

export default WalletManagementPage;
