const Manager = require( './manager' );

class PathofExileAccount
{
    constructor( name )
    {
        this.name = name;
        this.id = name;
    }
    get url()
    {
        return `https://www.pathofexile.com/account/view-profile/${this.name}`
    }
}

class PathofExileCharacter
{
    constructor( row, event )
    {
        this.id = row.id.toString( 'hex' );
        this.name = row.name;
        this.class = row.class;
        this.experience = row.experience;
        this.level = row.level;
        this.dead = row.dead;
        this.rank = row.rank;
        this.event = event;
        this.account = new PathofExileAccount( row.account_id );
    }
    get url()
    {
        return `${this.account.url}/characters?characterName=${this.name}`
    }
}

module.exports = 
class CharacterManager extends Manager
{
    constructor( view )
    {
        super( view );
    }
    async update( lastUpdate, thisUpdate )
    {
        const controller = this.controller;

        let deaths = await controller.run( 'get-character-deaths', [ lastUpdate, thisUpdate ]  );
        let levelUps = await controller.run( 'get-character-level-ups', [ lastUpdate, thisUpdate ]);
        let expUps = await controller.run( 'get-character-exp-ups', [ lastUpdate, thisUpdate ] );

        console.log( `deaths:`, deaths.length );
        console.log( `levels:`, levelUps.length );
        console.log( `exps:`, expUps.length );

        for( const change of levelUps )
        {
            const event = await this.root.events.getByID( change.event_id );
            const previous = new PathofExileCharacter( change, event );
            const current = new PathofExileCharacter( change, event );

            previous.level = current.level - change.level_change_total;

            this.emit( 'level', previous, current );
        }

        for( const change of deaths )
        {
            const event = await this.root.events.getByID( change.event_id );
            const previous = new PathofExileCharacter( change, event );
            const current = new PathofExileCharacter( change, event );
            
            previous.dead = current.dead - change.dead_change_total;

            this.emit( 'death', previous, current );
        }

        for( const change of expUps )
        {
            const event = await this.root.events.getByID( change.event_id );
            const previous = new PathofExileCharacter( change, event );
            const current = new PathofExileCharacter( change, event );

            previous.experience = current.experience - change.experience_change_total;

            this.emit( 'exp', previous, current );
        }
    
    }
    async push( event, character )
    {
        const controller = this.controller;

        try {
            await controller.run( 'upsert-character', 
                [ 
                    character.id,
                    character.name,
                    character.class,
                    character.experience,
                    character.level,
                    character.dead,
                    character.rank,
                    character.owner,
                    event.id,  // get the event id
                ] );
        }
        catch( e )
        {
            console.log( e );
        }
    }
}