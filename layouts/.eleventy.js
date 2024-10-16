module.exports = (eleventyConfig) => {
    // Add any custom configuration here

    // Return your Eleventy configuration
    return {
        dir: {
            input: "src", // Input directory
            output: "dist", // Output directory
            includes: "_includes", // Includes directory
            data: "_data", // Data directory
        },
    };
};
