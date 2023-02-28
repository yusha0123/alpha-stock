import "./App.css";
import SignupLogin from "./routes/SignupLogin";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SpecialRoute from "./utils/SpecialRoute";
import PrivateRoutes from "./utils/PrivateRoutes";
import Portfolio from "./routes/Portfolio";
import Root from "./routes/Root";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<Home />} path="/home" exact />
          <Route element={<Profile />} path="/profile" exact />
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
