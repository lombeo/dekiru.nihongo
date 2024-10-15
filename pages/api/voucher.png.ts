import { IMAGE_BG_VOUCHER } from "@src/constants/voucher/voucher.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ message: "Method Not Allowed" });
    }

    const { code, minOrderValue, money, maxMoney, percent, validDateTo } = req.query as any;

    let svgString = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1700" height="800" viewBox="0 0 1700 800" fill="none">
<rect width="1700" height="800" fill="url(#pattern0_2002_20385)"/>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Plus Jakarta Sans" font-size="32" font-weight="800" letter-spacing="0px"><tspan x="1242" y="381" dominant-baseline="middle" text-anchor="middle">${+percent ? percent + '%' : FunctionBase.formatShortPrice(money)}</tspan></text>
<text fill="#F84F4F" xml:space="preserve" style="white-space: pre" font-family="Plus Jakarta Sans" font-size="28" font-weight="800" letter-spacing="0px"><tspan x="1410" y="381" dominant-baseline="middle" text-anchor="middle">${code}</tspan></text>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Plus Jakarta Sans" font-size="24" font-weight="600" letter-spacing="0px"><tspan x="1192" y="487">${validDateTo}</tspan></text>
<text x="1355" y="578" dominant-baseline="middle" text-anchor="middle" fill="#304090" xml:space="preserve" style="white-space: pre" font-family="Plus Jakarta Sans" font-size="32" font-weight="800" letter-spacing="0px">
  GIẢM ĐẾN <tspan fill="#F84F4F">${FunctionBase.formatShortPrice(+money ? +money : +maxMoney)}</tspan>
</text>
<text x="1355" y="624" dominant-baseline="middle" text-anchor="middle" fill="#304090" xml:space="preserve" style="white-space: pre" font-family="Plus Jakarta Sans" font-size="32" font-weight="800" letter-spacing="0px">
  CHO ĐƠN TỪ <tspan fill="#F84F4F">${FunctionBase.formatShortPrice(+minOrderValue)}</tspan>
</text>
<defs>
<pattern id="pattern0_2002_20385" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_2002_20385" transform="matrix(0.000391696 0 0 0.000832354 0 -0.000660987)"/>
</pattern>
<image xmlns="http://www.w3.org/2000/svg" id="image0_2002_20385" width="2553" height="1203" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="${IMAGE_BG_VOUCHER}" />
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
