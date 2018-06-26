import React, { Component } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Appbar from './components/Appbar';
import Drawer from './components/Drawer';
import './App.css';
import MovieList from './pages/MovieList';

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Appbar />
        <Drawer />
        <Router>
          <Switch>
            <Route path="/" component={MovieList} exact />
          </Switch>
        </Router>
      </div>
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
  content: {
    paddingTop: 100,
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
});

export default withStyles(styles)(App);
