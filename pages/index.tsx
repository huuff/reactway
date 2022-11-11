import dynamic from "next/dynamic";
import "tailwindcss/tailwind.css";

const Home = dynamic(
  () => import("../src/components/Game"),
  { ssr: false },
)

export default Home;