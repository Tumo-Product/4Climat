let categories, posts;
let myPostsActive = false;
let postStage = -1;
let post = { categories: [], longitude: -1, latitude: -1, title: "", date: "", description: "", photos: [] };
let currMapLink, currUserId = 1;

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let examplePost = [
    {
        categories  : [
            "Category 1",
            "Category 2"
        ],
        latitude: 44.4937761,
        longitude: 40.1979479,
        title       : "Recycling plastic bottles bla bla bla bla bla bla",
        description : "Example description",
        photos      : [
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAKCAYAAADCb8xtAAAAAXNSR0IArs4c6QAAAKBJREFUOBHN1LENwjAQheH3bgSokNiBFbIDu6ROzSJU7MAK7ICUCkbg8I8i0Vhpcy7Plvz5bD+rjddtOn5SF1lDZh6obT1sz0rdwxr35+npBflI5W5rXG9/y++GPQWdrIoEjg1jcN29k5SqNWNUeZNrjcEYawsqzcXvd1USdSwYgwjozNUqEVPkFBFQS/bXLPE0BmFKTrXCtdIzwIIJG8Yvp300Z1a2OaoAAAAASUVORK5CYII="
        ]
    },
]

const onLoad = async () => {
    posts       = await network.getPosts();
    categories  = await network.getCategories();

    let data = await axios.put(config.generate_token, { uid: currUserId });
    data = data.data.data;
    console.log(data);
    let allowed = await axios.post(config.login, {uid: data.uid, token: data.token});
    console.log(allowed);

    for (let i = 0; i < posts.length; i++) {
        view.addPost(i, posts[i].title, posts[i].date, posts[i].categories, posts[i].description, posts[i].photos[0]);
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

const discardPost = async () => {
    postStage = -1;
    await postView.discardPost();
}

const addPost = async (dir) => {
    if (postStage == -1) {
        await postView.firstSetup();
        currMapLink = parser.getMapLink(post.longitude, post.latitude);
    }
    else {
        await postView.closeStage(postStage);
    }

    postStage += dir;

    switch (postStage) {
        case 0:
            await postHandlers.handleTitle();
            break;
        case 1:
            await postHandlers.handleCategories();
            break;
        case 2:
            await postHandlers.handleMap();
            break;
        case 3:
            await postHandlers.handleDescription();
            break;
        case 4:
            await postHandlers.handleImages();
            break;
        case 5:
            await postHandlers.handleFinalView();
            break;
        default:
            break;
    }
}

completePost = async () => {

}

const postHandlers = {
    handleTitle:  async () => {
        postView.disableBtn("left");
        let titleInput = await postView.setupTitleView(post.title);
    
        titleInput.on('input', function() {
            if (parser.isTitleCorrect($(this).val())) {
                postView.enableBtn("right");
                post.title = $(this).val();
            } else {
                postView.disableBtn("right");
            }
        });
    },
    addCategory : async (i) => {
        post.categories.push(categories[i]);
        postView.addCategory(i);
    },
    removeCategory : async (i) => {
        post.categories.splice(post.categories.indexOf(categories[i]), 1);
        postView.removeCategory(i);
    },
    handleCategories : async() => {
        postView.enableBtn("left");
        await postView.setupCategoryView(post.categories);
    },
    handleMap: async () => {
        $(".categoriesInPost").children().each(function() {
            post.categories.push($(this).find("p").text());
        });

        let mapLink = await postView.setupMapView();

        mapLink.on("input", async function() {
            if (parser.isURLValid($(this).val())) {
                postView.enableBtn("right");

                let mapCoords = parser.getCoords(currMapLink);
                let mapEmbed  = parser.getMapLink(mapCoords.longitude, mapCoords.latitude);
                post.longitude = mapCoords.longitude;
                post.latitude = mapCoords.latitude;
                await postView.addPostMap(mapEmbed);
                currMapLink = $(this).val();
            } else {
                postView.disableBtn("right");
                await postView.removePostMap();
            }
        });

        if (currMapLink !== undefined) {
            mapLink.val(currMapLink);
            let mapCoords = parser.getCoords(currMapLink);
            let mapEmbed  = parser.getMapLink(mapCoords.longitude, mapCoords.latitude);
            await postView.addPostMap(mapEmbed);
            postView.enableBtn("right");
        }
    },
    handleDescription: async () => {
        let description = await postView.setupDescriptionView(post.description);
        
        description.on("input", async function() {
            if (parser.isDescriptionCorrect($(this).val())) {
                postView.enableBtn("right");
                post.description = $(this).val();
            } else {
                postView.disableBtn("right");
            }
        });
    },
    handleImages: async () => {
        if (post.photos.length == 6) return;
        let downloadInput = await postView.setupImageView(post.photos);

        downloadInput.on({      // Drag and drop images.
            'dragover dragenter': function (e) {
                e.preventDefault();
                e.stopPropagation();
            },
            'drop': async function (e) {
                let dataTransfer = e.originalEvent.dataTransfer;

                if (dataTransfer && dataTransfer.files.length) {
                    e.preventDefault();
                    e.stopPropagation();
                    let file = dataTransfer.files[0];
                    if (!file.type.includes("image")) return;
                
                    let fr      = new FileReader();
                    let basedat = await (new Promise((resolve)=>{
                        fr.readAsDataURL(file);
                        fr.onloadend = () => {
                            resolve(fr.result);
                        }
                    }));

                    addImage(basedat);
                }
            }
        });
    },
    handleFinalView : async () => {
        let mapEmbed  = parser.getMapLink(post.longitude, post.latitude);
        await postView.setupPreview(post, mapEmbed);
    }
}

const addImage = async (src) => {
    if (post.photos.length == 6) return;
    let basedat;

    if (src === undefined) { // If it's undefined that means this function is being called by the download input.
        let input   = document.getElementById("downloadInput");
        let file    = input.files[0];

        if(file === undefined) { return; } // maybe some popup warning?

        let fr      = new FileReader();
        basedat = await (new Promise((resolve)=>{
            fr.readAsDataURL(file);
            fr.onloadend = () => {
                resolve(fr.result);
            }
        }));
    } else {                // If not then drag and drop is supllying it with a image.
        basedat = src;
    }

    post.photos.push(basedat);
    postView.addImage(post.photos.length - 1, basedat);

    if (post.photos.length > 0) postView.enableBtn("right");
    else                        postView.disableBtn("right");
}

const removeImage = async (i) => {
    post.photos.splice(i, 1);
    postView.removeImage(i);

    if (post.photos.length > 0) postView.enableBtn("right");
    else                        postView.disableBtn("right");
}

const openPost = async (i) => {
    let mapSrc = parser.getMapLink(posts[i].longitude, posts[i].latitude);
    view.openPost(i, posts[i].categories, posts[i].photos, mapSrc);
}

const closePost = async (i) => {
    view.closePost(i, posts[i].categories);
}

const toggleMyPosts = async () => {
    if (!myPostsActive) {
        setTimeout(() => {
            for (let i = 0; i < posts.length; i++) {
                $(".post").remove();

                for (let i = 0; i < posts.length; i++) {
                    if (posts[i].userId == currUserId) {
                        view.addPost(i, posts[i].title, posts[i].date, posts[i].categories,
                            posts[i].description, posts[i].photos[0]);
                    }
                }
            }    
        }, 500);

        await view.closePostsView();
        view.disableCategories();
        await view.openPostsView();
    } else {
        setTimeout(() => {
            for (let i = 0; i < posts.length; i++) {
                $(".post").remove();
                
                for (let i = 0; i < posts.length; i++) {
                    view.addPost(i, posts[i].title, posts[i].date, posts[i].categories, posts[i].description, posts[i].photos[0]);
                }
            }
        }, 500);

        await view.closePostsView();
        view.enableCategories();
        await view.openPostsView();
    }

    myPostsActive = !myPostsActive;
}

const search = async () => {
    let query = $("#search").val();
    let matches = [];

    view.hidePosts();
    setTimeout(() => {
        $(".post").remove();

        for (let i = 0; i < matches.length; i++) {
            let post = posts[matches[i]];
            view.addPost(i, post.title, post.date, post.categories, post.description, post.photos[0]);
            view.makePostAppear(i);
        }
    }, 500);

    for (let i = 0; i < posts.length; i++) {
        let regexp = new RegExp(`${query}`, "i");
        if (regexp.test(posts[i].title)) {
            matches.push(i);
            continue;
        } else if (regexp.test(posts[i].description)) {
            matches.push(i);
            continue;
        } else {
            for (let c = 0; c < posts[i].categories.length; c++) {
                if (regexp.test(posts[i].categories[c])) {
                    matches.push(i);
                    continue;
                }
            }
        }
    }
}

$(onLoad);