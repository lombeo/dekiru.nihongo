import clsx from "clsx";
import { setChoosedAnswer } from "@src/store/slices/eventSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getChoosedAnswer } from "@src/store/slices/eventSlice";
import styles from "../styles.module.scss";

export default function YesOrNo({
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
            key={item.id}
            className={clsx("flex items-center gap-2 py-3 px-4 rounded-[12px] border border-[#DBDBDB] cursor-pointer", {
              "!border-[#506CF0] bg-[#ECECFF]": answerChoosedArr.some(
                (answerChoosed) => answerChoosed?.id === item?.id
              ),
            })}
            style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}
            onClick={() => handleChooseAnswer(item)}
          >
            <label>
              <input
                type="radio"
                checked={answerChoosedArr.some((answerChoosed) => answerChoosed?.id === item?.id)}
                className={styles["radio-input"]}
              />
              <span className={`${styles["custom-radio-circle"]}`}></span>
            </label>
            <div
              className={clsx(styles["event-quiz-answer"], {
                "text-[#506CF0]": answerChoosedArr.some((answerChoosed) => answerChoosed?.id === item?.id),
              })}
              dangerouslySetInnerHTML={{ __html: item?.content }}
            ></div>
          </div>
        );
      })}
    </>
  );
}
