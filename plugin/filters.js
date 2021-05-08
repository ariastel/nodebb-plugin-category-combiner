const constants = require('./constants');
const { _, categories, db } = require('./nodebb');
const { getCategorySetFormat, getChildrenCategorySet } = require('./utils');


const Filters = {};

Filters.addMenuItem = async function addMenuItem(customHeader) {
  customHeader.plugins.push({
    route: `/${constants.plugin.route}`,
    icon: constants.plugin.icon,
    name: constants.displayName,
  });
  return customHeader;
};

Filters.buildTopicsSortedSet = async function buildTopicsSortedSet({ set, data }) {

  const actualSet = Array.isArray(set) ? set[0] : set;

  const setFormat = getCategorySetFormat(data);
  const childCategorySet = await getChildrenCategorySet(data.cid, setFormat);

  return { set: _.union([actualSet], childCategorySet) };
};

Filters.getTopicIds = async function getTopicIds(payload) {

  const {
    data,
    pinnedTids: pinnedTidsOnPage,
    allPinnedTids: pinnedTids,
    totalPinnedCount,
    normalTidsToGet,
  } = payload;

  const [direction, set] = await Promise.all([
    categories.getSortedSetRangeDirection(data.sort),
    categories.buildTopicsSortedSet(data),
  ]);

  let { start } = data;
  if (start > 0 && totalPinnedCount) {
    start -= totalPinnedCount - pinnedTidsOnPage.length;
  }

  const stop = data.stop === -1 ? data.stop : start + normalTidsToGet - 1;
  let normalTids;
  const reverse = direction === 'highest-to-lowest';
  if (Array.isArray(set)) {
    const weights = set.map((s, index) => (index ? 0 : 1));
    normalTids = await db[reverse ? 'getSortedSetRevUnion' : 'getSortedSetUnion']({
      sets: set, start, stop, weights,
    });
  } else {
    normalTids = await db[reverse ? 'getSortedSetRevRange' : 'getSortedSetRange'](set, start, stop);
  }
  normalTids = normalTids.filter((tid) => !pinnedTids.includes(tid));

  return { tids: pinnedTidsOnPage.concat(normalTids) };
};

Filters.getTopicCount = async function getTopicCount({ topicCount, data }) {

  const set = await categories.buildTopicsSortedSet(data);

  if (Array.isArray(set)) {
    return { topicCount: await db.sortedSetUnionCard(set) };
  }
  if (data.targetUid && set) {
    return { topicCount: await db.sortedSetCard(set) };
  }

  return { topicCount };
};

module.exports = Filters;
