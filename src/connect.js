const { Telegraf } = require("telegraf")

module.exports = (bot) => {
    bot
    .command("connect", async ctx => {
        if (ctx.chat.type === "private") return;
        const right = (await ctx.getChatMember(ctx.from.id)).status
        if (right !== "creator") return;
        await ctx.createChat(ctx.chat)
        await ctx.deleteMessage()
    })
    .on("channel_post", async ctx => {
        const { update: { channel_post : { text } } } = ctx,
            msg = text.split(" ")
        if (msg[0] === "/connect") {
            if (!msg[1]) return ctx.send("Неправильный ввод команды!").then(ctx.deleteMessage());
            if (!ctx.users.users.body[msg[1]]) return ctx.send("Пользователь не найден").then(ctx.deleteMessage());
            await ctx.createChat(ctx.update.channel_post.chat, msg[1])
            await ctx.deleteMessage()
        }
    })
}