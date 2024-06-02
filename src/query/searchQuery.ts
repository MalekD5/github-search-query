type TypeShape = {
  [key: string]: string[];
};

const types: TypeShape = {
  type: ["test", "slides", "videos"],
  banger: ["new", "old"],
};

export function findResults(query: string): string[] {
  const type = types[query];

  if (!type) {
    return ["-1"];
  }

  return type;
}

export function filterResults(input: string, results: string[]): string[] {
  return results.filter((result) => result.includes(input));
}
