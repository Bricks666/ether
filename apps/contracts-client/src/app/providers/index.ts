import compose from 'compose-function';
import { withStyles } from './with-styles';
import { withRouter } from './with-router';

export const withProviders = compose(withStyles, withRouter);
