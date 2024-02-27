import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

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
        name: "enduro-event",
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
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
          },

          //TODO: reuse list of clubs
          {
            type: 'string',
            name: 'club',
            label: 'Club',
            list: true,
            options: [
              {
                value: "BER",
              }, 
              {
                value: "CDR",
              }, 
              {
                value: "CJCR",
              },
              {
                value: "DER",
              },
              {
                value: "DVTR",
              }, 
              {
                value: "GMER",
              }, 
              {
                value: "HMDR",
              }, 
              {
                value: "IDR",
              }, 
              {
                value: "MCI",
              }, 
              {
                value: "MMC",
              }, 
              {
                value: "OCCR",
              }, 
              {
                value: "RORR",
              }, 
              {
                value: "RRMC",
              }, 
              {
                value: "SJER",
              }, 
              {
                value: "SPER",
              },
              {
                value: "STER",
              }, 
              {
                value: "TCSMC",
              }, 
              {
                value: "VFTR",
              }, 
            ]
          },
          {
            type: "datetime",
            name: "event_datetime",
            label: "Event Date",
            required: true,
          },
          {
            type: "string",
            name: "address",
            label: "Location",
            required: true,
          },

          //TODO: create event type array
          {
            type: "string",
            name: "event_type",
            label: "Event Type",
            required: true,
            list: true,
            options: [
              {
                value: "Time Keeping"
              },
              {
                value: "Restart"
              },
              {
                value: "Sprint Enduro"
              },
              {
                value: "National Enduro"
              },
              {
                value: "Other"
              }
            ]
          },
          {
            type: "string",
            name: "closed_course",
            label: "Closed Course?",
            required: true,
            list: true,
            options: [
              {
                value: "Yes"
              },
              {
                value: "No"
              }
            ]
          },
          {
            type: "string",
            name: "gas_away",
            label: "Gas Away?",
            required: false,
            list: true,
            options: [
              {
                value: "Yes"
              },
              {
                value: "No"
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
            }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Description and information about event",
            required: true
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



    ],
  },
});
