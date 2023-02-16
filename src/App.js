import "./App.css";
import SignupLogin from "./components/SignupLogin";
import Home from "./components/Home";
import Settings from "./components/Settings";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SpecialRoute from "./utils/SpecialRoute";
import PrivateRoutes from "./utils/PrivateRoutes";
import Portfolio from "./components/Portfolio";
import Root from "./components/Root";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<Home />} path="/home" exact />
          <Route element={<Settings />} path="/settings" exact />
          <Route element={<Portfolio />} path="/portfolio" exact />
        </Route>
        <Route element={<SpecialRoute />}>
          <Route element={<SignupLogin />} path="/authorize" exact />
          <Route element={<Root />} path="/" exact />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
