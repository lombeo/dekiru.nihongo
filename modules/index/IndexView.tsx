import { NextPage } from "next";
import { Container } from "@src/components";
import BoxSlogan from "./components/BoxSlogan";
import BoxRegister from "./components/BoxRegister";
import BoxPartners from "./components/BoxPartners";
import BoxSummary from "./components/BoxSummary";
import BoxRoadmap from "./components/BoxRoadmap";
import BoxOutstanding from "./components/BoxOutstanding";
import BoxOurPride from "./components/BoxOurPride";
import BoxFeedback from "./components/BoxFeedback";
import BoxStart from "./components/BoxStart";

const IndexView: NextPage = () => {
  // const router = useRouter();
  // const locale = router.locale;
  // const keyLocale = locale === "vi" ? "vn" : "en";

  return (
    <div className="w-full">
      <div>
       <div className="min-h-[calc(100vh_-_80px)] flex flex-col justify-end pt-[100px] lg:pt-[180px] md:pt-[150px] pb-[100px] relative">
         <div className="absolute top-0 right-0 w-[calc((100vw_-_1440px)/2_+_14vw)] lg:min-w-[258px] min-w-[300px] aspect-square bg-cover bg-[url('/images/head-right-bg.png')] bg-no-repeat bg-right-top" />
         <Container size="xl">
           <div className="grid lg:grid-cols-[2fr_1fr] gap-7 px-0 lg:px-0 md:px-20">
             <BoxSlogan />
             <BoxRegister />
           </div>
         </Container>
       </div>
       <BoxPartners />
       <BoxSummary />
       <BoxRoadmap />
       <BoxOutstanding />
       <BoxOurPride />
       <BoxFeedback />
       <BoxStart />
     </div>
    </div>
  );
};

export default IndexView;
