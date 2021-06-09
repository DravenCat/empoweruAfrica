import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Index from './components/pages/index/index'; 
import Header from './components/components/header/header'
import Footer from './components/components/footer/footer'; 
import Signin from './components/pages/signin/signin'; 


export default function App() {
  return (
    <Router>
      <Header />
      <Switch>

        <Route exact path="/">
          <Index />
        </Route>

        <Route exact path="/signin">
          <Signin />
        </Route>
        
      </Switch>
      <Footer />
    </Router>
    
  );
}