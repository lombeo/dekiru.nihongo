import { Breadcrumbs } from "@edn/components";
import { Button, Loader } from "@mantine/core";
import { Container } from "@src/components";
import { Notify } from "@src/components/cms";
import DefaultLayout from "@src/components/Layout/Layout";
import Link from "@src/components/Link";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { useNextQueryParam } from "@src/helpers/query-utils";
import { PaymentService, TransactionStatus } from "@src/services/PaymentService";
import { isNil } from "lodash";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const SuccessTransaction = () => {
  const { t } = useTranslation();

  const transactionId = useNextQueryParam("transactionId");
  const orderId = useNextQueryParam("orderId");
  const typeCom = useNextQueryParam("type");
  const [isLoading, setIsLoading] = useState(false);
  const refInterval = useRef(null);

  useEffect(() => {
    if (!transactionId) return;
    handleIntervalFetchTransaction(transactionId);
  }, [transactionId]);

  const breadcrumbsList = useMemo(() => {
    const result = [
      {
        title: t("Home"),
        href: "/",
      },
      {
        title: t("Cart"),
        href: "/cart",
      },
      {
        title: t("Payment success"),
      },
    ];
    if (typeCom === "1") result.splice(1, 1);
    return result;
  }, [typeCom]);

  const handleIntervalFetchTransaction = (transactionId: string) => {
    refInterval.current && clearInterval(refInterval.current);
    refInterval.current = setInterval(async () => {
      const res = await PaymentService.getTransaction({ provider: 1, transactionId });
      if (res?.data?.success && !isNil(res.data?.data?.status)) {
        if (![TransactionStatus.PENDING, TransactionStatus.UNKNOWN].includes(res.data.data.status)) {
          refInterval.current && clearInterval(refInterval.current);
        }
        if ([TransactionStatus.ENDED, TransactionStatus.SUCCESS].includes(res.data.data.status)) {
          setIsLoading(true);
        }
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
        refInterval.current && clearInterval(refInterval.current);
      }
    }, 2000);
  };

  return (
    <>
      <HeadSEO title={t("Thank you")} />
      <DefaultLayout allowAnonymous>
        <div className="bg-navy-light5 pb-[98px]">
          <Container size="xl">
            <Breadcrumbs data={breadcrumbsList} />
            <div className="mt-[52px] mx-auto shadow-[0_5px_12px_rgba(0,0,0,0.1)] lg:px-[55px] lg:py-[52px] py-6 px-4 rounded-[12px] bg-white flex flex-col items-center justify-center gap-3 border-t-[3px] border-navy-primary w-full max-w-[460px]">
              {isLoading ? (
                <>
                  <Image quality={100} alt="success" width={145} height={148} src="/images/payment/success-2.png" />
                  <h1 className="text-[24px] leading-[30px] font-bold mb-0 mt-5 text-center">
                    {t("Congratulations on your successful payment!")}
                  </h1>
                  <h2 className="my-0 font-normal text-lg leading-[28px]">
                    {t("Please continue to study and practice.")}
                  </h2>
                  <div className="mt-5 flex items-center gap-4">
                    <Link href={`/payment/orders/result/${orderId}`}>
                      <Button radius="md" size="lg" className="text-base" variant="outline">
                        {t("View order")}
                      </Button>
                    </Link>
                    <Link href="/learning">
                      <Button radius="md" size="lg" className="text-base">
                        {t("Course")}
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-[24px] leading-[30px] font-bold mb-0 mt-5 text-center">
                    {t("Verifying payment")}
                  </h1>
                  <Loader color="blue" />
                </>
              )}
            </div>
          </Container>
        </div>
      </DefaultLayout>
    </>
  );
};

export default SuccessTransaction;
