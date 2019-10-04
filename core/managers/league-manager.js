const Manager = require( './manager' );

class PathofExileLeague 
{
    constructor( id, name )
    {
        this.id = id;
        this.name = name;
    }
}

module.exports = 
class LeagueManager extends Manager
{
    constructor( view )
    {
        super( view );
        this.cached = {};
    }
    /**
     * Adds a league with the given name 
     * @param {String} leagueName 
     */
    async add( leagueName )
    {
        const controller = this.controller;

        if( typeof leagueName !== 'string' ) throw new Error( 'INVALID LEAGUENAME' );

        try
        {
            await controller.run( 'insert-league', [ leagueName ], { ignoreDuplicates : true } );
        }
        catch( e )
        {
           console.log( e );
        }
    }
    /**
     * Gets a league by league name
     * @param {String} leagueName 
     */
    async get( leagueName )
    {
        const controller = this.controller;

        if( typeof leagueName !== 'string' ) throw new Error( 'INVALID LEAGUENAME' );

        try
        {
            const rows = await controller.run( 'get-league-by-name', [ leagueName ] );
            if( rows.length < 1 )
            {
                throw new Error( `League '${leagueName}' does not exist in the database.` );
            }
            const row = rows.pop();
            return new PathofExileLeague( row.id, row.name );
        }
        catch( e )
        {
           console.log( e );
        }

        return null;
    }

    async getByID( leagueID )
    {
        const controller = this.controller;
        const cached = this.cached;

        if( !cached[ leagueID ] )
        {
            const rows = await controller.run( 'get-league-by-id', [ leagueID ] );
            if( rows.length < 1 )
            {
                throw new Error( `League with id '${leagueID}' does not exist in the database.` );
            }
            const row = rows.pop();
            cached[ leagueID ] = new PathofExileLeague( row.id, row.name );
        }
        return cached[ leagueID ];
    }
}