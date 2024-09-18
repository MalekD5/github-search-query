import { useState } from "react";
import { filterResults, findResults } from "../query/searchQuery";

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

function Text({ text }: { text: string }) {
  const components = [];

  const chars = text.split("");
  let lastStr = "";
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    lastStr += char;

    if (char === ":") {
      components.push(lastStr);
      lastStr = "";
      let j;
      let isWhiteSpace = false;
      for (j = i + 1; j < chars.length; j++) {
        const char = chars[j];
        lastStr += char;
        if (char === " ") {
          // create a space that contains a whitespace
          isWhiteSpace = true;
          break;
        }
      }
      components.push(
        <span className="cursor-text text-blue-700">{lastStr}</span>,
      );
      if (isWhiteSpace) {
        components.push(<span>&nbsp;</span>);
      }
      lastStr = "";
      i = j;
    }
  }
  components.push(lastStr);

  return (
    <div className="absolute cursor-text text-black select-none inline-flex">
      {components}
    </div>
  );
}

export default function Search() {
  const [value, setValue] = useState("");

  const [filters, setFilters] = useState<{
    [key: string]: string | undefined;
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
      const [, input, output] = regex;

      if (output && output.endsWith(" ")) {
        setResults([]);
        return;
      }

      const find = findResults(input);
      setResults(output ? filterResults(output, find) : find);

      console.log(output);
      if (input) {
        setFilters({ ...filters, [input]: output });
      }
    } else {
      setResults([]);
    }
  };

  return (
    <div className="relative">
      <Text text={value} />
      <input
        className="relative outline outline-black text-transparent bg-transparent cursor-text caret-black"
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
