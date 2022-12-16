import classNames from "classnames";
import Link from "next/link";
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

  // TODO: Make the link take to the game
  return (
    <div className={`h-screen bg-${theme.windowBackground.className}`}>
      <Header text="Reactway" />
      <SubHeader>
        Where dreams come true.
      </SubHeader>
      <main className={classNames(
        "mt-10",
        `text-${theme.text.className}`,
        "h-96",
        "w-[42rem]",
        `bg-${theme.panel.className}`,
        "mx-auto",
        "shadow-lg",
        "rounded-md",
        "p-5",
        "text-center",
        "flex",
        "flex-col",
        "justify-between",
      )}>
        <div>
          <p className="my-1">
            Before continuing, there are some things you <span className="italic">don&apos;t</span> need to know.
          </p>
          <p className="my-2">
            Reactway is a react-based implementation of Conway&apos;s Game of Life
          </p>
          <p className="my-3">
            Game of Life is a hyperrealistic simulation of a living community where individuals live, communicate, reproduce and die.
          </p>
          <p className="my-4">
            It&apos;s said to be so good that most people can discern it from reality after a few hours. So proceed with caution
          </p>
          <p className="my-5">
            Keep reading to know more about its rules and nature.
          </p>
        </div>
        <div>
          Or just <Link href="#" className="underline">start playing right now</Link>
        </div>
      </main>
    </div>
  );
};

export default Index;