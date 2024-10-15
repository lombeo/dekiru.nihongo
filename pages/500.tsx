import { Container } from "@src/components";
import { ErrorServer } from "@src/components/ErrorServer/ErrorServer";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";

export default function Custom500() {
  return (
    <>
      <HeadSEO />
      <DefaultLayout allowAnonymous>
        <Container>
          <div className="flex justify-center my-24 w-full">
            <ErrorServer />
          </div>
        </Container>
      </DefaultLayout>
    </>
  );
}
