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

class PathofExileChallenges
{
    constructor( row, league )
    {
        this.account = new PathofExileAccount( row.account_id ); 
        this.league = league;
        this.total = row.total;
    }
}

module.exports = 
class ChallengesManager extends Manager
{
    constructor( view )
    {
        super( view );
    }
    async update( lastUpdate, thisUpdate )
    {
        const controller = this.controller;

        let challenges = await controller.run( 'get-challenges-ups', [ lastUpdate, thisUpdate ] );

        for( const change of challenges )
        {
            const league = await this.root.leagues.getByID( change.league_id );
            const previous = new PathofExileChallenges( change, league );
            const current = new PathofExileChallenges( change, league );

            previous.total = current.total - change.total_change_total;

            this.emit( 'challenges', previous, current );
        }
    }
    async push( event, accountName, total )
    {
        const controller = this.controller;
        await controller.run( 'upsert-challenges', 
        [
            accountName,
            event.league.id,
            total,   
        ] )
    }
}