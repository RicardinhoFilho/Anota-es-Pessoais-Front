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
          <Route  path="/login">
            <Login />
          </Route>
          <Route  path="/singup">
            <SingUp />
          </Route>
          <Route  path="/updateAccount">
            <UpdateAccount />
          </Route>
          <Route  path="/repositories">
            <Repositories />
          </Route>
          <Route  path="/notes/:id">
            <Notes />
          </Route>
          <Route  path="/search/:search">
            <Search />
          </Route>
          <Route  path="/note/:id">
            <Note />
          </Route>

          <Route  path="/mobile_editor/:token/:repId">
            <EditorMobile />
          </Route>

          <Route  path="/mobile_edit_note/:token/:noteId">
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
