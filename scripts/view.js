const view      = {
    loaderOpen  : true,
    maxSize     : {width: 900, height: 684},
    window      : {width: 0, height: 0},
    categories  : [],

    toggleLoader    : () => {
        view.loaderOpen = !view.loaderOpen;

        if (view.loaderOpen)    $("#loadingScreen").show();
        else                    $("#loadingScreen").hide();
    },
    makeMap         : (src, parent) => {
        $(parent).append(`<iframe class="map" src="${src}"></iframe>`);
    },
    addCategory     : (index, text) => {
        $("#categories").append(`
        <div id="c_${index}" class="category insetShadow" onclick="toggleCategory(${index})">
            <p>#${text}</p><div class="inside"></div>
        </div>`);

        view.categories.push(false);
    },
    addPost         : (title, date, category, description, img) => {
        $("#postsView").append(`
        <div class="post">
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
            <div class="leftButton"></div>
            <div class="rightButton"></div>
        `);
        
        $(".leftButton").append (`<div class="button"><div class="inside"></div><img src="icons/left.svg"></div>`);
        $(".rightButton").append(`<div class="button"><div class="inside"></div><img src="icons/right.svg"></div>`);
    },
    toggleCategory  : (index) => {
        if (view.categories[index]) {
            $(`#c_${index}`).removeClass("outsideShadow");
            $(`#c_${index}`).addClass   ("insetShadow");
            $(`#c_${index} p`).animate  ({ fontSize: "-=2" }, 200);
        } else {
            $(`#c_${index}`).removeClass("insetShadow");
            $(`#c_${index}`).addClass   ("outsideShadow");
            $(`#c_${index} p`).animate  ({ fontSize: "+=2" }, 200);
        }

        view.categories[index] = !view.categories[index];
    },
    scrollToMiddle  : (elem) => {
        $(elem).scrollTop($(elem).width() / 2);
    },
    resize          : () => {
        $(".subContainer").css("width", parseFloat($(".subContainer").height()) * 1.1);

        $(window).resize(function() {
            $(".subContainer").css("width", parseFloat($(".subContainer").height()) * 1.1);
        });
    },
}