const { EventEmitter } = require( 'events' );

module.exports = 
class ObjectManager extends EventEmitter
{
    constructor( view )
    {
        super();
        this.root = view;
        this.controller = view.controller;
    }
    async update( lastUpdate ){}
}