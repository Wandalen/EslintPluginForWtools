( function _Int_test_s_()
{

'use strict';

if( typeof module !== 'undefined' )
{

  const _ = require( 'wTesting' );

  debugger;
  let plugin = require( 'eslint-plugin-for-wtools' );
  debugger;

}

const _ = _global_.wTools;

// --
//
// --

// --
//
// --

const Proto =
{

  name : 'eslint.space.in.parens.advanced',
  silencing : 1,

  tests :
  {

  },

}

//

const Self = wTestSuite( Proto );
if( typeof module !== 'undefined' && !module.parent )
_global_.wTester.test( Self.name );

} )();
