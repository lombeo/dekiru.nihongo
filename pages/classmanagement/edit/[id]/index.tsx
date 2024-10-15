import DefaultLayout from "@src/components/Layout/Layout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";
import ClassEdit from "@src/modules/classmanagement/ClassEdit";

export async function getStaticProps({ locale }: any) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"])),
        },
    };
}

const ClassEditPage = () => {
 
    return (
        <DefaultLayout>
            <ClassEdit/>
        </DefaultLayout>
    );
};

export default ClassEditPage;

export const getStaticPaths: GetStaticPaths<{
    id: string;
}> = async () => {
    return {
        paths: [],
        fallback: "blocking",
    };
};
