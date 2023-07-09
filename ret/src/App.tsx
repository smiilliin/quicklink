import { HashRouter, Route, Routes } from "react-router-dom";
import Links from "./Links";
import Setting from "./Setting";

export default () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Links />}></Route>
        <Route path="/setting" element={<Setting />}></Route>
      </Routes>
    </HashRouter>
  );
};
