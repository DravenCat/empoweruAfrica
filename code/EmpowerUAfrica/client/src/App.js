import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Index from './components/pages/index/index'; 
import Footer from './components/components/footer/footer'; 
import Header from './components/components/header/header'; 
import Signup from './components/pages/signup/signup';
import Signin from './components/pages/signin/signin'; 
import Setting_password from './components/pages/setting/setting_password'; 
import Setting_email from './components/pages/setting/setting_email'; 


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

        <Route exact path="/setting_password">
          <Setting_password />
        </Route>

        <Route exact path="/setting_email">
          <Setting_email />
        </Route>
        
      </Switch>
      <Footer />
    </Router>
    
  );
}