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
    addPost         : (index, title, date, categories, description, img) => {
        $("#postsView").append(`
        <div onclick="openPost(${index})" id="p_${index}" class="post">
            <div class="content">
                <p class="title">${title}</p>
                <div class="spanDiv">
                    <span class="date">${date}</span>
                </div>
                <p class="description">${description}</p>
            </div>
            <div class="picture">
                <img src="${img}">
            </div>
        </div>`);

        for (let i = 0; i < categories.length; i++) {
            $(`#p_${index} .spanDiv`).append(`<span class="postCategory">${categories[i]}</span>`);
        }
    },
    
    openPost        : async (index, categories, photos, mapSrc) => {
        $(`#p_${index}`).attr("onclick", "");
        
        let marginTop   = parseFloat($(`#p_${index}`).css("margin-top"));
        let postHeight  = parseFloat($(`#p_${index}`).height());
        let scrollPos   = postHeight * index + 5;
        if (index != 0) scrollPos += index * marginTop;

        $(`#p_${index} .picture`).css("height", $(`#p_${index} .picture`).height());
        $("#postsView").css("overflow", "hidden");
        $(`#p_${index}`).addClass("openedPost");
        $("#postsView").animate({scrollTop: scrollPos}, 500);
        let titleFontSize = parser.getCorrectFontSize($(`#p_${index} .title`).text().length);
        $(`#p_${index} .title`).animate({"font-size": `${titleFontSize}vh`}, 500);

        await timeout(300);
        $(`#p_${index} .description`).before(`
            <div class="imgMapView">
                <img onclick="view.scrollPhoto(-1)" class="leftImgBtn"    src="icons/thin_arrow.svg">
                <div class="imageView"></div>
                <img onclick="view.scrollPhoto(1)" class="rightImgBtn"   src="icons/thin_arrow.svg">
                <div class="mapContainer"></div>
            </div>
        `);

        $(`#p_${index} .description`).css("opacity", 0);

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
        $(`#p_${index} .description`).css("opacity", 1);

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
        $(`#p_${index}`).append(`<div class="minimize" onclick="closePost(${index})">
            <div class="inside"></div><img src="icons/minimize.png">
        </div>`);
        await timeout(100);
         $(".minimize").css("opacity", 1);
    },
    closePost       : async (index, categories) => {
        $(`#p_${index}`).removeClass("openedPost");
        $(`#p_${index} .imgMapView`).css("height", 0);
        setTimeout(() => {
            $(".imgMapView").remove();
        }, 500);
        $(`#p_${index} .title`).animate({ "font-size": "2.77vh" }, 500);
        $(`#p_${index} .minimize`).css({"opacity": 0, "pointer-events": "none"});
        $(".picture").css("height", "90.13%");
        await timeout(100);

        $(`#p_${index} .date`).clone().appendTo(`#p_${index} .spanDiv`);
        $(`#p_${index} .spanDiv .date`).removeClass("openedDate");
        $(".openedDate").remove();
        $(`#p_${index} .spanDiv .card`).remove();
        
        $(`#p_${index} .spanDiv`).removeClass("openCategories");
        for (let i = 0; i < categories.length; i++) {
            $(`#p_${index} .spanDiv`).append(`<span class="postCategory">${categories[i]}</span>`);
        }

        $("#postsView").css("overflow", "auto");
        $(`#p_${index}`).attr("onclick", `openPost(${index})`);
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
    toggleCategory  : (index) => {
        $(`#c_${index}`).removeClass(view.categories[index] ? "outsideShadow"   : "insetShadow");
        $(`#c_${index}`).addClass   (view.categories[index] ? "insetShadow"     : "outsideShadow");
        let font = view.categories[index] ? "1.55vh" : "1.77vh";
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
    }
}