const fs = require('fs');

module.exports = function (context, options) {
  return {
    name: 'staticcode',
    async loadContent() {
      const files = {
        'x42-c': 'static/code/X42.c'
      };
      const content = {};
      for (const [key, value] of Object.entries(files)) {
        content[key] = fs.readFileSync(value, 'utf8').trim();
      }
      return content;
    },
    async contentLoaded({content, actions}) {
      const {setGlobalData} = actions;
      setGlobalData({
        code: content
      });
    },
  };
};
