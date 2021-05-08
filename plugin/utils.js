const { categories, meta } = require('./nodebb');


/**
 * @param {*} data
 * @returns {string}
 */
function getCategorySetFormat(data) {

  let set = 'cid:{0}:tids';
  const sort = data.sort || (data.settings && data.settings.categoryTopicSort) || meta.config.categoryTopicSort || 'newest_to_oldest';

  if (sort === 'most_posts') {
    set = 'cid:{0}:tids:posts';
  } else if (sort === 'most_votes') {
    set = 'cid:{0}:tids:votes';
  }

  if (data.targetUid) {
    set = `cid:{0}:uid:${data.targetUid}:tids`;
  }

  return set;
}


/**
 * @param {number} parentCid
 * @param {string} setFormat
 * @returns {string[]}
 */
async function getChildrenCategorySet(parentCid, setFormat) {
  const childCids = await categories.getChildrenCids(parentCid);
  return childCids.map((cid) => setFormat.replace('{0}', cid));
}

module.exports = { getCategorySetFormat, getChildrenCategorySet };
