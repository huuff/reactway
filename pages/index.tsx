import "tailwindcss/tailwind.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { randomSeed } from "../src/game/birth-function";


export default () => {
  const router = useRouter();

  useEffect(() => {
    router.push({
      pathname: "/game",
      query: {
        seed: randomSeed(),
      }
    });
  }, [])
}