import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Index from './components/pages/index/index'; 
import Signup from './components/pages/signup/signup';
import Footer from './components/components/footer/footer'; 
import Header from './components/components/header/header'; 

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
        
      </Switch>
      <Footer />
    </Router>
    
  );
}