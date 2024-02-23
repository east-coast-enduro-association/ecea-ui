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
              }, {
                value: "News",
                label: "News"
              }, {
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



    ],
  },
});
