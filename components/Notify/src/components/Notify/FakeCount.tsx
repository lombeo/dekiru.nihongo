import axios from "axios";

const FakeCount = () => {
  const fakeCount = () => {
    axios
      .post(
        "/api/v1/notify",
        {
          message:
            '{"EventId":"eb44ece3-3ced-4823-89c4-f35a50f21b34","Content":"[\\"{0} đã thảo luận ở bài {1}\\",\\"alo\\",\\"Câu hỏi 1\\"]","ReferenceId":null,"Type":0,"AbsoluteUri":"https://testedn.edunext.club/en/session/activity?sessionid=170&activityId=1027","DataKey":null}',
          toList: ["2086", "3601"],
          type: "0",
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsaXZlc3RyZWFtY2hhdCIsImV4cCI6MTYxOTQyNDk2OCwiaWF0IjoxNjE5NDA2OTY4fQ.iKcbaM4G00p3Gb-FNzwDyguXOXq_xHQxSW8rZuQLtmRdsPIiqbCiS3aJyF_bXetH6-TKLIilu45wg1NaE_WD4g`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return <span onClick={fakeCount}>FAKE COUNT</span>;
};
export default FakeCount;
