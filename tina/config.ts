import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.HEAD ||
  "master";

const CLUBS = [
  {
    value: "BER",
    label: "BER"
  },
  {
    value: "CDR",
    label: "CDR"
  },
  {
    value: "CJCR",
    label: "CJCR"
  },
  {
    value: "DER",
    label: "DER"
  },
  {
    value: "DVTR",
    label: "DVTR"
  },
  {
    value: "GMER",
    label: "GMER"
  },
  {
    value: "HMDR",
    label: "HMDR"
  },
  {
    value: "IDR",
    label: "IDR"
  },
  {
    value: "MCI",
    label: "MCI"
  },
  {
    value: "MMC",
    label: "MMC"
  },
  {
    value: "OCCR",
    label: "OCCR"
  },
  {
    value: "RORR",
    label: "RORR"
  },
  {
    value: "RRMC",
    label: "RRMC"
  },
  {
    value: "SJER",
    label: "SJER"
  },
  {
    value: "SPER",
    label: "SPER"
  },
  {
    value: "STER",
    label: "STER"
  },
  {
    value: "TCSMC",
    label: "TCSMC"
  },
  {
    value: "VFTR",
    label: "VFTR"
  },
];

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: "e3b71653-2661-4a0c-876a-e8c6e2035132",
  // Get this from tina.io
  token: "bafa0c5b18caf0ef776bc31bc8568fe6b24ff40a",

  build: {
    outputFolder: "admin",
    publicFolder: "static",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "static",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [

      {
        name: "blog",
        label: "Blog",
        path: "content/english/blog",
        defaultItem: () => {
          return {
            draft: false,
            bg_image: "images/feature-bg.jpg",
            date: new Date().toLocaleString(),
            type: "post",
            layout: "blog",
            image: "images/logo-compact.png"
          }
        },
        fields: [
          {
            type: "boolean",
            name: "draft",
            label: "Draft",
            ui: {
              component: "hidden"
            }
          },
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "author",
            label: "Author",
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Publish Date",
            required: true,
            ui: {
              timeFormat: "HH:mm"
            }
          },
          {
            type: "image",
            name: "image",
            label: "Primary Image",
            required: true,
          },
          {
            type: "image",
            name: "bg_image",
            label: "Background Image",
            required: true,
            ui: {
              component: 'hidden'
            }
          },
          {
            type: 'string',
            name: 'categories',
            label: 'Categories',
            list: true,
            options: [
              {
                value: "Announcement",
                label: "Announcement"
              },
              {
                value: "News",
                label: "News"
              },
              {
                value: "On Your Minute",
                label: "On Your Minute"
              }
            ]
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },

      {
        name: "enduro_event",
        label: "Enduro Event",
        path: "content/english/events/enduro",
        defaultItem: () => {
          return {
            event_series: "ECEA Enduro Championship Series",
            event_type: "Enduro",
            bg_image: "images/feature-bg.jpg",
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Tag Line",
            required: true,
          },

          //TODO: reuse list of clubs
          {
            type: 'string',
            name: 'club',
            label: 'Club',
            list: true,
            options: CLUBS
          },
          {
            type: "datetime",
            name: "event_datetime",
            label: "Event Date",
            required: true,
          },
          {
            type: "string",
            name: "location",
            label: "Location",
            required: true,
          },

          //TODO: create event type array or map
          {
            type: "string",
            name: "event_format",
            label: "Event Format",
            required: true,
            list: true,
            ui: {
              component: "radio-group",
            },
            options: [
              {
                value: "Time Keeping",
                label: "Time Keeping"
              },
              {
                value: "Restart",
                label: "Restart"
              },
              {
                value: "Sprint Enduro",
                label: "Sprint Enduro"
              },
              {
                value: "National Enduro",
                label: "National Enduro"
              },
              {
                value: "Other",
                label: "Other"
              }
            ]
          },
          {
            type: "string",
            name: "closed_course",
            label: "Closed Course?",
            required: true,
            list: true,
            ui: {
              component: "radio-group"
            },
            options: [
              {
                value: "Yes",
                label: "Yes"
              },
              {
                value: "No",
                label: "No"
              }
            ]
          },
          {
            type: "string",
            name: "gas_away",
            label: "Gas Away?",
            required: false,
            list: true,
            ui: {
              component: "radio-group"
            },
            options: [
              {
                value: "Yes",
                label: "Yes"
              },
              {
                value: "No",
                label: "No"
              }
            ]
          },
          {
            type: "string",
            name: "start_grid",
            label: "Start Grid URL",
          },
          {
            type: "datetime",
            name: "key_time",
            label: "Key Time",
            ui: {
              timeFormat: "HH:mm"
            }
          },
          {
            type: "datetime",
            name: "check_in_time",
            label: "Check In Time",
            ui: {
              timeFormat: "HH:mm"
            }
          },
          {
            type: "datetime",
            name: "registration_date",
            label: "Pre-Entry Date",
            ui: {
              timeFormat: "HH:mm"              
            },
            required: false,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Description and information about event",
            required: true,
            isBody: true,
          },
          {
            type: "image",
            name: "preview_image",
            label: "Club Logo",
            required: true,
          },
          // {
          //   type: "object",
          //   name: "attachments",
          //   label: "Event Attachments",
          //   list: true,
          //   fields: [
          //     {
          //       type: "media",

          //     }
          //   ]
          // }
        ]
      },

      {
        name: "harescramble_event",
        label: "Hare Scramble Event",
        path: "content/english/events/harescramble",
        defaultItem: () => {
          return {
            event_series: "ECEA Hare Scramble Series",
            event_type: "Hare Scramble",
            event_format: "Hare Scramble",
            bg_image: "images/feature-bg.jpg",
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Tag Line",
            required: true,
          },

          //TODO: reuse list of clubs
          {
            type: 'string',
            name: 'club',
            label: 'Club',
            list: true,
            options: CLUBS
          },
          {
            type: "datetime",
            name: "event_datetime",
            label: "Event Date",
            required: true,
          },
          {
            type: "string",
            name: "location",
            label: "Location",
            required: true,
          },
          {
            type: "datetime",
            name: "key_time",
            label: "Key Time",
            ui: {
              timeFormat: "HH:mm"
            }
          },
          {
            type: "datetime",
            name: "check_in_time",
            label: "Check In Time",
            ui: {
              timeFormat: "HH:mm"
            }
          },
          {
            type: "datetime",
            name: "registration_date",
            label: "Pre-Entry Date",
            ui: {
              timeFormat: "HH:mm"
            }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Description and information about event",
            required: true,
            isBody: true
          },
          {
            type: "image",
            name: "preview_image",
            label: "Club Logo",
            required: true,
          },
          {
            type: "image",
            name: "flyer",
            label: "Flyer Image",
            required: false,
          },
        ]
      },

      {
        name: "fastkidz_event",
        label: "FastKIDZ Event",
        path: "content/english/events/fastkidz",
        defaultItem: () => {
          return {
            event_series: "ECEA Youth Series",
            event_type: "Hare Scramble",
            event_format: "Hare Scramble",
            bg_image: "images/feature-bg.jpg",
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Tag Line",
            required: true,
          },

          //TODO: reuse list of clubs
          {
            type: 'string',
            name: 'club',
            label: 'Club',
            list: true,
            options: CLUBS
          },
          {
            type: "datetime",
            name: "event_datetime",
            label: "Event Date",
            required: true,
          },
          {
            type: "string",
            name: "location",
            label: "Location",
            required: true,
          },
          {
            type: "datetime",
            name: "key_time",
            label: "Key Time",
            ui: {
              timeFormat: "HH:mm"
            }
          },
          {
            type: "datetime",
            name: "check_in_time",
            label: "Check In Time",
            ui: {
              timeFormat: "HH:mm"
            }
          },
          {
            type: "datetime",
            name: "registration_date",
            label: "Pre-Entry Date",
            ui: {
              timeFormat: "HH:mm"
            }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Description and information about event",
            required: true,
            isBody: true
          },
          {
            type: "image",
            name: "preview_image",
            label: "Club Logo",
            required: true,
          },
          {
            type: "image",
            name: "flyer",
            label: "Flyer Image",
            required: false,
          },
        ]
      },

      {
        name: "special_event",
        label: "Special Event",
        path: "content/english/events/special",
        defaultItem: () => {
          return {
            event_series: "Special Series",
            event_type: "Special",
            bg_image: "images/feature-bg.jpg",
            event_format: "Special"
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Tag Line",
            required: true,
          },

          //TODO: reuse list of clubs
          {
            type: 'string',
            name: 'club',
            label: 'Club',
            list: true,
            options: CLUBS
          },
          {
            type: "datetime",
            name: "event_datetime",
            label: "Event Date",
            required: true,
          },
          {
            type: "string",
            name: "location",
            label: "Location",
            required: true,
          },
          {
            type: "datetime",
            name: "key_time",
            label: "Key Time",
            ui: {
              timeFormat: "HH:mm"
            }
          },
          {
            type: "datetime",
            name: "check_in_time",
            label: "Check In Time",
            ui: {
              timeFormat: "HH:mm"
            }
          },
          {
            type: "datetime",
            name: "registration_date",
            label: "Pre-Entry Date",
            ui: {
              timeFormat: "HH:mm"
            }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Description and information about event",
            required: true,
            isBody: true
          },
          {
            type: "image",
            name: "preview_image",
            label: "Club Logo",
            required: true,
          },
          {
            type: "image",
            name: "flyer",
            label: "Flyer Image",
            required: false,
          },
        ]
      },

      {
        name: "dual_sport",
        label: "Dual Sport",
        path: "content/english/events/dualsport",
        defaultItem: () => {
          return {
            event_series: "Dual Sport Series",
            event_type: "Dual Sport",
            event_format: "Dual Sport",
            bg_image: "images/feature-bg.jpg",
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Tag Line",
            required: true,
          },
          //TODO: reuse list of clubs
          {
            type: 'string',
            name: 'club',
            label: 'Club',
            list: true,
            options: CLUBS
          },
          {
            type: "datetime",
            name: "event_datetime",
            label: "Event Date",
            required: true,
          },
          {
            type: "string",
            name: "location",
            label: "Location",
            required: true,
          },
          {
            type: "datetime",
            name: "check_in_time",
            label: "Check In Time",
            ui: {
              timeFormat: "HH:mm"
            }
          },
          {
            type: "datetime",
            name: "registration_date",
            label: "Pre-Entry Date",
            ui: {
              timeFormat: "HH:mm"
            }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Description and information about event",
            required: true,
            isBody: true
          },
          {
            type: "image",
            name: "preview_image",
            label: "Club Logo",
            required: true,
          },
          {
            type: "image",
            name: "flyer",
            label: "Flyer Image",
            required: false,
          },
        ]
      }

    ],
  },
});
