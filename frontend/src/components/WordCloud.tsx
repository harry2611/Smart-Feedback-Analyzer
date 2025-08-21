import React from 'react';
import { Box } from '@mui/material';
import D3Cloud from 'd3-cloud';

interface WordCloudProps {
  words: {
    text: string;
    value: number;
  }[];
}

const WordCloud: React.FC<WordCloudProps> = ({ words }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current || !words.length) return;

    const layout = D3Cloud()
      .size([500, 300])
      .words(words.map(d => ({ text: d.text, size: Math.sqrt(d.value) * 10 + 10 })))
      .padding(5)
      .rotate(() => 0)
      .font('Arial')
      .fontSize(d => d.size!)
      .on('end', draw);

    layout.start();

    function draw(words: any[]) {
      const width = 500;
      const height = 300;

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', width.toString());
      svg.setAttribute('height', height.toString());
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.style.width = '100%';
      svg.style.height = '100%';

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${width / 2},${height / 2})`);
      svg.appendChild(g);

      words.forEach((d: any) => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('transform', `translate(${d.x},${d.y}) rotate(${d.rotate})`);
        text.style.fontSize = `${d.size}px`;
        text.style.fontFamily = d.font;
        text.style.fill = '#1976d2';
        text.textContent = d.text;
        g.appendChild(text);
      });

      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(svg);
      }
    }

    const container = containerRef.current;
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [words]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    />
  );
};

export default WordCloud;
