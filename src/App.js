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
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/singup">
            <SingUp />
          </Route>
          <Route exact path="/updateAccount">
            <UpdateAccount />
          </Route>
          <Route exact path="/repositories">
            <Repositories />
          </Route>
          <Route exact path="/notes/:id">
            <Notes />
          </Route>
          <Route exact path="/search/:search">
            <Search />
          </Route>
          <Route exact path="/note/:id">
            <Note />
          </Route>

          <Route exact path="/mobile_editor/:token/:repId">
            <EditorMobile />
          </Route>

          <Route exact path="/mobile_edit_note/:token/:noteId">
            <EditeNoteMobile />
          </Route>
          <Route>
            <Error404 />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
