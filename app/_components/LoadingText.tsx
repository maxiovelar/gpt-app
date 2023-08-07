import React, { useEffect, useState } from "react";

interface LoadingTextProps {
  isLoading: boolean;
}

const loadingPhrases = [
  "Let's see what we can find",
  "Looking for the best deals",
  "Doing amazing things",
  "Making the magic happen",
  "Magic is happening...",
  "Almost there...",
];

export const LoadingText = ({ isLoading }: LoadingTextProps) => {
  const [paragraphIndex, setParagraphIndex] = useState<number>(0);
  const [currentParagraph, setCurrentParagraph] = useState<string>(
    loadingPhrases[0]
  );

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        if (paragraphIndex < loadingPhrases.length - 1) {
          setParagraphIndex(paragraphIndex + 1);
          setCurrentParagraph(loadingPhrases[paragraphIndex + 1]);
        }
        return () => clearTimeout(timer);
      }, 3000);
    }
  }, [isLoading, paragraphIndex]);

  return (
    <p className="animate-pulse duration-75 text-lg">{currentParagraph}</p>
  );
};
