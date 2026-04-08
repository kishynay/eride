import { createClient } from "@supabase/supabase-js"
import { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vcviezwcjaowpndxsbyp.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_G7vh6X8EVT2oNInXIfRNNA_FxgnzTeV"

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
