import { useRoutes } from "react-router-dom";
import Home from "./pages/Home";
import List from "./pages/List";

const App = () => {
    let routes = useRoutes([
      { path: "/", element: <Home /> },
      { path: "/list", element: <List /> },
      // ...
    ]);
    return routes;
  };
  
export default App