import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { GetStaticPaths } from "next";
import EventLuckySpin from "@src/modules/event/LuckySpin";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default function EventLuckySpinWrapper() {
  return (
    <>
      <HeadSEO
        title="ĐƯỜNG ĐUA LẬP TRÌNH"
        description='"Đường đua lập trình 2024" là cuộc thi trực tuyến quy mô toàn quốc, dành cho các học sinh từ khối lớp 1 - lớp 9 yêu thích bộ môn lập trình, tổng giải thưởng lên tới 500 triệu đồng'
        ogImage="/images/event/event-thumbnail.jpg"
      />
      <DefaultLayout allowAnonymous>
        <div className="image-fit">
          <EventLuckySpin />
        </div>
      </DefaultLayout>
    </>
  );
}
