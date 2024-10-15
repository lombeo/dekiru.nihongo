import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
// import IndexView from "@src/modules/index/IndexView";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NewLanding from "@src/modules/index/NewLanding";
import { getAccessToken } from "@src/api/axiosInstance";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Page = () => {
  const token = getAccessToken();

  return (
    <>
      <HeadSEO />
      <DefaultLayout allowAnonymous>
        {/* <IndexView /> */}
        <NewLanding />
      </DefaultLayout>
    </>
  );
};

export default Page;
