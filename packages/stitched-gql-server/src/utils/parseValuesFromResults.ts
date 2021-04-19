export default function parseValuesFromResults(): ((results: any, keys: readonly any[]) => any[]) | undefined {
  return (results, keys) => {
    let index = 0;
    return keys.map((key) => {
      if (index < results.length && results[index].id === key) {
        return results[index++];
      }
      return null;
    });
  };
}
