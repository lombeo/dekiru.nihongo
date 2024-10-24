import { Image } from "@mantine/core";
import { Container } from "@src/components";
import ExternalLink from "@src/components/ExternalLink";
import Link from "@src/components/Link";
import {
  ID_HELP_GENERAL_TRANSACTION,
  ID_HELP_PAYMENT_INSTRUCTIONS,
  ID_HELP_PRIVACY_POLICY,
  ID_HELP_RETURN_POLICY,
  ID_HELP_SERVICE_USAGE,
  ID_HELP_WARRANTY_POLICY,
} from "@src/config";
import { EMAIL_SUPPORT } from "@src/constants/contact.constant";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styles from "./Footer.module.css";

const Footer = (props: any) => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;

  return (
    <footer id="footer" className="bg-[#111928] text-white py-8">
      <Container size="xl">
        {/* Use flex-wrap to allow stacking and direction change based on screen size */}
        <div className="flex flex-col md:flex-row justify-between items-start pb-6">
          <div className="flex-shrink-0">
            <img src="/images/footer-logo.svg" alt="CodeLearn" className="mt-5 mb-5" width={250} height={79.95} />
            <p className="text-sm mt-4 max-w-[368px] text-[#ffffff] opacity-75">
              {t(
                "CodeLearn là nền tảng tương tác trực tuyến hỗ trợ người dùng học tập, thực hành, thi đấu và đánh giá kỹ năng lập trình một cách nhanh chóng và chính xác."
              )}
            </p>
          </div>

          {/* Modify this section to stack on smaller screens */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full md:w-3/5 mt-8 md:mt-0">
            <div>
              <h4 className="text-white font-semibold text-xl mb-10">{t("Tính năng")}</h4>
              <ul className="grid grid-cols-2 w-3/4">
                <li className="mb-2">
                  <Link href="/learning" className="link-menu font-light text-[#ffffff] opacity-75">
                    {t("Học tập")}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="/training" className="link-menu font-light text-[#ffffff] opacity-75">
                    {t("Luyện tập")}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="/fights" className="link-menu font-light text-[#ffffff] opacity-75">
                    {t("Thi đấu")}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="/challenge" className="link-menu font-light text-[#ffffff] opacity-75">
                    {t("Thử thách")}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="/evaluating" className="link-menu font-light text-[#ffffff] opacity-75">
                    {t("Đánh giá")}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="/discussion" className="link-menu font-light text-[#ffffff] opacity-75">
                    {t("Thảo luận")}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="/leaderboard" className="link-menu font-light text-[#ffffff] opacity-75">
                    {t("Xếp hạng")}
                  </Link>
                </li>
                {locale === "vi" && (
                  <li className="mb-2">
                    <Link href="/sharing" className="link-menu font-light text-[#ffffff] opacity-75">
                      {t("Chia sẻ")}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            {/* Information */}
            <div>
              <h4 className="text-white text-xl mb-10 font-semibold">{t("Thông tin")}</h4>
              <ul>
                <li className="mb-2">
                  <Link href="/aboutus" className="link-menu font-light text-[#ffffff] opacity-75">
                    {t("Về chúng tôi")}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="/terms" className="link-menu font-light text-[#ffffff] opacity-75">
                    {t("Điều khoản sử dụng")}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="/help" className="link-menu font-light text-[#ffffff] opacity-75">
                    {t("Trợ giúp")}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="/contact" className="link-menu font-light text-[#ffffff] opacity-75">
                    {t("Liên hệ chúng tôi")}
                  </Link>
                </li>
              </ul>
            </div>
            {/* Customer Care */}
            <div>
              <h4 className="text-white font-semibold text-xl mb-10">{t("Chăm sóc khách hàng")}</h4>
              <ul>
                <li className="mb-2">
                  <Link
                    href={`/help/${ID_HELP_PAYMENT_INSTRUCTIONS}`}
                    className="link-menu font-light text-[#ffffff] opacity-75"
                  >
                    {t("Hướng dẫn thanh toán")}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    href={`/help/${ID_HELP_GENERAL_TRANSACTION}`}
                    className="link-menu font-light text-[#ffffff] opacity-75"
                  >
                    {t("Điều kiện giao dịch chung")}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    href={`/help/${ID_HELP_SERVICE_USAGE}`}
                    className="link-menu font-light text-[#ffffff] opacity-75"
                  >
                    {t("Quy trình sử dụng dịch vụ")}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    href={`/help/${ID_HELP_WARRANTY_POLICY}`}
                    className="link-menu font-light text-[#ffffff] opacity-75"
                  >
                    {t("Chính sách bảo hành")}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    href={`/help/${ID_HELP_RETURN_POLICY}`}
                    className="link-menu font-light text-[#ffffff] opacity-75"
                  >
                    {t("Chính sách hoàn trả hàng")}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    href={`/help/${ID_HELP_PRIVACY_POLICY}`}
                    className="link-menu font-light text-[#ffffff] opacity-75"
                  >
                    {t("Chính sách bảo mật")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="border-t border-gray-700 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center text-white opacity-75">
          <div className="text-sm mb-4 md:mb-0">
            <span>Cung cấp bởi </span>
            <ExternalLink href="/" className="text-white">
              CodeLearn
            </ExternalLink>
            <span> © 2024. {t("Đã đăng ký bản quyền")}</span>
          </div>

          <div className="flex gap-3">
            <a
              href="https://www.youtube.com/channel/UCpt3dSDGk5fC7uU9OeFG5ig"
              target="_blank"
              rel="noreferrer"
              className="inline-block p-2 bg-[#0E1623] rounded-full border border-gray-400"
            >
              <Image alt="Youtube" src="/images/youtube-icon.svg" width={24} height={24} />
            </a>
            <a
              href="https://www.facebook.com/CodeLearnFanpage"
              target="_blank"
              rel="noreferrer"
              className="inline-block p-2 bg-[#0E1623] rounded-full border border-gray-400"
            >
              <Image alt="Facebook" src="/images/facebook-icon.svg" width={24} height={24} />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="inline-block p-2 bg-[#0E1623] rounded-full border border-gray-400"
            >
              <Image alt="LinkedIn" src="/images/linkedin-icon.svg" width={24} height={24} />
            </a>
            <a
              href="https://twitter.com/codelearn_io"
              target="_blank"
              rel="noreferrer"
              className="inline-block p-2 bg-[#0E1623] rounded-full border border-gray-400"
            >
              <Image alt="Twitter" src="/images/twitter-icon.svg" width={24} height={24} />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
