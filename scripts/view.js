const view      = {
    loaderOpen  : true,
    currImage   : 0,
    maxSize     : {width: 900, height: 684},
    window      : {width: 0, height: 0},
    categories  : [],
    offset      : -1,

    toggleLoader    : () => {
        view.loaderOpen = !view.loaderOpen;

        if (view.loaderOpen)    $("#loadingScreen").show();
        else                    $("#loadingScreen").hide();
    },
    makeMap         : (src, parent) => {
        $(parent).append(`<div class="mapCrop"><iframe class="map" src="${src}"></iframe></div>`);
    },
    addCategory     : (index, text) => {
        $("#categories").append(`
        <div id="c_${index}" class="category insetShadow" onclick="toggleCategory(${index})">
            <p>#${text}</p><div class="inside"></div>
        </div>`);

        view.categories.push(false);
    },
    addPost         : (index, title, date, category, description, img) => {
        $("#postsView").append(`
        <div onclick="openPost(${index})" id="p_${index}" class="post">
            <div class="content">
                <p class="title">${title}</p>
                <div class="spanDiv">
                    <span class="date">${date}</span>
                    <span class="postCategory">${category}</span>
                </div>
                <p class="description">${description}</p>
            </div>
            <div class="picture">
                <img src="${img}">
            </div>
        </div>`);
    },
    openPost        : async (index, categories, photos, mapSrc) => {
        $(`#p_${index}`).attr("onclick", "");
        
        let marginTop   = parseFloat($(`#p_${index}`).css("margin-top"));
        let postHeight  = parseFloat($(`#p_${index}`).height());
        let scrollPos   = postHeight * index;
        if (index != 0) scrollPos += index * marginTop;

        $(`#p_${index} .picture`).css("height", $(`#p_${index} .picture`).height());
        $("#postsView").css("overflow", "hidden");
        $(`#p_${index}`).addClass("openedPost");
        $("#postsView").scrollTop(scrollPos);

        $(`#p_${index} .description`).before(`
            <div class="imgMapView">
                <img onclick="view.scrollPhoto(-1)" class="leftImgBtn"    src="icons/thin_arrow.svg">
                <div class="imageView"></div>
                <img onclick="view.scrollPhoto(1)" class="rightImgBtn"   src="icons/thin_arrow.svg">
                <div class="mapContainer"></div>
            </div>
        `);

        view.makeMap(mapSrc, ".mapContainer");
        $(".map").contents().find(".place-card").hide();

        $(`#p_${index} .date`).clone().prependTo(`#p_${index}`);
        $(`#p_${index} .spanDiv`).empty();
        $(`#p_${index} .date`).addClass("openedDate");

        $(`#p_${index} .spanDiv`).addClass("openCategories");
        for (let i = 0; i < categories.length; i++) {
            $(`#p_${index} .spanDiv`).append(`<span class="card">${categories[i]}</span>`);
        }

        $(`#p_${index} .imageView`).append(`<div id="img_${0}" class="image"><img src="${photos[0]}"></div>`);
        await timeout(700);

        let left    = parseFloat($(`#img_${0}`).css("left"));
        let width   = parseFloat($(`#img_${0}`).css("width"));
        view.offset = left + width;

        for (let i = 1; i < photos.length; i++) {
            $(`#p_${index} .imageView`).append(`<div id="img_${i}" class="image"><img src="${photos[i]}"></div>`);

            let left    = parseFloat($(`#img_${i}`).css("left")) * 2;
            let width   = parseFloat($(`#img_${i}`).css("width"));

            $(`#img_${i}`).css("left", (left + width) * i);
        }

        await timeout(100);
        $(".image").addClass("smooth");
    },
    scrollPhoto     : async (dir) => {
        let scroll = false;

        if ((dir > 0 && view.currImage + 1 != $(".image").length) || (dir < 0 && view.currImage - 1 != -1)) {
            scroll = true;
        }

        if (scroll) {
            $(".image").each(function(i) {
                $(this).css("left", dir > 0 ? `-=${view.offset}` : `+=${view.offset}`);
            })
            view.currImage += dir;
        }
    },
    setupPostView   : async () => {
        $("#addBtn").attr("onclick", "");

        $(".category").eq(0).css("margin-top", $("#categories").prop("scrollHeight") + 100);
        $("#categories").css("scroll-behavior", "smooth");
        $("#categories").scrollTop(0);

        $("#search").css("width", 0);
        $("#postsView").css("margin-top", "50%");
        $("#postsView").css("height", 0);
        $("#searchbar").css("opacity", 0);
        $("#searchBtn").css("opacity", 0);
        await timeout(600);
        $("#posts").css({ "width": 0, margin: 0 });
        $("#categories").css("width", "100%");
        $(".category").remove();

        $("#categories").addClass("postView");

        $(".postView").append(`
            <h1>Title for this page</h1>
            <p>Explanatory title for this page</p>
            <input id="titleInput" placeholder="Write your title here …">
            <div class="leftButton button disabled"></div>
            <div class="rightButton button disabled"></div>
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
    toggleCategory  : (index) => {
        $(`#c_${index}`).removeClass(view.categories[index] ? "outsideShadow"   : "insetShadow");
        $(`#c_${index}`).addClass   (view.categories[index] ? "insetShadow"     : "outsideShadow");
        let font = view.categories[index] ? "-=2" : "+=2";
        $(`#c_${index} p`).animate  ({ fontSize: font }, 200);

        view.categories[index] = !view.categories[index];
    },
    scrollToMiddle  : (elem) => {
        $(elem).scrollTop($(elem).width() / 2);
    },
    resize          : () => {
        $(".subContainer").css("width", parseFloat($(".subContainer").height()) * 1.11);

        $(window).resize(function() {
            $(".subContainer").css("width", parseFloat($(".subContainer").height()) * 1.11);
        });
    },
}