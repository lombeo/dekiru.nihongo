import { generateAnswerLabel } from "@src/constants/event/event.constant";
import { getChoosedAnswer, setChoosedAnswer } from "@src/store/slices/eventSlice";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles.module.scss";

export default function SingleChoice({
  currentQuestion,
  isSubmitAnswerLoading,
}: {
  currentQuestion: any;
  isSubmitAnswerLoading: boolean;
}) {
  const answerChoosedArr = useSelector(getChoosedAnswer);

  const dispatch = useDispatch();

  const handleChooseAnswer = (answerData: any) => {
    if (!isSubmitAnswerLoading) {
      const arr = [];
      arr.push(answerData);
      dispatch(setChoosedAnswer(arr));
    }
  };

  return (
    <>
      {currentQuestion?.answers.map((item, index) => {
        return (
          <div
            id={`answer-${index}`}
            key={item?.id}
            className={clsx("flex items-center gap-2 py-3 px-4 rounded-[12px] border border-[#DBDBDB] cursor-pointer", {
              "!border-[#506CF0] bg-[#ECECFF]": !!answerChoosedArr.length && item?.id === answerChoosedArr[0]?.id,
            })}
            style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}
            onClick={() => handleChooseAnswer(item)}
          >
            <div
              className={clsx(
                "flex justify-center items-center rounded-full w-[24px] h-[24px] md:w-[34px] md:h-[34px] text-[#304090] bg-[#DCE1FC] text-sm md:text-base",
                {
                  "!text-white !bg-[#506CF0]": !!answerChoosedArr.length && item?.id === answerChoosedArr[0]?.id,
                }
              )}
            >
              {generateAnswerLabel(index)}
            </div>
            <div
              className={clsx(`${styles["event-quiz-answer"]} text-sm md:text-base`, {
                "text-[#506CF0]": !!answerChoosedArr.length && item?.id === answerChoosedArr[0]?.id,
              })}
              dangerouslySetInnerHTML={{ __html: item?.content }}
            ></div>
          </div>
        );
      })}
    </>
  );
}
