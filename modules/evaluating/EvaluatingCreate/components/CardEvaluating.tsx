import { Card, Image, Text } from "@mantine/core";
const listBg = [
  "/images/evaluating/test-center-test-bg.png",
  "/images/evaluating/test-center-test-bg-2.png",
  "/images/evaluating/test-center-test-bg-3.png",
  "/images/evaluating/test-center-test-bg-4.png",
  "/images/evaluating/test-center-test-bg-5.png",
  "/images/evaluating/test-center-test-bg-6.png",
];
const CardEvaluating = (props: any) => {
  const { data, index, firstIndex } = props;
  const totalEasyTask = data.listTemplateSubWarehouses.reduce((acc, current) => {
    return acc + current.randomNumberEasyTask;
  }, 0);
  const totalMediumTask = data.listTemplateSubWarehouses.reduce((acc, current) => {
    return acc + current.randomNumberMediumTask;
  }, 0);
  const totalHardTask = data.listTemplateSubWarehouses.reduce((acc, current) => {
    return acc + current.randomNumberHardTask;
  }, 0);
  return (
    <Card>
      <div className="relative max-w-[665px] overflow-hidden border h-full rounded-t-sm shadow-sm">
        <Image width={665} height={140} radius="sm" src={listBg[index % 6]} />
        <div className="w-[120px] h-[110px] absolute translate-x-[-50%] translate-y-[-50%] top-0 left-0 shadow-md rounded-[35px] bg-[#f26c6c]" />
        <Text className="text-white px-2 py-3 absolute top-0 left-0">{`${data.percent}%`}</Text>
        <div className="  absolute top-[50px] left-0 right-0  flex items-center justify-center">
          <Text className="text-xl bg-white p-3 rounded-3xl font-semibold text-center">{data.name}</Text>
        </div>

        <div className="flex gap-2 justify-center py-6 flex-wrap">
          {Array(totalEasyTask)
            .fill(null)
            .map((_, index) => {
              return (
                <div className="w-[35px] h-[35px] rounded-full border border-green-500 text-green-500 flex justify-center items-center hover:bg-green-500 cursor-pointer hover:text-white">
                  {index + firstIndex}
                </div>
              );
            })}
          {Array(totalMediumTask)
            .fill(null)
            .map((_, index) => {
              return (
                <div className="w-[35px] h-[35px] rounded-full border border-orange-500 text-orange-500 flex justify-center items-center hover:bg-orange-500 cursor-pointer hover:text-white">
                  {index + firstIndex + totalEasyTask}
                </div>
              );
            })}
          {Array(totalHardTask)
            .fill(null)
            .map((_, index) => {
              return (
                <div className="w-[35px] h-[35px] rounded-full border border-red-500 text-red-500 flex justify-center items-center hover:bg-red-500 cursor-pointer hover:text-white">
                  {index + firstIndex + totalMediumTask + totalEasyTask}
                </div>
              );
            })}
        </div>
      </div>
    </Card>
  );
};

export default CardEvaluating;
