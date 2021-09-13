let categories, posts;
let postStage = -1;
let post = { categories: [], longitude: -1, latitude: -1, title: "", date: "", description: "", photos: [] };
let currMapLink;

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const onLoad = async () => {
    posts       = await network.getPosts();
    categories  = await network.getCategories();

    for (let i = 0; i < posts.length; i++) {
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

const addPost = async (dir) => {
    if (postStage == -1) await postView.firstSetup();
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
                currMapLink = $(this).val();
                postView.enableBtn("right");

                let mapCoords = parser.getCoords(currMapLink);
                let mapEmbed  = parser.getMapLink(mapCoords.longitude, mapCoords.latitude);
                post.longitude = mapCoords.longitude;
                post.latitude = mapCoords.latitude;
                await postView.addPostMap(mapEmbed);
            } else {
                postView.disableBtn("right");
                await postView.removePostMap();
            }
        });
    },
    handleDescription: async () => {
        let description = await postView.setupDescriptionView();
        
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
        let downloadInput = await postView.setupImageView();

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

$(onLoad);