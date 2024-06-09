import { ReactElement } from "react";

interface WordProps {
  color: string;
  word: string;
}

const Word = (props: WordProps): ReactElement => {
  const { color, word } = props;

  return (
    <>
      <span
        className="word"
        style={{
          backgroundColor: color,
        }}
      >
        {/* TODO(michaelfromyeg): render last space conditionally */}
        {`${word} `}
      </span>
    </>
  );
};

export default Word;
