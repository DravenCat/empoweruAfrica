import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Index from './components/pages/index/index'; 
import Footer from './components/components/footer/footer'; 
import Header from './components/components/header/header'; 
import Signup from './components/pages/signup/signup';
import Signin from './components/pages/signin/signin'; 
import Sutype from './components/pages/signup/sutype'; 



export default function App() {
  return (
    <Router>
      <Header />
      <Switch>

        <Route exact path="/">
          <Index />
        </Route>

        <Route exact path="/signup">
          <Signup />
        </Route>

        <Route exact path="/signin">
          <Signin />
        </Route>

        <Route exact path="/sutype">
          <Sutype />
        </Route>
        
      </Switch>
      <Footer />
    </Router>
    
  );
}