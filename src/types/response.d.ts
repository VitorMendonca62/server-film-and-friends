interface IResponse {
  msg: string;
  error: boolean;
  data: unknown;
  status?: number;
}

interface IErrorMessage {
  msg: string;
  error: boolean;
  type: string | undefined;
}

type ResponseInAPIMedia  = [
  IResponse| null, null | IMovieSchema | ISerieSchema
]
