import "dotenv/config";
import { supabase } from "./server/supabase";

async function checkSchema() {
    console.log("Checking columns for table 'posts'...");
    const { data, error } = await supabase.from('posts').select('*').limit(1);

    if (error) {
        if (error.message.includes('column')) {
            console.error("Error detected:", error.message);
        } else {
            console.error("Unexpected error:", error);
        }
    } else {
        console.log("Columns found:", Object.keys(data[0] || {}).join(", "));
    }

    process.exit(0);
}

checkSchema();
