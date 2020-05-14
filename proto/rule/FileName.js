'use strict';

const path = require( 'path' );
// const { camelCase, kebabCase, snakeCase, upperFirst } = require( 'lodash' );
// const cartesianProductSamples = require('./utils/cartesian-product-samples');

'use strict';

//

function create( context )
{
  const filters =
  {
    Program,
  }
  const options = context.options[ 0 ] || {};
  const ignore = ( options.ignore || []).map( ( item ) =>
  {
    if( item instanceof RegExp )
    {
      return item;
    }
    return new RegExp( item, 'u' );
  });
  const filePath = context.getFilename();

  if( filePath === '<input>' || filePath === '<text>' )
  {
    return {};
  }

  return filters;

  /* */

  function Program( node )
  {
    const extension = path.extname( filePath );
    const fileName = path.basename( filePath, extension );
    const fullFileName = fileName + extension;
    let valid = true;

    if( ignore.some( ( regexp ) => regexp.test( base ) ) )
    return;

    if( fileName[ 0 ].toUpperCase() !== fileName[ 0 ])
    valid = false;

    if( fileName.slice( 1 ).indexOf( '_' ) !== -1 )
    valid = false;

    if( valid )
    return;

    context.report
    ({
      node,
      messageId : 'renameMsg',
      data :
      {
        fullFileName,
      }
    });
  }

};

//

const schema =
[
  {
    oneOf :
    [
      {
        properties :
        {
          ignore :
          {
            type : 'array',
            uniqueItems : true
          }
        },
        additionalProperties : false
      },
      {
        properties :
        {
          ignore :
          {
            type : 'array',
            uniqueItems : true
          }
        },
        additionalProperties : false
      }
    ]
  }
];

//

module.exports =
{
  create,
  meta : {
    type : 'suggestion',
    schema,
    messages :
    {
      renameMsg : 'Filename {{fullFileName}} is bad. Rename it.',
    }
  }
};
