import { useRouter } from "next/router";
import { useEffect } from "react";
import { randomSeed } from "../src/util/birth-function";


const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push({
      pathname: "/game",
      query: {
        seed: randomSeed(),
      }
    });
  }, [router])
}

export default Index;