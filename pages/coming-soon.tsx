import { Button } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { Image } from "@mantine/core";
import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import Link from "@src/components/Link";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default function Custom403() {
  const { t } = useTranslation();
  return (
    <>
      <HeadSEO />
      <DefaultLayout allowAnonymous>
        <Container>
          <div className="flex flex-col items-center justify-center max-w-full overflow-hidden my-20 h-full w-full">
            <div className="w-[485px] max-w-full">
              <Image src="/images/error/1782224.webp" alt="" fit="contain" />
            </div>
            Chúng tôi đang trong quá trình mang chức năng này đến sớm nhất với bạn!
            <Link href="/">
              <Button variant="filled" className={"mt-6"} leftIcon={<Icon name="home" size={20} />}>
                {t("Back to home")}
              </Button>
            </Link>
          </div>
        </Container>
      </DefaultLayout>
    </>
  );
}
