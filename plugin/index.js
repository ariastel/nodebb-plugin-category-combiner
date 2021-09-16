'use strict';

const constants = require('./constants');
const filters = require('./filters');
const logger = require('./logger');
const { routesHelpers } = require('./nodebb');


const Plugin = {};

// NodeBB list of Hooks: https://github.com/NodeBB/NodeBB/wiki/Hooks
Plugin.hooks = {
	filters,
	statics: {
		/**
		 * Called on `static:app.load`
		 */
		async load(params) {
			const { router, middleware } = params;
			logger.verbose('initializing');

			function renderAdmin(req, res) {
				res.render(`admin/${constants.plugin.route}`, {});
			}
			routesHelpers.setupAdminPageRoute(router, `/admin/${constants.plugin.route}`, middleware, [], renderAdmin);

			return params;
		},
	},
};

module.exports = Plugin;
