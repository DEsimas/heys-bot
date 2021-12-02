import commands from "./commands.js";

export default function messageHandler(message) {
    const content = message.content.trim();
    const args = content.split(" ");
    const command = args[0].toLowerCase();
    commands.forEach(cmd => {
        cmd.name.forEach(name => {
            if (process.env.PREFIX + name === command) cmd.out(message, args);
        });
    });
}