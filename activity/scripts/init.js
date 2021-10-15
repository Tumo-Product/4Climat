let uid = "1";

if (window.location.href.includes("examiner")) {
    let pid = "17c179c16c3";
    $(onLoad(true, "1", pid));
}

window.parent.postMessage({
    application: "activity-manager",
    message: "init"
}, '*');

window.addEventListener("message", event => {
    if (event.data.application !== "activity-manager") {
        return;
    }

    console.log(event.data.message);
    console.log(event.data);

    switch(event.data.message) {
        case 'init-response':
            const { data } = event.data;
            uid = data.studentId ? data.studentId : data.id;

            if (window.location.href.includes("viewer")) {
                $(onLoad(false, uid));
            } else if (window.location.href.includes("examiner")) {
                let pid = data.answers[0];
                $(onLoad(true, "1", pid));
            }
        break;
    }
});

window.parent.postMessage({
    application: 'activity-manager',
    message: 'set-iframe-height',
    data: { iframeHeight: 800 }
}, '*');