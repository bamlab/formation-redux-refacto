// @flow
import { connect } from 'react-redux';
import { favoritesSelector } from '../stores/Movies';
import MovieList from '../components/MovieList';

const mapStateToProps = state => ({ movies: favoritesSelector(state) });
export default connect(mapStateToProps)(MovieList);
