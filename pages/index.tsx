import Header from "@/components/header";
import LandingPageSection from "@/components/home/landing-page";
import OurMembers from "@/components/home/our-members";
import ReasonsToLearnJapanese from "@/components/home/reason";
import WhyChooseUs from "@/components/home/why-choose-us";
import React from "react";

const index = () => {
  return (
    <>
      <LandingPageSection />
      <ReasonsToLearnJapanese />
      <WhyChooseUs />
      <OurMembers />
    </>
  );
};

export default index;
