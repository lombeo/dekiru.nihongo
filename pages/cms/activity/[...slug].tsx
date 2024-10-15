import { Breadcrumbs } from "@edn/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { ActivityForm } from "@src/modules/cms/activities/form/ActivityForm";
import { Container } from "components";
import { activityTypes } from "constants/activity/activity.constant";
import { useRouter } from "hooks/useRouter";
import { GetStaticPaths, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"])),
    },
  };
}

const SingleActivityPage: NextPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const slug: any = router.query.slug ? router.query.slug : "";
  const actionType = slug[0] ? slug[0] : "create";
  const actionId = slug[1];

  const getTitle = () => {
    const activity = activityTypes.find((x: any) => x.type == actionId);
    if (!activity) return "Activity";
    return t(`${actionType === "edit" ? "Edit" : "Create"} ${activity.label?.toLowerCase()}`);
  };

  const getBreadCrumbs = () => [
    {
      href: "/cms/activities",
      title: t("Activity management"),
    },
    {
      title: getTitle(),
    },
  ];

  return (
    <>
      <HeadSEO title={"CMS"} />
      <DefaultLayout>
        <Container size="xl">
          <div className="max-w-4xl mx-auto">
            <Breadcrumbs className="items-baseline" data={getBreadCrumbs()} />
            <h2 className="text-xl font-bold">{getTitle()}</h2>
            <ActivityForm action={actionType} actionId={actionId} />
          </div>
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

export default SingleActivityPage;
