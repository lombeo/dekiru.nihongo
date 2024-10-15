import { IMAGE_BG_ACTIVATION_CODE_COMBO } from "@src/constants/voucher/activation-code-combo.constant";
import { IMAGE_BG_ACTIVATION_CODE } from "@src/constants/voucher/activation-code.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import type { NextApiRequest, NextApiResponse } from "next";
import QRCode from "qrcode";
import sharp from "sharp";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ message: "Method Not Allowed" });
    }

    const { code, price, qr, title, startTime, endTime } = req.query as any;

    const qrImageBase64 = await QRCode.toDataURL(qr);

    const isCombo = req.query.isCombo === "true";

    let subCourses = isCombo ? (req.query.subCourses as any).split(",") : [];

    const svgSubCourse = isCombo
      ? `
    ${
      subCourses?.[0]
        ? `<path d="M639.795 611.381L647.048 603.524L639.795 595.667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M634 611.381L641.253 603.524L634 595.667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Plus Jakarta Sans" font-size="24" font-weight="500" letter-spacing="0px"><tspan x="662" y="612.792">${subCourses?.[0]}</tspan></text>`
        : ""
    }
${
  subCourses?.[1]
    ? `<path d="M639.795 657.381L647.048 649.524L639.795 641.667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M634 657.381L641.253 649.524L634 641.667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Plus Jakarta Sans" font-size="24" font-weight="500" letter-spacing="0px"><tspan x="662" y="658.792">${subCourses?.[1]}</tspan></text>`
    : ""
}
${
  subCourses?.[2]
    ? `<path d="M639.795 703.381L647.048 695.524L639.795 687.667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M634 703.381L641.253 695.524L634 687.667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Plus Jakarta Sans" font-size="24" font-weight="500" letter-spacing="0px"><tspan x="662" y="704.792">${subCourses?.[2]}</tspan></text>`
    : ""
}
${
  subCourses?.[3]
    ? `<path d="M1118.79 611.381L1126.05 603.524L1118.79 595.667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1113 611.381L1120.25 603.524L1113 595.667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Plus Jakarta Sans" font-size="24" font-weight="500" letter-spacing="0px"><tspan x="1141" y="612.792">${subCourses?.[3]}</tspan></text>`
    : ""
}
${
  subCourses?.[4]
    ? `<path d="M1118.79 657.381L1126.05 649.524L1118.79 641.667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1113 657.381L1120.25 649.524L1113 641.667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Plus Jakarta Sans" font-size="24" font-weight="500" letter-spacing="0px"><tspan x="1141" y="658.792">${subCourses?.[4]}</tspan></text>`
    : ""
}
${
  subCourses?.[5]
    ? `<path d="M1118.79 703.381L1126.05 695.524L1118.79 687.667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1113 703.381L1120.25 695.524L1113 687.667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Plus Jakarta Sans" font-size="24" font-weight="500" letter-spacing="0px"><tspan x="1141" y="704.792">${subCourses?.[5]}</tspan></text>`
    : ""
}`
      : "";

    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1700" height="800" viewBox="0 0 1700 800" fill="none">
<rect width="1700" height="800" fill="url(#pattern0_2001_21131)"/>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Plus Jakarta Sans" font-size="70" font-weight="800" letter-spacing="0px"><tspan x="1516" y="168" dominant-baseline="middle" text-anchor="middle">${FunctionBase.formatShortPrice(
      +price
    )}</tspan></text>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Plus Jakarta Sans" font-size="48" font-weight="bold" letter-spacing="0px"><tspan x="630" y="${
      isCombo ? "558" : "628"
    }">${title}</tspan></text>
    ${svgSubCourse}
<text fill="#F56060" xml:space="preserve" style="white-space: pre" font-family="Plus Jakarta Sans" font-size="28" font-weight="800" letter-spacing="0px"><tspan x="424" y="605" dominant-baseline="middle" text-anchor="middle">${code}</tspan></text>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Plus Jakarta Sans" font-size="22.0859" font-weight="600" letter-spacing="0px"><tspan x="413" y="702">${endTime}</tspan></text>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Plus Jakarta Sans" font-size="22.0859" font-weight="600" letter-spacing="0px"><tspan x="187" y="702">${startTime}</tspan></text>
<rect x="1447" y="296" width="125" height="125" fill="url(#pattern1_2001_21131)"/>
<defs>
<pattern id="pattern0_2001_21131" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_2001_21131" transform="matrix(0.000391696 0 0 0.000832354 0 -0.000660987)"/>
</pattern>
<pattern id="pattern1_2001_21131" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image1_2001_21131" transform="scale(0.00444444)"/>
</pattern>
<image xmlns="http://www.w3.org/2000/svg" id="image0_2001_21131" width="2553" height="1203" xlink:href="${
      isCombo ? IMAGE_BG_ACTIVATION_CODE_COMBO : IMAGE_BG_ACTIVATION_CODE
    }" />
<image id="image1_2001_21131" width="225" height="225" xlink:href="${qrImageBase64}"/>
</defs>
</svg>`;

    const pngBuffer = await sharp(Buffer.from(svgString)).png().toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.status(200).send(pngBuffer);
  } catch (e) {
    res.status(500).send({
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
}
