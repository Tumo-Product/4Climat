let categories, posts   = [];
let data;
let post                = { categories: [], longitude: -1, latitude: -1, title: "",  description: "", images: [] };
let currUid             = "1";
let postStage           = -1;
let filesToAdd          = [];
let myPostsActive       = false;
let categoriesStates    = [];

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const onLoad = async () => {
    categories  = await network.getCategories();
    let token   = await axios.put(config.generateToken, { uid: currUid });
    token       = token.data.data;
    let allowed = await axios.post(config.login, {uid: token.uid, token: token.token});
    console.log(token, allowed);

    await fillPosts();

    for (let i = 0; i < categories.length; i++) {
        view.addCategory(i, categories[i]);
        categoriesStates.push(false);
    }
    
    $(".popupContainer").click(function (e) {
        if (e.target !== this) return;
        view.closePopupContainer()
    });

    view.scrollToMiddle("#categories");
    view.resize();
    await timeout(100);
    view.toggleLoader();
}

const fillPosts = async (userPosts) => {
    data = undefined; posts = []; // reset
    $(".post").remove();

    if (userPosts === true) {
        data = await network.getUserPosts(currUid);
    } else {
        data = await network.getPosts();
    }
    data    = data.data.data;
    for (let p = 0; p < data.length; p++) {
        posts[p]        = data[p].post;
        posts[p].date   = data[p].date.substring(data[p].date.indexOf(" ") + 1); // cut weekday from date

        let images = await network.getImages(data[p].pid, posts[p].images, "small");
        data[p].images = posts[p].images;
        posts[p].images = images;
    }

    for (let i = 0; i < posts.length; i++) {
        view.addPost(i, posts[i].title, posts[i].date, posts[i].categories, posts[i].description, posts[i].images[0]);
    }
}

const toggleCategory = async (index) => {
    view.toggleCategory(index, categoriesStates[index]);
    categoriesStates[index] = !categoriesStates[index];

    let queries = [], matches = [];
    for (let i = 0; i < categoriesStates.length; i++) {
        if (categoriesStates[i] === true) {
            queries.push(categories[i]);
        }
    }

    view.hidePosts();
    setTimeout(() => {
        $(".post").remove();

        for (let i = 0; i < matches.length; i++) {
            let post = posts[matches[i]];
            view.addPost(i, post.title, post.date, post.categories, post.description, post.images[0]);
            view.makePostAppear(i);
        }
    }, 500);

    if (!categoriesStates.includes(true)) {
        for (let i = 0; i < posts.length; i++) { matches[i] = i;}
        return;
    }
    for (let q = 0; q < queries.length; q++) {
        for (let p = 0; p < posts.length; p++) {
            let regexp = new RegExp(`${queries[q]}`, "i");
            
            for (let c = 0; c < posts[p].categories.length; c++) {
                if (regexp.test(posts[p].categories[c])) {
                    matches.push(p);
                    continue;
                }
            }
        }
    }
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

const addPost = async (dir) => {
    if (postStage == -1) {
        await postView.firstSetup();
    }
    else {
        await postView.closeStage(postStage);
    }

    postStage += dir;
    $("#currentStage").text(postStage + 1);

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

const publishPost = async () => {
    await network.createPost(post, filesToAdd, 'published');
    await postView.postComplete();
    await discardPost();
}

const saveDraft = async () => {
    await network.createPost(post, filesToAdd, 'draft');
    await postView.postComplete();
    await discardPost();
}

const discardPost = async () => {
    view.closePopupContainer();
    post = { categories: [], longitude: -1, latitude: -1, title: "",  description: "", mapLink: undefined, images: [] };
    postStage = -1; filesToAdd = [];
    await fillPosts();
    await postView.discardPost();
}

const openImage = async (i, imageIndex) => {
    let pid     = data[i].pid;
    view.openLoading();
    let images  = await network.getImages(pid, [data[i].images[imageIndex]], "standard");
    view.openImage(images[0]);
}

const postHandlers = {
    handleTitle:  async () => {
        postView.disableBtn("left");
        let titleInput = await postView.setupTitleView(post.title);
    
        titleInput.on('input', function() {
            if (parser.isTitleCorrect($(this).val())) {
                postView.enableBtn("right");
                post.title = $(this).val();
                postView.enableDraftBtn();
            } else {
                postView.disableBtn("right");
                postView.disableDraftBtn();
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

        let mapInput = await postView.setupMapView();
        mapInput.on("input", async function() {
            if (parser.isURLValid($(this).val())) {
                postView.enableBtn("right");

                post.mapLink    = $(this).val();
                let mapCoords   = parser.getCoords(post.mapLink);
                let mapEmbed    = parser.getMapLink(mapCoords.longitude, mapCoords.latitude);
                post.longitude  = mapCoords.longitude;
                post.latitude   = mapCoords.latitude;
                await postView.addPostMap(mapEmbed);
            } else {
                post.mapLink    = undefined;
                postView.disableBtn("right");
                await postView.removePostMap();
            }
        });

        if (post.mapLink !== undefined) {
            mapInput.val(post.mapLink);
            let mapCoords = parser.getCoords(post.mapLink);
            let mapEmbed  = parser.getMapLink(mapCoords.longitude, mapCoords.latitude);
            await postView.addPostMap(mapEmbed);
            postView.enableBtn("right");
        }
    },
    handleDescription: async () => {
        let description = await postView.setupDescriptionView(post.description, 600);
        
        description.on("input", async function() {
            $("#charCount").text($(this).val().length);

            if (parser.isDescriptionCorrect($(this).val())) {
                postView.enableBtn("right");
                post.description = $(this).val();
            } else {
                postView.disableBtn("right");
            }
        });
    },
    handleImages: async () => {
        if (post.images.length == 6) return;
        let downloadInput = await postView.setupImageView(post.images);

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
                    let files = dataTransfer.files;
                    if(files[0] === undefined) { return; }
                    for (let i = 0; i < files.length; i++) {
                        if (!files[i].type.includes("image")) { files = []; break; }
                    }
                    
                    addImage(files);
                }
            }
        });
    },
    handleFinalView : async () => {
        let mapEmbed  = parser.getMapLink(post.longitude, post.latitude);
        await postView.setupPreview(post, mapEmbed);
    }
}

const addImage = async (dragFiles) => {
    if (post.images.length == 6) return;
    let basedat;

    let input   = document.getElementById("downloadInput");
    let files   = input.files;
    if (dragFiles !== undefined) files = dragFiles;

    if(files[0] === undefined) { return; }

    for (let i = 0; i < files.length; i++) {
        if (!files[i].type.includes("image")) continue;

        let fr  = new FileReader();
        basedat = await (new Promise((resolve)=>{
            fr.readAsDataURL(files[i]);
            fr.onloadend = () => { resolve(fr.result); }
        }));

        post.images.push(basedat);
        filesToAdd.push(files[i]);
        postView.addImage(post.images.length - 1, basedat);
    }

    if (post.images.length > 0) postView.enableBtn("right");
    else                        postView.disableBtn("right");
}

const removeImage = async (i) => {
    post.images.splice(i, 1);
    filesToAdd.splice(i, 1);
    postView.removeImage(i);

    if (post.images.length > 0) postView.enableBtn("right");
    else                        postView.disableBtn("right");
}

const openPost = async (i) => {
    let mapSrc = parser.getMapLink(posts[i].longitude, posts[i].latitude);
    await view.openPost(i, posts[i].categories, posts[i].images, mapSrc);

    $(`#p_${i} .image`).unbind();
    $(`#p_${i} .image`).click(function () {
        openImage(i, $(this).index());
    });
}

const closePost = async (i) => {
    view.closePost(i, posts[i].categories);
}

const toggleMyPosts = async () => {
    if (!myPostsActive) {
        await view.closePostsView();
        view.disableCategories();
        await fillPosts(true);
        await view.openPostsView();
    } else {
        await view.closePostsView();
        view.enableCategories();
        await fillPosts();
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
            view.addPost(i, post.title, post.date, post.categories, post.description, post.images[0]);
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