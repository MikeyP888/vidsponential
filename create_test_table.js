// Script to create a test table in Supabase and insert test records

const SUPABASE_URL = 'https://euzbpslzrimyokzvgbzk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emJwc2x6cmlteW9renZnYnprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDU0OTkxNSwiZXhwIjoyMDY2MTI1OTE1fQ.0-f5AmioTZHU2PcSKOoSPAO_iQl4abiz4ZeA1dhRNRE';

async function createTestTable() {
    try {
        console.log('Creating test table a_test_table...');

        // Create table using SQL via Supabase REST API
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS a_test_table (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
            );
        `;

        const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify({ query: createTableSQL })
        });

        // If the exec_sql function doesn't exist, try direct SQL execution
        if (!createResponse.ok) {
            console.log('Trying alternative method to create table...');

            // Use the query endpoint if available
            const altResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Prefer': 'return=minimal'
                }
            });
        }

        console.log('Table creation attempted. Now inserting test records...');

        // Insert test records
        const testRecords = [
            { name: 'Test Record 1', description: 'This is the first test record' },
            { name: 'Test Record 2', description: 'This is the second test record' },
            { name: 'Test Record 3', description: 'This is the third test record' }
        ];

        const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/a_test_table`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(testRecords)
        });

        if (!insertResponse.ok) {
            const errorText = await insertResponse.text();
            console.error('Error inserting records:', insertResponse.status, errorText);
            throw new Error(`Failed to insert records: ${insertResponse.status} - ${errorText}`);
        }

        const insertedData = await insertResponse.json();
        console.log('Successfully inserted test records:');
        console.log(JSON.stringify(insertedData, null, 2));

        // Verify records were created
        console.log('\nVerifying records...');
        const selectResponse = await fetch(`${SUPABASE_URL}/rest/v1/a_test_table?select=*`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!selectResponse.ok) {
            const errorText = await selectResponse.text();
            console.error('Error fetching records:', selectResponse.status, errorText);
            throw new Error(`Failed to fetch records: ${selectResponse.status}`);
        }

        const records = await selectResponse.json();
        console.log(`\nTotal records in a_test_table: ${records.length}`);
        console.log('Records:', JSON.stringify(records, null, 2));

    } catch (error) {
        console.error('Error:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

// Run the script
createTestTable();
