import { Textarea } from "components/cms";

interface InputSectionProps {
  data?: any;
  index: number;
  onRemove: any;
  onUpdateTitle: any;
}

export const InputSection = ({ data, index, onRemove, onUpdateTitle }: InputSectionProps) => {
  return (
    <Textarea
      autosize
      minRows={1}
      maxRows={2}
      onChange={(e: any) => onUpdateTitle(index, e.target.value)}
      placeholder="Title of session"
      required
      classNames={{
        input: "h-12 rounded",
      }}
    />
  );
};
