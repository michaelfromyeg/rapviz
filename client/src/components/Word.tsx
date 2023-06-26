const Word = (props: any) => {
  let { color, word } = props;
  return (
    <>
      <span
        className="word"
        style={{
          backgroundColor: color,
        }}
      >
        {word}
      </span>
      <span> </span>
    </>
  );
}

export default Word;
