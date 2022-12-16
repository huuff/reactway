import { useRouter } from "next/router";
import { useEffect } from "react";
import Header from "../src/components/ui/Header";
import SubHeader from "../src/components/ui/SubHeader";
import { useDarkMode } from "../src/hooks/use-dark-mode";
import { randomSeed } from "../src/util/birth-function";
import { getTheme } from "../src/util/get-theme";


const Index = () => {
  const { isDarkMode } = useDarkMode();
  const theme = getTheme(isDarkMode);
  /*
  const router = useRouter();

  useEffect(() => {
    router.push({
      pathname: "/game",
      query: {
        seed: randomSeed(),
      }
    });
  }, [router]);
  */

  return (
    <div className={`h-screen bg-${theme.windowBackground.className}`}>
      <Header text="Reactway"/>
      <SubHeader>
        Where dreams come true.
      </SubHeader>
    </div>
  );
};

export default Index;