
'use strict';

//

function isOpeningParenToken( token )
{
  return token.value === '(' && token.type === 'Punctuator';
}

//

function isClosingParenToken( token )
{
  return token.value === ')' && token.type === 'Punctuator';
}

//

function isTokenOnSameLine( left, right )
{
  return left.loc.end.line === right.loc.start.line;
}

//

function create( context )
{
  const filters =
  {
    Program,
    // FunctionDeclaration,
  }
  const ALWAYS = context.options[ 0 ] === 'always',
    exceptionsArrayOptions = ( context.options[ 1 ] && context.options[ 1 ].exceptions ) || [],
    options = {};

  let exceptions;

  if( 0 )
  {
    console.log( 0, [ 1, 2, 3 ] );
    console.log([ 1, 2, 3 ]);
  }

  if( exceptionsArrayOptions.length )
  {
    options.braceException = exceptionsArrayOptions.includes( '{}' );
    options.bracketException = exceptionsArrayOptions.includes( '[]' );
    options.parenException = exceptionsArrayOptions.includes( '()' );
    options.empty = exceptionsArrayOptions.includes( 'empty' );
  }

  const sourceCode = context.getSourceCode();

  return filters;

  // function FunctionDeclaration( node )
  // {
  //   console.log( node ); debugger;
  //   // console.log( node.type ); debugger;
  // }

  function Program( node )
  {
    exceptions = getExceptions();
    const tokens = sourceCode.tokensAndComments;

    tokens.forEach( ( token, i ) =>
    {
      const prevToken = tokens[ i - 1 ];
      const nextToken = tokens[ i + 1 ];

      // if token is not an opening or closing paren token, do nothing
      if( !isOpeningParenToken( token ) && !isClosingParenToken( token ) )
      {
        return;
      }

      // if token is an opening paren and is not followed by a required space
      if( token.value === '(' && openerMissingSpace( token, nextToken ) )
      {
        context.report
        ({
          node,
          loc : token.loc,
          messageId : 'missingOpeningSpace',
          fix( fixer )
          {
            return fixer.insertTextAfter( token, ' ' );
          }
        });
      }

      // if token is an opening paren and is followed by a disallowed space
      if( token.value === '(' && openerRejectsSpace( token, nextToken ) )
      {
        context.report({
          node,
          loc : { start : token.loc.end, end : nextToken.loc.start },
          messageId : 'rejectedOpeningSpace',
          fix( fixer )
          {
            return fixer.removeRange([ token.range[ 1 ], nextToken.range[ 0 ] ]);
          }
        });
      }

      // if token is a closing paren and is not preceded by a required space
      if( token.value === ')' && closerMissingSpace( prevToken, token ) )
      {
        context.report
        ({
          node,
          loc : token.loc,
          messageId : 'missingClosingSpace',
          fix( fixer )
          {
            return fixer.insertTextBefore( token, ' ' );
          }
        });
      }

      // if token is a closing paren and is preceded by a disallowed space
      if( token.value === ')' && closerRejectsSpace( prevToken, token ) )
      {
        context.report
        ({
          node,
          loc : { start : prevToken.loc.end, end : token.loc.start },
          messageId : 'rejectedClosingSpace',
          fix( fixer )
          {
            return fixer.removeRange([ prevToken.range[ 1 ], token.range[ 0 ] ]);
          }
        });
      }
    });

  }

  //

  function isOpenerException( token )
  {
    return exceptions.openers.includes( token.value );
  }

  //

  function isCloserException( token )
  {
    return exceptions.closers.includes( token.value );
  }

  //

  function openerMissingSpace( openingParenToken, tokenAfterOpeningParen )
  {
    if( sourceCode.isSpaceBetweenTokens( openingParenToken, tokenAfterOpeningParen ) )
    {
      return false;
    }

    if( !options.empty && isClosingParenToken( tokenAfterOpeningParen ) )
    {
      return false;
    }

    if( ALWAYS )
    {
      return !isOpenerException( tokenAfterOpeningParen );
    }
    return isOpenerException( tokenAfterOpeningParen );
  }

  //

  function openerRejectsSpace( openingParenToken, tokenAfterOpeningParen )
  {
    if( !isTokenOnSameLine( openingParenToken, tokenAfterOpeningParen ) )
    {
      return false;
    }

    if( tokenAfterOpeningParen.type === 'Line' )
    {
      return false;
    }

    if( !sourceCode.isSpaceBetweenTokens( openingParenToken, tokenAfterOpeningParen ) )
    {
      return false;
    }

    if( ALWAYS )
    {
      return isOpenerException( tokenAfterOpeningParen );
    }
    return !isOpenerException( tokenAfterOpeningParen );
  }

  //

  function closerMissingSpace( tokenBeforeClosingParen, closingParenToken )
  {
    if( sourceCode.isSpaceBetweenTokens( tokenBeforeClosingParen, closingParenToken ) )
    {
      return false;
    }

    if( !options.empty && isOpeningParenToken( tokenBeforeClosingParen ) )
    {
      return false;
    }

    if( ALWAYS )
    {
      return !isCloserException( tokenBeforeClosingParen );
    }
    return isCloserException( tokenBeforeClosingParen );
  }

  //

  function closerRejectsSpace( tokenBeforeClosingParen, closingParenToken )
  {
    if( !isTokenOnSameLine( tokenBeforeClosingParen, closingParenToken ) )
    {
      return false;
    }

    if( !sourceCode.isSpaceBetweenTokens( tokenBeforeClosingParen, closingParenToken ) )
    {
      return false;
    }

    if( ALWAYS )
    {
      return isCloserException( tokenBeforeClosingParen );
    }
    return !isCloserException( tokenBeforeClosingParen );
  }

  //

  function getExceptions()
  {
    const openers = [];
    const closers = [];

    if( options.braceException )
    {
      openers.push( '{' );
      closers.push( '}' );
    }

    if( options.bracketException )
    {
      openers.push( '[' );
      closers.push( ']' );
    }

    if( options.parenException )
    {
      openers.push( '(' );
      closers.push( ')' );
    }

    if( options.empty )
    {
      openers.push( ')' );
      closers.push( '(' );
    }

    return {
      openers,
      closers
    };
  }

}

// --
//
// --

module.exports =
{
  meta :
  {
    type : 'layout',

    docs :
    {
      description : 'enforce consistent spacing inside parentheses',
      category : 'Stylistic Issues',
      recommended : false,
      url : 'https://eslint.org/docs/rules/space-in-parens'
    },

    fixable : 'whitespace',

    schema :
    [
      {
        enum : [ 'always', 'never' ]
      },
      {
        type : 'object',
        properties : {
          exceptions : {
            type : 'array',
            items : {
              enum : [ '{}', '[]', '()', 'empty' ]
            },
            uniqueItems : true
          }
        },
        additionalProperties : false
      }
    ],

    messages :
    {
      missingOpeningSpace : 'There must be a space after this paren.',
      missingClosingSpace : 'There must be a space before this paren.',
      rejectedOpeningSpace : 'There should be no space after this paren.',
      rejectedClosingSpace : 'There should be no space before this paren.'
    }
  },

  create,

};
