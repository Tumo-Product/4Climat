let categories, posts;

const onLoad = async () => {
    posts       = await network.getPosts();
    categories  = await network.getCategories();

    for (let i = 0; i < posts.length; i++) {
        let src = parser.getMapLink(posts[i].longitude, posts[i].latitude, "fr");
        view.makeMap(src, "body");
    }

    view.toggleLoader();
}

$(onLoad);