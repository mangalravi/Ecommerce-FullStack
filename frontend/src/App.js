import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <Navbar />
      <div
        style={{
          marginTop: location.pathname === "/change-password" ? "5rem" : "7rem",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default App;
