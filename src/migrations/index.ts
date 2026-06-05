import * as migration_20260409_155721_initial from './20260409_155721_initial'
import * as migration_20260605_211500_edareview_cms_schema from './20260605_211500_edareview_cms_schema'

export const migrations = [
  {
    up: migration_20260409_155721_initial.up,
    down: migration_20260409_155721_initial.down,
    name: '20260409_155721_initial',
  },
  {
    up: migration_20260605_211500_edareview_cms_schema.up,
    down: migration_20260605_211500_edareview_cms_schema.down,
    name: '20260605_211500_edareview_cms_schema',
  },
]
