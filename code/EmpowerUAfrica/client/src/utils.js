
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
    }
}

export default Utils; 