const ChallengesManager = require( './managers/challenges-manager');
const CharacterManager = require( './managers/character-manager' );
const AccountManager = require( './managers/account-manager' );
const LeagueManager = require( './managers/league-manager' );
const EventManager = require( './managers/event-manager' );
const Controller = require( '../database/controller' );

const config = require( '../config.json' );

module.exports = 
class Database 
{
    constructor( { host, user, password } = config, events = false )
    {
        this.controller = new Controller( { host, user, password, database : 'poe', schema : 'schema' } );
        this.challenges = new ChallengesManager( this );
        this.characters = new CharacterManager( this );
        this.accounts = new AccountManager( this );
        this.leagues = new LeagueManager( this );
        this.events = new EventManager( this );

        this._lastUpdate = Math.floor( Date.now() / 1000 ) * 1000;

        if( events ) this.autoUpdate();
    }
    async autoUpdate( seconds = 10 )
    {
        
        while( true )
        {
            const lastUpdate = this._lastUpdate;
            this._lastUpdate = Math.floor( Date.now() / 1000 ) * 1000;
            const thisUpdate = this._lastUpdate;
            
            try 
            {
                await this.pumpUpdates( lastUpdate, thisUpdate );
                console.log( `pumped updates for [${lastUpdate}] to [${thisUpdate}] ...` );
            }
            catch( e )
            {
                console.log( e );
                this._lastUpdate = lastUpdate;
            }
            finally
            {
                await new Promise( res => setTimeout( res, 1000 * seconds ) );
            }
        }
    
    }
    async pumpUpdates( lastUpdate, thisUpdate )
    {
        await this.challenges.update( lastUpdate, thisUpdate );
        await this.characters.update( lastUpdate, thisUpdate );
        await this.accounts.update( lastUpdate, thisUpdate );
        await this.leagues.update( lastUpdate, thisUpdate );
        await this.events.update( lastUpdate, thisUpdate );
    }
    async delete( confirm )
    {
        if( confirm === 'CONFIRM' )
        {
            const controller = this.controller;
            await controller.destroySchema();
        }
        else 
        {
            throw new Error( 'Cannot call poe.delete without string \'CONFIRM\' as argument. WARNING THIS WILL DELETE ALL DATA AND DATABASE SCHEMA ASSOCIATED WITH THIS APPLICATION.' );
        }
    }
    async install()
    {
        const controller = this.controller;
        await controller.createSchema();
    }
}