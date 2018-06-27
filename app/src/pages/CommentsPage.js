// @flow
import { connect } from 'react-redux';
import { commentsSelector } from '../stores/Comments';
import CommentList from '../components/CommentList';

const mapStateToProps = state => ({ comments: commentsSelector(state) });
export default connect(mapStateToProps)(CommentList);
