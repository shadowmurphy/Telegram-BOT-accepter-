const fs = require('fs');
const { Scenes: { Stage }, session, Composer } = require('telegraf')

module.exports = (context) => {
  const sceneDirectories = ['userScenes', 'adminScenes'];

  const scenes = new Stage(sceneDirectories.flatMap(directory => {
    return fs.readdirSync(directory)
      .map(filename => {
        const file_ = filename.match('(.+).js')[1];
        const timestamp = new Date().toLocaleTimeString();
        console.log(`\x1b[2m${timestamp}\x1b[0m \x1b[90m[\x1b[0m\x1b[31mINFO\x1b[90m] \x1b[2mLoading ${directory === 'userScenes' ? 'user' : 'admin'} scene: ${file_}\x1b[0m...`);
        console.log(`\x1b[2m${timestamp}\x1b[0m \x1b[90m[\x1b[0m\x1b[31mINFO\x1b[90m] \x1b[32m${directory === 'userScenes' ? 'User' : 'Admin'} scene \x1b[90m[\x1b[36m\x1b[1m${file_}\x1b[0m\x1b[90m]\x1b[32m loaded successfully.\x1b[0m`);
        return require(`./../${directory}/${file_}`)(context);
      });
  }));

  const stages = new Composer();
  stages.use(scenes.middleware());
  return stages;
}
