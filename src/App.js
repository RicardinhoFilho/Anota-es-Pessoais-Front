import Login from "./Pages/Login";
import Repositories from "./Pages/Repositories";
import Notes from "./Pages/Notes";
import SingUp from "./Pages/SingUp";
import UpdateAccount from "./Pages/updateAccount";
import Error404 from "./Pages/Error404";
import Search from "./Pages/Search";
import { EditorMobile } from "./Pages/Mobile/EditorMobile";
import { EditeNoteMobile } from "./Pages/Mobile/EditeNoteMobile";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Note from "./Pages/Note";
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Repositories />
          </Route>
          <Route  path="/anotacoes-pessoais/login">
            <Login />
          </Route>
          <Route  path="/anotacoes-pessoais/singup">
            <SingUp />
          </Route>
          <Route  path="/anotacoes-pessoais/updateAccount">
            <UpdateAccount />
          </Route>
          <Route  path="/anotacoes-pessoais/repositories">
            <Repositories />
          </Route>
          <Route  path="/anotacoes-pessoais/notes/:id">
            <Notes />
          </Route>
          <Route  path="/anotacoes-pessoais/search/:search">
            <Search />
          </Route>
          <Route  path="/anotacoes-pessoais/note/:id">
            <Note />
          </Route>

          <Route  path="/anotacoes-pessoais/mobile_editor/:token/:repId">
            <EditorMobile />
          </Route>

          <Route  path="/anotacoes-pessoais/mobile_edit_note/:token/:noteId">
            <EditeNoteMobile />
          </Route>
          <Route>
            <Repositories />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
