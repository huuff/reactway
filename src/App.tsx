import Game from "./components/Game";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { randomSeed } from "./game/birth-function";
import { seedRoute } from "./routes/active-routes";

function App() {
  return (
    <div className="App">
      <h1 className="text-5xl text-center mb-5">Reactway</h1>
      <BrowserRouter>
        <Routes>
          <Route path={seedRoute.base} element={<Game />} />
          <Route path="/" element={
            <Navigate replace to={seedRoute.build({seed: randomSeed()}, {})} />
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
