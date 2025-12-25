// Parse markdown-style formatting to JSX
export const parseFormattedText = (text: string) => {
  if (!text) return null;

  // Split by lines
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    if (!line.trim()) return <br key={lineIndex} />;

    // Parse inline formatting
    let parts: (string | JSX.Element)[] = [line];

    // Helper to apply formatting recursively
    const applyFormatting = (text: string | JSX.Element, pattern: RegExp, tag: string): (string | JSX.Element)[] => {
      if (typeof text !== 'string') return [text];
      
      const segments = text.split(pattern);
      const result: (string | JSX.Element)[] = [];
      
      for (let i = 0; i < segments.length; i++) {
        if (i % 2 === 0) {
          result.push(segments[i]);
        } else {
          const key = `${tag}-${lineIndex}-${i}`;
          switch (tag) {
            case 'bold':
              result.push(<strong key={key}>{segments[i]}</strong>);
              break;
            case 'italic':
              result.push(<em key={key}>{segments[i]}</em>);
              break;
            case 'underline':
              result.push(<u key={key}>{segments[i]}</u>);
              break;
            case 'strike':
              result.push(<s key={key}>{segments[i]}</s>);
              break;
          }
        }
      }
      return result;
    };

    // Bold: **text**
    parts = parts.flatMap(part => applyFormatting(part, /\*\*(.+?)\*\*/g, 'bold'));
    
    // Italic: *text*
    parts = parts.flatMap(part => applyFormatting(part, /\*([^*]+?)\*/g, 'italic'));
    
    // Underline: <u>text</u>
    parts = parts.flatMap(part => applyFormatting(part, /<u>(.+?)<\/u>/g, 'underline'));
    
    // Strikethrough: ~~text~~
    parts = parts.flatMap(part => applyFormatting(part, /~~(.+?)~~/g, 'strike'));

    // Links: [text](url)
    parts = parts.flatMap((part) => {
      if (typeof part !== 'string') return [part];
      
      const linkPattern = /\[(.+?)\]\((.+?)\)/g;
      const segments = part.split(linkPattern);
      const result: (string | JSX.Element)[] = [];
      
      for (let i = 0; i < segments.length; i += 3) {
        if (segments[i]) result.push(segments[i]);
        if (segments[i + 1] && segments[i + 2]) {
          result.push(
            <a
              key={`link-${lineIndex}-${i}`}
              href={segments[i + 2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {segments[i + 1]}
            </a>
          );
        }
      }
      return result;
    });

    // First line is title - make it bold and larger
    if (lineIndex === 0) {
      return (
        <div key={lineIndex} className="text-xl font-bold text-white mb-2">
          {parts}
        </div>
      );
    }

    return (
      <span key={lineIndex} className="block">
        {parts}
      </span>
    );
  });
};
