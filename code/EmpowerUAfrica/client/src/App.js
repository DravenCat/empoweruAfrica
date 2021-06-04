import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Index from './components/index/index'; 

export default function App() {
  return (
    <Router>
      <Switch>

        <Route path="/">
          <Index />
        </Route>
        
      </Switch>
    </Router>
  );
}