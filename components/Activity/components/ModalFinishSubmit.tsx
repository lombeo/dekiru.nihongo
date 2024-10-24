import { Button, Modal } from "@edn/components";
import Link from "@src/components/Link";
import { useRouter } from "@src/hooks/useRouter";
import { ActivityContextType } from "@src/services/Coding/types";
import { useTranslation } from "next-i18next";

const IconFinish = `<svg width="160px" height="134px" viewBox="0 0 160 134" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
    <polygon id="path-1" points="0.141035714 0.540178571 42.7005595 0.540178571 42.7005595 41.0165119 0.141035714 41.0165119"/>
</defs>
<g id="Course" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="Popup-Submit-" transform="translate(-878.000000, -333.000000)">
        <g id="Congratulations" transform="translate(878.000000, 333.000000)">
            <path d="M81.4280893,51.5298214 L81.4280893,116.436369" id="Stroke-1" stroke="#9570EE" stroke-width="3" stroke-linecap="round"/>
            <g id="Group-37" transform="translate(0.000000, 0.114583)">
                <path d="M91.3134226,131.809655 C91.3134226,131.809655 87.7397321,98.4122143 124.671577,75.2192381" id="Stroke-2" stroke="#4D96FF" stroke-width="3" stroke-linecap="round"/>
                <path d="M71.5430179,131.809655 C71.5430179,131.809655 75.1167083,98.4122143 38.1842083,75.2192381" id="Stroke-4" stroke="#EE4035" stroke-width="3" stroke-linecap="round"/>
                <path d="M38.9519821,21.0410952 L38.9519821,17.9060952" id="Stroke-6" stroke="#4D96FF" stroke-width="2" stroke-linecap="round"/>
                <path d="M38.9519821,27.6111071 L38.9519821,24.4767619" id="Stroke-8" stroke="#4D96FF" stroke-width="2" stroke-linecap="round"/>
                <path d="M40.66975,22.7585357 L43.80475,22.7585357" id="Stroke-10" stroke="#4D96FF" stroke-width="2" stroke-linecap="round"/>
                <path d="M34.0991488,22.7585357 L37.2341488,22.7585357" id="Stroke-12" stroke="#4D96FF" stroke-width="2" stroke-linecap="round"/>
                <path d="M122.648298,5.98477976 L122.648298,2.84977976" id="Stroke-14" stroke="#9570EE" stroke-width="2" stroke-linecap="round"/>
                <path d="M122.648298,12.5547917 L122.648298,9.42044643" id="Stroke-16" stroke="#9570EE" stroke-width="2" stroke-linecap="round"/>
                <path d="M124.366131,7.70222024 L127.501131,7.70222024" id="Stroke-18" stroke="#9570EE" stroke-width="2" stroke-linecap="round"/>
                <path d="M117.795464,7.70222024 L120.930464,7.70222024" id="Stroke-20" stroke="#9570EE" stroke-width="2" stroke-linecap="round"/>
                <path d="M99.1680119,74.585756 C99.1680119,75.4899821 98.4353333,76.2226607 97.5311071,76.2226607 C96.626881,76.2226607 95.8942024,75.4899821 95.8942024,74.585756 C95.8942024,73.6815298 96.626881,72.9488512 97.5311071,72.9488512 C98.4353333,72.9488512 99.1680119,73.6815298 99.1680119,74.585756" id="Fill-22" fill="#4D96FF"/>
                <path d="M67.8254762,56.0586786 C67.8254762,56.9629048 67.0927976,57.6955833 66.1885714,57.6955833 C65.285,57.6955833 64.5516667,56.9629048 64.5516667,56.0586786 C64.5516667,55.1544524 65.285,54.4217738 66.1885714,54.4217738 C67.0927976,54.4217738 67.8254762,55.1544524 67.8254762,56.0586786" id="Fill-24" fill="#EE4035"/>
                <path d="M141.115268,25.5035595 C141.115268,26.407131 140.382589,27.1404643 139.478363,27.1404643 C138.574792,27.1404643 137.841458,26.407131 137.841458,25.5035595 C137.841458,24.5993333 138.574792,23.8666548 139.478363,23.8666548 C140.382589,23.8666548 141.115268,24.5993333 141.115268,25.5035595" id="Fill-26" fill="#4D96FF"/>
                <path d="M20.469625,4.3324881 C20.469625,5.23671429 19.7362917,5.96939286 18.8327202,5.96939286 C17.928494,5.96939286 17.1958155,5.23671429 17.1958155,4.3324881 C17.1958155,3.4282619 17.928494,2.69558333 18.8327202,2.69558333 C19.7362917,2.69558333 20.469625,3.4282619 20.469625,4.3324881" id="Fill-28" fill="#9570EE"/>
                <g id="Group-32" transform="translate(60.892857, 0.000000)">
                    <mask id="mask-2" fill="white">
                        <use xlink:href="#path-1"/>
                    </mask>
                    <g id="Clip-31"/>
                    <polygon id="Fill-30" fill="#EE4035" mask="url(#mask-2)" points="21.4207976 0.539785714 27.9959167 13.8641905 42.7005595 16.0006786 32.0606786 26.3721071 34.5716905 41.0165119 21.4207976 34.102881 8.26925 41.0165119 10.7809167 26.3721071 0.141035714 16.0006786 14.8450238 13.8641905"/>
                </g>
                <polygon id="Fill-33" fill="#9570EE" points="156.280092 45.7199077 151.966215 58.4399692 160 69.2050769 146.569046 69.0332 138.812954 79.9994154 134.826462 67.1735385 122 63.1864615 132.9668 55.4303692 132.794923 42 143.560031 50.0332"/>
                <polygon id="Fill-35" fill="#4D96FF" points="16.4399692 50.0332 27.2050769 42 27.0332 55.4303692 38 63.1864615 25.1735385 67.1735385 21.1870462 79.9994154 13.4309538 69.0332 0 69.2050769 8.03378462 58.4399692 3.71990769 45.7199077"/>
            </g>
        </g>
    </g>
</g>
</svg>`;

interface FinishSubmitProps {
  onClose: any;
  contextId: number;
  contextType: number;
  nextActivity: any;
  token?: any | null;
  chapters?: any | null;
  activityId: number;
}

const ModalFinishSubmit = (props: FinishSubmitProps) => {
  const { contextId, contextType, onClose, nextActivity, token, chapters, activityId } = props;
  const { t } = useTranslation();

  const id = nextActivity?.activityId;
  const type = nextActivity?.activityType;
  const router = useRouter();
  const index = chapters.findIndex((item: any) => item.id == activityId);
  let label = t("Back to contest");
  let pathname = `/fights/detail/${contextId}`;

  if (contextType === ActivityContextType.Training) {
    label = t("Back to training");
    pathname = `/training`;
  } else if (contextType === ActivityContextType.Challenge) {
    label = t("Back to challenge");
    pathname = `/challenge`;
  } else if (contextType === ActivityContextType.Evaluating) {
    (label = t("Back to evaluate")), (pathname = `/evaluating/detail/${contextId}/${id ?? chapters[index + 1]?.id}`);
  }

  return (
    <Modal opened onClose={onClose} size="md">
      <div className="flex flex-col item-center justify-center text-center mb-5">
        <div className="flex justify-center mb-4" dangerouslySetInnerHTML={{ __html: IconFinish }} />
        <h3 className="text-2xl font-semibold mb-1">{t("Congratulations")}</h3>
        <p className="text-lg">{t("You have just finished this task.")}</p>
      </div>
      {contextType === ActivityContextType.Evaluating ? (
        <div className="flex justify-center mb-4">
          <Button variant="outline" onClick={onClose}>
            {t("Stay on this page")}
          </Button>
          {nextActivity ? (
            <Link
              onClick={(event) => {
                event.preventDefault();
                router
                  .push({
                    pathname,
                    query: {
                      activityId: id,
                      activityType: type,
                      token: token,
                    },
                  })
                  .finally(() => onClose());
              }}
              href={`${pathname}?activityType=${type}&activityId=${id}`}
            >
              <Button type="submit" className="ml-4">
                {t("TRY OTHER TASK")}
              </Button>
            </Link>
          ) : (
            <>
              {chapters[index + 1] ? (
                <Link
                  onClick={(event) => {
                    event.preventDefault();
                    router.push(pathname).finally(() => onClose());
                  }}
                  href={`${pathname}?activityType=${type}&activityId=${chapters[index + 1]?.id}`}
                >
                  <Button type="submit" className="ml-4" uppercase>
                    {t("Next chapter")}
                  </Button>
                </Link>
              ) : (
                <Link
                  onClick={(event) => {
                    event.preventDefault();
                    router.push(`/evaluating/detail/${contextId}`).finally(() => onClose());
                  }}
                  href={`/evaluating/detail/${contextId}`}
                >
                  <Button type="submit" className="ml-4" uppercase>
                    {label}
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="flex justify-center mb-4 flex-wrap gap-4 items-center">
          <Button variant="outline" onClick={onClose}>
            {t("Stay on this page")}
          </Button>
          {nextActivity ? (
            <Link
              onClick={(event) => {
                event.preventDefault();
                router
                  .push({
                    pathname,
                    query: {
                      activityId: id,
                      activityType: type,
                      token: token,
                    },
                  })
                  .finally(() => onClose());
              }}
              href={`${pathname}?activityType=${type}&activityId=${id}`}
            >
              <Button type="submit">{t("TRY OTHER TASK")}</Button>
            </Link>
          ) : (
            <Link
              onClick={(event) => {
                event.preventDefault();
                router.push(pathname).finally(() => onClose());
              }}
              href={pathname}
            >
              <Button type="submit" uppercase>
                {label}
              </Button>
            </Link>
          )}
        </div>
      )}
    </Modal>
  );
};
export default ModalFinishSubmit;