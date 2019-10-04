const Manager = require( './manager' );

module.exports = 
class AccountManager extends Manager
{
    constructor( view )
    {
        super( view );
    }
    async push( accountName )
    {
        const controller = this.controller;

        try {
            await controller.run( 'upsert-account', 
            [ 
                accountName,
            ] );
        }
        catch( e )
        {
            console.log( e );
        }   
    }
}