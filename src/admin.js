const { Markup } = require("telegraf");

module.exports = (bot) => {
    bot
    .hears("🔐 Админ панель", async ctx => {
        if (ctx.chat.type !== "private") return;
        if (!ctx.user.is_admin) return;
        ctx.send("Админ панель 🖥", Markup.inlineKeyboard([
            [Markup.button.callback("✉️ Сделать рассылку", "sender")]
        ]))
    })
    .action("sender", async ctx => ctx.scene.enter("sender"))
}