import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Index from './components/pages/index/index'; 
import Footer from './components/components/footer/footer'; 

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