const fs = require('fs');

if (process.argv.length <= 2) process.exit(-1);

const filename = process.argv[2];

fs.writeFile(`userScenes/${filename}.js`, `const { Scenes: { WizardScene }, Composer, Telegraf, session, Markup } = require('telegraf')

module.exports = (base_ctx) => {

    const handlerText = Telegraf.on("text", async ctx => {
        //code
    })

    const handerAction = new Composer();

    handerAction
    .action("callback", ctx => {
      // code
    })

    const ${filename} = new WizardScene(
        "${filename}",
        handlerText,
        handerAction
      );
    
      ${filename}.enter(async ctx => {
        // code
      })
    return ${filename};
}
`, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`File ${filename}.js has been created!`);
});