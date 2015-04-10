'use strict';

module.exports = function (assemble) {
  var session = assemble.session;
  var taskName = session.get('task name');
  var templateType = 'page';
  if (taskName) {
    templateType = '__task__' + taskName;
  }
  var plural = assemble.collection[templateType];
  return plural;
}
