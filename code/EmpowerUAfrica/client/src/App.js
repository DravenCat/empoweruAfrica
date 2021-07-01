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

import Community from './components/pages/community/community'; 
import PostContent from './components/pages/postContent/postContent';
import MakePost from './components/pages/makePost/makePost'; 

import ViewAllPost from './components/pages/viewAllPosts/viewAllPosts'; 

import Profile from './components/pages/profile/profile'; 
// import EditProfile from './components/pages/profile_edit/profile_edit'; 



export default function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Switch>

        {/* Routing to the home page */}
        <Route exact path="/">
          <Index />
        </Route>

        {/* Routing to the signup page */}
        <Route exact path="/signup">
          <Signup />
        </Route>

        {/* Routing to the signin page */}
        <Route exact path="/signin">
          <Signin />
        </Route>

        {/* Routing to the setting password page */}
        <Route exact path="/setting_password">
          <SetPassword />
        </Route>

        {/* Routing to the setting email page */}
        <Route exact path="/setting_email">
          <SetEmail/>
        </Route>


        <Route exact path="/community">
          <Navbar />
          <Community/>
        </Route>

        <Route exact path="/view_all_posts">
          <Navbar />
          <ViewAllPost/>
        </Route>

        <Route exact path="/community/post_content">
          <Navbar />
          <PostContent/>
        </Route>

        <Route exact path="/community/make_post">
          <Navbar />
          <MakePost/>
        </Route>

        <Route exact path="/profile/:username" component={Profile}>

        </Route>
        
      </Switch>
      <Footer />
    </Router>
    
  );
}