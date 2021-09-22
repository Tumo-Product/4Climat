const postView = {
    dropdownOpen: false,
    offset      : -1,

    disableBtn : async (which) => {
        $(`.${which}Button`).addClass("disabled");
    },
    enableBtn : async (which) => {
        $(`.${which}Button`).removeClass("disabled");
    },

    popup           : async (type) => {
        if (type == "complete") {
            $(".popup").append(`
                <button onclick="saveDraft()" id="draftButton" class="wideBtn">
                    <div class="inside"></div>
                    <p>Save Draft</p>
                </button>
                <button onclick="publishPost()" id="publishButton" class="wideBtn">
                    <div class="inside"></div>
                    <p>Publish</p>
                </button>
            `);
        }

        $(".popupContainer").css({"opacity": 1, "pointer-events": "all"});
    },

    postComplete    : async () => {
        $(".popup button").css("opacity", 0);                       // Fade out and remove buttons
        setTimeout(() => { $(".popup button").remove(); }, 500);

        $(".popup .mainMsg").css("opacity", 0);
        setTimeout(() => {
            $(".popup .mainMsg").css("position", "initial");
            $(".popup .mainMsg").text("Your post has been successfully published!");
            $(".popup .mainMsg").css("opacity", 1);
        }, 500);

        await timeout(200);
        $(".popup").append(`
            <img class="postComplete" src="icons/checkmark.svg">
        `);
    },

    closeStage      : async (stage) => {
        $(".rightButton").addClass("disabled");

        switch (stage) {
            case 0:
                $("#titleInput").addClass("closed");
                await timeout(600);
                $("#titleInput").remove();
                break;
            case 1:
                postView.dropdownOpen = false;
                $(".categories").addClass("hidden");
                $(".selector").css({opacity: 0});
                $(".dropdown").css({opacity: 0});
                $(".categories").css("opacity", 0);
                await timeout(500);
                $(".categories").remove();
                $(".selector").remove();
                $(".dropdown").remove();
                break;
            case 2:
                $(".postMapContainer").removeClass("mapContainerOpen");
                $(".postInput").addClass("closed");
                $(".wrongLink").css("opacity", 0);
                await timeout(500);
                $(".postMapContainer").remove();
                $(".postInput").remove();
                $(".wrongLink").remove();
                break;
            case 3:
                $(".postDescription").removeClass("openPostDescription");
                $("#chars").css("opacity", 0);
                await timeout(800);
                $("#chars").remove();
                break;
            case 4:
                $("#download").addClass("goUnder");
                $(".postImages").removeClass("openPostImages");
                await timeout(500);
                $("#download").remove();
                $("#downloadInput").remove();
                $(".postImages").remove();
                break;
            case 5:
                view.currImage = 0;
                $(".openedPost").css({"opacity": 0, "height": 0});
                await timeout(500);
                $(".postTitle").css("opacity", 1);
                $(".postStageExpl").css("opacity", 1);
                $("#stages").css("opacity", 0);
                $("#addBtn img").attr("src", "icons/bigX.png");
                $("#addBtn").attr("onclick", "discardPost()");
                $(".openedPost").remove();
                break;
            default:
                break;
        }
    },

    discardPost     : async () => {
        $("#addBtn").attr("onclick", "addPost(1)");
        $("#addBtn img").attr("src", "icons/plus.png");
        $("#categories").children().each(function () {
            if (!$(this).hasClass("category")) {
                $(this).css("transition", "0s");
                $(this).animate({"opacity": 0}, 500);
                setTimeout(() => {
                    $(this).remove();
                }, 500);
            }
        });

        await timeout(500);
        $("#categories").removeClass("postView");
        await timeout(500);
        $("#posts").css({ "width": "65%", margin: "2.88%", "margin-left": 0 });
        await timeout(200);
        $("#mainCard").removeClass("cardPostView");

        $(".category").eq(0).css("margin-top", "10.25%");
    },
    firstSetup      : async () => {
        $("#addBtn").attr("onclick", "discardPost()");
        $("#addBtn img").attr("src", "icons/bigX.png");
        $("#postButton").attr("onclick", "saveDraft()");
        $("#postButton p").text("Save Draft");

        // Slide categories down.
        $(".category").eq(0).css("margin-top", $("#categories").prop("scrollHeight") + (window.innerHeight * 0.555));

        // Widen categories to make it the main post adding space.
        $("#mainCard").addClass("cardPostView"); await timeout(600);
        $("#posts").css({ "width": 0, margin: 0 });
        $("#categories").addClass("postView");

        $(".postView").append(`
            <h1 class="postTitle">Title for this page</h1>
            <p class="postStageExpl">Explanatory title for this page</p>
            <button onclick="addPost(-1)" class="leftButton button disabled"></button>
            <button onclick="addPost(1)"  class="rightButton button disabled"></button>
            <div id="stages">
                <span id="currentStage">1</span> <span>/</span> <span>5</span>
            </div>
        `);
        
        $(".leftButton").append (`<div class="inside"></div><img src="icons/arrow.svg">`);
        $(".rightButton").append(`<div class="inside"></div><img src="icons/arrow.svg">`);
    },
    setupTitleView  : async (title) => {
        $(".postView").append(`<input autocomplete="off" class="postInput" id="titleInput" placeholder="Write your title here …">`);
        $("#titleInput").val(title);
        if (title.length !== 0) postView.enableBtn("right");
        return $("#titleInput");
    },
    setupCategoryView   : async (postCategories) => {
        $(".postView").append(`
            <div class="selector">
                <p class="chooseCategories">Choose categories...</p>
                <div class="categoriesInPost"></div>
            </div>
            <div class="dropdown" onclick="postView.toggleDropdown()">
                <img src="icons/triangle.png">
            </div>
            <div class="categories hidden"></div>
        `);
        await timeout(50);
        $(".selector").css({opacity: 1});
        $(".dropdown").css({opacity: 1});

        for (let i = 0; i < categories.length; i++) {
            postView.appendCategory(categories[i], i, ".categories", 1);

            if (postCategories.includes(categories[i])) {
                await postView.addCategory(i, true);
                await timeout(200);
            }
        }

        if ($(".categoriesInPost").children().length != 0) {
            let scrollAmount = $(".categoriesInPost").prop("scrollWidth");
            $(".categoriesInPost").animate({ scrollLeft: scrollAmount }, 700);
            await timeout(200);
            postView.toggleDropdown();
        }

        return $(".categoriesInPost");
    },
    addCategory   : async (i, dontScroll) => {
        let ctgWidth = parseFloat($(`#pc_${i}`).css("width")) / window.innerHeight * 100;

        if ($(".selector .addPostCategory").length == 0) {
            $(".chooseCategories").addClass("hideChooseCategories");
        }

        $(`#pc_${i}`).css("width", $(`#pc_${i}`).width());
        $(`#pc_${i}`).animate({ width: 0, padding: 0 }, 600);
        $(`#pc_${i} p`).animate({ opacity: 0 }, 500);
        $(`#pc_${i} span`).css("opacity", 0);

        setTimeout(() => { $(`.categories #pc_${i}`).remove(); }, 600);
        
        postView.appendCategory(categories[i], i, ".categoriesInPost", 0, 0);

        $(`#pc_${i}`).animate({ width: `${ctgWidth}vh` }, 500);
        let scrollAmount = $(".categoriesInPost").prop("scrollWidth");
        if (dontScroll !== true) {
            $(".categoriesInPost").animate({ scrollLeft: scrollAmount }, 1000);
        }
    },
    removeCategory : async (i) => {
        let ctgWidth = parseFloat($(`#pc_${i}`).css("width")) / window.innerHeight * 100;

        $(`#pc_${i}`).css("width", $(`#pc_${i}`).width());
        $(`#pc_${i}`).animate({ width: 0, padding: 0 }, 600);
        $(`#pc_${i} p`).animate({ opacity: 0 }, 500);
        $(`#pc_${i} span`).css("opacity", 0);
        await timeout(600);
        
        $(`#pc_${i}`).remove();

        postView.appendCategory(categories[i], i, ".categories", 1, 0);
        $(".categories").animate({ scrollTop: Number.MAX_SAFE_INTEGER }, 500);
        $(`#pc_${i}`).animate({ width: `${ctgWidth}vh` }, 500);
    },
    appendCategory  : (text, i, parent, type, width) => {
        $(parent).append(`<div id="pc_${i}" class="addPostCategory"><p>${text}</p></div>`);

        if (type == 1) {
            $(`#pc_${i}`).append(`<span onclick="postHandlers.addCategory(${i})" class="categoryIcon">
                <img src="icons/plus.png">
            </span>`);
        } else {
            $(`#pc_${i}`).append(`<span onclick="postHandlers.removeCategory(${i})" class="categoryIcon">
                <img src="icons/X.png">
            </span>`);
        }

        if (width !== undefined) {
            $(`#pc_${i}`).css("width", width);
        }
    },
    setupMapView   : async () => {
        $(".postView").append(`
            <div class="postMapContainer">
                <div class="postMap"><iframe src=""></iframe></div>
            </div>
            <input autocomplete="off" type="url" class="postInput closed" id="linkInput" placeholder="Paste your link here …">
            <p class="wrongLink">Wrong link</p>
        `); await timeout(50);
        $("#linkInput").removeClass("closed");

        return $("#linkInput");
    },
    addPostMap      : async (embedSrc) => {
        document.getElementById("linkInput").readOnly = true;

        if ($(".postMapContainer iframe").attr("src") === "") {
            $(".wrongLink").css("opacity", 0);          await timeout(200);
            $(".postMapContainer iframe").attr("src", embedSrc);
            $("#linkInput").addClass("underMapInput");  await timeout(100);
            $(".postMapContainer").addClass("mapContainerOpen");
        }

        document.getElementById("linkInput").readOnly = false;
    },
    removePostMap   : async () => {
        document.getElementById("linkInput").readOnly = true;

        $(".postMapContainer iframe").attr("src", "");
        $(".postMapContainer").removeClass("mapContainerOpen");
        if ($(".postMapContainer").height() == 0)
            $(".wrongLink").css("opacity", 1);
        await timeout(170); $("#linkInput").removeClass("underMapInput");
        await timeout(500);
        $(".wrongLink").css("opacity", 1);

        document.getElementById("linkInput").readOnly = false;
    },
    setupDescriptionView    : async (description, limit) => {
        if ($(".postDescription").length == 0) {
            $(".postView").append(`
                <div id="chars">
                    <span id="charCount">0</span> <span>/</span> <span>${limit}</span>
                </div>
                <textarea class="postDescription" placeholder="Write your text here …">
            `);
        } else postView.enableBtn("right");

        await timeout(50); $(".postDescription").addClass("openPostDescription");
        $(".postDescription").val(description);
        if (description.length !== 0) postView.enableBtn("right");

        return $(".postDescription");
    },
    setupImageView  : async (images) => {
        $(".postView").append(`
            <div class="postImages"></div>
            <input autocomplete="off" type="file" accept="image/*" id="downloadInput" onchange="addImage()" multiple/>
            <div class="bigBtn goUnder" id="download">
                <div class="inside"></div>
                <img src="icons/download.png">
        </div>`);
        
        $("#download").click( function () { document.getElementById("downloadInput").click(); } );
        await timeout(50); $(".postImages").addClass("openPostImages");
        $("#download").removeClass("goUnder");

        for (let i = 0; i < images.length; i++) {
            postView.addImage(i, images[i]);
            postView.enableBtn("right");
        }

        return $(".postImages");
    },
    setupPreview    : async (post, mapEmbed) => {
        $("#addBtn img").attr("src", "icons/checkmark.svg");
        $("#addBtn").attr("onclick", "completePost()");
        $(".postTitle").css("opacity", 0);
        $(".postStageExpl").css("opacity", 0);
        $("#stages").css("opacity",  0);
        await timeout(400);

        view.currImage = 0;
        let date = new Date().toDateString();
        date = date.substring(date.indexOf(" ") + 1, date.length); // Remove weekday
        $(".postView").append(`
        <div class="post openedPost">
            <p id="previewText">Post Preview</p>
            <span class="date openedDate">${date}</span>
            <div class="content">
                <p class="title">${post.title}</p>
                <div class="spanDiv openCategories"></div>
                
                <div class="imgMapView">
                    <img onclick="view.scrollPhoto(-1)" class="leftImgBtn" src="icons/thin_arrow.svg">
                    <div class="imageView"></div>
                    <img onclick="view.scrollPhoto(1)" class="rightImgBtn" src="icons/thin_arrow.svg">
                    <div class="mapContainer"><div class="mapCrop"><iframe class="map" src="${mapEmbed}"></iframe></div></div>
                </div>
                <p class="description">${post.description}</p>
            </div>
        </div>
        `);

        let titleFontSize = parser.getCorrectFontSize($(`.postView .openedPost .title`).text().length);
        $(`.postView .openedPost .title`).css("font-size", `${titleFontSize}vh`);

        $(".openCategories").append(`<span class="card">${post.categories[0]}</span>`);

        $(`.imageView`).append(`<div id="img_${0}" class="image"><img src="${post.images[0]}"></div>`);
        view.offset = parseFloat($(`#img_${0}`).css("width")) / window.innerHeight * 100;

        for (let i = 1; i < post.images.length; i++) {
            $(`.imageView`).append(`<div id="img_${i}" class="image"><img src="${post.images[i]}"></div>`);

            $(`#img_${i}`).css("left", `${view.offset * i}vh`);
        }

        await timeout(100);
        $(".image").addClass("smooth");
    },
    addImage    : async (i, imgSrc) => {
        $(".postImages").append(`
            <div id="pImg_${i}" class="postImgContainer">
                <img src="${imgSrc}">
                <img src="icons/X.png" class="remImage" onclick="removeImage(${i})">
            </div>
        `);
    },
    removeImage : async (i) => {
        $(`#pImg_${i}`).remove();

        $(".postImgContainer").each(function(index) {
            $(this).attr("id", `pImg_${index}`);
            $(this).find(".remImage").attr("onclick", `removeImage(${index})`);
        })
    },
    toggleDropdown  : async () => { // TODO: Change icons
        let openLate = false;

        if (!postView.dropdownOpen) {   // Open
            postView.dropdownOpen = !postView.dropdownOpen;
            $(".rightButton").addClass("disabled");
            
            let height = parseFloat($(".selector").css("height"));
            let newHeight = window.innerHeight * 0.08667;
            if (height > newHeight + 1) openLate = true;

            $(".selector").height(height).animate({"height": newHeight}, 100);
            $(".categoriesInPost").removeClass("expandedCategories");
            $(".dropdown").addClass("flipY");

            let scrollAmount = $(".categoriesInPost").prop("scrollWidth");
            $(".categoriesInPost").animate({ scrollLeft: scrollAmount }, 1000);
            $(".categoriesInPost span").css({"opacity": 1, "pointer-events": "all"});
            if (openLate) await timeout(500);

            $(".categories").removeClass("hidden");
            await timeout(50);
            $(".selector").css("height", "8.677vh");
        } else {                        // Hide
            postView.dropdownOpen = !postView.dropdownOpen;
            if ($(".categoriesInPost").children().length >= 1) {
                $(".rightButton").removeClass("disabled");
            } else {
                $(".rightButton").addClass("disabled");
            }

            $(".dropdown").removeClass("flipY");
            $(".categories").addClass("hidden");
            $(".categoriesInPost span").css({"opacity": 0, "pointer-events": "none"});
            await timeout(500);
            $(".categoriesInPost").animate({ scrollLeft: 0 }, 500);
            await timeout(400);

            $(".categoriesInPost").addClass("expandedCategories");
            $(".selector").css("height", "fit-content");
            let height = parseFloat($(".selector").css("height")) / window.innerHeight * 100;
            $(".selector").css("height", "8.677vh").animate({"height": `${height}vh`}, 500);
        }
    },
}