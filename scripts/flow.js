let categories, posts;

const onLoad = async () => {
    posts       = await network.getPosts();
    categories  = await network.getCategories();

    for (let i = 0; i < posts.length; i++) {
        let src = parser.getMapLink(posts[i].longitude, posts[i].latitude, "us");
        // view.makeMap(src, ".card");
    }

    view.toggleLoader();
}

const login = async () => {
    view.toggleLoader();

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

$(onLoad);