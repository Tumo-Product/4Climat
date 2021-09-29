let data, userData;
let categories, posts   = [];
let loading = false, editing = false;
let post                = { categories: [], longitude: -1, latitude: -1, title: "",  description: "", images: [] };
let currUid             = "1";
let postStage           = -1;
let filesToAdd          = [];
let myPostsActive       = false;
let categoriesStates    = [];
let postCount           = 0;
let postOpen            = -1;
let postImageNames = [], imagesToRemove = [];

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const onLoad = async () => {
    userData = await network.getUserPosts(currUid);
    data = await network.getPosts();
    data = data.data.data; userData = userData.data.data;
    for (let i = 0; i < data.length; i++)       { data[i].imageNames        = data[i].post.images;      }
    for (let i = 0; i < userData.length; i++)   { userData[i].imageNames    = userData[i].post.images;  }

    network.getNewToken();
    await addPosts();

    for (let i = 0; i < categories.length; i++) {
        view.addCategory(i, categories[i]);
        categoriesStates.push(false);
    }
    
    $(".popupContainer").click(function (e) {
        if (e.target !== this) return;
        view.closePopupContainer()
    });
    $("#search").keyup(function(event) {
        if (event.key === "Enter") {
            document.getElementById("searchBtn").click();
        }
    });
    $('#postsView').on('scroll', async function(e) {
        if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight && postOpen != -1) {
            let length = myPostsActive === true ? userData.length : data.length;
            if ($(".stage").length == 0 && !loading && postCount != length) {
                loading = true;
                $("#postsView").append(`
                    <div class="stage">
                        <div class="dot-bricks"></div>
                    </div>`
                );
                await timeout(2000);
                await addPosts(myPostsActive);
                loading = false;
                $(".stage").remove();
            }
        }
    });

    view.scrollToMiddle("#categories");
    view.resize();
    await timeout(100);
    view.toggleLoader();
}

const resetPosts = async () => {
    posts = [];
    postCount = 0;
    $(".post").remove();
}

const addPosts = async (userPosts) => {
    let dat = userPosts === true ? userData : data;
    let length = 10;
    
    if (length > dat.length) length = dat.length;
    for (let p = postCount; p < length; p++) {
        posts[p]        = dat[p].post;
        posts[p].date   = dat[p].date.substring(dat[p].date.indexOf(" ") + 1); // cut weekday from date

        let images      = await network.getImages(dat[p].pid, dat[p].imageNames, "small");
        posts[p].images = images;
    }

    if (postCount != length) {
        for (let i = 0; i < posts.length; i++) {
            view.addPost(i, posts[i].title, posts[i].date, posts[i].categories, posts[i].description, posts[i].images[0], dat[i].status);
        }
    }

    postCount = $(".post").length;
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
                console.log();
                if (regexp.test(posts[p].categories[c]) && !matches.includes(p)) {
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
        resetPosts();
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

const updatePost = async (status) => {
    await network.updatePost(userData[postOpen].pid, post, filesToAdd, imagesToRemove, status);
    await postView.postComplete();
    await discardPost();
}

const deletePost = async () => {
    imagesToRemove = userData[postOpen].imageNames;
    await network.deletePost(userData[postOpen].pid, imagesToRemove);
    await postView.postComplete();
    await discardPost();
}

const discardPost = async () => {
    $("#postsView").css("overflow", "auto");
    // await addPosts(myPostsActive);
    postView.enableDraftBtn();
    view.closePopupContainer();
    post = { categories: [], longitude: -1, latitude: -1, title: "",  description: "", mapLink: undefined, images: [] };
    postStage = -1; postOpen = -1;
    imagesToRemove = []; filesToAdd = [];
    await postView.discardPost();
    location.reload();
}

const openImage = async (i, imgIndex) => {
    let dat = myPostsActive ? userData : data;
    let pid = dat[i].pid;
    view.openLoading();
    let images  = await network.getImages(pid, dat[i].imageNames, "standard");
    view.openImage(images, imgIndex);
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

        if (parser.isTitleCorrect(post.title)) {
            postView.enableDraftBtn();
        }
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
        if (postOpen != -1 && editing && userData) {
            if (userData[postOpen].imageNames.length > 0) {
                postImageNames = userData[postOpen].imageNames;
            }
        }

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
        postView.addImage(filesToAdd.length - 1, basedat, "new");
    }

    if (post.images.length > 0) postView.enableBtn("right");
    else postView.disableBtn("right");
}

const removeImage = async (i, type) => {
    post.images.splice(i, 1);
    if (type == "new") {
        filesToAdd.splice(i, 1);
    } else if (postImageNames[i] !== undefined) {
        imagesToRemove.push(postImageNames[i]);
        postImageNames.splice(i, 1);
    }

    postView.removeImage(i);
    if (post.images.length > 0) postView.enableBtn("right");
    else                        postView.disableBtn("right");
}

const openPost = async (i) => {
    let mapSrc = parser.getMapLink(posts[i].longitude, posts[i].latitude);
    if (userData[i].status === "draft" && myPostsActive) {
        view.enableEditButton("editPost()");
    }
    await view.openPost(i, posts[i].categories, posts[i].images, mapSrc);
}

const closePost = async (i) => {
    view.disableEditButton();
    view.closePost(i, posts[i].categories);
}

const editPost = async () => {
    editing = true;
    post    = posts[postOpen];
    await addPost(1);
    resetPosts();
}

const toggleMyPosts = async () => {
    postCount = 0; postOpen = -1;
    if (!myPostsActive) {
        await view.closePostsView();
        view.disableCategories();
        resetPosts();
        await addPosts(true);
        await view.openPostsView();
    } else {
        await view.closePostsView();
        view.enableCategories();
        resetPosts();
        await addPosts();
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