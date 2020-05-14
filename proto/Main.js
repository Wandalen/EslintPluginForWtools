'use strict';

module.exports.rules =
{
  'no-full-fp-lib' : require( './rules/no-full-fp-lib' ),
};

module.exports.configs =
{
  recommended :
  {
    rules :
    {
      'tumblbug/no-full-fp-lib' : 2,
    },
  },
};
