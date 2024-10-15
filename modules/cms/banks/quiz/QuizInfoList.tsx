import { QuizInfo } from "./QuizInfo";

export const QuizInfoList = (props: any) => {
  const { data, onSelect, isSelected, collapse, selectable } = props;

  return (
    <>
      {data &&
        data.map((quiz: any, idx: any) => (
          <QuizInfo
            idx={idx}
            data={quiz}
            isSelected={isSelected}
            onSelect={onSelect}
            key={quiz.uniqueId}
            selectable={selectable}
            collapse={collapse}
          />
        ))}
    </>
  );
};
