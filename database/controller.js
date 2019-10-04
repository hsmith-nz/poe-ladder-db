const MySQL = require( 'mysql2/promise' );
const Schema = require( './schema' );

module.exports =
class Controller 
{
    constructor( {
        host,
        user,
        schema,
        password,
        database,
        multipleStatements = true
    } )
    {
        this.config = {
            host,
            user,
            schema,
            password,
            database,
            multipleStatements,
        }
        this.connection = null;
        this.schema = null;
    }   
    async acquire()
    {
        if( !this.connection ){
            this.schema = await Schema.fromFolder( this.config.schema );
            delete this.config.schema;
            this.connection = await MySQL.createConnection( this.config );
            delete this.config.password;
        }
        return this.connection;
    }
    async createSchema()
    {
        const connection = await this.acquire();
        const statements = this.schema.create;
        for( const statement of statements  )
        {
            await statement.execute( connection );
        }
    }
    async destroySchema()
    {
        const connection = await this.acquire();
        const statements = this.schema.destroy;
        for( const statement of statements  )
        {
            await statement.execute( connection );
        }
    }
    async run( actionName, params = [], { ignoreDuplicates } = {} )
    {
        const connection = await this.acquire();
        const statement = this.schema.actions[ actionName ];
        try 
        {
            return await statement.execute( connection, params );
        }
        catch( e )
        {
            if( e.code === 'ER_DUP_ENTRY' && ignoreDuplicates )
            {
                // do nothing
            }
            else if( e.message === 'ENTRY_IGNORED' )
            {
                // do nothing
            }
            else
            {
                throw e;
            }
        }
    }
    async exit()
    {
        const connection = await this.acquire();
        await connection.close();
    }
}