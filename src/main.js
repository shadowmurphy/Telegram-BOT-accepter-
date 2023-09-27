const { Telegraf, Markup } = require("telegraf")

module.exports = (bot) => {
    bot
    .start(async ctx => {
        if (ctx.chat.type !== "private") return;
        ctx.start()
    })

    .hears("📌 Главное меню", async ctx => {
        if (ctx.chat.type !== "private") return;
        ctx.start()
    })
    .hears("ℹ️ Инструкция", async ctx => {
        if (ctx.chat.type !== "private") return;
        await ctx.back("❓")
        await ctx.send("Выбери мои чаты если у тебя уже есть добавленный чат, если же нет - добавь свой первый чат используя кнопку ниже, следуй инструкциям и в последствии управляй им!")
    })
    .hears("📁 Мои чаты", async ctx => {
        if (ctx.chat.type !== "private") return;
        if (ctx.user.chats.length === 0) return ctx.send("У вас отсутствуют чаты, для начала добавьте хоть один чат!")
        ctx.myChats("send")
    })
    .hears("➕ Добавить чат", async ctx => {
        if (ctx.chat.type !== "private") return;
        await ctx.back("📥")
        await ctx.send(`<b>Что бы добавить чат и управлять им следуйте следующим шагам:</b>\n\n<b>Группа:</b>\n\n1. Перейдите в нужную Вам группу и добавьте туда бота\n2. Выдайте боту администраторские права доступа\n3. Напишите /connect в группе\n4. Наслаждайтесь функционалом бота.\n\n<b>Канал:</b>\n\n1. Перейдите в нужный вам канал\n2. Добавьте бота в канал как администратора\n3. Напишите в канал: /connect ${ctx.user.id}\n4. Если все сработало, прогер не криворукий :)`, Markup
            .inlineKeyboard([
                [Markup.button.url('➕ Добавить в чат', `https://t.me/${ctx.botInfo.username}?startgroup=false`)]
            ])
        )
    })

    .action(/chat-(-?\d+)/, async ctx => {
        const [, id] = ctx.match;
        ctx.answerCbQuery()
        const chat = ctx.groups.body[id]
        ctx.edit(`<b>Настройка для чата ${chat.title}</b>\n\nПринял людей: <b>${chat.options.accepted}</b>\n\nПриветственное сообщение: <b>${chat.options.message}</b>\n\nСсылка на приглашение: ${chat.options.link}`, Markup.inlineKeyboard([
            [Markup.button.callback("📍 Изменить приветственное сообщение", `edit-hello-message-${chat.id}`)],
            [Markup.button.callback("⬅️ Назад", "back")]
        ]))
    })
    .action(/^edit-hello-message-(-?\d+)$/, async ctx => {
        ctx.session.chat_id = ctx.match[1]
        ctx.scene.enter("add_message")
    })
    .action("back", async ctx => ctx.myChats("edit"))
}