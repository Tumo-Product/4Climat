let uid = "";
let evnt;

// document.querySelector(".confirm").innerHTML = window.parent.;

window.parent[0].postMessage({
    application: "activity-manager",
    message: "init"
}, '*');

window.addEventListener("message", event => {
    evnt = event;
    if (evnt.data.data)
        uid = evnt.data.data.id || "";
    else uid = "1";

    if (uid != "") {
        document.getElementById("launch").onclick = () => {
            window.open(`index.html?uid=${uid}`, "_blank");
        };
    }
    document.querySelector(".confirm").innerHTML = uid;

    console.log(evnt);
    document.getElementById("response").innerHTML               = evnt;
    document.getElementById("stringifiedResponse").innerHTML    = JSON.stringify(evnt);
});