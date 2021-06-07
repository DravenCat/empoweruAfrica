import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Index from './components/index/index'; 
import Footer from './components/index/footer'; 

export default function App() {
  return (
    <Router>
      <Switch>

        <Route path="/">
          <Index />
        </Route>
        
      </Switch>
      <Footer />
    </Router>
    
  );
}