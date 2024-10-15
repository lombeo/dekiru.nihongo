import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ message: "Method Not Allowed" });
    }
    const fileResponse = await axios.get(req.query.url as any, {
      responseType: "arraybuffer",
    });
    res.setHeader("Content-Type", "application/zip");
    res.status(200).send(fileResponse.data);
  } catch (error) {
    console.error("Error fetching SB3 file:", error);
    res.status(500).send({
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
}
