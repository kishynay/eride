import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://vcviezwcjaowpndxsbyp.supabase.co"                     // supabaseUrl
const supabaseKey = "sb_publishable_G7vh6X8EVT2oNInXIfRNNA_FxgnzTeV"              // anon_key supabase

export const supabase = createClient(supabaseUrl, supabaseKey)