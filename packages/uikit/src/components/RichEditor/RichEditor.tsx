import { PickImageModal } from "@src/components/FileManager/PickImageModal";
import { Editor } from "@tinymce/tinymce-react";
import React, { useState } from "react";
import { UploadService } from "@src/services/UploadService/UploadService";
import { fileType } from "@src/config";

export interface RichEditorProps {
  value: string;
  onChange: any;
}
let mainEditor: any;
const RichEditor = (props: RichEditorProps) => {
  const { value, onChange } = props;
  const [isOpenFileManagement, setIsOpenFileManagement] = useState(false);
  const onSelectFile = (file: any) => {
    if (file && file.length && file[0].url) {
      mainEditor?.editorManager?.activeEditor?.selection?.setContent(`<img src="${file[0].url}"/>`);
    }
    setIsOpenFileManagement(false);
  };
  const path = "";
  const onOpenPicker = async () => {
    setIsOpenFileManagement(true);
  };
  return (
    <>
      <Editor
        value={value}
        onEditorChange={onChange}
        init={{
          min_height: 480,
          // menubar: false,
          setup: (editor) => {
            editor.on("paste", function (e) {
              var imageBlob = retrieveImageFromClipboardAsBlob(e);
              if (!imageBlob) {
                return;
              }
              e.preventDefault();
              UploadService.upload(imageBlob, fileType.thumbnailContent)
                .then((x: any) => x?.data)
                .then((x: any) => {
                  if (editor) {
                    const { url } = x?.data;
                    editor.insertContent(`<img alt=${url} src=${url} />`);
                  } else {
                    console.log("Tinymce editor not found!");
                  }
                });
            });
            mainEditor = editor;
            editor.ui.registry.addButton("file_manager", {
              icon: "image",
              onAction: onOpenPicker,
            });
          },
          //indent: false,
          branding: false,
          // menubar: false,
          plugins: [
            "advlist autolink lists link charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount codesample charmap",
          ],
          toolbar:
            "formatselect | code | undo redo | bold italic underline strikethrough | file_manager | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | codesample link charmap | media | removeformat",
          toolbar_mode: "sliding",
          file_browser_callback: false,
          convert_urls: false,
          paste_data_images: true,
          // content_style:
          //   'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
        tinymceScriptSrc={path + "/tinymce/tinymce.min.js"}
      />
      {isOpenFileManagement && (
        <PickImageModal
          onOpen={isOpenFileManagement}
          onClose={() => setIsOpenFileManagement(false)}
          onSelected={onSelectFile}
        />
      )}
    </>
  );
};
export default RichEditor;

function retrieveImageFromClipboardAsBlob(pasteEvent: any) {
  if (pasteEvent.clipboardData === false) {
    return false;
  }

  var items = pasteEvent.clipboardData.items;

  if (items === undefined) {
    return false;
  }

  for (var i = 0; i < items.length; i++) {
    // Only paste if image is only choice
    if (items[i].type.indexOf("image") === -1) {
      return false;
    }
    // Retrieve image on clipboard as blob
    var blob = items[i].getAsFile();

    // load image if there is a pasted image
    if (blob !== null) {
      const reader = new FileReader();
      reader.onload = function () {
        // console.log('result', e.target.result);
      };
      reader.readAsDataURL(blob);
      return blob;
    }
  }
  return false;
}
