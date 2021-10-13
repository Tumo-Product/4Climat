let uid = "";

// document.querySelector(".confirm").innerHTML = window.parent.;

window.parent.postMessage({
    application: "activity-manager",
    message: "init"
}, '*');


window.addEventListener("message", event => {
    if(event.data.application !== "activity-manager") return;

    switch(event.data.message) {
        case 'init-response':
            uid = event.data.data.id || "";

            if (uid != "") {
                document.getElementById("launch").onclick = () => {
                    window.open(`index.html?uid=${uid}`, "_blank");
                };
            }
            document.querySelector(".confirm").innerHTML = uid;
        break;
    }

    console.log(event.data);
    document.getElementById("response").innerHTML               = event.data;
    document.getElementById("stringifiedResponse").innerHTML    = JSON.stringify(event.data);
});