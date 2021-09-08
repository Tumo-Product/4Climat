const postView = {
    dropdownOpen: false,

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
            <input id="titleInput" placeholder="Write your title here …">
            <div class="leftButton button disabled"></div>
            <div onclick="addPost(1)" class="rightButton button disabled"></div>
        `);
        
        $(".leftButton").append (`<div class="inside"></div><img src="icons/arrow.svg">`);
        $(".rightButton").append(`<div class="inside"></div><img src="icons/arrow.svg">`);

        $("#titleInput").on('input', function() {
            if (parser.isTitleCorrect($(this).val())) {
                if (!$(".rightButton").attr("class").includes("disabled")) {
                    $(".rightButton").addClass("disabled");
                }
            } else {
                $(".rightButton").removeClass("disabled");
            }
        });
    },
    setupCategoryView   : async () => {
        $("#titleInput").addClass("closed");
        $(".rightButton").attr("onclick", "addPost(2)");
        $(".rightButton").addClass("disabled");
        await timeout(600);
        $("#titleInput").remove();

        $(".postView").append(`
            <div class="categorySelector">
                <div class="selector">
                    <p class="chooseCategories">Choose categories...</p>
                    <div class="categoriesInPost"></div>
                </div>
                <div class="dropdown" onclick="postView.toggleDropdown()">&#11167;</div>
            </div>
            <div class="categories hidden"></div>
        `);

        for (let i = 0; i < categories.length; i++) {
            postView.appendCategory(i, ".categories", 1);
        }
    },
    toggleDropdown  : () => { // TODO: Change icons
        if (!postView.dropdownOpen) {   // Open
            $(".categories").removeClass("hidden");
        } else {                        // Hide
            $(".categories").addClass("hidden");
        }

        postView.dropdownOpen = !postView.dropdownOpen;
    },
    addCategory   : async (i) => {
        let ctgWidth = parseFloat($(`#pc_${i}`).css("width")) / window.innerHeight * 100;

        if ($(".selector .addPostCategory").length == 0) {
            $(".chooseCategories").css("opacity", 0);
        }

        $(`#pc_${i}`).css("width", $(`#pc_${i}`).width());
        $(`#pc_${i}`).animate({ width: 0, padding: 0 }, 600);
        $(`#pc_${i} p`).animate({ opacity: 0 }, 500);

        await timeout(600);
        $(".chooseCategories").hide();
        $(`#pc_${i}`).remove();
        
        postView.appendCategory(i, ".categoriesInPost", 0, 0);

        // if ($(".selector").children().length >= 1)
        //     $(".rightButton").removeClass("disabled");

        $(`#pc_${i}`).animate({ width: `${ctgWidth}vh` }, 500);
        let scrollAmount = $(".categoriesInPost").prop("scrollWidth");
        $(".selector").animate({ scrollLeft: scrollAmount }, 1000);
    },
    removeCategory : async (i) => {
        let ctgWidth = parseFloat($(`#pc_${i}`).css("width")) / window.innerHeight * 100;

        $(`#pc_${i}`).css("width", $(`#pc_${i}`).width());
        $(`#pc_${i}`).animate({ width: 0, padding: 0 }, 600);
        $(`#pc_${i} p`).animate({ opacity: 0 }, 500);
        await timeout(600);
        
        $(`#pc_${i}`).remove();
        // if ($(".selector").children().length >= 1)
        //     $(".rightButton").addClass("disabled");

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