import MonacoEditor from "@monaco-editor/react";
import React, { forwardRef, useRef } from "react";
import { useTranslation } from "next-i18next";
import { useIdeContext } from "../CodelearnIDE/IdeContext";
import styles from "./Editor.module.scss";

let readOnly = false;
const Editor = forwardRef((props: any, rootRef) => {
  const { data, onChange, editorRef, defaultLang } = props;
  const { t } = useTranslation();
  const ref = useRef(null);
  const { codeActivity } = useIdeContext();
  const { limitCodeCharacter } = codeActivity ?? {};
  const monacoRef = useRef(null);
  const isReadOnly = data.replace("\t|\n|\r|s", "").length >= limitCodeCharacter;
  readOnly = isReadOnly;
  const editorConfig = {
    automaticLayout: true,
    scrollBeyondLastLine: false,
    readOnly: false,
    //lineNumbers: 'on',
    minimap: {
      enabled: false,
    },
  };

  const handleOnchange = (value: string | undefined) => {
    onChange(value);
  };

  const handleSelectDots = () => {
    const editor = editorRef.current;
    const model = editor?.getModel();
    const matches = model?.findMatches("...");
    if (!matches || matches.length <= 0) return;
    const fixScroll = {
      fixed: 19,
      position: 30,
    };
    const range = matches[0].range;

    editor.setSelection(range);
    editor.getAction("actions.find").run();
    editor.onDidScrollChange(function (e) {
      if (e.scrollTop <= fixScroll.fixed) {
        editor.setScrollPosition({ scrollTop: fixScroll.position });
      }
    });

    if (editor.getScrollTop() <= fixScroll.fixed) {
      editor.setScrollPosition({ scrollTop: fixScroll.position });
    }
  };

  React.useImperativeHandle(rootRef, () => ({
    selectDots: handleSelectDots,
  }));

  return (
    <div className="md:h-full h-[400px]">
      <MonacoEditor
        value={data}
        className={styles.editor}
        theme="vs-dark"
        onChange={handleOnchange}
        onMount={(editor, monaco) => {
          editorRef.current = editor;
          ref.current = editor;
          monacoRef.current = monaco;
          editor.onKeyDown((e: any) => {
            if (readOnly) {
              let key = e.keyCode;
              if (key == 1 || key == 20) {
                editor.updateOptions({ readOnly: false });
                readOnly = false;
              }
            }
          });
          // const messageContribution = editor.getContribution("editor.contrib.messageController");
          // editor.onDidAttemptReadOnlyEdit(() => {
          //   messageContribution.showMessage(t("Exceeds the allowed characters."), editor.getPosition());
          // });
        }}
        options={editorConfig}
        language={defaultLang}
      />
    </div>
  );
});
Editor.displayName = "Editor";

export default Editor;
