const network   = {
    idExists        : async(id) => {

    },

    getNewToken        : async () => {
        
    },

    createPost         : async (post, files, status) => {
        let imageNames = [];
        for (let i = 0; i < filesToAdd.length; i++) {
            let type = filesToAdd[i].type.substring(filesToAdd[i].type.indexOf('/') + 1);
            imageNames.push(generateHash(i) + `.${type}`);
        }

        post.images         = imageNames;
        let postString      = JSON.stringify(post);
        let renamedFiles    = await network.renameFiles(files, imageNames);
        let request         = await axios.post(config.createPost, {uid: currUid, post: postString, status: status});
        console.log(request);
        
        if (files.length !== 0)
            await network.addImages(renamedFiles, request.data.data.pid);
    },

    renameFiles         : async (files, fileNames) => {
        let finalFiles = [];

        for (let i = 0; i < files.length; i++) {
            let blob = files[i].slice(0, files[i].size, files[i].type);
            finalFiles.push(new File([blob], fileNames[i], {type: files[0].type}));
        }

        return finalFiles;
    },

    addImages       : async (files, pid) => {
        let formData = new FormData();
        formData.append("pid", pid);

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }

        let request = await axios.post(config.uploadImages, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    getPosts        : async () => {
        return await axios.post(config.listPosts);
        return allPosts;
    },

    getUserPosts        : async (uid) => {
        return await axios.post(config.userListPosts, {uid: uid});
        return allPosts;
    },

    getCategories   : async () => {
        return [
            "Category 1",
            "Category 2",
            "Category 3 ………………………",
            "Category 4",
            "Category 5 ………………………",
        ];
    },

    getImages      : async (pid, images, size) => {
        let imagesData = await axios.post(config.getImages, {pid: pid, images: JSON.stringify(images), type: size});
        if (imagesData.data.data === null) return [];

        let currImages = imagesData.data.data.images;
        for (let i = 0; i < currImages.length; i++) {
            currImages[i] = "data:image/*;base64," + currImages[i];
        }
        return currImages;
    }
}

// VVVVVVVV Dummy Data VVVVVVVVV

const allPosts = [
    {
        postId      : "",
        userId      : "1",
        categories  : [
            "Category 1",
            "Category 2"
        ],
        latitude: 40.1851133,
        longitude: 44.5057693,
        title       : "Recycling plastic bottles bla bla bla bla bla bla",
        date        : "29 Sep 2021",
        description : "Have you noticed how everybody takes it for granted a bad experience is automatically, unreservedly, unremittingly bad? That nothing good could ever come from a bad childhood, for example? I’m hearing the comment more and more often that we have become a victim society. Maybe this is true? Consider… Don’t we hear these comments a lot? I was mistreated when I was a child… I was a lonely latchkey kid… My ancestors got a bad break, so I’m… I lived in a poor, disadvantaged family… I grew up in a broken home… I didn’t get the proper advantages… I was constantly criticized as a child…",
        images      : [
            `images/1.jpeg`,
            `images/2.jpeg`,
            `images/3.jpeg`,
        ],
        mapLink     : "https://www.google.com/maps/place/Haypost/@40.1851133,44.5057693,20z/data=!4m5!3m4!1s0x406abd02e04e1d49:0x3ddb3c7640fddd71!8m2!3d40.1848816!4d44.5055428"
    },
    {
        categories  : [
            "Category 3 ………………………",
            "Category 1"
        ],
        longitude   : 44.4325385,
        latitude    : 40.2122591,
        title       : "Recycling clothes",
        date        : "28 Sep 2021",
        description : "Have you noticed how everybody takes it for granted a bad experience is automatically, unreservedly, unremittingly bad? That nothing good could ever come from a bad childhood, for example? I’m hearing the comment more and more often that we have become a victim society. Maybe this is true? Consider… Don’t we hear these comments a lot? I was mistreated when I was a child… I was a lonely latchkey kid… My ancestors got a bad break, so I’m… I lived in a poor, disadvantaged family… I grew up in a broken home… I didn’t get the proper advantages… I was constantly criticized as a child…",
        images      : [
            `images/2.jpeg`
        ],
    },
    {
        categories  : [
            "Category 4"
        ],
        longitude   : 44.4325385,
        latitude    : 40.2122591,
        title       : "Recycling clothes",
        date        : "28 Sep 2021",
        description : "Have you noticed how everybody takes it for granted a bad experience is automatically, unreservedly, unremittingly bad? That nothing good could ever come from a bad childhood, for example? I’m hearing the comment more and more often that we have become a victim society. Maybe this is true? Consider… Don’t we hear these comments a lot? I was mistreated when I was a child… I was a lonely latchkey kid… My ancestors got a bad break, so I’m… I lived in a poor, disadvantaged family… I grew up in a broken home… I didn’t get the proper advantages… I was constantly criticized as a child…",
        images      : [
            `images/3.jpeg`
        ],
    },
    {
        categories  : [
            "Category 4"
        ],
        longitude   : 44.4325385,
        latitude    : 40.2122591,
        title       : "Recycling clothes",
        date        : "28 Sep 2021",
        description : "Have you noticed how everybody takes it for granted a bad experience is automatically, unreservedly, unremittingly bad? That nothing good could ever come from a bad childhood, for example? I’m hearing the comment more and more often that we have become a victim society. Maybe this is true? Consider… Don’t we hear these comments a lot? I was mistreated when I was a child… I was a lonely latchkey kid… My ancestors got a bad break, so I’m… I lived in a poor, disadvantaged family… I grew up in a broken home… I didn’t get the proper advantages… I was constantly criticized as a child…",
        images      : [
            `images/1.jpeg`
        ],
    },
    {
        categories  : [
            "Category 4"
        ],
        longitude   : 44.4325385,
        latitude    : 40.2122591,
        title       : "Recycling clothes",
        date        : "28 Sep 2021",
        description : "Have you noticed how everybody takes it for granted a bad experience is automatically, unreservedly, unremittingly bad? That nothing good could ever come from a bad childhood, for example? I’m hearing the comment more and more often that we have become a victim society. Maybe this is true? Consider… Don’t we hear these comments a lot? I was mistreated when I was a child… I was a lonely latchkey kid… My ancestors got a bad break, so I’m… I lived in a poor, disadvantaged family… I grew up in a broken home… I didn’t get the proper advantages… I was constantly criticized as a child…",
        images      : [
            `images/2.jpeg`
        ],
    },
    {
        categories  : [
            "Category 4"
        ],
        longitude   : 44.4325385,
        latitude    : 40.2122591,
        title       : "Recycling clothes",
        date        : "28 Sep 2021",
        description : "Have you noticed how everybody takes it for granted a bad experience is automatically, unreservedly, unremittingly bad? That nothing good could ever come from a bad childhood, for example? I’m hearing the comment more and more often that we have become a victim society. Maybe this is true? Consider… Don’t we hear these comments a lot? I was mistreated when I was a child… I was a lonely latchkey kid… My ancestors got a bad break, so I’m… I lived in a poor, disadvantaged family… I grew up in a broken home… I didn’t get the proper advantages… I was constantly criticized as a child…",
        images      : [
            `images/3.jpeg`
        ],
    },
    {
        categories  : [
            "Category 4"
        ],
        longitude   : 44.4325385,
        latitude    : 40.2122591,
        title       : "Recycling clothes",
        date        : "28 Sep 2021",
        description : "Have you noticed how everybody takes it for granted a bad experience is automatically, unreservedly, unremittingly bad? That nothing good could ever come from a bad childhood, for example? I’m hearing the comment more and more often that we have become a victim society. Maybe this is true? Consider… Don’t we hear these comments a lot? I was mistreated when I was a child… I was a lonely latchkey kid… My ancestors got a bad break, so I’m… I lived in a poor, disadvantaged family… I grew up in a broken home… I didn’t get the proper advantages… I was constantly criticized as a child…",
        images      : [
            `images/1.jpeg`
        ],
    },
    {
        categories  : [
            "Category 4"
        ],
        longitude   : 44.4325385,
        latitude    : 40.2122591,
        title       : "Recycling clothes",
        date        : "28 Sep 2021",
        description : "Have you noticed how everybody takes it for granted a bad experience is automatically, unreservedly, unremittingly bad? That nothing good could ever come from a bad childhood, for example? I’m hearing the comment more and more often that we have become a victim society. Maybe this is true? Consider… Don’t we hear these comments a lot? I was mistreated when I was a child… I was a lonely latchkey kid… My ancestors got a bad break, so I’m… I lived in a poor, disadvantaged family… I grew up in a broken home… I didn’t get the proper advantages… I was constantly criticized as a child…",
        images      : [
            `images/2.jpeg`
        ],
    },
]