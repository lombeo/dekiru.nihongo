// import { LoadingOverlay } from "components";
import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { CreateQuestionBankButton } from "@src/modules/cms/banks/CreateQuestionBankButton";
import { QuestionList } from "@src/modules/cms/banks/QuestionList";
import { LocaleKeys } from "@src/public/locales/locale";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"])),
    },
  };
}

const QuestionPage: NextPage = () => {
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
      //   UserRole.TestCenter,
      //   UserRole.OwnerTestCenter,
      //   UserRole.ReviewTestCenter,
      //   UserRole.ManagerTestCenter,
      // ]}
      // rightComponent={<CreateQuestionBankButton />}
      >
        <Container size="xl">
          <div className="flex items-center justify-between">
            <div>{t(LocaleKeys["Question"])}</div>
            <CreateQuestionBankButton />
          </div>
          <QuestionList />
        </Container>
      </DefaultLayout>
    </>
  );
};

export default QuestionPage;
