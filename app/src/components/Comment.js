// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PencilIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';

import { type Comment, updateComment, updateIsLoadingSelector } from '../stores/Comments';
import { userByIdSelector, type User } from '../stores/Users';
import { movieByIdSelector, type Movie } from '../stores/Movies';

type Props = {
  comment: Comment,
  movie: Movie,
  user: User,
  updateComment: (number, string) => Promise<Comment>,
  updateIsLoading: boolean,
};

type State = {
  editting: boolean,
  edittingValue: string,
};

class CommentComponent extends React.PureComponent<Props, State> {
  state = { editting: false, edittingValue: '' };

  onConfirm = async () => {
    await this.props.updateComment(this.props.comment.id, this.state.edittingValue);
    this.stopEdit();
  };

  onEdit = () => this.setState({ editting: true, edittingValue: this.props.comment.text });
  stopEdit = () => this.setState({ editting: false });
  onChange = event => this.setState({ edittingValue: event.target.value });

  render() {
    const { user, comment, movie } = this.props;
    return (
      <ListItem key={comment.id}>
        <Card>
          {user && (
            <CardHeader
              avatar={<Avatar aria-label="Recipe">{user.firstname[0].toUpperCase()}</Avatar>}
              title={`${user.firstname} ${user.lastname}`}
              subheader={movie && movie.title}
              action={
                <IconButton onClick={this.onEdit}>
                  <PencilIcon />
                </IconButton>
              }
            />
          )}
          <CardContent>
            {this.props.updateIsLoading && <LinearProgress />}
            {!this.state.editting && <Typography component="p">{comment.text}</Typography>}
            {this.state.editting && (
              <div>
                <TextField
                  label="Comment"
                  value={this.state.edittingValue}
                  onChange={this.onChange}
                  margin="normal"
                />
                <Button variant="contained" onClick={this.stopEdit}>
                  Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={this.onConfirm}>
                  Confirm
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </ListItem>
    );
  }
}

const mapStateToProps = (state, props) => ({
  user: userByIdSelector(state, props.comment.user),
  movie: movieByIdSelector(state, props.comment.movie),
  updateIsLoading: updateIsLoadingSelector(state),
});
export default connect(
  mapStateToProps,
  { updateComment }
)(CommentComponent);
