export function setupWindowResizeWatcher() {
    let isMobile = false;

    function handleWindowResize() {
        // Update the isMobile value based on window dimensions
        isMobile = window.innerWidth <= 768 && window.innerHeight <= 1024;
        console.log(`isMobile: ` + isMobile);
    }

    // Attach the window resize event listener
    window.addEventListener('resize', handleWindowResize);

    return {
        isMobile: () => isMobile,
    };
}
  