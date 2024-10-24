import Icon from "@edn/font-icons/icon";
import { FC } from "react";
import { motion } from "framer-motion";

const StrengthList: FC = () => {
  const data = [
    { icon: "add", label: "Học lập trình từ con số 0", styles: { delay: 0.06 } },
    { icon: "add", label: "Khơi dậy đam mê công nghệ", styles: { delay: 0.12 } },
    { icon: "add", label: "Chinh phục thế giới số, khẳng định bản thân", styles: { delay: 0.18 } },
    { icon: "add", label: "Mở ra cơ hội việc làm hấp dẫn trong tương lai", styles: { delay: 0.24 } },
  ];

  return (
    <ul className="flex flex-col items-start gap-3">
      {data.map((item, index) => (
        <motion.div
          key={`strength-key-${index}`}
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: item.styles?.delay || 0 }}
        >
          <li className="text-white px-6 py-4 gap-[10px] bg-[#0E2643] flex flex-row item-center leading-4">
            <Icon name={item.icon} />
            {item.label}
          </li>
        </motion.div>
      ))}
    </ul>
  );
};

export default StrengthList;
