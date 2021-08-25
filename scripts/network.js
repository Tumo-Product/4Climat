const network   = {
    getToken        : async () => {
        
    },

    getPosts        : async (id, token) => {
        return userPosts;
    },

    getCategories   : async () => {
        return [
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
        description : "I recycled some plastic bottles at x place",
        photos      : [
            `base64 image blsajgioaj fioaj`,
            `base64 image blsajgioaj fioaj`
        ]
    }
]