const { Markup } = require("telegraf")

module.exports = (bot) => {
    bot
    .on("chat_join_request", async ctx => {
        const { chat } = ctx.update.chat_join_request
        const status = await ctx.telegram.approveChatJoinRequest(chat.id, ctx.from.id)
        let { message, link } = ctx.groups.body[chat.id].options
        if (status) {
            ctx.groups.body[chat.id].options.accepted += 1
            ctx.groups.save()
            await ctx.send(message, {
                ...Markup.inlineKeyboard([
                    [Markup.button.url("🔗 Перейти в группу", link)]
                ]),
                chat_id: ctx.from.id
            })
        }
    })
}