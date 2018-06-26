// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { fetchMovies, moviesSelector, type Movie } from '../stores/Movies';

type Props = {
  movies: Movie[],
  fetchMovies: () => any,
};

class MovieList extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchMovies();
  }
  render() {
    return <div>{this.props.movies.map(movie => <div>{movie.title}</div>)}</div>;
  }
}

const mapStateToProps = state => ({ movies: moviesSelector(state) });
const mapDispatchToProps = { fetchMovies };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MovieList);
