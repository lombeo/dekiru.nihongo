import Icon from "@edn/font-icons/icon";
import { ActionIcon } from "@mantine/core";

/**
 * Setting button - Display setting button of editor
 * @param props - onToggleFullEditor event + state of display.
 * @returns Settings buttons.
 */
const SettingButton = (props: any) => {
  const { onToggleFullEditor, isFullScreen = false } = props;
  return (
    <>
      <ActionIcon onClick={onToggleFullEditor}>
        <Icon name={isFullScreen ? "close-full-screen" : "open-in-full"} size={20} />
      </ActionIcon>
    </>
  );
};
export default SettingButton;
