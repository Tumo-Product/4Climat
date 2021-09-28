const popups = {
    createPopup: (type) => {
        $(".popupContainer").append(`
            <div class="popup">
                <div class="minimize" onclick="view.closePopupContainer()">
                    <div class="inside"></div><img src="icons/X.png">
                </div>
            </div>
        `);

        if (type == "complete") {
            $(".popup").append(`
                <p class="mainMsg">Do you want to publish or save this post?</p>
                <button onclick="saveDraft()" id="draftButton" class="wideBtn">
                    <div class="inside"></div>
                    <p>Save Draft</p>
                </button>
                <button onclick="publishPost()" id="publishButton" class="wideBtn">
                    <div class="inside"></div>
                    <p class="confirm">Publish</p>
                </button>
            `);
        } else if (type == "draft") {
            $(".popup").append(`
                <p class="mainMsg">Are you want sure you want save this post as a draft?</p>
                <button onclick="discardPost()" id="draftButton" class="wideBtn">
                    <div class="inside"></div>
                    <p>Discard</p>
                </button>
                <button onclick="saveDraft()" id="publishButton" class="wideBtn">
                    <div class="inside"></div>
                    <p>Save draft</p>
                </button>
            `);
        } else {
            $(".popup").append(`
                <p class="mainMsg">Do you want to edit your draft or delete it?</p>
                <button onclick="deletePost()" id="draftButton" class="wideBtn">
                    <div class="inside"></div>
                    <p>Delete</p>
                </button>
                <button onclick="updatePost('draft')" id="publishButton" class="wideBtn">
                    <div class="inside"></div>
                    <p>Edit</p>
                </button>
            `);
        }

        $(".popupContainer").css({"opacity": 1, "pointer-events": "all"});
    }
}