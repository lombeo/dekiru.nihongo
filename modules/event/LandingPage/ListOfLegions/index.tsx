import { Modal } from "@mantine/core";

interface IProps {
  onClose: () => void;
}

const ModalListOfLegions = (props: IProps) => {
  const { onClose } = props;
  return (
    <Modal opened onClose={onClose} size="lg" centered>
      <div className="space-y-6 px-8 pb-4">
        <div className="uppercase font-bold text-blue-600 text-lg text-center">Quy định về khu vực</div>
        <div className="font-bold break-words">
          Khu vực phía Bắc bao gồm các Tỉnh/TP:
          <div className="font-normal">
            Hà Giang, Cao Bằng, Lào Cai, Sơn La, Lai Châu, Bắc Kạn, Lạng Sơn, Tuyên Quang, Yên Bái, Thái Nguyên, Điện
            Biên, Phú Thọ, Vĩnh Phúc, Bắc Giang, Bắc Ninh, Hà Nội, Quảng Ninh, Hải Dương, Hải Phòng, Hòa Bình, Hưng Yên,
            Hà Nam, Thái Bình, Nam Định, Ninh Bình, Thanh Hóa, Nghệ An, Hà Tĩnh, Quảng Bình, Quảng Trị, Thừa - Thiên
            Huế, Đà Nẵng. 
          </div>
        </div>
        <div className="font-bold break-words">
          Khu vực phía Nam bao gồm các Tỉnh/TP:
          <div className="font-normal">
            Quảng Nam, Quảng Ngãi, Kon Tum, Gia Lai, Bình Định, Phú Yên, Đăk Lăk, Khánh Hòa, Đăk Nông, Lâm Đồng, Ninh
            Thuận, Bình Phước, Tây Ninh, Bình Dương, Đồng Nai, Bình Thuận, Hồ Chí Minh, Long An, Bà Rịa - Vũng Tàu, Đồng
            Tháp, An Giang, Tiền Giang, Vĩnh Long, Bến Tre, Cần Thơ, Kiên Giang, Trà Vinh, Hậu Giang, Sóc Trăng, Bạc
            Liêu, Cà Mau. 
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalListOfLegions;
