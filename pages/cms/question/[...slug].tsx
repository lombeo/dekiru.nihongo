import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { QuestionForm } from "@src/modules/cms/banks/form/QuestionForm";
import { GetStaticPaths, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"])),
    },
  };
}

const QuestionPage: NextPage = () => {
  return (
    <>
      <HeadSEO title={"CMS"} />
      <DefaultLayout>
        <Container size="xl">
          <QuestionForm />
        </Container>
      </DefaultLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
export default QuestionPage;
