export const PubsubTopic = {
  UPDATE_FOLDER: "UPDATE_FOLDER",
  DELETE: "DELETE",
};

export const fileType = {
  Folder: 1,
  File: 2,
};
export const fileExtension = {
  Image: "image",
  Word: "doc",
  Excel: "xls",
  PowerPoint: "ppt",
  Pdf: "pdf",
  Document: "doc,xls,pdf,ppt",
  Video: "video",
  Audio: "audio",
  Media: "video,audio",
  MultiMedia: "video,audio,image",
  Zip: "zip",
  Files: "video,audio,image,zip",
  Other: "other",
};

export const fileExtensionsObject = [
  {
    type: fileExtension.Image,
    accept: "image/png,image/bmp,image/gif,image/jpeg",
    maxSize: 2,
  },
  {
    type: fileExtension.Word,
    accept: ".doc,.docx",
    maxSize: 10,
  },
  {
    type: fileExtension.Excel,
    accept: ".xls,.xlsx",
    maxSize: 10,
  },
  {
    type: fileExtension.PowerPoint,
    accept: ".ppt,.pptx",
    maxSize: 10,
  },
  {
    type: fileExtension.Pdf,
    accept: ".pdf",
    maxSize: 10,
  },
  {
    type: fileExtension.Document,
    accept: ".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx",
    maxSize: 10,
  },
  {
    type: fileExtension.Video,
    accept: ".mp4,.mov",
    maxSize: 50,
  },
  {
    type: fileExtension.Audio,
    accept: ".mp3,.wav",
    maxSize: 10,
  },
  {
    type: fileExtension.Media,
    accept: ".mp3,.wav,.mp4,.mov",
    maxSize: 50,
  },
  {
    type: fileExtension.MultiMedia,
    accept: ".mp3,.wav,.mp4,.mov,image/png,image/bmp,image/gif,image/jpeg",
    maxSize: 50,
  },
  {
    type: fileExtension.Zip,
    accept: ".rar",
    maxSize: 50,
  },
  {
    type: fileExtension.Files,
    accept: ".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.rar,.mp4,.mov",
    maxSize: 50,
  },
];
