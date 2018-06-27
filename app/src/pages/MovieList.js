// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { moviesSelector, type Movie } from '../stores/Movies';
import MovieCard from '../components/MovieCard';

type Props = {
  movies: Movie[],
};

class MovieList extends React.PureComponent<Props> {
  render() {
    return (
      <Grid container cellHeight="auto" justify="space-around" spacing={32}>
        {this.props.movies.map(movie => (
          <Grid item key={movie.id} cols={1}>
            <MovieCard key={movie.id} movie={movie} />
          </Grid>
        ))}
      </Grid>
    );
  }
}

const mapStateToProps = state => ({ movies: moviesSelector(state) });
export default connect(mapStateToProps)(MovieList);
