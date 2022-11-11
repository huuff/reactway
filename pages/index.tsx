import dynamic from "next/dynamic";

const Home = dynamic(
  () => import("../src/components/Game"),
  { ssr: false },
)

export default Home;