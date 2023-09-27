const { Markup, session } = require("telegraf");

const basic_options = { parse_mode: 'HTML', disable_web_page_preview: true };

module.exports = (bot) => {
    Object.assign(bot.context, {
        send: async function(text, extra={}) {
            const chat_id = extra.chat_id || this.chat.id;
            delete extra.chat_id;
            return this.telegram.sendMessage(chat_id, text, Object.assign(extra, basic_options));
        },

        genMention: function(user){
			const { first_name, last_name, id, username } = user ?? this.from;
			return username ? `@${username}` : `<a href='tg://user?id=${id}'>${first_name + (last_name ? ' ' + last_name : '')}</a>`
		},

        edit: async function(text, extra = {}){
			const chat_id = extra.chat_id || this.chat.id;
			const message_id = extra.message_id || this.callbackQuery.message.message_id
			delete extra.chat_id;
			delete extra.message_id;
			return this.telegram.editMessageText(chat_id, message_id, null, text, Object.assign(extra, basic_options));
		},

        start: async function() {
            const buttons = [
                ["ℹ️ Инструкция", "📁 Мои чаты"],
                ["➕ Добавить чат"]
            ]
            if (this.user.is_admin) buttons.push(["🔐 Админ панель"])
            await this.send("Здравствуй, используй меню под вводом текста.", Markup.keyboard(buttons).resize())
        },

        back: async function(smile) {
            await this.send(smile, Markup.keyboard(["📌 Главное меню"]).resize())
        },

        createChat: async function(chat, userId) {
            if (this.users.users.body[userId].chats.includes(chat.id)) return this.send("Данная группа уже добавлена!")
            this.users.users.body[userId].chats.push(chat.id)
            this.groups.body[chat.id] = chat
            this.groups.body[chat.id].options = {
                message: "Не установлено",
                accepted: 0,
                link: (await this.createChatInviteLink({ creates_join_request: true })).invite_link
            }
            this.groups.save()
            this.users.save()
            this.send(`Чат <b>${chat.title}</b> был успешно добавлен!\nНастройки чата вы можете посмотреть использовав кнопку "Мои чаты"`, {
                chat_id: userId
            })
        },

        myChats: async function(method) {
            const buttons = [];
            for (let i in this.groups.body) {
              const num = this.groups.body[i];
              if (this.user.chats.includes(num.id)) buttons.push([Markup.button.callback(num.title, `chat-${num.id}`)]);
            }
            await this[method]("Ваши чаты:", Markup.inlineKeyboard(buttons));
        }
    })
}