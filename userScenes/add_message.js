const { Scenes: { WizardScene }, Composer, Telegraf, session, Markup } = require('telegraf')

module.exports = (base_ctx) => {

    const handlerMesssage = Telegraf.on("text", async ctx => {
        ctx.session.message = ctx.message.text
        ctx.send(`Проверьте введенное вами сообщение:\n\n${ctx.message.text}`, Markup.inlineKeyboard([
            [Markup.button.callback("✅ Обновить", "okay")],
            [Markup.button.callback("♻️ Заново", "reenter")],
            [Markup.button.callback("❌ Выйти", "leave")]
        ]))
        ctx.wizard.next()
    })

    const handlerAction = new Composer()

    handlerAction
    .action("reenter", ctx => ctx.scene.reenter())
    .action("okay", async ctx => {
        ctx.groups.body[ctx.session.chat_id].options.message = ctx.session.message
        ctx.groups.save()
        await ctx.scene.leave()
        await ctx.edit("Приветственное сообщение успешно обновлено!")
        return ctx.myChats("send")
    })

    const back = Markup.inlineKeyboard([
        [Markup.button.callback("⬅️ Выйти", "leave")]
    ])

    const addMessage = new WizardScene(
        "add_message",
        handlerMesssage,
        handlerAction
    )

    addMessage
    .action("leave", async ctx => {
        await ctx.scene.leave()
        await ctx.myChats("edit")
    })
    .enter(async ctx => ctx.edit("Отправьте новое приветственное сообщение:", back))

    return addMessage;
}