import { Container } from "@src/components";
import Link from "@src/components/Link";
import { Breadcrumbs } from "@mantine/core";
import { ChevronRight } from "tabler-icons-react";
import { useTranslation } from "next-i18next";

export default function EventGameDetail() {
  const { t } = useTranslation();

  const urlImg = "https://s3-sgn09.fptcloud.com/codelearnstorage";

  return (
    <div className="bg-[#f1f1f1] pb-20">
      <Container size="xl">
        <Breadcrumbs
          className="flex-wrap gap-y-3 py-3 md:py-5"
          separator={<ChevronRight color={"#8899A8"} size={15} />}
        >
          <Link href="/" className={`text-[#8899A8] text-[13px] hover:underline`}>
            {t("Home")}
          </Link>
          <Link href="/event" className={`text-[#8899A8] text-[13px] hover:underline`}>
            {t("Event")}
          </Link>
          <span className="text-[#8899A8] text-[13px] max-w-[100px] sm:max-w-max text-ellipsis overflow-hidden">
            Reinforcement Learning Competition
          </span>
        </Breadcrumbs>

        <div>
          <div
            className="flex flex-col screen1024:flex-row screen1024:items-center screen1024:gap-10 bg-center bg-no-repeat bg-cover"
            style={{
              backgroundImage:
                "url('https://codelearnstorage.s3.amazonaws.com/Upload/AIGame/63730994001.8734f1632b16c5294d86a031bc7044cf70ce.png')",
            }}
          >
            <div className="screen1024:w-[262px] lg:ml-20">
              <img src="https://game.codelearn.io/Themes/TheCodeCampPro/Resources/Images/rlcomp/rlcomp-left-img.png?v2" />
            </div>
            <div className="text-white py-[50px] px-5">
              <div className="text-[32px]">Đấu trường Reinforcement Learning</div>
              <div className="mt-5 text-[15px]">Total Award:</div>
              <div className="flex flex-col screen1024:flex-row screen1024:gap-8 screen1024:items-center">
                <div className="w-[240px] screen1024:w-[296px]">
                  <img src="https://game.codelearn.io/Themes/TheCodeCampPro/Resources/Images/rlcomp/rlcomp-total-reward.png" />
                </div>
                <div className="text-sm screen1024:text-base whitespace-nowrap">
                  <div className="flex flex-row screen1024:flex-col lg:flex-row gap-1 flex-wrap">
                    <span>Thời gian đăng ký:</span>
                    <span className="text-[#ffdc00]">2020/07/15 00:00:00 - 2020/08/05 23:59:59</span>
                  </div>
                  <div className="flex flex-row screen1024:flex-col lg:flex-row gap-1 flex-wrap">
                    <span>Thời gian gửi mã nguồn:</span>
                    <span className="text-[#ffdc00]">2020/08/08 12:00:00 - 2020/09/26 09:00:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[white] py-[5px] px-4">Lần đầu tiên có mặt tại Việt Nam!</div>
        </div>

        <div className="p-4 sm:p-8 mt-5 bg-white">
          <div>
            <div className="text-sm font-bold text-[#4d96ff]">♦ MÔ TẢ</div>
            <p className="text-sm mt-[10px]">
              Trong trò chơi này, bạn phải điều khiển nhân vật của mình di chuyển trên một bản đồ được thể hiện dưới
              dạng ma trận hai chiều để vượt qua các chướng ngại vật và đào được nhiều vàng nhất có thể. Hãy chú ý quan
              sát bản đồ và cẩn thận với thanh năng lượng của mình để đưa ra các chiến thuật đúng đắn!
            </p>
          </div>
          <div className="mt-8">
            <div className="text-sm font-bold text-[#4d96ff]">♦ CÂU CHUYỆN</div>
            <p className="text-sm mt-[10px]">
              Bạn là một thợ săn kho báu đi vào rừng để tìm kiếm những mỏ vàng được chôn sâu trong rừng. Ở đây, các thợ
              săn khác cũng đang vội vã đi tìm kho báu của mình vì vậy đừng chần chừ thêm nữa. Khu rừng thiêng đầy rẫy
              các cạm bẫy nguy hiểm nhưng mong bạn đừng nản lòng, vì trải qua gian khó mới thấy chiến thắng giá trị
              nhường nào!
            </p>
          </div>
          <div className="mt-8">
            <div className="text-sm font-bold text-[#4d96ff]">♦ MỤC TIÊU</div>
            <p className="text-sm mt-[10px]">
              Bạn cần đào được số vàng nhiều nhất với số năng lượng tiêu tốn là ít nhất. Trong khu rừng nơi bạn đang
              đứng có rất nhiều cạm bẫy và chướng ngại vật, vì vậy hãy di chuyển một cách thông minh và sử dụng lệnh
              nghỉ đúng lúc.
            </p>
          </div>
          <div className="mt-8">
            <div className="text-sm font-bold text-[#4d96ff]">♦ LUẬT CHƠI</div>

            <ul className="mt-[10px] pl-9 list-disc">
              <li>
                <strong className="text-[red]">n&nbsp;</strong>thợ săn kho báu (1 ≤{" "}
                <strong className="text-[red]">n</strong> ≤&nbsp;4) sẽ cùng xuất phát tại cùng một điểm trong khu rừng.
              </li>
              <li>
                Bản đồ khu rừng được biểu diễn dưới dạng một<span>&nbsp;</span>ma trận 2 chiều{" "}
                <strong className="text-[red]">w*h</strong>.&nbsp;(w=21, h=9<span>)</span>
              </li>
              <li>
                Số năng lượng lúc đầu của mọi người là <strong className="text-[red]">50</strong>.
              </li>
              <li>
                Lượt chơi mỗi trận đấu là <strong className="text-[red]">100</strong>, mỗi lượt người chơi sẽ phải thể
                hiện một trong các hành động.
              </li>
            </ul>

            <table style={{ borderCollapse: "collapse", width: "100%" }} className="text-xs sm:text-base mt-3">
              <tbody>
                <tr style={{ height: 43 }}>
                  <td
                    style={{
                      width: "311.333px",
                      height: 43,
                      textAlign: "center",
                      borderStyle: "solid",
                      borderColor: "#ebebeb",
                      backgroundColor: "#f5f5f5",
                    }}
                    className="border"
                  >
                    <strong>GoLeft</strong>
                  </td>
                  <td
                    style={{
                      width: "311.333px",
                      height: 43,
                      textAlign: "center",
                      borderStyle: "solid",
                      borderColor: "#ebebeb",
                      backgroundColor: "#f5f5f5",
                    }}
                    className="border"
                  >
                    <strong>GoRight</strong>
                  </td>
                  <td
                    style={{
                      width: "311.333px",
                      height: 43,
                      textAlign: "center",
                      borderStyle: "solid",
                      borderColor: "#ebebeb",
                      backgroundColor: "#f5f5f5",
                    }}
                    className="border"
                  >
                    <strong>GoUp</strong>
                  </td>
                  <td
                    style={{
                      width: "311.333px",
                      height: 43,
                      textAlign: "center",
                      borderStyle: "solid",
                      borderColor: "#ebebeb",
                      backgroundColor: "#f5f5f5",
                    }}
                    className="border"
                  >
                    <strong>GoDown</strong>
                  </td>
                  <td
                    style={{
                      width: "311.35px",
                      height: 43,
                      textAlign: "center",
                      borderStyle: "solid",
                      borderColor: "#ebebeb",
                      backgroundColor: "#f5f5f5",
                    }}
                    className="border"
                  >
                    <strong>Free</strong>
                  </td>
                  <td
                    style={{
                      width: "311.317px",
                      height: 43,
                      textAlign: "center",
                      borderStyle: "solid",
                      borderColor: "#ebebeb",
                      backgroundColor: "#f5f5f5",
                    }}
                    className="border"
                  >
                    <strong>Craft</strong>
                  </td>
                </tr>
                <tr style={{ height: 46 }}>
                  <td
                    style={{
                      width: "311.333px",
                      height: 46,
                      textAlign: "center",
                      borderStyle: "solid",
                      borderColor: "#ebebeb",
                    }}
                    className="border"
                  >
                    Đi sang trái ←
                  </td>
                  <td
                    style={{
                      width: "311.333px",
                      height: 46,
                      textAlign: "center",
                      borderStyle: "solid",
                      borderColor: "#ebebeb",
                    }}
                    className="border"
                  >
                    Đi sang phải →
                  </td>
                  <td
                    style={{
                      width: "311.333px",
                      height: 46,
                      textAlign: "center",
                      borderStyle: "solid",
                      borderColor: "#ebebeb",
                    }}
                    className="border"
                  >
                    Đi lên ↑
                  </td>
                  <td
                    style={{
                      width: "311.333px",
                      height: 46,
                      textAlign: "center",
                      borderStyle: "solid",
                      borderColor: "#ebebeb",
                    }}
                    className="border"
                  >
                    Đi xuống ↓
                  </td>
                  <td
                    style={{
                      width: "311.35px",
                      height: 46,
                      textAlign: "center",
                      borderStyle: "solid",
                      borderColor: "#ebebeb",
                    }}
                    className="border"
                  >
                    Nghỉ ngơi
                  </td>
                  <td
                    style={{
                      width: "311.317px",
                      height: 46,
                      textAlign: "center",
                      borderStyle: "solid",
                      borderColor: "#ebebeb",
                    }}
                    className="border"
                  >
                    Đào vàng
                  </td>
                </tr>
              </tbody>
            </table>

            <ul className="mt-[10px] pl-9 list-disc">
              <li>
                Sau mỗi 1 lượt, hệ thống sẽ gửi lại phương án đi của những người chơi khác đồng thời cập nhật số vàng và
                năng lượng của mỗi người chơi.
              </li>
              <li>Người chơi phải vượt qua các chướng ngại vật và đào thật nhiều vàng để chiến thắng.</li>
            </ul>
          </div>

          <div className="mt-8">
            <div className="text-sm font-bold text-[#4d96ff]">♦ QUY TẮC TIÊU THỤ NĂNG LƯỢNG</div>
            <p>Đi vào một trong các ô sau hoặc đào vàng sẽ tiêu tốn số năng lượng như sau:</p>
            <div className="flex flex-col screen1024:flex-row gap-5 screen1024:gap-[100px] sm:px-10">
              <div className="flex flex-col gap-5">
                <div className="flex gap-3">
                  <div className="w-20">
                    <img src={urlImg + "/Media/Default/Game/GoldMiner/Grass.png"} />
                  </div>
                  <div>
                    <div className="text-[18px] font-bold">Đất</div>
                    <div>
                      <span className="text-[red] font-bold">-1</span>
                      <span className="ml-1">năng lượng</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-20">
                    <img src={urlImg + "/Media/Default/Game/GoldMiner/dig-gold.png"} />
                  </div>
                  <div>
                    <div className="text-[18px] font-bold">Đào vàng</div>
                    <div>
                      <span className="text-[red] font-bold">-5</span>
                      <span className="ml-1">năng lượng</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-20">
                    <img src={urlImg + "/Media/Default/Users/3ron/basicit/Đầm lầy-01.png"} />
                  </div>
                  <div className="w-[75%]">
                    <div className="text-[18px] font-bold">Đầm lầy</div>
                    <div>
                      <span className="text-[red] font-bold">{`-5 -> -20 -> -40 -> 100`}</span>
                      <span className="ml-1">
                        năng lượng. Năng lượng cần dùng sẽ tăng dần theo số lần vào ô có đầm lầy. Lần đầu tiên sẽ là trừ
                        5 năng lượng, lần thứ 2 là 20... (số lần vào tính theo lượt chơi)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex gap-3">
                  <div className="w-20">
                    <img src={urlImg + "/Media/Default/Users/3ron/basicit/700-01.png"} />
                  </div>
                  <div>
                    <div className="text-[18px] font-bold">Mỏ vàng</div>
                    <div>
                      <span className="text-[red] font-bold">-4</span>
                      <span className="ml-1">năng lượng</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-20">
                    <img src={urlImg + "/Media/Default/Users/3ron/basicit/Tree-01.png"} />
                  </div>
                  <div className="w-[75%]">
                    <div className="text-[18px] font-bold">Rừng</div>
                    <div>
                      là giá trị ngẫu nhiên từ trong đoạn ​<span className="text-[red] font-bold">[-5, -20]</span>
                      <span className="ml-1">năng lượng</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-20">
                    <img src={urlImg + "/Media/Default/Users/3ron/basicit/Trap-01.png"} />
                  </div>
                  <div className="w-[75%]">
                    <div className="text-[18px] font-bold">Bẫy</div>
                    <div>
                      <span className="text-[red] font-bold">-10</span>
                      <span className="ml-1">
                        năng lượng. Chỉ được sử dụng 1 lần (tính theo lượt chơi. Nếu trong 1 lượt chơi, nhiều người chơi
                        cùng đi vào 1 ô bẫy (chưa được sử dụng), thì tất cả đều sẽ bị trừ 10 năng lượng. Sau khi được sử
                        dụng, bẫy chuyển thành đất).
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="text-sm font-bold text-[#4d96ff]">♦ QUY TẮC HỒI NĂNG LƯỢNG</div>
            <p>Để hồi năng lượng, nhà thám hiểm phải dành thời gian ngồi nghỉ:</p>
            <table style={{ borderCollapse: "collapse", width: "100%" }} border={1}>
              <tbody>
                <tr
                  style={{
                    height: 45,
                    borderStyle: "solid",
                    borderColor: "#ebebeb",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <td
                    style={{
                      width: "374.2px",
                      height: 47,
                      textAlign: "center",
                      borderColor: "#ebebeb",
                    }}
                    className="border"
                  >
                    <strong>Số lần nghỉ</strong>
                  </td>
                  <td
                    style={{
                      width: "374.2px",
                      height: 47,
                      textAlign: "center",
                      borderColor: "#ebebeb",
                    }}
                    className="border"
                  >
                    1 lượt
                  </td>
                  <td
                    style={{
                      width: "374.2px",
                      height: 47,
                      textAlign: "center",
                      borderColor: "#ebebeb",
                    }}
                    className="border"
                  >
                    2 lượt liên tiếp
                  </td>
                  <td
                    style={{
                      width: "374.217px",
                      height: 47,
                      textAlign: "center",
                      borderColor: "#ebebeb",
                    }}
                    className="border"
                  >
                    3 lượt liên tiếp
                  </td>
                  <td
                    style={{
                      width: "374.183px",
                      height: 47,
                      textAlign: "center",
                      borderColor: "#ebebeb",
                    }}
                    className="border"
                  >
                    <span>Năng lượng hồi quá E</span>
                  </td>
                </tr>
                <tr style={{ height: 45, borderColor: "#ebebeb", borderStyle: "solid" }}>
                  <td
                    style={{
                      width: "374.2px",
                      height: 45,
                      textAlign: "center",
                      borderColor: "#ebebeb",
                    }}
                    className="border"
                  >
                    <strong>Số năng lượng hồi</strong>
                  </td>
                  <td
                    style={{
                      width: "374.2px",
                      height: 45,
                      textAlign: "center",
                      borderColor: "#ebebeb",
                    }}
                    className="border"
                  >
                    <span style={{ color: "#ff0000" }}>
                      <span style={{ caretColor: "#ff0000" }}>[E/4]</span>
                    </span>
                  </td>
                  <td
                    style={{
                      width: "374.2px",
                      height: 45,
                      textAlign: "center",
                      borderColor: "#ebebeb",
                    }}
                    className="border"
                  >
                    <span style={{ color: "#ff0000" }}>
                      <span style={{ caretColor: "#ff0000" }}>[E/4] + [E/3]</span>
                    </span>
                  </td>
                  <td
                    style={{
                      width: "374.217px",
                      height: 45,
                      textAlign: "center",
                      borderColor: "#ebebeb",
                    }}
                    className="border"
                  >
                    <span>
                      <span style={{ color: "#ff0000" }}>
                        <span style={{ caretColor: "#ff0000" }}>[E/4] + [E/3] + [E/2]</span>
                      </span>
                    </span>
                  </td>
                  <td
                    style={{
                      width: "374.183px",
                      height: 45,
                      textAlign: "center",
                      borderColor: "#ebebeb",
                    }}
                    className="border"
                  >
                    <span style={{ color: "#ff0000" }}>
                      <span style={{ caretColor: "#ff0000" }}>Không hồi thêm</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              <em>Lưu ý: kết quả của phép chia được làm tròn xuống số nguyên gần nhất</em>
            </p>
          </div>

          <div className="mt-8">
            <div className="text-sm font-bold text-[#4d96ff]">♦ QUY TẮC ĐÀO VÀNG</div>
            <p>
              Giả sử tại thời điêm hiện tại, lượng vàng trong mỏ là G và có m người cùng đào vàng. Số lượng vàng mỗi
              người thu được được tính toán như bảng dưới đây:
            </p>
            <table style={{ borderCollapse: "collapse", width: "100%" }} border={1}>
              <tbody>
                <tr
                  style={{
                    height: 45,
                    borderStyle: "solid",
                    borderColor: "#ebebeb",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <td
                    style={{
                      width: "468.5px",
                      height: 45,
                      borderColor: "#ebebeb",
                      textAlign: "center",
                    }}
                    className="border"
                  >
                    <strong>Lượng vàng</strong>
                  </td>
                  <td
                    style={{
                      width: "468.5px",
                      height: 45,
                      borderColor: "#ebebeb",
                      textAlign: "center",
                    }}
                    className="border"
                  >
                    <strong>Lượng vàng mỗi người đạt được</strong>
                  </td>
                  <td
                    style={{
                      width: "468.5px",
                      height: 45,
                      borderColor: "#ebebeb",
                      textAlign: "center",
                    }}
                    className="border"
                  >
                    <strong>Lượng vàng còn lại ở mỏ</strong>
                  </td>
                  <td style={{ width: "468.5px", height: 45, textAlign: "center" }}>
                    <strong>Năng lượng tiêu tốn</strong>
                  </td>
                </tr>
                <tr style={{ height: 60, borderColor: "#ebebeb", borderStyle: "solid" }}>
                  <td
                    style={{
                      width: "468.5px",
                      height: 61,
                      borderStyle: "solid",
                      borderColor: "#ebebeb",
                      textAlign: "center",
                    }}
                    className="border"
                  >
                    <span style={{ color: "red" }}>G &gt;= m*50</span>
                  </td>
                  <td
                    style={{
                      width: "468.5px",
                      height: 61,
                      borderColor: "#ebebeb",
                      textAlign: "center",
                    }}
                    className="border"
                  >
                    <span style={{ color: "red" }}>50</span>
                  </td>
                  <td
                    style={{
                      width: "468.5px",
                      height: 61,
                      borderColor: "#ebebeb",
                      textAlign: "center",
                    }}
                    className="border"
                  >
                    <span style={{ color: "red" }}>G-m*50</span>
                  </td>
                  <td
                    style={{
                      width: "468.5px",
                      height: 61,
                      borderColor: "#ebebeb",
                      textAlign: "center",
                    }}
                    className="border"
                  >
                    <span style={{ color: "red" }}>5</span>
                  </td>
                </tr>
                <tr style={{ height: 57, borderColor: "#ebebeb", borderStyle: "solid" }}>
                  <td
                    style={{
                      width: "468.5px",
                      height: 60,
                      borderStyle: "solid",
                      borderColor: "#ebebeb",
                      textAlign: "center",
                    }}
                    className="border"
                  >
                    <span style={{ color: "red" }}>G &lt; m*50</span>
                  </td>
                  <td
                    style={{
                      width: "468.5px",
                      height: 60,
                      borderStyle: "solid",
                      borderColor: "#ebebeb",
                      textAlign: "center",
                    }}
                    className="border"
                  >
                    <span style={{ color: "red" }}>ceil(G/m)</span>
                  </td>
                  <td style={{ width: "468.5px", textAlign: "center", height: 60 }} className="border">
                    <span style={{ color: "red" }}>
                      0<br />
                      <span style={{ color: "#898989" }}>(ô này chuyển thành ô đất)</span>
                    </span>
                  </td>
                  <td
                    style={{
                      width: "468.5px",
                      height: 60,
                      borderColor: "#ebebeb",
                      borderStyle: "solid",
                      textAlign: "center",
                    }}
                    className="border"
                  >
                    <span style={{ color: "red" }}>5</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-8">
            <div className="text-sm font-bold text-[#4d96ff]">♦ CÁC QUY TẮC KHÁC</div>
            <ul className="list-disc ml-9 mt-[10px]">
              <li>
                Không đứng tại mỏ mà dùng lệnh đào vàng:{" "}
                <strong style={{ color: "red" }}>
                  -1<span style={{ color: "red" }}>0&nbsp;</span>
                </strong>
                <span style={{ color: "red" }}>năng lượng</span>
                <strong style={{ color: "red" }} />
              </li>
              <li>
                Đi ra khỏi bản đồ: <strong style={{ color: "red" }}>Loại</strong>
              </li>
              <li>
                Không đưa ra hành động khi đến lượt chơi: <strong style={{ color: "red" }}>Loại</strong>
              </li>
              <li>
                Năng lượng của người chơi
                <strong style={{ color: "red" }}>&nbsp;&lt;= 0</strong>:&nbsp;
                <strong style={{ color: "red" }}>Loại</strong>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <div className="text-sm font-bold text-[#4d96ff]">♦ QUY TẮC CHIẾN THẮNG</div>
            <ul className="list-disc ml-9 mt-[10px]">
              <li>Chỉ còn duy nhất 1 người do những người khác đã bị loại thì người đó là người chiến thắng</li>
              <li>
                Nếu số vàng ở mỏ được đào hết trước <strong style={{ color: "red" }}>T</strong> lượt hoặc hết{" "}
                <strong style={{ color: "red" }}>T</strong> lượt chơi:
                <ul style={{ listStyleType: "circle" }} className="ml-9">
                  <li>Người có nhiều vàng nhất sẽ chiến thắng</li>
                  <li>Nếu có nhiều người được số vàng cao bằng nhau, người nhiều năng lượng nhất sẽ chiến thắng.</li>
                  <li>
                    Nếu có nhiều người có cùng số vàng và năng lượng cao bằng nhau, hệ thống sẽ chọn ngẫu nhiên một
                    người chiến thắng
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <div className="text-sm font-bold text-[#4d96ff]">♦ MÔI TRƯỜNG</div>
            <ul className="list-disc ml-9 mt-[10px]">
              <li>
                Hệ điều hành: Ubuntu 18.04.4 LTS (<span>4 vCPUs, 2.5 GHz, No GPU,&nbsp;</span>2 GiB memory)
              </li>
              <li>Ngôn ngữ: Python3 (phiên bản 3.6.9)</li>
              <li>
                Kích cỡ mã nguồn + Thư viện: &lt; <strong>30MB</strong> (người chơi phải sử dụng thư viện có sẵn của
                ngôn ngữ lập trình hoặc thư viện nhúng vào mã nguồn của bạn để nó có thể chạy trên máy chủ.)
              </li>
              <li>Tensorflow 1.14.0 và 2.2.0</li>
              <li>Keras 2.3.1</li>
              <li>Numpy 1.18.4</li>
              <li>Pandas 0.15</li>
              <li>PyTorch 1.5.0</li>
              <li>joblib 0.16.0</li>
              <li>ray 0.8.6 (ray[rllib], ray[tune])</li>
              <li>requests 2.24.0</li>
              <li>semver 2.10.2&nbsp;</li>
              <li>tf-agents 0.3.0 (0.5.0 trên tensorflow 2.2.0)</li>
              <li>Pyqlearning v1.2.4</li>
              <li>Mushroom-RL v1.4.0</li>
              <li>gym 0.17.2</li>
              <li>opencv-python 4.2.0.34</li>
              <li>prettytable 0.7.2</li>
              <li>yacs 0.1.7</li>
            </ul>
          </div>

          <div className="mt-8">
            <div className="text-sm font-bold text-[#4d96ff]">♦ CẤU TRÚC MÃ NGUỒN</div>
            <div className="pl-9">
              <ul className="list-disc mt-[10px]">
                <li>Cấu trúc của mã nguồn sẽ như sau:</li>
              </ul>

              <p>Trong đó:</p>
              <ul style={{ listStyleType: "circle" }} className="ml-9">
                <li>
                  Bài thi của bạn cần có 2 thư mục là&nbsp;
                  <strong style={{ color: "red" }}>src</strong> và <strong style={{ color: "red" }}>build</strong>
                </li>
                <li>
                  Thư mục <strong style={{ color: "red" }}>src</strong>&nbsp;chứa mã nguồn và tập tin{" "}
                  <strong style={{ color: "red" }}>build.sh</strong>: Khi chạy tập tin{" "}
                  <strong style={{ color: "red" }}>build.sh</strong>, các mã nguồn đã được biên dịch sẽ được đưa vào thư
                  mục <strong style={{ color: "red" }}>build</strong>. Chú ý, việc biên dịch mã nguồn được xem là thành
                  công chỉ khi thực hiện tập tin <strong style={{ color: "red" }}>build</strong> và không có bất kỳ một
                  tin nhắn nào trả về (bao gồm cả tin nhắn cảnh báo (Warning)). Lệnh chạy sẽ là{" "}
                  <strong style={{ color: "red" }}>python3</strong>.&nbsp;
                </li>
                <li>
                  Thư mục <strong style={{ color: "red" }}>build</strong> cần có thêm tập tin{" "}
                  <strong style={{ color: "red" }}>run.sh</strong>
                </li>
                <li>
                  Mã nguồn của bạn sẽ được chạy qua việc gọi tập tin <strong style={{ color: "red" }}>run.sh</strong>
                </li>
              </ul>
              <ul className="list-disc">
                <li>Cách tải mã nguồn lên hệ thống:</li>
              </ul>

              <ul style={{ listStyleType: "circle" }} className="ml-9">
                <li>
                  Máy khách của bạn có thể kết nối máy chủ thành công và đạt được ít nhất 50 điểm thì được xem là đạt
                  yêu cầu, và trạng thái sẽ là <strong style={{ color: "red" }}>Verified</strong>
                </li>
                <li>Nén bài thi thành tập tin .zip với tên bất kỳ và tải tập tin lên hệ thống</li>
                <li>
                  Sau khi tải đoạn mã hệ thống sẽ trả về trạng thái{" "}
                  <strong style={{ color: "red" }}>Building, Build Failed, Verifying, Failed </strong>
                  hoặc<strong style={{ color: "red" }}> Verified</strong>:
                  <ul style={{ listStyleType: "square" }} className="ml-9">
                    <li>
                      <strong style={{ color: "red" }}>Build Failed, Failed</strong>: hệ thống sẽ cho phép người dùng
                      tải về tập tin chứa thông tin lỗi.
                    </li>
                    <li>
                      <strong style={{ color: "red" }}>Verifying, Failed, Verified</strong>: người dùng sẽ xem được màn
                      hình chạy của trò chơi.
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <div className="text-sm font-bold text-[#4d96ff]">♦ GIAO TIẾP GIỮA NGƯỜI CHƠI VÀ MÁY CHỦ</div>
            <p>
              Máy chủ và người chơi sẽ giao tiếp thông qua socket. Thông tin của socket (host, port) sẽ được truyền ở
              tham số đầu vào khi chạy tập tin <strong style={{ color: "red" }}>run.sh</strong>
            </p>
            <ul className="list-disc ml-9 mt-[10px]">
              <li>Các tin nhắn trao đổi giữa người chơi và máy chủ:</li>
            </ul>
            <div className="ml-[72px]">
              <ul className="mt-[10px]" style={{ listStyleType: "circle" }}>
                <li>
                  Khi người chơi kết nối đến máy chủ thành công, máy chủ sẽ gửi về cho người chơi tin nhắn có nội dung
                  như sau:
                </li>
              </ul>
              <pre className="language-markup !p-[10px] !text-[#333] !bg-[#f5f5f5] border border-[#ccc] rounded-[4px] !text-[13px] whitespace-pre">
                <code style={{ whiteSpace: "pre-wrap" }}>
                  {"{"} {"\n"}
                  {"    "}"playerId": int,{"\n"}
                  {"    "}“posx”: int,{"\n"}
                  {"    "}“posy”: int,{"\n"}
                  {"    "}“energy”: int,{"\n"}
                  {"    "}"gameinfo": {"{"}
                  {"\n"}
                  {"        "}"numberOfPlayers": int,{"\n"}
                  {"        "}"width": int,{"\n"}
                  {"        "}"height": int,{"\n"}
                  {"        "}"steps": int,{"\n"}
                  {"        "}"golds":[{"\n"}
                  {"            "}
                  {"{"}
                  {"\n"}
                  {"                "}"posx": int,{"\n"}
                  {"                "}"posy": int,{"\n"}
                  {"                "}"amount": int{"\n"}
                  {"            "}
                  {"}"}
                  {"\n"}
                  {"        "}],{"\n"}
                  {"        "}"obstacles":[{"\n"}
                  {"            "}
                  {"{"}
                  {"\n"}
                  {"                "}"type": int, //0: đất, 1: rừng, 2: bẫy, 3: đầm lầy{"\n"}
                  {"                "}"posx": int,{"\n"}
                  {"                "}"posy": int,{"\n"}
                  {"                "}"value": int{"\n"}
                  {"            "}
                  {"}"}
                  {"\n"}
                  {"        "}]{"\n"}
                  {"    "}
                  {"}"}
                  {"\n"}
                  {"}"}
                </code>
              </pre>

              <p>
                Trong đó:
                <br />♦ Thông tin người chơi gồm:
                <br />- <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">playerId</code>: mã ID
                của người chơi
                <br />- <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">(posx, posy)</code>:
                tọa độ khởi tạo ban đầu
                <br />- <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">energy</code>: năng
                lượng khởi tạo ban đầu
              </p>

              <p>
                ♦ Thông tin trận đấu gồm:
                <br />- <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">numberOfPlayers</code>
                : số người chơi tham gia trận đấu
                <br />- <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">(width, height)</code>
                : kích thước của bản đồ
                <br />- <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">steps</code>: số
                lượt&nbsp;tối đa trong trận đấu
                <br />- <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">golds</code>: thông
                tin của các mỏ vàng bao gồm tọa độ <code>(posx, posy)</code> và khối lượng vàng ban đầu{" "}
                <code>(amount)</code>
                <br />- <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">obstacles</code>:
                thông tin các chướng ngại vật trên đường đi bao gồm tọa độ{" "}
                <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">(posx, posy),&nbsp;</code>loại
                chướng ngại vật{" "}
                <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">
                  (type), và giá trị của chướng ngại vật (value &lt;= 0, là năng lượng mà người chơi sẽ mất khi đi vào ô
                  có vật cản tương ứng). Nếu kiểu dữ liệu của vật cản là rừng (type = 1), value = 0
                </code>
              </p>
              <p>
                <em>
                  Các loại chương ngại vật được thể hiện bằng số nguyên như sau:{" "}
                  <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">0</code>: đất,{" "}
                  <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">1</code>: rừng,{" "}
                  <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">2</code>: bẫy,
                  <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">3</code>: đầm lầy
                </em>
              </p>
            </div>

            <ul style={{ listStyleType: "circle" }} className="ml-9">
              <li>
                Mỗi lượt chơi, người chơi gửi lên máy chủ 1 trong câu lệnh:{" "}
                <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">
                  "0", "1", "2", "3", "4", "5"
                </code>{" "}
                với ý nghĩa:
                <br />
                <table
                  style={{ marginLeft: "auto", marginRight: "auto" }}
                  width={200}
                  cellSpacing={0}
                  cellPadding={0}
                  border={0}
                  className="border border-[#ddd] text-[#677897] mt-2 text-sm"
                >
                  <colgroup>
                    <col width={87} span={2} />
                  </colgroup>
                  <tbody>
                    <tr style={{ height: 22 }}>
                      <td
                        className="xl63 p-[6px] border-r border-[#b8b8b8] border-dashed"
                        style={{ width: 177, textAlign: "center", height: 22 }}
                      >
                        &nbsp;"0"
                      </td>
                      <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 22 }}>
                        &nbsp;đi sang trái
                      </td>
                    </tr>
                    <tr style={{ height: 44 }} className="bg-[#e1e1e1]">
                      <td
                        className="xl63 p-[6px] border-r border-[#b8b8b8] border-dashed"
                        style={{ width: 177, textAlign: "center", height: 44 }}
                      >
                        &nbsp;"1"
                      </td>
                      <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 44 }}>
                        &nbsp;đi sang phải
                      </td>
                    </tr>
                    <tr style={{ height: 22 }}>
                      <td
                        className="xl63 p-[6px] border-r border-[#b8b8b8] border-dashed"
                        style={{ width: 177, textAlign: "center", height: 22 }}
                      >
                        &nbsp;"2"
                      </td>
                      <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 22 }}>
                        &nbsp;đi lên
                      </td>
                    </tr>
                    <tr style={{ height: 22 }} className="bg-[#e1e1e1]">
                      <td
                        className="xl63 p-[6px]  border-r border-[#b8b8b8] border-dashed"
                        style={{ width: 177, textAlign: "center", height: 22 }}
                      >
                        &nbsp;"3"
                      </td>
                      <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 22 }}>
                        &nbsp;đi xuống
                      </td>
                    </tr>
                    <tr style={{ height: 22 }}>
                      <td
                        className="xl63 p-[6px] border-r border-[#b8b8b8] border-dashed"
                        style={{ width: 177, textAlign: "center", height: 22 }}
                      >
                        &nbsp;"4"
                      </td>
                      <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 22 }}>
                        &nbsp;nghỉ ngơi
                      </td>
                    </tr>
                    <tr style={{ height: 22 }} className="bg-[#e1e1e1]">
                      <td
                        className="xl63 p-[6px] border-r border-[#b8b8b8] border-dashed"
                        style={{ width: 177, textAlign: "center", height: 22 }}
                      >
                        &nbsp;"5"
                      </td>
                      <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 22 }}>
                        &nbsp;đào vàng
                      </td>
                    </tr>
                    <tr style={{ height: 66 }}>
                      <td
                        className="xl63 p-[6px] border-r border-[#b8b8b8] border-dashed"
                        style={{ width: 177, textAlign: "center", height: 66 }}
                      >
                        ngoài các câu lệnh trên
                      </td>
                      <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 66 }}>
                        bị loại
                      </td>
                    </tr>
                  </tbody>
                </table>
              </li>
              <li>
                <span>
                  Sau khi người chơi gửi các hành động đến máy chủ, máy chủ phản hồi lại trạng thái mới của bản đồ như
                  sau:
                </span>
                <pre className="language-markup !p-[10px] !text-[#333] !bg-[#f5f5f5] border border-[#ccc] rounded-[4px] !text-[13px]">
                  <code style={{ whiteSpace: "pre-wrap" }}>
                    {"{"}
                    {"\n"}
                    {"        "}"players":[{"\n"}
                    {"            "}
                    {"{"}
                    {"\n"}
                    {"                "}"playerId": int,{"\n"}
                    {"                "}"posx": int,{"\n"}
                    {"                "}"posy": int,{"\n"}
                    {"                "}"score": int,{"\n"}
                    {"                "}"energy": int,{"\n"}
                    {"                "}"status": int, //0: PLAYING, 1: ELIMINATED_WENT_OUT_MAP, 2:
                    ELIMINATED_OUT_OF_ENERGY, 3: ELIMINATED_INVALID_ACTION, 4: STOP_EMPTY_GOLD, 5: STOP_END_STEP{"\n"}
                    {"                "}"lastAction": int //0: đi sang trái, 1: đi sang phải, 2: đi lên, 3: đi xuống, 4:
                    nghỉ ngơi, 5: đào vàng, 6: bị loại (trường hợp action = null do đã bị loại){"\n"}
                    {"            "}
                    {"}"}
                    {"\n"}
                    {"        "}],{"\n"}
                    {"        "}"golds":[{"\n"}
                    {"            "}
                    {"{"}
                    {"\n"}
                    {"                "}"posx": int,{"\n"}
                    {"                "}"posy": int,{"\n"}
                    {"                "}"amount": int{"\n"}
                    {"            "}
                    {"}"}
                    {"\n"}
                    {"        "}]{"  "},{"\n"}
                    {"        "}"changedObstacles":[{"\n"}
                    {"            "}
                    {"{"}
                    {"\n"}
                    {"                "}"posx": int,{"\n"}
                    {"                "}"posy": int,{"\n"}
                    {"                "}"type": int,{"\n"}
                    {"                "}"value": int{"\n"}
                    {"            "}
                    {"}"}
                    {"\n"}
                    {"        "}] {"\n"}
                    {"}"}
                    {"\n"}
                  </code>
                </pre>
              </li>
            </ul>
            <p className="ml-9">
              Trong đó, trạng thái của tất cả người chơi gồm:
              <br />- <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">playerId</code>: mã ID
              của người chơi
              <br />- <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">(posx, posy)</code>: tọa
              độ hiện tại của người chơi
              <br />- <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">score</code>: điểm của
              người chơi (số vàng đã đào được)
              <br />- <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">energy</code>: năng
              lượng còn lại của người chơi
              <br />- <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">lastAction</code>: hành
              động của người chơi ở lượt chơi trước (state = 6 nghĩa là người chơi đã bị loại)
              <br />- <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">status</code>: trạng
              thái hiện tại của người chơi (đang chơi, bị loại hay đã dừng do trận đấu đã kết thúc)
            </p>
            <p className="ml-9">
              <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">golds</code>: thông tin các mỏ
              vàng hiện tại trên bản đổ
            </p>
            <p className="ml-9">
              <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">changedObstacles</code>: là danh
              sách các vật cản bị thay đổi bởi lượt chơi vừa xảy ra. Bao gồm: vàng -&gt; đất sau khi đã đào hết, bẫy
              -&gt; đất khi có người chơi đi vào, và năng lượng của đầm lầy bị thay đổi khi có nguời chơi đi vào.
              <br />
              Hành động của người chơi được thể hiện như sau:
            </p>
          </div>
          <div className="ml-9">
            <table
              style={{ marginLeft: "auto", marginRight: "auto" }}
              width={200}
              cellSpacing={0}
              cellPadding={0}
              border={0}
              className="border border-[#ddd] text-[#677897] mt-2 text-sm"
            >
              <colgroup>
                <col width={87} span={2} />
              </colgroup>
              <tbody>
                <tr style={{ height: 22 }}>
                  <td
                    className="xl63 p-[6px] border-r border-[#b8b8b8] border-dashed"
                    style={{ width: 177, textAlign: "center", height: 22 }}
                  >
                    &nbsp;"0"
                  </td>
                  <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 22 }}>
                    &nbsp;đi sang trái
                  </td>
                </tr>
                <tr style={{ height: 44 }} className="bg-[#e1e1e1]">
                  <td
                    className="xl63 p-[6px] border-r border-[#b8b8b8] border-dashed"
                    style={{ width: 177, textAlign: "center", height: 44 }}
                  >
                    &nbsp;"1"
                  </td>
                  <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 44 }}>
                    &nbsp;đi sang phải
                  </td>
                </tr>
                <tr style={{ height: 22 }}>
                  <td
                    className="xl63 p-[6px] border-r border-[#b8b8b8] border-dashed"
                    style={{ width: 177, textAlign: "center", height: 22 }}
                  >
                    &nbsp;"2"
                  </td>
                  <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 22 }}>
                    &nbsp;đi lên
                  </td>
                </tr>
                <tr style={{ height: 22 }} className="bg-[#e1e1e1]">
                  <td
                    className="xl63 p-[6px]  border-r border-[#b8b8b8] border-dashed"
                    style={{ width: 177, textAlign: "center", height: 22 }}
                  >
                    &nbsp;"3"
                  </td>
                  <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 22 }}>
                    &nbsp;đi xuống
                  </td>
                </tr>
                <tr style={{ height: 22 }}>
                  <td
                    className="xl63 p-[6px] border-r border-[#b8b8b8] border-dashed"
                    style={{ width: 177, textAlign: "center", height: 22 }}
                  >
                    &nbsp;"4"
                  </td>
                  <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 22 }}>
                    &nbsp;nghỉ ngơi
                  </td>
                </tr>
                <tr style={{ height: 22 }} className="bg-[#e1e1e1]">
                  <td
                    className="xl63 p-[6px] border-r border-[#b8b8b8] border-dashed"
                    style={{ width: 177, textAlign: "center", height: 22 }}
                  >
                    &nbsp;"5"
                  </td>
                  <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 22 }}>
                    &nbsp;đào vàng
                  </td>
                </tr>
                <tr style={{ height: 66 }}>
                  <td
                    className="xl63 p-[6px] border-r border-[#b8b8b8] border-dashed"
                    style={{ width: 177, textAlign: "center", height: 66 }}
                  >
                    "6"
                  </td>
                  <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 66 }}>
                    bị loại
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="ml-9">Trạng thái của người chơi được thể hiện như sau:</p>
          <div className="ml-9">
            <table
              style={{ marginLeft: "auto", marginRight: "auto" }}
              width={200}
              cellSpacing={0}
              cellPadding={0}
              border={0}
              className="border border-[#ddd] text-[#677897] mt-2 text-sm"
            >
              <colgroup>
                <col width={87} span={2} />
              </colgroup>
              <tbody>
                <tr style={{ height: 22 }}>
                  <td
                    className="xl63 p-[6px] border-r border-[#b8b8b8] border-dashed"
                    style={{ width: 177, textAlign: "center", height: 22 }}
                  >
                    &nbsp;"0"
                  </td>
                  <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 22 }}>
                    đang chơi
                  </td>
                </tr>
                <tr style={{ height: 44 }} className="bg-[#e1e1e1]">
                  <td
                    className="xl63 p-[6px] border-r border-[#b8b8b8] border-dashed"
                    style={{ width: 177, textAlign: "center", height: 44 }}
                  >
                    &nbsp;"1"
                  </td>
                  <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 44 }}>
                    bị loại vì đi ra khỏi bản đồ
                  </td>
                </tr>
                <tr style={{ height: 22 }}>
                  <td
                    className="xl63 p-[6px] border-r border-[#b8b8b8] border-dashed"
                    style={{ width: 177, textAlign: "center", height: 22 }}
                  >
                    &nbsp;"2"
                  </td>
                  <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 22 }}>
                    bị loại vì hết năng lượng
                  </td>
                </tr>
                <tr style={{ height: 22 }} className="bg-[#e1e1e1]">
                  <td
                    className="xl63 p-[6px]  border-r border-[#b8b8b8] border-dashed"
                    style={{ width: 177, textAlign: "center", height: 22 }}
                  >
                    &nbsp;"3"
                  </td>
                  <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 22 }}>
                    bị loại vì không gửi action cho server hoặc hành động không phải là giá trị từ "0"-"5"
                  </td>
                </tr>
                <tr style={{ height: 22 }}>
                  <td
                    className="xl63 p-[6px] border-r border-[#b8b8b8] border-dashed"
                    style={{ width: 177, textAlign: "center", height: 22 }}
                  >
                    &nbsp;"4"
                  </td>
                  <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 22 }}>
                    kết thúc trận đấu vì hết vàng
                  </td>
                </tr>
                <tr style={{ height: 22 }} className="bg-[#e1e1e1]">
                  <td
                    className="xl63 p-[6px] border-r border-[#b8b8b8] border-dashed"
                    style={{ width: 177, textAlign: "center", height: 22 }}
                  >
                    &nbsp;"5"
                  </td>
                  <td className="xl63 p-[6px]" style={{ width: 223, textAlign: "center", height: 22 }}>
                    kết thúc trận đấu vì hết lượt đi
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul className="ml-9 list-disc">
            <li>Khi người chơi bị loại, máy chủ sẽ ngắt kết nối với người chơi</li>
            <li>Khi trò chơi kết thúc máy chủ sẽ ngắt kết nối đến tất cả người chơi.</li>
            <li>
              Cách tính tọa độ của bản đồ:
              <ul className="ml-9" style={{ listStyleType: "circle" }}>
                <li>
                  <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">(0,0)</code> là điểm trái
                  trên cùng của bản đồ
                </li>
                <li>
                  <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">(posx, posy)</code> được
                  tính bắt đầu từ <code>(0,0)</code>
                  &nbsp;với <code>posx</code> là cột thứ posx và <code>posy</code> là hàng thứ posy trên bản đồ.
                </li>
              </ul>
            </li>
          </ul>
          <div className="flex justify-center">
            <img src={urlImg + "/Media/Default/Game/GoldMiner/Coordinates.png"} />
          </div>
          <div className="mt-8">
            <div className="text-sm font-bold text-[#4d96ff]">♦ CÁC GIỚI HẠN VỀ THỜI GIAN</div>
            <ul className="ml-9 list-disc mt-[10px]">
              <li>
                Thời gian kết nối đến máy chủ: <strong style={{ color: "red" }}>1 phút</strong>. Nghĩa là trong vòng{" "}
                <strong style={{ color: "red" }}>1 phút</strong>, từ thời điểm chạy bài thi&nbsp;(chạy tập tin{" "}
                <strong style={{ color: "red" }}>run.sh</strong>), nếu máy chủ không nhận được kết nối từ người chơi thì
                được xem là kết nối thất bại. Và người chơi sẽ bị loại khỏi cuộc thi.
              </li>
              <li>
                Thời gian chờ giữa các step: <strong style={{ color: "red" }}>1000 ms</strong>. Nghĩa là trong vòng{" "}
                <strong style={{ color: "red" }}>1000 ms</strong>, tính từ thời điểm máy chủ gửi trạng thái của trò chơi
                cho người chơi, mà máy chủ không nhận được action từ phía người chơi thì người chơi sẽ bị loại khỏi trận
                đấu. Kết nối giữa người chơi và máy chủ sẽ bị ngắt.
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <div className="text-sm font-bold text-[#4d96ff]">♦ MÃ NGUỒN ĐƯỢC XÁC NHẬN NHƯ THẾ NÀO?</div>
            <ul className="ml-9 list-disc mt-[10px]">
              <li>
                Ngay sau khi nhận được tập tin .zip, máy chủ sẽ thực hiện biên dịch đoạn mã (chạy tập tin{" "}
                <strong style={{ color: "red" }}>build.sh</strong>) và chạy thử mã nguồn (chạy tập tin{" "}
                <strong style={{ color: "red" }}>run.sh</strong>) để đảm bảo cấu trúc mã nguồn là đúng và việc kết nối
                đến máy chủ socket thành công. Chú ý, lúc này máy chủ sẽ không thực hiện tính điểm cũng như không đánh
                giá nội dung tin nhắn mà người chơi gửi lên máy chủ là đúng hay sai.
              </li>
              <li>
                <p>
                  <strong>Mã nguồn mẫu:</strong>
                  <strong>
                    <br />
                  </strong>
                  Tải mã nguồn mẫu tại đây:&nbsp;
                  <strong className="hover:underline">
                    <a
                      href="https://github.com/xphongvn/rlcomp2020/archive/master.zip"
                      target="_blank"
                      data-toggle="tooltip"
                      data-placement="left"
                      rel="noopener"
                    >
                      sample-source
                    </a>
                  </strong>
                </p>
              </li>
            </ul>
            <p className="ml-9">
              Hướng dẫn cài đặt môi trường:&nbsp;
              <strong className="hover:underline">
                <a
                  href="https://github.com/xphongvn/rlcomp2020/raw/master/MinerAI%20-%20C%C3%A0i%20%C4%91%E1%BA%B7t%20m%C3%B4i%20tr%C6%B0%E1%BB%9Dng.pdf"
                  target="_blank"
                  data-toggle="tooltip"
                  data-placement="left"
                  rel="noopener"
                >
                  MinerAI - Cài đặt môi trường.pdf
                </a>
              </strong>
              &nbsp;
            </p>
            <p className="ml-9">
              Hướng dẫn huấn luyện tại local PC:&nbsp;
              <strong className="hover:underline">
                <a
                  href="https://github.com/xphongvn/rlcomp2020/raw/master/MinerAI%20-%20CodeAISample.pdf"
                  target="_blank"
                  data-toggle="tooltip"
                  data-placement="left"
                  rel="noopener"
                >
                  MinerAI - CodeAISample.pdf
                </a>
              </strong>
            </p>
            <p className="ml-9">
              <strong style={{ color: "red" }}>Version Date: 2020/09/08 10:26&nbsp;</strong>
            </p>
            <p className="ml-9">
              Nội dung cập nhật:&nbsp;
              <strong className="hover:underline">
                <a
                  href="https://github.com/xphongvn/rlcomp2020/raw/master/Change%20logs.docx"
                  target="_blank"
                  data-toggle="tooltip"
                  data-placement="left"
                  rel="noopener"
                >
                  Change logs.docx
                </a>
              </strong>
            </p>
            <p className="ml-9">
              <code className="py-[2px] px-1 text-[#c7254e] bg-[#f9f2f4] rounded-[4px]">
                (Bạn cũng có thể sử dụng Git để clone mã nguồn mẫu về từ repository:{" "}
                <a
                  href="https://github.com/xphongvn/rlcomp2020"
                  className="hover:underline"
                  style={{ wordBreak: "break-all" }}
                >
                  https://github.com/xphongvn/rlcomp2020)
                </a>
              </code>
            </p>
          </div>
          <div className="mt-8">
            <div className="text-sm font-bold text-[#4d96ff]">♦ GIAO TIẾP GIỮA NGƯỜI CHƠI VÀ MÁY CHỦ</div>
            <p className="ml-9">
              Mỗi đội thi được submit code không giới hạn số lượt lên hệ thống, nhưng chỉ được thi đấu tối đa 20 lượt
              với Bot của Ban tổ chức.
            </p>
            <p className="ml-9">
              Lượt đấu với bot sẽ được tự động kích hoạt sau khi code của đội thi được verify thành công. Mỗi lượt sẽ có
              5 trận đấu.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
