let uid = "";
let evnt;

// document.querySelector(".confirm").innerHTML = window.parent.;

window.parent.postMessage({
    application: "activity-manager",
    message: "init"
}, 'https://tumo-product.github.io/4Climat/activityView.html');

window.addEventListener("message", event => {
    evnt = event;
    uid = evnt.target["0"].localStorage.tumoid || "";

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