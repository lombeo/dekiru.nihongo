import { Breadcrumbs } from "@edn/components";
import { getAccessToken } from "@src/api/axiosInstance";
import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import ChangePassword from "@src/modules/user/ChangePassword";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";

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
      <HeadSEO title={t("Change password")} />
      <DefaultLayout bgGray allowAnonymous>
        <ChangePasswordWrap />
      </DefaultLayout>
    </>
  );
};

export default Page;

const ChangePasswordWrap = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const token = getAccessToken();

  if (!token) {
    return (
      <div>
        <Container>
          <Breadcrumbs
            data={[
              {
                href: `/`,
                title: t("Home"),
              },
              {
                href: `/user/information`,
                title: t("My information"),
              },
              {
                title: t("Change password"),
              },
            ]}
          />
          <div
            onClick={() => {
              dispatch(setOpenModalLogin(true));
            }}
            className="text-[red] italic mb-20"
          >
            {t("Please sign in to update your password!")}
          </div>
        </Container>
      </div>
    );
  }
  return <ChangePassword />;
};
