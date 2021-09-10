let categories, posts;
let post = { images: [] }, currMapLink;

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
            await postHandlers.handleMap();
            break;
        case 3:
            await postHandlers.handleDescription();
            break;
        case 4:
            await postHandlers.handleImages();
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
    handleMap: async () => {
        let mapLink = await postView.setupMapView();

        mapLink.on("input", async function() {
            if (parser.isURLValid($(this).val())) {
                currMapLink = $(this).val();
                postView.enableRightBtn();

                let mapCoords = parser.getCoords(currMapLink);
                let mapEmbed  = parser.getMapLink(mapCoords.longitude, mapCoords.latitude);
                await postView.addPostMap(mapEmbed);
            } else {
                postView.disableRightBtn();
                await postView.removePostMap();
            }
        });
    },
    handleDescription: async () => {
        let description = await postView.setupDescriptionView();
        
        description.on("input", async function() {
            if (parser.isDescriptionCorrect($(this).val())) {
                postView.enableRightBtn();
            } else {
                postView.disableRightBtn();
            }
        });
    },
    handleImages: async () => {
        if (post.images.length == 6) return;
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
    }
}

const clickDownloadInput = async () => {
    document.getElementById("downloadInput").click();
}

const addImage = async (src) => {
    if (post.images.length == 6) return;
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

    post.images.push(basedat);
    postView.addImage(post.images.length - 1, basedat);
}

const removeImage = async (i) => {
    post.images.splice(i, 1);
    postView.removeImage(i);
}

const openPost = async (i) => {
    let mapSrc = parser.getMapLink(posts[i].longitude, posts[i].latitude);
    view.openPost(i, posts[i].categories, posts[i].photos, mapSrc);
}

$(onLoad);