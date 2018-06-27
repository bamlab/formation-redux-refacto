// @flow
import * as React from 'react';
import List from '@material-ui/core/List';
import { type Comment } from '../stores/Comments';
import CommentComponent from './Comment';

type Props = {
  comments: Comment[],
};

class CommentList extends React.PureComponent<Props> {
  render() {
    return (
      <List>{this.props.comments.map(comment => <CommentComponent comment={comment} />)}</List>
    );
  }
}

export default CommentList;
