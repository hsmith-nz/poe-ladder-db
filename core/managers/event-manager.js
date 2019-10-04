const Manager = require( './manager' );

class PathofExileEventURL
{
    constructor( event )
    {
        this.event = event;
        this.offset = 0;
        this.last = 0;
        this.limit = 200;
        this.maximum = 15000;
    }
    get string()
    {
        return `http://api.pathofexile.com/ladders/${this.event.name}?offset=${this.offset}&limit=${this.limit}`;
    }
    increment()
    {
        this.last = this.offset;
        this.offset += this.limit;
        this.offset %= this.maximum;
    }
    rollback()
    {
        this.offset = this.last;
    }
}

class PathofExileEvent
{
    constructor( id, name, active, league )
    {
        this.id = id;
        this.name = name;
        this.active = active;
        this.league = league;
        this.url = new PathofExileEventURL( this );
    }
}

module.exports = 
class EventManager extends Manager
{
    constructor( view )
    {
        super( view );
        this.cached = {};
    }
    async update( lastUpdate, thisUpdate )
    {
        const controller = this.controller;

        let events = await controller.run( 'get-event-active-change', [ lastUpdate, thisUpdate ] );

        for( const change of events )
        {
            const league = await this.root.leagues.getByID( change.league_id );
            const previous = new PathofExileEvent( change.id, change.name, change.active - change.active_change_total, league );
            const current = new PathofExileEvent( change.id, change.name, change.active, league );

            if( !previous.active && current.active ) this.emit( 'activated', current );
            if( previous.active && !current.active ) this.emit( 'deactivated', current );
        }
    }
    /** Adds an event.
     * Order matters. Ensure that a parent event is created before a child event.
     * For example: an ssf event needs to be made after a normal event.
     * This is for character migration purposes.
     */
    async add( eventName, leagueName = 'Default' )
    {
        const controller = this.controller;
        try
        {
            const league = await this.root.leagues.get( leagueName );
            await controller.run( 'insert-event', [ eventName, league.id ], { ignoreDuplicates : true } );
        }
        catch( e )
        {
            console.log( e );
        }
    }

    async get( eventName )
    {
        const controller = this.controller;
        const rows = await controller.run( 'get-event-by-name', [ eventName ] );
        if( rows.length < 1 )
        {
            throw new Error( `Event '${eventName}' does not exist in the database.` );
        }
        const row = rows.pop();
        const league = await this.root.leagues.getByID( row.league_id );
        return new PathofExileEvent( row.id, row.name, row.active, league );
    }

    async getByID( eventID )
    {
        const controller = this.controller;
        const cached = this.cached;

        if( !cached[ eventID ] )
        {
            const rows = await controller.run( 'get-event-by-id', [ eventID ] );
            if( rows.length < 1 )
            {
                throw new Error( `Event with id '${eventID}' does not exist in the database.` );
            }
            const row = rows.pop();
            const league = await this.root.leagues.getByID( row.league_id );
            cached[ eventID ] = new PathofExileEvent( row.id, row.name, row.active, league );
            
        }
        return cached[ eventID ];
    }

    async activate( event )
    {
        const controller = this.controller;
        await controller.run( 'set-event-active', [ true, event.id ] );
    }
    
    async deactivate( event )
    {
        const controller = this.controller;
        await controller.run( 'set-event-active', [ false, event.id ] );
    }

    async getActive()
    {
        const controller = this.controller;
        const rows = await controller.run( 'get-events-active' );
        const events = [];
        for( const row of rows )
        {
            events.push( await this.getByID( row.id ) );
        }
        return events;
    }
}
