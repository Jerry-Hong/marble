import { map, mapTo } from 'rxjs/operators';
import { HttpErrorEffect } from '../effects/http-effects.interface';
import { HttpStatus } from '../http.interface';
import { HttpError, isHttpError } from './error.model';

const defaultHttpError = new HttpError(
  'Internal server error',
  HttpStatus.INTERNAL_SERVER_ERROR,
);

const getStatusCode = (error: Error): HttpStatus =>
  isHttpError(error)
    ? error.status
    : HttpStatus.INTERNAL_SERVER_ERROR;

const errorFactory = (status: HttpStatus, error: Error) =>
  isHttpError(error)
    ? { error: { status, message: error.message, data: error.data, context: error.context } }
    : { error: { status, message: error.message } };

export const defaultError$: HttpErrorEffect<HttpError> = (req$, _, meta) => req$
  .pipe(
    mapTo(meta.error || defaultHttpError),
    map(error => {
      const status = getStatusCode(error);
      const body = errorFactory(status, error);
      return { status, body };
    }),
  );
