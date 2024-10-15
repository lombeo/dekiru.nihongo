export default function EventFooter({ imageSrc, title, location, contact, mail }) {
  return (
    <div className="flex flex-col gap-6 text-white">
      <div className="h-[78px]">
        <img src={imageSrc} className="max-h-full" />
      </div>

      <div className="text-[18px] xs:text-[22px] md:text-2xl custom:min-h-[64px]">{title}</div>

      <div className="text-sm flex flex-col gap-[10px]">
        <div className="flex gap-[10px]">
          <div className="w-[14px] shrink">
            <img src="/images/event/icons/LandingLocation.svg" />
          </div>
          <div className="w-[99%]">{location}</div>
        </div>

        <div className="flex gap-[10px]">
          <div className="w-[14px] shrink">
            <img src="/images/event/icons/LandingPhone.svg" className="w-full" />
          </div>
          <div className="w-[99%]">{contact}</div>
        </div>

        <div className="flex gap-[10px]">
          <div className="w-[14px] shrink">
            <img src="/images/event/icons/LandingMail.svg" />
          </div>
          <div className="w-[99%]">{mail}</div>
        </div>
      </div>
    </div>
  );
}
