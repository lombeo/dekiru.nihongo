import { InputCQCompletionSetting } from "../../components/cq/InputCQCompletionSetting";
import { InputCQDisplaySetting } from "../../components/cq/InputCQDisplaySetting";
import { InputCQVoteSetting } from "../../components/cq/InputCQVoteSetting";

interface GroupFormSettingProps {
  data: any;
  register: any;
  errors: any;
  control: any;
  onChange: any;
}

export const GroupFormSetting = (props: GroupFormSettingProps) => {
  const { data, register, errors, control, onChange } = props;

  const onChangeCardSetting = (cardData: any, field: string, value: any) => {
    let cards = data.cards;
    const cardIndex = cards.findIndex((x: any) => x.audence == cardData.audence && x.starType == cardData.starType);
    cards[cardIndex][field] = value;
    onChange("cards", cards);
  };

  return (
    <>
      <InputCQDisplaySetting errors={errors} register={register} control={control} data={data} onChange={onChange} />
      <InputCQVoteSetting data={data} onChange={onChangeCardSetting} />
      <InputCQCompletionSetting errors={errors} register={register} control={control} data={data} onChange={onChange} />
    </>
  );
};
