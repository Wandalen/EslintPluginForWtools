'use strict';

module.exports.rules =
{
  'space-in-parens' : require( './rule/SpaceInParens.js' ),
  'filename' : require( './rule/FileName.js' ),
};

module.exports.configs =
{
  recommended :
  {
    rules :
    {
      'for-wools/space-in-parens' : 'error',
      'for-wools/filename' : 'error',
    },
  },
};
