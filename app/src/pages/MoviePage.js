// @flow
import { connect } from 'react-redux';
import { moviesSelector } from '../stores/Movies';
import MovieList from '../components/MovieList';

const mapStateToProps = state => ({ movies: moviesSelector(state) });
export default connect(mapStateToProps)(MovieList);
