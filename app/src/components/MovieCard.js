// @flow
import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';

import CommentList from './CommentList';
import { type Movie, isFavoriteSelector } from '../stores/Movies';

type Props = {
  movie: ?Movie,
  classes: Object,
  isFavorite: boolean,
};

class MovieCard extends React.Component<Props> {
  render() {
    const { classes, movie, isFavorite } = this.props;
    if (!movie) {
      return null;
    }

    return (
      <Card className={classes.card}>
        <CardHeader title={movie.title} subheader={movie.release_date} />
        <CardMedia className={classes.media} image={movie.poster_path} title={movie.title} />
        <CardContent>
          <Typography component="p">{movie.overview}</Typography>
        </CardContent>

        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Add to favorites">
            <FavoriteIcon color={isFavorite ? 'primary' : undefined} />
          </IconButton>
        </CardActions>
        <CommentList comments={movie.comments} />
      </Card>
    );
  }
}

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

export default connect((state, props) => ({
  isFavorite: isFavoriteSelector(state, props.movie.id),
}))(withStyles(styles)(MovieCard));
