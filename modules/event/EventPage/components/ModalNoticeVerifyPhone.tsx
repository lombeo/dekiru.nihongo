import { Modal } from "@mantine/core";
import { Check } from "tabler-icons-react";

interface IProps {
  onClose: () => void;
}
const ModalNoticeVerifyPhone = ({ onClose }: IProps) => {
  return (
    <Modal opened onClose={onClose} size="lg" centered classNames={{ header: "pb-0" }}>
      <div className="space-y-2 sm:px-4 pb-4 text-sm break-words">
        <div className="uppercase font-bold text-blue-700 text-lg text-center pb-4">Cập nhật thể lệ</div>
        <div className="text-red-600">{`100% thí sinh phải xác nhận số điện thoại để tham gia "Đường đua lập trình"`}</div>
        <div>
          Để đảm bảo sự công bằng, tính bảo mật và tránh gian lận trong khi thi bằng việc tạo nhiều tài khoản ảo, Ban tổ
          chức cuộc thi Đường đua lập trình cập nhật thể lệ mới nhất như sau:
        </div>
        <div className="sm:flex gap-3 items-center">
          <Check color="blue" />
          100% thí sinh phải xác minh số điện thoại.
        </div>
        <div className="sm:flex gap-3 items-center">
          <Check color="blue" />
          01 số điện thoại đăng ký và xác minh được tối đa{" "}
          <span className="font-bold sm:pl-1 sm:-mx-3">02 tài khoản</span>.
        </div>
        <div className="sm:flex gap-3 items-center">
          <Check color="blue" />
          Cú pháp đăng ký: <span className="font-bold sm:-mx-2">CODELEARN</span>
          {`<dấucách>`}
          <span className="font-bold sm:-mx-2">Tên tài khoản</span> gửi
          <span className="font-bold pl-1 sm:-mx-3">8200</span>.
        </div>
        <div className="sm:flex gap-3 items-center">
          <Check color="blue" />
          Số điện thoại đăng ký cần phải trùng khớp với số điện thoại trong hồ sơ.
        </div>
        <div className="sm:flex gap-3 items-center">
          <Check color="blue" />
          Cước phí: <span className="font-bold sm:pl-1 sm:-mx-3">2.000 đồng</span>/ 01 tin nhắn.
        </div>
        <div className=" italic text-[#637381] !mt-6">
          Lưu ý: Số điện thoại được sử dụng để xác thực tài khoản trong cuộc thi, phục vụ việc xử lý các tình huống liên
          quan đến tài khoản và được cam kết bảo mật thông tin dữ liệu cá nhân theo quy định của Bộ Thông tin và Truyền
          thông.
        </div>
      </div>
    </Modal>
  );
};

export default ModalNoticeVerifyPhone;
