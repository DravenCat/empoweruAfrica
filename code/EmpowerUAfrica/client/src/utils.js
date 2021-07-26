
const Utils = {
    getProfilePictureURL(username, pfp_type) {
        switch(pfp_type) {
            case 1: return `/profilepics/users/${username}.jpg`; 
            case 2: return `/profilepics/users/${username}.png`; 
            default: return "/profilepics/default/default_profile_pic.jpg"; 
        }
    },

    timeStampToTime(timestamp) {
        let d = new Date(timestamp * 1000);
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        let year = d.getFullYear();
        let month = months[d.getMonth()];
        let date = d.getDate();
        let hour = d.getHours();
        let min = d.getMinutes();

        hour = hour < 10? `0${hour}`: hour; 
        min = min < 10? `0${min}`: min; 
        let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min ;
        return time;
    },

    async getUsersAbstract(users) {
        let res;
        let URL = "/profile/getUsersAbstract?" + users.map(username => `username=${username}`).join('&');
        try {
            res = await fetch(
                URL,
                {
                    method: 'GET'
                }
            ); 
        }
        catch (err) {
            console.error(err); 
            return;
        }

        let body;
        try {
            body = await res.json();
        }
        catch (err) {
            console.error(err); 
            return;
        }

        if (!res.ok) {
            console.log(body.message);
            return; 
        }
        for (const username in body) {
            body[username].username = username; 
        }
        return body; 
    },
    updateSelfAbstract: async () =>  {
        if (localStorage.getItem('signedIn') !== 'true') {
            return null; 
        }
        const username = localStorage.getItem('username'); 
        const selfAbstract = (await Utils.getUsersAbstract([username]))[username]; 
        localStorage.setItem('abstract', JSON.stringify(selfAbstract)); 
    },
    isAdmin() {
        if (localStorage.getItem('signedIn') !== 'true') {
            return false; 
        }
        if (JSON.parse(localStorage.getItem('abstract')).isAdmin === true ) {
            return true; 
        }
        return false; 
    }
    ,
    trimString(str, maxLen) {
        return str.length > maxLen? 
            str.slice(0, maxLen) + '...':
            str;
    },
    getY2bVideoId(url) {
        
    },
    /**
     * A wrapper for fetch() to reduce repeated code in ajax requests. 
     * @param url: string, the target url of this request. 
     * @param req: object, the request object to be passed into fetch()
     * 
     * @returns object {res, body}
     */
    ajax: async (url, req) => {
        let res = await fetch(url, req); 
        let body; 
        if (res.headers.get('Content-Type').indexOf('application/json') !== -1) {
            body = await res.json(); 
        }
        else {
            body = await res.text(); 
        }
        return {res, body}
    }
}

export default Utils; 