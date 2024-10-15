import styles from "@src/components/Certificate/certificate.module.scss";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useRouter } from "@src/hooks/useRouter";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useRef } from "react";

interface CertificateImageProps {
  isDone?: boolean;
  courseTitleVN?: any;
  courseTitleEN?: any;
  finishedTime?: any;
  userName?: string;
  enrolmentUniqueId?: any;
  id?: string;
}

const CertificateImage = (props: CertificateImageProps) => {
  const { t } = useTranslation();

  const { isDone, id, userName, courseTitleVN, courseTitleEN, finishedTime, enrolmentUniqueId } = props;

  const ref = useRef<HTMLDivElement>(null);

  const { locale } = useRouter();

  const fontSizeUserName = userName?.length > 32 ? "st10" : "st11";

  const finishedTimeStr = finishedTime ? FunctionBase.formatDate(finishedTime) : "--/--/----";

  const titleEscape = FunctionBase.escape(courseTitleVN);
  const titleEscapeEN = FunctionBase.escape(courseTitleEN);

  const head =
    locale === "vi"
      ? `<text fill="#494644" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="44" letter-spacing="0em"><tspan x="218" y="884">Đã hoàn thành khoá học &#x201c;${titleEscape}&#x201d;</tspan></text>
<text fill="#557296" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="44" letter-spacing="0em">
<tspan x="218" y="950">Has successfully completed the course &#x201c;${titleEscapeEN}&#x201d;</tspan></text>`
      : `<text fill="#557296" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="44" letter-spacing="0em">
    <tspan x="218" y="900">Has successfully completed the course &#x201c;${titleEscapeEN}&#x201d;</tspan>`;
  const time =
    locale === "vi" &&
    `<text fill="#494644" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="28" letter-spacing="0em"><tspan x="218" y="1139.87">Hà Nội, ${finishedTimeStr}</tspan></text>`;

  const certificateImage = `<svg id="${id}" class="${
    isDone ? "" : "inprogress"
  }" viewBox="0 0 1998 1412" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g clip-path="url(#clip0_1_3)">
<rect y="-2" width="2000" height="1415" fill="url(#pattern0)"/>
<path d="M216.673 687.326H1311.43" stroke="url(#paint0_linear_1_3idc)" stroke-width="1.63915" stroke-miterlimit="10"/>
<text fill="#557296" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="104" letter-spacing="0em"><tspan x="218" y="666.807" class="${fontSizeUserName}">${
    userName || ""
  }</tspan></text>
${head}
</text>
${time}
<text fill="#557296" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="28" letter-spacing="0em">
<tspan x="218" y="1198.87">Ha Noi, ${finishedTimeStr}</tspan></text>
<text fill="#494644" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="20" letter-spacing="0em">
<tspan x="107.103" y="1316.89">${t("Verify at")} codelearn.io/share/${enrolmentUniqueId}</tspan></text>
</g>
<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_1_3" transform="scale(0.0005 0.000706714)"/>
</pattern>
<linearGradient id="paint0_linear_1_3idc" x1="nan" y1="nan" x2="nan" y2="nan" gradientUnits="userSpaceOnUse">
<stop stop-color="#F5E8C7"/>
<stop offset="0.12" stop-color="#F2DFA5"/>
<stop offset="0.17" stop-color="#F0DB94"/>
<stop offset="0.24" stop-color="#D9BB74"/>
<stop offset="0.32" stop-color="#C39D56"/>
<stop offset="0.36" stop-color="#BB924B"/>
<stop offset="0.44" stop-color="#CCAB70"/>
<stop offset="0.61" stop-color="#F5E8C7"/>
<stop offset="0.75" stop-color="#F2DFA5"/>
<stop offset="0.81" stop-color="#F0DB94"/>
<stop offset="0.85" stop-color="#E6CE87"/>
<stop offset="0.92" stop-color="#CDAA64"/>
<stop offset="1" stop-color="#AC7C38"/>
</linearGradient>
<linearGradient id="paint1_linear_1_3" x1="nan" y1="nan" x2="nan" y2="nan" gradientUnits="userSpaceOnUse">
<stop stop-color="#F5E8C7"/>
<stop offset="0.12" stop-color="#F2DFA5"/>
<stop offset="0.17" stop-color="#F0DB94"/>
<stop offset="0.24" stop-color="#D9BB74"/>
<stop offset="0.32" stop-color="#C39D56"/>
<stop offset="0.36" stop-color="#BB924B"/>
<stop offset="0.44" stop-color="#CCAB70"/>
<stop offset="0.61" stop-color="#F5E8C7"/>
<stop offset="0.75" stop-color="#F2DFA5"/>
<stop offset="0.81" stop-color="#F0DB94"/>
<stop offset="0.85" stop-color="#E6CE87"/>
<stop offset="0.92" stop-color="#CDAA64"/>
<stop offset="1" stop-color="#AC7C38"/>
</linearGradient>
<clipPath id="clip0_1_3">
<rect width="1998" height="1412" fill="white"/>
</clipPath>
<image id="image0_1_3" width="2000" height="1415" href="${
    locale === "vi" ? "/nen-certificate.png" : "/nen-certificate_en.png"
  }" />
</defs>
</svg>
`;

  return (
    <div ref={ref} className={clsx("bg-white max-w-full", styles.certificate)}>
      <div dangerouslySetInnerHTML={{ __html: certificateImage }} />
    </div>
  );
};

export default CertificateImage;
