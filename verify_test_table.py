#!/usr/bin/env python3
"""Verify the test table was created successfully"""

import json
import urllib.request
import urllib.error

SUPABASE_URL = 'https://euzbpslzrimyokzvgbzk.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emJwc2x6cmlteW9renZnYnprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDU0OTkxNSwiZXhwIjoyMDY2MTI1OTE1fQ.0-f5AmioTZHU2PcSKOoSPAO_iQl4abiz4ZeA1dhRNRE'

def verify_table():
    """Verify the test table exists and has records"""

    print("Checking a_test_table...")

    url = f"{SUPABASE_URL}/rest/v1/a_test_table?select=*"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}'
    }

    try:
        req = urllib.request.Request(url, headers=headers, method='GET')
        with urllib.request.urlopen(req) as response:
            records = json.loads(response.read().decode('utf-8'))

            print(f"\n✓ SUCCESS! Table 'a_test_table' exists!")
            print(f"✓ Found {len(records)} record(s)\n")

            if len(records) > 0:
                print("Records in table:")
                print("-" * 80)
                for record in records:
                    print(f"ID: {record.get('id')}")
                    print(f"Name: {record.get('name')}")
                    print(f"Description: {record.get('description')}")
                    print(f"Created: {record.get('created_at')}")
                    print("-" * 80)
            else:
                print("⚠ Table exists but is empty")

            return True

    except urllib.error.HTTPError as e:
        if e.code == 404:
            print("\n✗ Table 'a_test_table' does not exist yet")
            print("Please run the SQL in your Supabase dashboard first")
        else:
            error_body = e.read().decode('utf-8')
            print(f"\n✗ Error (HTTP {e.code}): {error_body}")
        return False

if __name__ == '__main__':
    success = verify_table()
    exit(0 if success else 1)
