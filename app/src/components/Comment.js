// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import type { Comment } from '../stores/Comments';
import { userByIdSelector, type User } from '../stores/Users';
import { movieByIdSelector, type Movie } from '../stores/Movies';

type Props = {
  comment: Comment,
  movie: Movie,
  user: User,
};

class CommentComponent extends React.PureComponent<Props> {
  render() {
    const { user, comment, movie } = this.props;
    console.log(comment, movie);

    return (
      <ListItem key={comment.id}>
        <Card>
          {user && (
            <CardHeader
              avatar={<Avatar aria-label="Recipe">{user.firstname[0].toUpperCase()}</Avatar>}
              title={`${user.firstname} ${user.lastname}`}
              subheader={movie && movie.title}
            />
          )}
          <CardContent>
            <Typography component="p">{comment.text}</Typography>
          </CardContent>
        </Card>
      </ListItem>
    );
  }
}

const mapStateToProps = (state, props) => ({
  user: userByIdSelector(state, props.comment.user),
  movie: movieByIdSelector(state, props.comment.movie),
});
export default connect(mapStateToProps)(CommentComponent);
