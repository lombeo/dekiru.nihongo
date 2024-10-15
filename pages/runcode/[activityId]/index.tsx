import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import CodelearnIDE from "@src/packages/codelearn/src/components/CodelearnIDE/CodelearnIDE";
import IdeContextProvider from "@src/packages/codelearn/src/components/CodelearnIDE/IdeContext";
import { GetStaticPaths, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
const ActivityDetailPage: NextPage = () => {
  return (
    <>
      <HeadSEO />
      <DefaultLayout hiddenFooter>
        <IdeContextProvider isRunCodePage>
          <CodelearnIDE />
        </IdeContextProvider>
      </DefaultLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths<{
  activityId: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ActivityDetailPage;
