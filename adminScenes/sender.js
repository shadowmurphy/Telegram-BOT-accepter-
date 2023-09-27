const { Scenes: { WizardScene }, Composer, Telegraf, session, Markup } = require('telegraf')

module.exports = (base_ctx) => {

    const handlerMessage = Telegraf.on("message", async ctx => {
        ctx.session.message_id = ctx.message.message_id
        await ctx.copyMessage(ctx.from.id)
        await ctx.send("Сообщение выглядит правильно?", Markup.inlineKeyboard([
            [Markup.button.callback("✅ Да, разослать!", "yep")],
            [Markup.button.callback("♻️ Заново", "reenter")],
            [Markup.button.callback("❌ Выйти", "leave")]
        ]))
        ctx.wizard.next()
    })

    const handlerAction = new Composer()

    handlerAction
    .action("reenter", ctx => ctx.scene.reenter())
    .action("yep", async ctx => {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        const db = ctx.users.users.body
        ctx.scene.leave()
        await ctx.edit(`Пользователей в базе: ${Object.keys(db).length}\nРассылка займет: ${Object.keys(db).length * 3} секунд`)
        const startDate = new Date()
        for (let key in db) {
            try {
                if (db[key].is_bot || db[key].is_admin) continue;
                await ctx.telegram.copyMessage(db[key].id, ctx.from.id, ctx.session.message_id)
                console.log(`✅ Отправил: ${db[key].id}`)
                await sleep(2000);
            } catch (e) { console.log(`❌ Не смог отправить: ${db[key].id}` ) }
        }
        const endDate = new Date()
        ctx.send(`Рассылка закончена за ${(endDate - startDate) / 1000} секунд.`)
    })

    const sender = new WizardScene(
        "sender",
        handlerMessage,
        handlerAction
    )

    const back = Markup.inlineKeyboard([
        [Markup.button.callback("⬅️ Выйти", "leave")]
    ])

    sender
    .action("leave", async ctx => {
        await ctx.deleteMessage()
        await ctx.scene.leave()
        await ctx.start()
    })
    .enter(async ctx => ctx.edit("Отправьте сообщение которое хотите разослать всем пользователям!", back))

    return sender;
}