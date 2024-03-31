/**
 * As title. ChatGPT wrote this.
 *
 * @param {string} html
 * @returns {string}
 */
export const convertHtmlToRtf = (html: string): string => {
  let rtfHeader = "{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}";
  let colorTable = "{\\colortbl ;";
  let content = "\\viewkind4\\uc1\\pard\\f0\\fs22 ";
  let colorMap: Record<string, number> = {};

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const spans = doc.querySelectorAll('span');
  let colorIndex = 1;

  spans.forEach((span: HTMLSpanElement) => {
    let bgColor = span.style.backgroundColor;
    let rtfColorIndex = 0;

    if (bgColor && bgColor !== 'inherit' && bgColor.startsWith('rgb')) {
      // Convert RGB CSS color to RTF color table entry and index
      if (!colorMap[bgColor]) {
        const rgbMatch = bgColor.match(/\d+/g); // Extract RGB values
        if (rgbMatch) {
          const [r, g, b] = rgbMatch.map(Number);
          colorTable += `\\red${r}\\green${g}\\blue${b};`;
          colorMap[bgColor] = colorIndex++;
        }
      }
      rtfColorIndex = colorMap[bgColor];
    }

    const text = span.textContent?.replace(/\n/g, '\\par\n') || '';
    content += rtfColorIndex > 0 ? `\\highlight${rtfColorIndex} ${text}` : `${text}`;
    content += " ";
  });

  const rtfContent = `${rtfHeader}${colorTable}}${content}\\cf0\\highlight0 }`;

  console.log({ html, rtfContent });
  return rtfContent;
}
