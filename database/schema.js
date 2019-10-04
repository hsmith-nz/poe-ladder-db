const fs = require( 'fs' );
const glob = require( 'glob' );
const path = require( 'path' );

class SchemaEntry
{
    constructor( filename, statement )
    {
        this.filename = filename;
        this.statement = statement;
    }
    async execute( connection, params = [] )
    {
        try 
        {
            const [ res, ] = await connection.query( this.statement, params );
            return res;
        }
        catch( e )
        {
            if( e.code === 'ER_PARSE_ERROR' )
            {
                this.error();
                //console.log( params );
                console.log( e );
            }
            else
            {
                throw e;
            }
        }
    }
    error()
    {
        console.log( `\n\n` );
        console.log( `Parse error on [${this.filename}] script: ` );
        const lines = this.statement.split( '\n' );
        let n = 1;
        for( const line of lines )
        {
            console.log( `${(n++).toString().padStart( 3, '0' )} : ${line}` );
        }  
        console.log( `\n\n` );
    }
}

module.exports = 
class Schema 
{
    constructor()
    {
        this.create = [];
        this.destroy = [];
        this.actions = {};
    }

    static async fromFolder( folder )
    {
        const rootFolder = path.dirname( path.dirname( __filename ) );
        const filenames = await glob.sync( `${folder}/**/*.sql`, { cwd : rootFolder } );

        const schema = new Schema();

        for( const filename of filenames )
        {
            const split = filename.split('/').slice( 1 );
            const group = split.shift();
            const base = path.basename( filename );
            const name = base.split( '.' ).slice( 0, -1 ).join( '-' );

            const contents = await fs.readFileSync( path.join( rootFolder, filename ), { encoding : 'utf8' } ).split('\n').map( s => s.replace(/\s+/g,' ').trim() ).join( '\n' );

            switch( group )
            {
                case 'create' : 
                    schema.create.push( new SchemaEntry( base, contents ) );
                    break;
                case 'destroy' : 
                    schema.destroy.push( new SchemaEntry( base, contents ) );
                    break;
                case 'actions' : 
                    schema.actions[ name ] = new SchemaEntry( base, contents );
                    break;
            }
        }

        return schema;
    }
}
