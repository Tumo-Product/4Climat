const parser = {
    getMapLink          : (longitude, latitude, lang) => {
        let language = lang === undefined ? "us" : lang;
        return `https://maps.google.com/maps?q=${longitude},${latitude}&hl=${language}&output=embed`;
    },
    getCoords           : (link) => {
        let substring   = link.substring(link.lastIndexOf("@") + 1, link.lastIndexOf(","));
        let coords      = substring.split(",");
        coords          = { longitude: parseFloat(coords[0]), latitude: parseFloat(coords[1]) };

        return coords;
    },
    isTitleCorrect      : (title) => {
        return !title.includes("   ") && title.length > 5;
    },
    isURLValid          : (urlString) => {
        let url;
        try {
            url = new URL(urlString);
        } catch (e) {
            console.log("Invalid URL!");
            return false;  
        }
      
        return true;
    }
}