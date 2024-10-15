import { Breadcrumbs } from "@edn/components";
import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { QuestionForm } from "@src/modules/cms/banks/form/QuestionForm";
import { GetStaticPaths, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"])),
    },
  };
}

const QuestionPage: NextPage = () => {
  const router = useRouter();
  const questionBankId: any = router.query.questionBankId;
  const { t } = useTranslation();

  return (
    <>
      <HeadSEO title={"CMS"} />
      <DefaultLayout
      // allowAnyRoles={[
      //   UserRole.Administrator,
      //   UserRole.OwnerCourse,
      //   UserRole.ManagerContent,
      //   UserRole.SiteOwner,
      //   UserRole.OwnerContest,
      //   UserRole.TestCenter,
      //   UserRole.OwnerTestCenter,
      //   UserRole.ReviewTestCenter,
      //   UserRole.ManagerTestCenter,
      // ]}
      >
        <Container size="xl">
          <Breadcrumbs
            data={[
              {
                href: "/cms/question-bank",
                title: t("Bank management"),
              },
              {
                href: `/cms/question-bank/${questionBankId}`,
                title: t("Bank"),
              },
              {
                title: "Question",
              },
            ]}
          />
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
