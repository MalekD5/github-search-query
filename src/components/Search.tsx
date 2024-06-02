import { useState } from "react";
import { filterResults, findResults } from "../query/searchQuery";

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

function Text({ text }: { text: string }) {
  const components = [];

  let isSemi = false;
  for (let i = 0; i < text.length; ) {
    if (isSemi) {
      isSemi = false;
      const indexOfSpace = text.indexOf(" ", i);
      if (indexOfSpace === -1) {
        components.push(
          <span className="text-blue-700">{text.substring(i)}</span>,
        );
        break;
      }
      const built = text.substring(i, indexOfSpace);
      components.push(<span className="text-blue-700">{built} </span>);
      i = indexOfSpace + 1;
      continue;
    }
    const indexOfSemi = text.indexOf(":", i);
    if (indexOfSemi === -1) {
      components.push(text.substring(i));
      break;
    }
    const built = text.substring(i, indexOfSemi);
    components.push(`${built}:`);
    i = indexOfSemi + 1;
    isSemi = true;
  }
  return (
    <div className="absolute cursor-text text-black select-none inline-flex">
      {components}
    </div>
  );
}

export default function Search() {
  const [value, setValue] = useState("");
  const [filters, setFilters] = useState<{
    [key: string]: string;
  }>({});

  const [results, setResults] = useState<string[]>([]);

  const handleOnChange = (e: ChangeEvent) => {
    const value = e.target.value;
    setValue(value);
    const currentCursorPos = e.target.selectionStart || 0;
    const regexExp = /(\w+):(?!\s)(\w+\s{0,1})?/g;

    const exp = new RegExp(regexExp);

    const section = value.substring(0, currentCursorPos).split(" ");

    const lastSection = section[section.length - 1];

    const regex = exp.exec(lastSection);
    if (regex) {
      console.log(regex);
      const [, input, output] = regex;

      if (output && output.endsWith(" ")) {
        setResults([]);
        return;
      }

      const find = findResults(input);
      setResults(output ? filterResults(output, find) : find);
    } else {
      setResults([]);
    }
  };

  const handleOnDelete = (e: ChangeEvent) => {
    const value = e.target.value;
    setValue(value);
  };

  return (
    <div className="relative">
      <Text text={value} />
      <input
        className="relative outline outline-black text-transparent bg-transparent"
        type="text"
        onChange={handleOnChange}
      />
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
