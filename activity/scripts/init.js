let uid = "";
let evnt;

window.parent[0].postMessage({
    application: "activity-manager",
    message: "init"
}, '*');

window.addEventListener("message", event => {
    evnt = event;
    if (evnt.data.data.id)
        uid = evnt.data.data.id || "";
    else uid = null;

    if (uid != "") {
        document.getElementById("launch").onclick = () => {
            window.open(`index.html?uid=${uid}`, "_blank");
        };
    }
    document.querySelector(".confirm").innerHTML = uid;

    console.log(evnt);
});

window.parent[0].postMessage({
    application: 'activity-manager',
    message: 'set-iframe-height',
    data: { iframeHeight: 300 }
}, '*');