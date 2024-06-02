import { useState } from "react";
import { findResults } from "../query/searchQuery";

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

export default function Search() {
  const [filters, setFilters] = useState<{
    [key: string]: string;
  }>({});

  const [results, setResults] = useState<string[]>([]);

  const handleOnChange = (e: ChangeEvent) => {
    const value = e.target.value;
    console.log(value);
    console.log(e.target.selectionStart);

    const expression = /(\w+):(?!\s)(?!\w+)/g;

    const regex = value.match(expression);

    if (regex) {
      const val = regex[0].replace(":", "");
      const find = findResults(val);
      setResults(find);
      console.log(val);
      console.log(find);
    } else {
      setResults([]);
    }
  };

  return (
    <div>
      <input className="outline" type="text" onChange={handleOnChange} />
      {results && results.length > 0 && (
        <ul>
          {results.map((result) => (
            <li key={result}>{result}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
