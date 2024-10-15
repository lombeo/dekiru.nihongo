import Icon from "@edn/font-icons/icon";
import { ActionIcon, Checkbox } from "@mantine/core";
import { Visible } from "components/cms/core/Visible";

export const CourseFeatureList = (props: any) => {
  const { data, onSelect, selectable = false, isSelected, onRemove, disabled } = props;
  return (
    <>
      <ul className="divide-y divide-dashed space-y-1">
        <Visible visible={data}>
          {data.map((x: any) => (
            <li key={x.uniqueId} className="pt-1.5">
              <Visible visible={selectable}>
                <Checkbox
                  checked={isSelected && isSelected(x)}
                  label={x.title}
                  size="md"
                  disabled={disabled}
                  onChange={(event: any) => onSelect && onSelect(x, event.currentTarget.checked)}
                />
              </Visible>
              <Visible visible={!selectable}>
                <div className="flex justify-between">
                  <label>{x.title}</label>
                  <ActionIcon
                    disabled={disabled}
                    variant="filled"
                    size="sm"
                    color="red"
                    onClick={() => onRemove && onRemove(x)}
                  >
                    <Icon name="delete" />
                  </ActionIcon>
                </div>
              </Visible>
            </li>
          ))}
        </Visible>
      </ul>
    </>
  );
};
