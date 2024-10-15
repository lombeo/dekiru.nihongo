import React from "react";
import styled from "styled-components";
import { Image, Modal } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import ExternalLink from "@src/components/ExternalLink";
import clsx from "clsx";
import { TextLineCamp } from "@edn/components/TextLineCamp";

interface WinnerModalProps {
  onClose: () => void;
  data: any;
}

const WinnerModal = (props: WinnerModalProps) => {
  const { onClose, data } = props;

  const getImageRank = (index: number) => {
    switch (index) {
      case 0:
        return <Image mt="sm" src={`/images/fight/modal-top-${index}-min.png`} height={61} width={77} />;
      case 1:
        return <Image mt="sm" src={`/images/fight/modal-top-${index}-min.png`} height={79} width={79} />;
      case 2:
        return <Image mt="sm" src={`/images/fight/modal-top-${index}-min.png`} height={43} width={75} />;
    }
  };

  return (
    <>
      <Modal
        classNames={{
          root: "bg-[#1D1C30]",
          header: "hidden",
          body: "px-0 !py-[36px] relative flex items-center flex-col justify-start",
        }}
        closeOnClickOutside
        closeOnEscape
        opened
        size={600}
        zIndex={300}
        onClose={onClose}
      >
        <Background />
        <WinnerImage src="/images/fight/topBanner-min.png" width={349} height={207} />
        <div className="flex justify-center gap-[68px] mt-8">
          {data?.map((e: any, index) =>
            e?.user ? (
              <div
                key={e.teamId}
                className={clsx("flex flex-col justify-between items-center", {
                  "mt-4": index !== 1,
                })}
              >
                <Avatar
                  userExpLevel={e?.user?.userExpLevel}
                  src={e?.user?.userAvatarUrl}
                  userId={e?.user?.userId}
                  size="xl"
                />
                <ExternalLink
                  className="text-[#fff] text-center hover:underline w-[110px] mt-[36px] z-10"
                  target="_blank"
                  href={`/profile/${e?.user?.userId}`}
                >
                  <TextLineCamp>{e?.user?.userName}</TextLineCamp>
                </ExternalLink>
                {getImageRank(index)}
              </div>
            ) : (
              <div key={index}></div>
            )
          )}
        </div>
      </Modal>
    </>
  );
};

export default WinnerModal;

const WinnerImage = styled(Image)``;

const Background = styled.div`
  background-color: #1d1c30;
  background-position: top center;
  background-image: url("/images/fight/top-users-bg-min.png");
  background-repeat: no-repeat;
  background-size: cover;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
`;
