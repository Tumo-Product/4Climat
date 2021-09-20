const network   = {
    idExists        : async(id) => {

    },

    getNewToken        : async () => {
        return '1o1d1oasof3posfji13ojr93f';
    },

    getPosts        : async (id, token) => {
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
    addImage        : async (file) => {
        let formData = new FormData();
        formData.append("files", file);
        formData.append("pid", "test");
        let request = await axios.post(config.uploadImage, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(request, file);
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
            `https://www.pixsy.com/wp-content/uploads/2021/04/ben-sweet-2LowviVHZ-E-unsplash-1.jpeg`,
            `https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171__340.jpg`,
            `https://www.pixsy.com/wp-content/uploads/2021/04/ben-sweet-2LowviVHZ-E-unsplash-1.jpeg`,
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
            `https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171__340.jpg`
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
            `https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171__340.jpg`
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
            `https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171__340.jpg`
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
            `https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171__340.jpg`
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
            `https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171__340.jpg`
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
            `https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171__340.jpg`
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
            `https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171__340.jpg`
        ],
    },
]