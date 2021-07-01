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

        {/* Routing to the home page */}
        <Route exact path="/">
          <Navbar />
          <Index />
        </Route>

        {/* Routing to the signup page */}
        <Route exact path="/signup">
          <Navbar />
          <Signup />
        </Route>

        {/* Routing to the signin page */}
        <Route exact path="/signin">
          <Navbar />
          <Signin />
        </Route>

        {/* Routing to the setting password page */}
        <Route exact path="/setting_password">
          <Navbar />
          <SetPassword />
        </Route>

        {/* Routing to the setting email page */}
        <Route exact path="/setting_email">
          <Navbar />
          <SetEmail/>
        </Route>
        
      </Switch>
      <Footer />
    </Router>
    
  );
}