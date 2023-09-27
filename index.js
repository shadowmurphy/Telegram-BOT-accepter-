const { Telegraf, session } = require("telegraf");
require("dotenv").config();
const bot = new Telegraf(process.env.BOT_TOKEN);
const { folderLoader, logger, createJsonBase } = require("telegraf-tools")(bot);

createJsonBase();

const { JsonBase, Users } = bot.context.jsonbase

bot.context.users = new Users(() => ({
    is_admin: false,
    reg_date: new Date().toLocaleString(),
    chats: [],
}))
bot.context.groups = new JsonBase("groups", {})

bot
.catch(error => console.log(error))
.use(session())
.use((ctx, next) => {
    if (ctx.chat.type === "channel") return next();
    if (!ctx.from) return;
    ctx.user = ctx.users.get(ctx.from, true);
    return next();
})
.use(require("./tools/stage")(bot.context))

bot
.on("new_chat_members", ctx => ctx.deleteMessage())
.on("left_chat_member", ctx => ctx.deleteMessage())

folderLoader("/src")
folderLoader("/utils")
// folderLoader("/tools")
// folderLoader("/functions")


const timestamp = new Date().toLocaleTimeString()

bot
.launch({ dropPendingUpdates: true })
.then(logger.log(`${timestamp} \x1b[90m[\x1b[0m\x1b[31mINFO\x1b[90m] Bot Started!`, {
    green: "Bot Started!",
    dim: timestamp
}));