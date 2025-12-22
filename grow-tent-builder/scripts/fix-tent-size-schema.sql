-- Fix tent_size column type in preset_sets table
-- This script handles existing non-JSON text (like "150x150x200") by converting it to empty JSON.
-- Run this in Supabase SQL Editor

DO $$
BEGIN
    -- Only run if column exists and is not already JSONB
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'preset_sets' 
        AND column_name = 'tent_size' 
        AND data_type != 'jsonb'
    ) THEN
        -- Alter column to JSONB
        -- If data looks like JSON (starts with {), cast it.
        -- Otherwise (like "150x150x200"), reset to empty JSON object '{}'.
        ALTER TABLE preset_sets 
        ALTER COLUMN tent_size TYPE JSONB 
        USING CASE 
            WHEN trim(tent_size) LIKE '{%}' THEN tent_size::jsonb
            ELSE '{}'::jsonb
        END;
    END IF;
END $$;
