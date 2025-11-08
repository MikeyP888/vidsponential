-- Create test table
CREATE TABLE IF NOT EXISTS a_test_table (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert test records
INSERT INTO a_test_table (name, description) VALUES
    ('Test Record 1', 'This is the first test record'),
    ('Test Record 2', 'This is the second test record'),
    ('Test Record 3', 'This is the third test record');

-- Verify records
SELECT * FROM a_test_table;
