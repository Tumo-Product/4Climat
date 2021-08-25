const view      = {
    loaderOpen: true,

    toggleLoader: () => {
        view.loaderOpen = !view.loaderOpen;

        if (view.loaderOpen)    $("#loadingScreen").show();
        else                    $("#loadingScreen").hide();
    },
    makeMap     : (src, parent) => {
        $(parent).append(`<iframe class="map" src="${src}"></iframe>`);
    }
}