import { fileExtension } from "../constant/common.constant";

const imgRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp))/gim;
const zipRegex = /^(https?:\/\/.*\.(?:zip|rar|7zip))/gim;
const mediaRegex = /^(https?:\/\/.*\.(?:mov|mp4|mp3|wav|flac))/gim;
const wordRegex = /^(https?:\/\/.*\.(?:doc|docx))/gim;
const excelRegex = /^(https?:\/\/.*\.(?:xls|xlsx))/gim;
const powerPointRegex = /^(https?:\/\/.*\.(?:ppt|pptx))/gim;
const pdfRegex = /^(https?:\/\/.*\.(?:pdf))/gim;
const extensionOptions = [
  {
    type: imgRegex,
    icon: "image",
    ext: fileExtension.Image,
  },
  {
    type: zipRegex,
    icon: "folder_zip",
    ext: fileExtension.Zip,
  },
  {
    type: mediaRegex,
    icon: "drawer_play",
    ext: fileExtension.Media,
  },
  {
    type: wordRegex,
    icon: "text_t",
    ext: fileExtension.Word,
  },
  {
    type: excelRegex,
    icon: "calculator_multiple",
    ext: fileExtension.Excel,
  },
  {
    type: powerPointRegex,
    icon: "presenter",
    ext: fileExtension.PowerPoint,
  },
  {
    type: pdfRegex,
    icon: "document_pdf",
    ext: fileExtension.Pdf,
  },
];

export const fileExtensionType = (url: string) => {
  const fileEx = extensionOptions.find((x: any) => url.match(x.type));
  if (!fileEx) return null;
  return fileEx;
};

export const getFileType = (file: any) => {
  if (!file) {
    return "";
  }
  const fileRaw = file.type.split("/");
  const fileType = fileRaw[fileRaw.length - 1];
  return fileType;
};
