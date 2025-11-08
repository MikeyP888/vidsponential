#!/usr/bin/env python3
"""Script to create a test table in Supabase and insert test records"""

import json
import urllib.request
import urllib.error

SUPABASE_URL = 'https://euzbpslzrimyokzvgbzk.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emJwc2x6cmlteW9renZnYnprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDU0OTkxNSwiZXhwIjoyMDY2MTI1OTE1fQ.0-f5AmioTZHU2PcSKOoSPAO_iQl4abiz4ZeA1dhRNRE'

def create_and_populate_table():
    """Create table and insert test records"""

    # First, let's try to insert records - if table doesn't exist, we'll get an error
    print("Attempting to insert test records into a_test_table...")

    test_records = [
        {"name": "Test Record 1", "description": "This is the first test record"},
        {"name": "Test Record 2", "description": "This is the second test record"},
        {"name": "Test Record 3", "description": "This is the third test record"}
    ]

    # Insert records using Supabase REST API
    url = f"{SUPABASE_URL}/rest/v1/a_test_table"
    headers = {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Prefer': 'return=representation'
    }

    data = json.dumps(test_records).encode('utf-8')

    try:
        req = urllib.request.Request(url, data=data, headers=headers, method='POST')
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print(f"\n✓ Successfully inserted {len(result)} test records!")
            print("\nInserted records:")
            for record in result:
                print(f"  - ID: {record.get('id')}, Name: {record.get('name')}")

    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"\n✗ Error inserting records (HTTP {e.code}):")
        print(f"  {error_body}")

        if e.code == 404 or 'relation' in error_body.lower():
            print("\n⚠ Table 'a_test_table' does not exist.")
            print("\nPlease create the table manually in Supabase with this SQL:")
            print("""
CREATE TABLE a_test_table (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
            """)
            return False

    # Verify records were created
    print("\nVerifying records in the table...")
    verify_url = f"{SUPABASE_URL}/rest/v1/a_test_table?select=*"
    verify_headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}'
    }

    try:
        req = urllib.request.Request(verify_url, headers=verify_headers, method='GET')
        with urllib.request.urlopen(req) as response:
            records = json.loads(response.read().decode('utf-8'))
            print(f"\n✓ Total records in a_test_table: {len(records)}")
            print("\nAll records:")
            print(json.dumps(records, indent=2))

    except urllib.error.HTTPError as e:
        print(f"\n✗ Error verifying records: {e.code}")
        print(f"  {e.read().decode('utf-8')}")
        return False

    return True

if __name__ == '__main__':
    success = create_and_populate_table()
    if not success:
        exit(1)
