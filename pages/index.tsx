import classNames from "classnames";
import Link from "next/link";
import Header from "../src/components/ui/Header";
import SubHeader from "../src/components/ui/SubHeader";
import { useDarkMode } from "../src/hooks/use-dark-mode";
import { randomSeed } from "../src/util/birth-function";
import { getTheme } from "../src/util/get-theme";


const Index = () => {
  const { isDarkMode } = useDarkMode();
  const theme = getTheme(isDarkMode);

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
        "p-7",
        "flex",
        "flex-col",
        "justify-between",
      )}>
        { /*<FirstSection /> */}
        <SecondSection />
        <div className="text-center">
          Or just <Link href={{
            pathname: "/game",
            query: {
              seed: randomSeed(),
            }
          }} className="underline">start playing right now</Link>
        </div>
      </main>
    </div>
  );
};

const FirstSection = () => {
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

const SecondSection = () => {
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

export default Index;