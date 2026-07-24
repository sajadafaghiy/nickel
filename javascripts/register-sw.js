if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register(
            "/nickel/service-worker.js"
        )
        .then(() => {
            console.log("PWA service worker registered");
        })
        .catch(error => {
            console.error(
                "Service worker failed:",
                error
            );
        });

    });
}