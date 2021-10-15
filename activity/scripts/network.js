const network   = {
    getNewToken         : async () => {
        categories  = await network.getCategories();
        let token   = await axios.put(config.users, { uid: currUid });
        token       = token.data.data;
        let allowed = await axios.post(config.users, {uid: token.uid, token: token.token});
        console.log(token, allowed);
    },

    deletePost          : async (pid, images) => {
        if (images.length > 0) {
            await network.removeImages(images, pid);
        }

        let request = await axios.post(config.removePost, {uid: currUid, pid: pid});
    },

    updatePost          : async (pid, post, files, filesToRemove, status) => {
        let imageNames  = [];
        for (let i = 0; i < filesToAdd.length; i++) {
            let type = filesToAdd[i].type.substring(filesToAdd[i].type.indexOf('/') + 1);
            imageNames.push(generateHash(i) + `.${type}`);
        }

        post.images         = imageNames;
        for (let i = 0; i < filesToRemove.length; i++) {
            post.images.push(filesToRemove[i]);
        }

        let postString      = JSON.stringify(post);
        let renamedFiles    = await network.renameFiles(files, imageNames);
        let request         = await axios.post(config.updatePost, {uid: currUid, pid: pid, post: postString, status: status});

        if (files.length > 0)
            await network.addImages(renamedFiles, pid);
        if (filesToRemove.length > 0) {
            await network.removeImages(filesToRemove, pid);
        }
        
        if (status === "moderation") {
            window.parent.postMessage({
                application: 'activity-manager',
                message: 'set-answers',
                data: { answers: pid }
            }, '*');
            $("#addBtn").attr("disabled", "true").addClass("disableApproveBtn");
        }
    },
    
    changeStatus         : async (pid, post, imageNames, status) => {
        post.images = imageNames;
        let postString      = JSON.stringify(post);
        let request         = await axios.post(config.updatePost, {uid: currUid, pid: pid, post: postString, status: status});
        console.log(request);
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
        
        if (files.length !== 0)
            await network.addImages(renamedFiles, request.data.data.pid);
        
        let pid = request.data.data.pid;
        if (status === "moderation") {
            window.parent.postMessage({
                application: 'activity-manager',
                message: 'set-answers',
                data: { answers: pid }
            }, '*');
        }
        $("#addBtn").attr("disabled", "true").addClass("disableApproveBtn");
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

    removeImages    : async (fileNames, pid) => {
        await axios.delete(config.removeImages, {
            data: {pid:pid, images: JSON.stringify(fileNames)}
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