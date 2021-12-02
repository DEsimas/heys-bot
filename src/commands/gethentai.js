import Discord from "discord.js";
import Booru from "booru";

export default function gethentai(message, args) {
    function sendError(content) {
        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle(content);
        message.channel.send({ embeds: [embed] });
    };

    function sendPosts(posts) {
        let embeds = [];
        posts.forEach((el, index) => {
            const embed = new Discord.MessageEmbed()
                .setImage(el.fileUrl)
                .setColor("#202225");

            embeds.push(embed);

            if ((index + 1) % 10 === 0) {
                message.channel.send({ embeds: embeds });
                embeds = [];
            }
        });

        if (embeds.length) message.channel.send({ embeds: embeds });
        if(posts.length >= 20) message.channel.send(message.url);
    };

    if(!message.channel.nsfw) {
        sendError("Hentai is only availible on nsfw channels");
        return;
    }

    const site = args[1];
    let tags = [];
    let amount = 1;
    args.forEach((arg, index) => {
        if(index < 2) return;
        if(!isNaN(arg)) amount = arg;
        else tags.push(arg);
    });

    if(amount > 300) amount = 300;

    try {
    Booru.search(site, tags, { limit: amount, random: true }).then(posts => {
        if(!posts.length) {
            sendError("Nothing was found");
        }
        sendPosts(posts);
    }).catch(err => {
        sendError("Resource not responding. Try again");
    });
    } catch {
        sendError("This site not supported");
    }
}