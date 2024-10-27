import HomePage from "@/components/home/home-page";
import LandingPageSection from "@/components/home/landing-page";
import OurMembers from "@/components/home/our-members";
import ReasonsToLearnJapanese from "@/components/home/reason";
import WhyChooseUs from "@/components/home/why-choose-us";
import React from "react";
import { useUser } from "@/context/UserContext"; // Import useUser từ UserContext

const Index = () => {
  const userContext = useUser();
  const isLoggedIn = userContext?.isLoggedIn || false;

  return (
    <>
      {!isLoggedIn ? (
        <>
          <LandingPageSection />
          <ReasonsToLearnJapanese />
          <WhyChooseUs />
          <OurMembers />
        </>
      ) : (
        <HomePage />
      )}
    </>
  );
};

export default Index;
