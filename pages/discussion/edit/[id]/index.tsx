import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";
import TopicEditIndex from "@src/modules/discussion/TopicEdit/TopicEditIndex";

export async function getStaticProps({ locale }: any) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"])),
        },
    };
}

const TopicEditPage = () => {
 
    return (
        <DefaultLayout allowAnonymous>
            <TopicEditIndex/>
        </DefaultLayout>
    );
};

export default TopicEditPage;

export const getStaticPaths: GetStaticPaths<{
    id: string;
}> = async () => {
    return {
        paths: [],
        fallback: "blocking",
    };
};
