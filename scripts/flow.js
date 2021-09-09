let categories, posts;
let post, currMapLink;

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const onLoad = async () => {
    posts       = await network.getPosts();
    categories  = await network.getCategories();

    for (let i = 0; i < posts.length; i++) {
        let src = parser.getMapLink(posts[i].longitude, posts[i].latitude, "us");
        // view.makeMap(src, ".card");
        view.addPost(i, posts[i].title, posts[i].date, posts[i].categories[0], posts[i].description, posts[i].photos[0]);
    }

    for (let i = 0; i < categories.length; i++) {
        view.addCategory(i, categories[i]);
    }

    view.scrollToMiddle("#categories");
    view.resize();
    view.toggleLoader();
}

const toggleCategory = async (index) => {
    view.toggleCategory(index);
}

const login = async () => {
    let id = $("#id").val();

    if (id === "" || !network.idExists(id)) {
        // warning
        view.toggleLoader();
        return;
    }

    if ($("#token").val() === await network.getNewToken(id)) {
        
    }

    view.toggleLoader();
}

const addPost = async (stage) => {
    switch (stage) {
        case 0:
            await postHandlers.handleTitle();
            break;
        case 1:
            await postView.setupCategoryView();
            break;
        case 2:
            await postHandlers.handleMapLink();
            break;
        case 3:
            await postHandlers.handleMap();
            break;
        default:
            break;
    }
}

const postHandlers = {
    handleTitle:  async () => {
        let titleInput = await postView.setupTitleView();
    
        titleInput.on('input', function() {
            if (parser.isTitleCorrect($(this).val())) {
                postView.enableRightBtn();
            } else {
                postView.disableRightBtn();
            }
        });
    },
    handleMapLink: async () => {
        let mapLink = await postView.setupMapLinkView();

        mapLink.on('input', function() {
            if (parser.isURLValid($(this).val())) {
                currMapLink = $(this).val();
                postView.enableRightBtn();
            } else {
                postView.disableRightBtn();
            }
        });
    },
    handleMap: async () => {
        console.log(currMapLink);
        let mapCoords = parser.getCoords(currMapLink);
        let mapEmbed  = parser.getMapLink(mapCoords.longitude, mapCoords.latitude);
        await postView.setupMapView(mapEmbed);
    }
}

const openPost = async (i) => {
    let mapSrc = parser.getMapLink(posts[i].longitude, posts[i].latitude);
    view.openPost(i, posts[i].categories, posts[i].photos, mapSrc);
}

$(onLoad);