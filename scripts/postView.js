const postView = {
    dropdownOpen: false,

    disableRightBtn : async () => {
        $(".rightButton").addClass("disabled");
    },
    enableRightBtn : async () => {
        $(".rightButton").removeClass("disabled");
    },

    setupTitleView   : async () => {
        $("#addBtn").attr("onclick", "");

        // Slide categories down and remove them.
        $(".category").eq(0).css("margin-top", $("#categories").prop("scrollHeight") + 100);
        $("#categories").css("scroll-behavior", "smooth");
        $("#categories").scrollTop(0);

        // Widen categories to make it main post adding space.
        $("#mainCard").addClass("cardPostView");
        await timeout(600);
        $("#posts").css({ "width": 0, margin: 0 });
        $(".category").remove();

        $("#categories").addClass("postView");

        $(".postView").append(`
            <h1 class="postTitle">Title for this page</h1>
            <p class="postStageExpl">Explanatory title for this page</p>
            <input class="postInput" id="titleInput" placeholder="Write your title here …">
            <div class="leftButton button disabled"></div>
            <div onclick="addPost(1)" class="rightButton button disabled"></div>
        `);
        
        $(".leftButton").append (`<div class="inside"></div><img src="icons/arrow.svg">`);
        $(".rightButton").append(`<div class="inside"></div><img src="icons/arrow.svg">`);

        return $("#titleInput");
    },
    setupCategoryView   : async () => {
        $("#titleInput").addClass("closed");
        $(".rightButton").attr("onclick", "addPost(2)");
        $(".rightButton").addClass("disabled");
        await timeout(600);
        $("#titleInput").remove();

        $(".postView").append(`
            <div class="selector">
                <p class="chooseCategories">Choose categories...</p>
                <div class="categoriesInPost"></div>
            </div>
            <div class="dropdown" onclick="postView.toggleDropdown()">&#11167;</div>
            <div class="categories hidden"></div>
        `);

        for (let i = 0; i < categories.length; i++) {
            postView.appendCategory(i, ".categories", 1);
        }
    },
    setupMapView   : async (mapEmbed) => {
        $(".rightButton").attr("onclick", "addPost(3)");
        $(".rightButton").addClass("disabled");

        $(".categories").addClass("hidden");
        $(".selector").animate({opacity: 0}, 500);
        $(".dropdown").animate({opacity: 0}, 500);
        await timeout(500);
        $(".selector").remove();
        $(".dropdown").remove();
        $(".postView").append(`
            <div class="postMapContainer">
                <div class="postMap"><iframe src=""></iframe></div>
            </div>
            <input type="url" class="postInput" id="linkInput" placeholder="Paste your link here …">
            <p class="wrongLink">Wrong link</p>
        `);

        return $("#linkInput");
    },
    addPostMap      : async (embedSrc) => {
        if ($(".postMapContainer iframe").attr("src") === "") {
            $(".wrongLink").css("opacity", 0); await timeout(200);
            $(".postMapContainer iframe").attr("src", embedSrc);
            $("#linkInput").addClass("underMapInput");
            await timeout(100); $(".postMapContainer").addClass("mapContainerOpen");
        }
    },
    removePostMap   : async () => {
        $(".postMapContainer iframe").attr("src", "");
        $(".postMapContainer").removeClass("mapContainerOpen");
        await timeout(170); $("#linkInput").removeClass("underMapInput");
        await timeout(500);
        $(".wrongLink").css("opacity", 1);
    },
    setupDescriptionView    : async () => {
        $(".rightButton").attr("onclick", "addPost(4)");
        $(".rightButton").addClass("disabled");

        $(".postMapContainer").removeClass("mapContainerOpen");
        $(".postInput").addClass("closed");
        await timeout(500);

        $(".postView").append(`<textarea class="postDescription" placeholder="Write your text here …">`);
        await timeout(50); $(".postDescription").addClass("openPostDescription");

        return $(".postDescription");
    },
    setupImageView  : async () => {
        $(".postDescription").removeClass("openPostDescription");
        await timeout(800);

        $(".postView").append(`
            <div class="postImages"></div>
            <input type="file" accept="image/*" id="downloadInput" onchange="addImage()"/>
            <div class="bigBtn" id="download" onclick="clickDownloadInput()">
                <div class="inside"></div>
                <img src="icons/download.png">
            </div>
        `);
        await timeout(50); $(".postImages").addClass("openPostImages");

        return $(".postImages");
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

            $(".selector").height(height).animate({"height": newHeight}, 500);
            $(".categoriesInPost").removeClass("expandedCategories");

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
    addCategory   : async (i) => {
        let ctgWidth = parseFloat($(`#pc_${i}`).css("width")) / window.innerHeight * 100;

        if ($(".selector .addPostCategory").length == 0) {
            $(".chooseCategories").addClass("hideChooseCategories");
        }

        $(`#pc_${i}`).css("width", $(`#pc_${i}`).width());
        $(`#pc_${i}`).animate({ width: 0, padding: 0 }, 600);
        $(`#pc_${i} p`).animate({ opacity: 0 }, 500);
        $(`#pc_${i} span`).css("opacity", 0);

        setTimeout(() => {
            $(`.categories #pc_${i}`).remove();
        }, 600);
        
        postView.appendCategory(i, ".categoriesInPost", 0, 0);
        $(`#pc_${i}`).animate({ width: `${ctgWidth}vh` }, 500);
        let scrollAmount = $(".categoriesInPost").prop("scrollWidth");
        $(".categoriesInPost").animate({ scrollLeft: scrollAmount }, 1000);
    },
    removeCategory : async (i) => {
        let ctgWidth = parseFloat($(`#pc_${i}`).css("width")) / window.innerHeight * 100;

        $(`#pc_${i}`).css("width", $(`#pc_${i}`).width());
        $(`#pc_${i}`).animate({ width: 0, padding: 0 }, 600);
        $(`#pc_${i} p`).animate({ opacity: 0 }, 500);
        $(`#pc_${i} span`).css("opacity", 0);
        await timeout(600);
        
        $(`#pc_${i}`).remove();

        postView.appendCategory(i, ".categories", 1, 0);
        $(".categories").animate({ scrollTop: Number.MAX_SAFE_INTEGER }, 500);
        $(`#pc_${i}`).animate({ width: `${ctgWidth}vh` }, 500);
    },
    appendCategory  : (i, parent, type, width) => {
        $(parent).append(`<div id="pc_${i}" class="addPostCategory"><p>${categories[i]}</p></div>`);

        if (type == 1) {
            $(`#pc_${i}`).append(`<span onclick="postView.addCategory(${i})" class="addCategory">+</span>`);
        } else {
            $(`#pc_${i}`).append(`<span onclick="postView.removeCategory(${i})" class="removeCategory">x</span>`);
        }

        if (width !== undefined) {
            $(`#pc_${i}`).css("width", width);
        }
    },
}