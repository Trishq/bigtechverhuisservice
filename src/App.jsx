import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { useState } from "react";

import Home from "./pages/Home";
import Inpakken from "./pages/Inpakken";
import Customizen from "./pages/Customizen";
import Huisje from "./pages/Huisje";
import Stad from "./pages/Stad";
import Afscheid from "./pages/Afscheid";

import LiveVisitors from "./components/LiveVisitors";

export default function App() {
  const [name, setName] = useState("");

  const [links, setLinks] = useState([
    "",
    "",
    "",
    "",
    "",
  ]);

  return (
    <BrowserRouter>

      {/* Live online bezoekers op alle pagina's */}
      <LiveVisitors name={name} />

      <Routes>

        <Route
          path="/"
          element={
            <Home
              name={name}
              setName={setName}
            />
          }
        />

        <Route
          path="/inpakken"
          element={
            <Inpakken
              name={name}
              links={links}
              setLinks={setLinks}
            />
          }
        />

        <Route
          path="/afscheid"
          element={<Afscheid />}
        />

        <Route
          path="/customizen"
          element={
            <Customizen
              name={name}
              links={links}
            />
          }
        />

       <Route
  path="/huisje/:id"
  element={
    <Huisje
      name={name}
    />
  }
/>

        <Route
          path="/stad"
          element={
            <Stad
              name={name}
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}