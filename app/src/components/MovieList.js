// @flow
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { type Movie } from '../stores/Movies';
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
export default MovieList;
