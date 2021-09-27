const view      = {
    loaderOpen  : true,
    currImage   : 0,
    maxSize     : {width: 900, height: 684},
    window      : {width: 0, height: 0},
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
    },
    addPost         : (index, title, date, categories, description, img) => {
        if (title === "") title = "N/A";
        if (categories.length === 0) categories = ["N/A"];
        if (description === "") description = "N/A";
        if (img === undefined) img = "images/notAval.png";

        $("#postsView").append(`
        <div onclick="openPost(${index})" id="p_${index}" class="post">
            <div class="content">
                <p class="title">${title}</p>
                <div class="spanDiv">
                    <span class="date">${date}</span>
                    <span class="postCategory">${categories[0]}</span>
                </div>
                <p class="description">${description}</p>
            </div>
            <div class="picture">
                <img src="${img}">
            </div>
        </div>`);

        if (categories.length > 1)
            $(`#p_${index} .spanDiv span`).last().append(" ...");
    },

    openLoading     : async () => {
        $(".popupContainer").append(`
            <div class="stage">
                <div class="dot-bricks"></div>
            </div>
        `);
        $(".popupContainer").css({"opacity": 1, "pointer-events": "all"});
        $(".popupContainer").addClass("loading");
    },

    openImage       : async (image) => {
        $(".popupContainer").empty(); await timeout(50);
        $(".popupContainer").removeClass("loading");
        
        $(".popupContainer").append(`
            <div class="card" id="imagePopup" style="opacity: 0">
                <img src="${image}">
            </div>
        `); await timeout(50);
        $("#imagePopup").css("opacity", 1);
    },

    closePopupContainer      : async () => {
        $(".popupContainer").css({"opacity": 0, "pointer-events": "none"}); await timeout(500);
        $(".popupContainer").empty();
    },

    openPost        : async (index, categories, images, mapSrc) => {
        postClosed = false;
        if (categories.length === 0) categories = ["N/A"];
        if (images.length === 0) images = ["images/notAval.png"];
        $(`#p_${index}`).attr("onclick", "");
        
        let marginTop   = parseFloat($(`#p_${index}`).css("margin-top"));
        let postHeight  = parseFloat($(`#p_${index}`).height());
        let scrollPos   = postHeight * index;
        scrollPos += index * marginTop;

        $(`#p_${index} .picture`).css("height", $(`#p_${index} .picture`).height());
        $("#postsView").css("overflow", "hidden");
        $(`#p_${index}`).addClass("openedPost");
        if ($(`#p_${index}`).index() != 0)
            $("#postsView").animate({scrollTop: scrollPos}, 500);
        let titleFontSize = parser.getCorrectFontSize($(`#p_${index} .title`).text().length);
        $(`#p_${index} .title`).animate({"font-size": `${titleFontSize}vh`}, 500);

        $(`#p_${index} .description`).css("opacity", 0);
        await timeout(300);
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

        $(`#p_${index} .imageView`).append(`<div id="img_${0}" class="image"><img src="${images[0]}"></div>`);
        await timeout(700);
        $(`#p_${index} .description`).css("opacity", 1);

        view.offset = parseFloat($(`#img_${0}`).css("width")) / window.innerHeight * 100;

        for (let i = 1; i < images.length; i++) {
            $(`#p_${index} .imageView`).append(`<div id="img_${i}" class="image"><img src="${images[i]}"></div>`);
            $(`#img_${i}`).css("left", `${view.offset * i}vh`);
        }

        await timeout(100);
        $(".image").addClass("smooth");
        $(`#p_${index}`).append(`<div class="minimize" onclick="closePost(${index})">
            <div class="inside"></div><img src="icons/minimize.png">
        </div>`);
        await timeout(100);
         $(".minimize").css("opacity", 1);
         postClosed = true;
    },
    closePost       : async (index, categories) => {
        if (categories.length == 0) categories = ["N/A"];
        view.currImage = 0;
        $(`#p_${index} .description`).css("opacity", 0);
        $(`#p_${index} .imgMapView`).css("height", 0);
        setTimeout(() => {
            $(".imgMapView").remove();
            $(`#p_${index} .minimize`).remove();
        }, 500);

        await timeout(370);
        $(`#p_${index}`).removeClass("openedPost");
        $(`#p_${index} .title`).animate({ "font-size": "2.77vh" }, 500);
        $(`#p_${index} .minimize`).css({"opacity": 0, "pointer-events": "none"});
        $(".picture").css("height", "90.13%");
        await timeout(100);

        $(`#p_${index} .date`).clone().appendTo(`#p_${index} .spanDiv`);
        $(`#p_${index} .spanDiv .date`).removeClass("openedDate");
        $(".openedDate").remove();
        $(`#p_${index} .spanDiv .card`).remove();
        
        $(`#p_${index} .spanDiv`).removeClass("openCategories");
        $(`#p_${index} .spanDiv`).append(`<span class="postCategory">${categories[0]}</span>`);
        if (categories.length > 1)
            $(`#p_${index} .spanDiv span`).last().append(" ...");

        $("#postsView").css("overflow", "auto");
        $(`#p_${index}`).attr("onclick", `openPost(${index})`);
        await timeout (380);
        $(`#p_${index} .description`).css("opacity", 1);
    },
    hidePosts       : async () => {
        $(`.post`).css({transform: "scale(0)", opacity: 0});
    },
    makePostAppear  : async (i) => {
        $(`#p_${i}`).css({transform: "scale(0)", opacity: 0});
        await timeout(50);
        $(`#p_${i}`).css({transform: "scale(1)", opacity: 1});
    },
    scrollPhoto     : async (dir) => {
        let scroll = false;
        $(".leftImgBtn").attr("onclick", ""); $(".rightImgBtn").attr("onclick", "");

        setTimeout(() => {
            $(".leftImgBtn").attr("onclick", "view.scrollPhoto(-1)"); $(".rightImgBtn").attr("onclick", "view.scrollPhoto(1)");
        }, 500);

        if ((dir > 0 && view.currImage + 1 != $(".image").length) || (dir < 0 && view.currImage - 1 != -1)) {
            scroll = true;
        }

        if (scroll) {
            $(".image").each(function(i) {
                let offset = parseFloat($(this).css("left")) / window.innerHeight * 100;
                $(this).css("left", dir > 0 ? `${offset - view.offset}vh` : `${offset + view.offset}vh`);
            })
            view.currImage += dir;
        }
    },
    toggleCategory  : (index, enable) => {
        $(`#c_${index}`).removeClass(enable ? "outsideShadow"   : "insetShadow");
        $(`#c_${index}`).addClass   (enable ? "insetShadow"     : "outsideShadow");
        let font = enable ? "1.55vh" : "1.77vh";
        $(`#c_${index} p`).animate  ({ fontSize: font }, 200);
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
    closePostsView  : async () => {
        $("#postsView").css( {marginTop: "50%", height: 0} );
        await timeout(500);
    },
    openPostsView   : async () => {
        $("#postsView").css( {marginTop: "3.1%", height: "100%"} );
        await timeout(500);
    },
    disableCategories   : async () => {
        $(".category").addClass("disabledCategory");
        $(".category p").animate({fontSize: "1.77vh"}, 200);
    },
    enableCategories    : async () => {
        $(".category").removeClass("disabledCategory");
        $(".category p").animate({fontSize: "1.55vh"}, 200);
    },
    enableCategories    : async () => {
        $(".category").removeClass("disabledCategory");
        $(".category p").animate({fontSize: "1.55vh"}, 200);
    }
}