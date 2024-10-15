import { OverlayLoading } from "@edn/components";
import { useRouter } from "next/router";

const EvaluatingCreateIndex = () => {
    const router = useRouter();
    router.push("/evaluating");
    return(
        <>
            <OverlayLoading/>
        </>
    )
}

export default EvaluatingCreateIndex;