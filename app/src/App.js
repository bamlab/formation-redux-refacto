// @flow
import React, { Component } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Appbar from './components/Appbar';
import Drawer from './components/Drawer';
import './App.css';
import MovieList from './pages/MovieList';
import CommentPage from './pages/CommentsPage';
import { fetchMovies } from './stores/Movies';
import { fetchComments } from './stores/Comments';
import { fetchUsers } from './stores/Users';

type Props = {
  classes: Object,
  fetchMovies: () => any,
  fetchComments: () => any,
};

class App extends Component<Props> {
  componentDidMount() {
    this.props.fetchMovies();
    this.props.fetchComments();
    this.props.fetchUsers();
  }

  render() {
    const { classes } = this.props;
    return (
      <Router>
        <div className={classes.root}>
          <Appbar title="Movie List" />
          <Drawer />
          <div className={classes.container}>
            <Switch>
              <Route path="/" component={MovieList} exact />
              <Route path="/comments" component={CommentPage} exact />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  container: {
    paddingTop: 100,
  },
});

const mapDispatchToProps = { fetchMovies, fetchComments, fetchUsers };
export default connect(
  undefined,
  mapDispatchToProps
)(withStyles(styles)(App));
