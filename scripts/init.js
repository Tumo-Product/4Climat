let uid = "";
let evnt;

// document.querySelector(".confirm").innerHTML = window.parent.;

window.parent[0].postMessage({
    application: "activity-manager",
    message: "init"
}, '*');

window.addEventListener("message", event => {
    evnt = event;
    uid = evnt.currentTarget.localStorage.uuid || "";

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