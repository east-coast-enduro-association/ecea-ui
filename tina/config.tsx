import { defineConfig, LocalAuthProvider } from 'tinacms';
import { UsernamePasswordAuthJSProvider, TinaUserCollection } from 'tinacms-authjs/dist/tinacms';
import { CsvUploaderScreen, UploadIcon } from './CsvUploaderScreen';

// Local dev talks to the filesystem + skips auth; production uses the
// self-hosted backend (GitHub + Upstash Redis) with username/password login.
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

import { blogCollection } from './collections/blog';
import { createEventsCollection } from './collections/events';
import { clubsCollection } from './collections/clubs';
import { seriesCollection } from './collections/series';
import { boardCollection } from './collections/board';
import { staffCollection } from './collections/staff';
import { sponsorsCollection } from './collections/sponsors';
import { getStartedPageCollection } from './collections/getStartedPage';
import { faqPageCollection } from './collections/faqPage';
import { siteInfoCollection } from './collections/siteInfo';
import { teamSeasonsCollection } from './collections/teamSeasons';
import { teamEventResultsCollection } from './collections/teamEventResults';
import { teamResultsCollection } from './collections/teamResults';

export default defineConfig({
  branch:
    process.env.TINA_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.HEAD ||
    'cms-setup',

  // Self-hosted: point the admin UI at our own backend instead of Tina Cloud.
  // (If the backend ends up on a different origin than the site, change this to
  // the backend's absolute URL, e.g. https://tina-backend.example.org/api/tina/gql)
  contentApiUrlOverride: '/api/tina/gql',
  authProvider: isLocal
    ? new LocalAuthProvider()
    : new UsernamePasswordAuthJSProvider(),

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  media: {
    tina: {
      mediaRoot: '',
      // Upload directly to src/assets (public/assets is a symlink that GitHub API can't traverse)
      publicFolder: 'src',
    },
  },

  cmsCallback: (cms) => {
    cms.plugins.add({
      __type: 'screen',
      name: 'Upload Team Results',
      Component: CsvUploaderScreen,
      Icon: UploadIcon,
      layout: 'popup',
      navCategory: 'Site',
    });
    return cms;
  },

  schema: {
    collections: [
      // Editor accounts (username/password) for the self-hosted backend.
      TinaUserCollection,

      blogCollection,

      // Events by year — add a new createEventsCollection(YYYY) each season.
      // Past years (locked: true) disable create/delete but remain editable.
      // Years older than ~2 seasons can be removed from here; content files
      // remain on disk and Astro still serves them.
      createEventsCollection(2026),
      createEventsCollection(2025, { locked: true }),

      clubsCollection,
      seriesCollection,
      boardCollection,
      staffCollection,
      sponsorsCollection,

      // Pages — each is a singleton collection so editors see only relevant fields
      getStartedPageCollection,
      faqPageCollection,

      siteInfoCollection,

      // Team competition (2026+)
      teamSeasonsCollection,
      teamEventResultsCollection,

      // Legacy team results (2025 and prior — read-only)
      teamResultsCollection,
    ],
  },
});
