import { useState, useEffect } from 'react';

/**
 * A hook that takes a target text string and reveals it character by character,
 * simulating a typewriter effect. It correctly handles updates to the target text
 * (e.g. from a stream) by continuing to type from the current position.
 * 
 * @param text The full text to display eventually
 * @param speedMs Time in milliseconds between each character (default: 20ms)
 * @returns The currently displayed portion of the text
 */
export const useSmoothTyping = (text: string | null, speedMs: number = 20) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        if (!text) {
            setDisplayedText("");
            return;
        }

        let i = displayedText.length;

        // If text was reset or changed significantly (not just appended), reset
        if (!text.startsWith(displayedText)) {
            setDisplayedText("");
            i = 0;
        }

        // If we've already displayed everything, do nothing
        if (i >= text.length) {
            return;
        }

        const intervalId = setInterval(() => {
            if (i < text.length) {
                // Take the next character
                setDisplayedText(prev => prev + text.charAt(prev.length));
                i++;
            } else {
                clearInterval(intervalId);
            }
        }, speedMs);

        return () => clearInterval(intervalId);
    }, [text, speedMs, displayedText]); // Re-run when target text changes

    return displayedText;
};
