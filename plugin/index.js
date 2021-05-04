const constants = require('./constants');
const filters = require('./filters');
const logger = require('./logger');


const Plugin = {};

// NodeBB list of Hooks: https://github.com/NodeBB/NodeBB/wiki/Hooks
Plugin.hooks = {
  filters,
  statics: {
    async load(params) {

      const { router, middleware } = params;
      logger.verbose('initializing');

      function renderAdmin(req, res) {
        res.render(`admin/${constants.plugin.route}`, {});
      }

      router.get(`/admin/${constants.plugin.route}`, middleware.admin.buildHeader, renderAdmin);
      router.get(`/api/admin/${constants.plugin.route}`, renderAdmin);

      return params;
    },
  },
};

module.exports = Plugin;
