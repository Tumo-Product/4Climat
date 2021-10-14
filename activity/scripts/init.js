let uid = "";

window.parent[0].postMessage({
    application: "activity-manager",
    message: "init"
}, '*');

window.addEventListener("message", event => {
    if (evnt.data.application !== "activity-manager") {
        return;
    }

    console.log(event.data.message);

    switch(event.data.message) {
        case 'init-response':
            const { data } = event.data;
            console.log(event.data);
            uid = data.id;

            document.getElementById("launch").onclick = () => {
                window.open(`index.html?uid=${uid}`, "_blank");
            };

            document.querySelector(".confirm").innerHTML = uid;
        break;
    }
});

window.parent[0].postMessage({
    application: 'activity-manager',
    message: 'set-iframe-height',
    data: { iframeHeight: 300 }
}, '*');