
// @ts-ignore
import ImageTracer from 'imagetracerjs';

export const vectorizeImage = (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            // Options for cleaner vector art style
            // We want fewer colors, cleaner lines since it's an avatar
            const options = {
                // Tracing
                corsenabled: true,
                ltres: 1,
                qtres: 1,
                pathomit: 8,
                rightangleenhance: true,

                // Color quantization
                colorsampling: 2, // Deterministic
                numberofcolors: 16, // Limit colors for "vector" look
                mincolorratio: 0,
                colorquantcycles: 3,

                // SVG rendering
                scale: 1,
                simplify: 0,
                roundcoords: 1,
                lcpr: 0,
                qcpr: 0,
                desc: false,
                viewbox: true,
            };

            ImageTracer.imageToSVG(
                imageUrl,
                (svgString: string) => {
                    if (svgString) {
                        resolve(svgString);
                    } else {
                        reject(new Error("Failed to generate SVG"));
                    }
                },
                options
            );
        } catch (error) {
            reject(error);
        }
    });
};
