const network   = {
    idExists        : async(id) => {

    },

    getNewToken        : async () => {
        return '1o1d1oasof3posfji13ojr93f';
    },

    getPosts        : async (id, token) => {
        return userPosts;
    },

    getCategories   : async () => {
        return [
            "Reuse",
            "Recycle",
            "Reduce",
            "Reuse",
            "Recycle",
            "Reduce",
            "Reuse",
            "Recycle",
            "Reduce",
            "Reuse",
            "Recycle",
            "Reduce",
            "Reuse",
            "Recycle",
            "Reduce",
            "Reuse",
            "Recycle",
            "Reduce"
        ];
    }
}

// VVVVVVVV Dummy Data VVVVVVVVV

const userPosts = [
    {
        categoryId  : 2,
        longitude   : 44.4325385,
        latitude    : 40.2122591,
        title       : "Recycling plastic bottles",
        date        : "29 Sep 2021",
        description : "Have you noticed how everybody takes it for granted a bad experience is automatically, unreservedly, unremittingly bad? That nothing good could ever come from a bad childhood, for example? I’m hearing the comment more and more often that we have become a victim society. Maybe this is true? Consider… Don’t we hear these comments a lot? I was mistreated when I was a child… I was a lonely latchkey kid… My ancestors got a bad break, so I’m… I lived in a poor, disadvantaged family… I grew up in a broken home… I didn’t get the proper advantages… I was constantly criticized as a child…",
        photos      : [
            `https://www.pixsy.com/wp-content/uploads/2021/04/ben-sweet-2LowviVHZ-E-unsplash-1.jpeg`
        ]
    },
    {
        categoryId  : 1,
        longitude   : 44.4325385,
        latitude    : 40.2122591,
        title       : "Recycling clothes",
        date        : "28 Sep 2021",
        description : "Have you noticed how everybody takes it for granted a bad experience is automatically, unreservedly, unremittingly bad? That nothing good could ever come from a bad childhood, for example? I’m hearing the comment more and more often that we have become a victim society. Maybe this is true? Consider… Don’t we hear these comments a lot? I was mistreated when I was a child… I was a lonely latchkey kid… My ancestors got a bad break, so I’m… I lived in a poor, disadvantaged family… I grew up in a broken home… I didn’t get the proper advantages… I was constantly criticized as a child…",
        photos      : [
            `https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171__340.jpg`
        ],
    }
]