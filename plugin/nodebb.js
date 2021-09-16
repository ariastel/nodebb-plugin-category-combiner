'use strict';

module.exports = {
	db: require.main.require('./src/database'),
	categories: require.main.require('./src/categories'),
	meta: require.main.require('./src/meta'),
	routesHelpers: require.main.require('./src/routes/helpers'),
	topics: require.main.require('./src/topics'),

	_: require.main.require('lodash'),
	winston: require.main.require('winston'),
};
