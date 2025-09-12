import { useMemo } from "react";

/**
 * Creates an array of floating token style objects
 * @param {number} count - how many tokens to spawn
 */
export function useFloatingSets(count = 20) {
    return useMemo(() => {
        const tokens = ["{0,1,4}", "{0,2,5}", "{0,3,7}", "{0,4,5}", "{0,1,2}", "{0,1,3}", "{0,2,3}"];
        return Array.from({ length: count }, () => {
            // random start near edges
            const xStart = `${Math.floor(Math.random() * 100)}%`;
            const yStart = `${Math.floor(Math.random() * 100)}%`;
            // random far end
            const xEnd = `${Math.floor(Math.random() * 200 - 50)}%`; // can overshoot
            const yEnd = `${Math.floor(Math.random() * 200 - 50)}%`;
            const zStart = `${Math.floor(Math.random() * 400 - 200)}px`;
            const zEnd = `${Math.floor(Math.random() * 600 - 300)}px`;
            const scale = (0.8 + Math.random() * 1.4).toFixed(2);
            const duration = `${20 + Math.floor(Math.random() * 20)}s`;

            const setObj = {
                token: tokens[Math.floor(Math.random() * tokens.length)],
                style: {
                    "--x-start": xStart,
                    "--y-start": yStart,
                    "--x-end": xEnd,
                    "--y-end": yEnd,
                    "--z-start": zStart,
                    "--z-end": zEnd,
                    "--scale": scale,
                    "--duration": duration,
                },
            };

            console.log('set:', setObj);

            return setObj;
        });
    }, [count]);
};
