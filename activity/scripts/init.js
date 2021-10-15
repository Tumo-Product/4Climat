let uid = "1";

window.parent.postMessage({
    application: "activity-manager",
    message: "init"
}, '*');

window.addEventListener("message", event => {
    if (event.data.application !== "activity-manager") {
        return;
    }

    console.log(event.data.message);
    console.log(eent.data);

    switch(event.data.message) {
        case 'init-response':
            const { data } = event.data;
            uid = data.studentId ? data.studentId : data.id;

            if (window.location.href.includes("viewer")) {
                $(onLoad(false, uid));
            } else if (window.location.href.includes("examiner")) {
                let pid = data.answers;
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