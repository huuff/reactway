import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import Link from "next/link";
import { FC, useCallback, useState } from "react";
import Header from "../src/components/ui/Header";
import SubHeader from "../src/components/ui/SubHeader";
import { useDarkMode } from "../src/hooks/use-dark-mode";
import { randomSeed } from "../src/util/birth-function";
import { getTheme, Theme } from "../src/util/get-theme";
import clamp from "lodash/clamp";
import { NextPage } from "next";

type SectionNumber = 1 | 2 | 3;

type ChangeSection = "next" | "previous";

const SectionButton: FC<{ 
  theme: Theme, 
  type: ChangeSection, 
  changeSection: (change: ChangeSection) => void ,
  isEnabled: boolean,
}> = ({ theme, type, changeSection, isEnabled }) => {
  return (
    <button className={classNames(
      "flex",
      "items-center",
      "px-2",
      { ["ml-3"]: type === "next"},
      { ["mr-3"]: type === "previous"},
      { ["rounded-l-md"]: type === "previous" },
      { ["rounded-r-md"]: type === "next" },
      {[`hover:bg-${theme.panelHighlight.className}`]: isEnabled},
      {["hover:cursor-pointer"]: isEnabled },
      { [`text-${theme.panelMuted.className}`]: !isEnabled}
    )}
      onClick={() => isEnabled && changeSection(type)}
      disabled={!isEnabled}
    >
      <FontAwesomeIcon className="w-4" icon={type === "next" ? faChevronRight : faChevronLeft} />
    </button>
  );
};

type Section = FC<{theme: Theme}>;

// TODO: Slide-in/Slide-out animation when changing section
// TODO: Make it responsive
const Index: NextPage<{seed: string}> = ({ seed }) => {
  const { isDarkMode } = useDarkMode();
  const theme = getTheme(isDarkMode); 

  const [currentSectionNumber, setCurrentSectionNumber] = useState<SectionNumber>(1);

  const changeSection = useCallback((action: ChangeSection) => {
    setCurrentSectionNumber((current) => {
      const change = action === "next" ? 1 : -1;
      // TODO: Can I do a version of this that types the result as a number in a range?
      return clamp(current + change, 1, 3) as SectionNumber;
    });
  }, [setCurrentSectionNumber]);

  const CurrentSection = useCallback(() => {
    switch (currentSectionNumber) {
      case 1:
        return <FirstSection theme={theme}/>;
      case 2:
        return <SecondSection theme={theme}/>;
      case 3:
        return <ThirdSection theme={theme}/>;
    }
  }, [currentSectionNumber, theme]);

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
        "flex",
        "flex-row",
      )}>
        <SectionButton theme={theme} type="previous" changeSection={changeSection} isEnabled={currentSectionNumber !== 1}/>
        <div className="flex flex-col justify-between py-7">
          <CurrentSection />
          <div className="text-center">
            Or just <Link href={{
              pathname: "/game",
              query: { seed },
            }} className="underline">start playing right now</Link>
          </div>
        </div>
        <SectionButton theme={theme} type="next" changeSection={changeSection} isEnabled={currentSectionNumber !== 3}/>
      </main>
    </div>
  );
};

const FirstSection: Section = ({theme}) => {
  return (
    <section className="text-center">
      <p className="mb-2">
        Before continuing, there are some things you <span className="italic">don&apos;t</span> need to know.
      </p>
      <p className="my-5">
        Reactway is a react-based implementation of Conway&apos;s Game of Life
      </p>
      <p className="my-5">
        Game of Life is a hyperrealistic simulation of a living community where individuals live, communicate, reproduce and die.
      </p>
      <p className="my-5">
        It&apos;s said to be so good that most people can&apos;t discern it from reality after a few hours.
        So <span className="italic">proceed with caution</span>
      </p>
      <p className="my-5">
        Keep reading to know more about its rules and nature.
      </p>
    </section>
  );
};

const SecondSection: Section = ({theme}) => {
  return (
    <section>
      <p className="text-center mb-6">
        Want to know the rules of <span className="italic">life</span>?
      </p>
      <ul className="list-disc mx-14">
        <li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
        <li>Any live cell with two or three live neighbours lives on to the next generation.</li>
        <li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
        <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
      </ul>
      <p className="text-right my-3 hover:underline">
        <Link href="https://en.wikipedia.org/wiki/Conway's_Game_of_Life#Rules" >
          Source: Wikipedia
        </Link>
      </p>
    </section>
  );
};

const ThirdSection: Section = ({theme}) => {
  return (
    <section className="text-center">
      <p className="my-3">
        The development of each game is completely deterministic, based on a seed.
      </p>

      <p className="my-3">
        You&apos;ll find all possible settings of configurations in the drawer at the bottom of the screen.
      </p>

      <p className="my-3">
        Settings will be synchronized with your search bar, which means that sharing it with anyone is guaranteed to 
        give them the exact same configuration as yours.
      </p>

      {/* TODO: Pass the exact address of the deployment environment from the server and put it here */}
      <div className="mt-4 w-5/6 mx-auto">
        <label htmlFor="example-url" className={`text-${theme.panelMuted.className}`}>Example</label>
        <input 
          type="text"
          id="example-url"
          name="example-url"
          className={`bg-${theme.panelHighlight.className} py-1 px-2 w-full`}
          readOnly
          value="https://localhost:3000/game?seed=0be686b1-207e-4065-8d64-257d111feeb5&height=50&width=100&tickDuration=700&cellSize=4"
        />
      </div>
    </section>
  );
};

Index.getInitialProps = () => {
  return {
    seed: randomSeed(),
  };
};

export default Index;