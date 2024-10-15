import yup from "./yupGlobal";

export const FolderFileManager = yup.object({
  folderName: yup.string().trim().required("Folder name must be not blank"),
});
