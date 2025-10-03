import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.jsx";
import "./App.css";

const App = () => {
  return <RouterProvider router={router} />
};

export default App;