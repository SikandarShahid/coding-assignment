import React from "react";
import AppRoutes from "./routes";

const vh = window.innerHeight * 0.01;
window.document.documentElement.style.setProperty("--vh", `${vh}px`);

window.visualViewport.addEventListener("resize", (event) => {
  let vh = (event.target.height + event.target.offsetTop) * 0.01;
  window?.document.documentElement.style.setProperty("--vh", `${vh}px`);
});

const App = () => {
  return <AppRoutes />;
};

export default App;
