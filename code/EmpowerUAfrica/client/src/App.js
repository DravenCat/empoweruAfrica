import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Index from './components/pages/index/index'; 
import Footer from './components/components/footer/footer'; 
import Header from './components/components/header/header'; 
import Navbar from './components/components/navbar/navbar';
import Signup from './components/pages/signup/signup';
import Signin from './components/pages/signin/signin'; 

import SetPassword from './components/pages/setting/setting_password'; 
import SetEmail from './components/pages/setting/setting_email'; 


export default function App() {
  return (
    <Router>
      <Header />
      <Switch>

        <Route exact path="/">
          <Navbar />
          <Index />
        </Route>

        <Route exact path="/signup">
          <Signup />
        </Route>

        <Route exact path="/signin">
          <Signin />
        </Route>

        <Route exact path="/setting_password">
          <Navbar />
          <SetPassword />
        </Route>

        <Route exact path="/setting_email">
          <Navbar />
          <SetEmail/>
        </Route>
        
      </Switch>
      <Footer />
    </Router>
    
  );
}