import { useEffect, useState } from 'react';

export type UsePromiseResponse<T> = {
  loading: boolean;
  data?: T;
  error?: Error;
};
// https://github.com/bitmatica/blogmatica-mst-apollo/blob/5f498588ee97458bdd87b0fa4b97cfa85795ab70/src/utilities/promises.ts
const usePromise = <T>(task: () => PromiseLike<T>): UsePromiseResponse<T> => {
  const [state, setState] = useState<UsePromiseResponse<T>>({
    loading: false,
  });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!initialized) {
      task().then(
        (data: T) => {
          if (!cancelled) {
            setState({
              data,
              loading: false,
            });
          }
        },
        (error: Error) => {
          if (!cancelled) {
            setState({
              error,
              loading: false,
            });
          }
        },
      );
      setInitialized(true);
    }
    return (): void => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, setState, initialized, setInitialized]);

  return state;
};

export default usePromise;
