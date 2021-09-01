let categories, posts;

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

const addPost = async (index) => {
    await view.setupPostView(index);
}

const openPost = async (i) => {
    let postCategories  = posts[i].categories;
    let mapSrc          = parser.getMapLink(posts[i].longitude, posts[i].latitude);
    view.openPost(i, postCategories, mapSrc);
}

$(onLoad);