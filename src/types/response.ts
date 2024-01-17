interface IResponse<T> {
  msg: string;
  error: boolean;
  data: T;
  status?: number;
}

export default IResponse;
