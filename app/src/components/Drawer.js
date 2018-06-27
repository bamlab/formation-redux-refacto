import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import MenuList from '@material-ui/core/MenuList';
import MaterialMenuItem from '@material-ui/core/MenuItem';
import { Route } from 'react-router-dom';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MovieIcon from '@material-ui/icons/Movie';
import StarIcon from '@material-ui/icons/Star';
import CommentIcon from '@material-ui/icons/Comment';

const drawerWidth = 240;

const MenuItem = ({ to, exact, strict, location, ...rest }) => {
  const path = typeof to === 'object' ? to.pathname : to;

  // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
  const escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');

  return (
    <Route
      path={escapedPath}
      exact={exact}
      strict={strict}
      location={location}
      children={({ history, match }) => {
        return (
          <MaterialMenuItem selected={match} button {...rest} onClick={() => history.push(to)} />
        );
      }}
    />
  );
};

function ClippedDrawer(props) {
  const { classes } = props;

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <MenuList>
        <MenuItem to="/" exact>
          <ListItemIcon>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText primary="Movie List" />
        </MenuItem>
        <MenuItem to="/favorites">
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Favorites" />
        </MenuItem>
        <MenuItem to="/comments">
          <ListItemIcon>
            <CommentIcon />
          </ListItemIcon>
          <ListItemText primary="Comments" />
        </MenuItem>
      </MenuList>
    </Drawer>
  );
}

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
});

export default withStyles(styles)(ClippedDrawer);
