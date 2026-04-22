import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lnsnqosxarmgechnveky.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_SERVICE_KEY) {
  console.error('Set SUPABASE_SERVICE_KEY env var')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const BUCKET = 'product-images'
const BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`

// slug → exact folder name in bucket
const SLUG_TO_FOLDER = {
  'kova-modular-sofa':   'Kova Modular Sofa',
  'kova-lounge-chair':   'Kova Lounge Chair',
  'aldren-coffee-table': 'Aldren Coffee Table',
  'lune-bed-frame':      'Lune Bed Frame',
  'aldren-nightstand':   'Aldren Nightstand',
  'sable-dresser':       'Sable Dresser',
  'kova-dining-table':   'Kova Dining Table',
  'sato-dining-chair':   'Sato Dining Chair',
}

async function run() {
  for (const [slug, folder] of Object.entries(SLUG_TO_FOLDER)) {
    const { data: files, error } = await supabase.storage
      .from(BUCKET)
      .list(folder, { sortBy: { column: 'name', order: 'asc' } })

    if (error) {
      console.log(`⚠  ${slug}: ${error.message}`)
      continue
    }

    if (!files || files.length === 0) {
      console.log(`–  ${slug}: no files found`)
      continue
    }

    const urls = files
      .filter((f) => f.name && !f.name.startsWith('.'))
      .map((f) => `${BASE_URL}/${encodeURIComponent(folder)}/${encodeURIComponent(f.name)}`)

    const { error: updateError } = await supabase
      .from('products')
      .update({ images: urls })
      .eq('slug', slug)

    if (updateError) {
      console.log(`✗  ${slug}: ${updateError.message}`)
    } else {
      console.log(`✓  ${slug}: ${urls.length} image(s) set`)
      urls.forEach((u) => console.log(`     ${u}`))
    }
  }

  console.log('\nDone. Refresh your product pages.')
}

run()
