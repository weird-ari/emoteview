
var emotesDiv = document.getElementById('emotes-div');
var emotes = [];

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const channelID = urlParams.get('id');

async function getBTTV(target) {
    return await fetch("https://api.betterttv.net/3/" + target).then(async (res) => {
        return res.json();
    });
}

async function get7tv(target) {
    return await fetch("https://api.7tv.app/v2/" + target).then(async (res) => {
        return res.json();
    });
}

function addEmoteToDiv(div, name, url) {

    var emote = document.createElement('div');
    emote.classList.add("emote");

    var img = document.createElement('img');
    img.src = url;

    text = document.createTextNode(name);
    var name = document.createElement('div');
    name.appendChild(text)
    name.classList.add("name");

    emote.appendChild(img)
    emote.appendChild(name)

    div.appendChild(emote);
}


async function init() {
    //FFZ
    ffzEmotes = await getBTTV('cached/frankerfacez/users/twitch/' + channelID);
    for (i = 0; i < ffzEmotes.length; i++) {
        emote = ffzEmotes[i];
        emotes.push([emote.code, `https://cdn.frankerfacez.com/emote/${emote.id}/2`, "ffz"]);
    }

    //BTTV
    bttvUser = await getBTTV('cached/users/twitch/' + channelID);
    bttvChannelEmotes = bttvUser["channelEmotes"];
    for (i = 0; i < bttvChannelEmotes.length; i++) {
        emote = bttvChannelEmotes[i];
        emotes.push([emote.code, `https://cdn.betterttv.net/emote/${emote.id}/3x`, "bttv"]);
    }

    bttvSharedEmotes = bttvUser["sharedEmotes"];
    for (i = 0; i < bttvSharedEmotes.length; i++) {
        emote = bttvSharedEmotes[i];
        emotes.push([emote.code, `https://cdn.betterttv.net/emote/${emote.id}/3x`, "bttv"]);
    }


    bttvGlobalEmotes = await getBTTV("cached/emotes/global");
    for (i = 0; i < bttvGlobalEmotes.length; i++) {
        emote = bttvGlobalEmotes[i];
        emotes.push([emote.code, `https://cdn.betterttv.net/emote/${emote.id}/3x`, "bttv"]);
    }

    // 7tv
    seventvChannelEmotes = await get7tv("users/" + channelID + "/emotes");
    for (i = 0; i < seventvChannelEmotes.length; i++) {
        emote = seventvChannelEmotes[i];
        emotes.push([emote.name, emote.urls[0][1], "7tv"]);
    }

    seventvGlobalEmotes = await get7tv("/emotes/global");
    for (i = 0; i < seventvGlobalEmotes.length; i++) {
        emote = seventvGlobalEmotes[i];
        emotes.push([emote.name, emote.urls[0][1], "7tv"]);
    }

    emotes.sort((a, b) => a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0))
    for (i = 0; i < emotes.length; i++) {
        addEmoteToDiv(emotesDiv, emotes[i][0], emotes[i][1]);
    }
}


init();
