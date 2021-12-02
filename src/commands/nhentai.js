import Discord from "discord.js";
import webnhentai from "nhentai";

export default function nhentai(message, args) {
    function sendError(content) {
        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle(content);
        message.channel.send({ embeds: [embed] });
    };

    function sendInfo(doujin) {
        let tags = doujin.tags.all.map(tag => tag.name).join(', ');
        const embed = new Discord.MessageEmbed()
            .setAuthor("NHENTAI")
            .addField("Enjoy the masterpiece: ", "**" + doujin.titles.pretty + "**" + " [" + doujin.id + "]")
            .addField("Tags: ", tags)
            .setThumbnail(doujin.thumbnail.url)
            .setColor("#202225");
        message.channel.send({ embeds: [embed] });
    };

    function sendPages(doujin) {
        let embeds = [];
        doujin.pages.forEach((el, index) => {
            console.log(el.url);
            const embed = new Discord.MessageEmbed()
                .setImage(el.url)
                .setColor("#202225");

            embeds.push(embed);

            if ((index + 1) % 10 === 0) {
                message.channel.send({ embeds: embeds });
                embeds = [];
            }
        });

        if (embeds.length) message.channel.send({ embeds: embeds });
        message.channel.send(message.url);
    };

    function sendDoujin(ID) {
        const api = new webnhentai.API();
        api.fetchDoujin(ID).then(doujin => {
            if(!doujin){
                sendError("An error was occurred. May be its a sign?");
                return;
            };
    
            sendInfo(doujin);
            sendPages(doujin);
        }).catch(err => {
            sendError("An error was occurred. May be its a sign?");
        })
    }

    function isEnglish(doujin) {
        let isEnglish = false;
        doujin.tags.all.forEach(tag => {
            if (tag.name === "english") isEnglish = true;
        });
        return isEnglish;
    };

    async function sendRandom() {
        const api = new webnhentai.API();
        let acknowlaged = false;

        while(!acknowlaged) {
            const ID = Math.floor(Math.random() * 300000);

            const doujin = await api.fetchDoujin(ID).catch(err => (err));
            if(doujin !== null && doujin !== undefined) {
                if(isEnglish(doujin)) {
                    sendInfo(doujin);
                    sendPages(doujin);
                    acknowlaged = true;
                }
            }
        }
    }

    const ID = args[1];

    if(!message.channel.nsfw) {
        sendError("Hentai is only availible on nsfw channels");
        return;
    }

    if((isNaN(ID) && ID?.toLowerCase() !== "random") || ID <= 0 || ID > 300000) {
        sendError("You should pass doujin code or \"random\"");
        return;
    }

    if(ID === "random") sendRandom();  
    else sendDoujin(ID)
}