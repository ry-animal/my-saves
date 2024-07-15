# my-saves

## Site URL

[MySaves](https://my-saves-seven.vercel.app/)

MySaves: Save, Share, Stream
MySaves is a web application that allows visitors to submit YouTube videos, see all the submissions, and play the videos submitted by others in a beautiful UI.
Feature ideas:

- Submit: Provide a way to submit either a YouTube video (example: https://www.youtube.com/watch?v=dQw4w9WgXcQ) or a YouTube short (example: https://youtube.com/shorts/pDlalQiF5Yg) to the app.
- Permalink Page: Represent each submission as an individual “post” (think of it as a Reddit post) on the app with a permalink. The post page embeds the YouTube video and auto-plays the video when someone opens the URL in the browser.
  - For simplicity, any visitor can remove this saved video (e.g. delete the post) from the app from this page.
  - The URL of the page could look like this: https://xyz.vercel.app/p/1234 where 1234 is the internal identifier of the post.
- Open Graph Tags: Sharing the link to the post on Twitter, iMessage, or SMS shows a rich preview that includes the thumbnail, title, and any other interesting details about that post.
- Grid View: A page that shows all submissions in a grid view. The user can click on any of the grid items to go to the permalink. The visitor should be able to go to the next post from the permalink page.
- ...any other interesting features that you can think of!
  Design and Implementation Considerations:
- First and foremost, as a user, the app should be a delight to use from the latest mobile and desktop browsers.
- The app should be written in Typescript and built with the latest version of Next.js as the React framework and use Tailwind CSS for the UI design.
  - Note: The app does not have to use the /app directory feature in NextJS.
- The end goal of this app is to provide a great user experience. If any packages, libraries, or AI assistants can help us achieve that goal, it’s completely ok. Some packages we like are Redux ToolKit (RTK), Axios, and @headlessui/react.
- The app can be built with or without any database or caching solutions. If you plan on using a database, we encourage using off-the-shelf solutions such as Vercel KV, Vercel Postgres, Supabase, PlanetScale, etc. to simplify the integration.
  - Caution: Please watch out for the cold start issue since that can negatively impact the user experience.
    Deliverables:

1. A private GitHub repository with @raxityo and @anoakie added as collaborators. Feel free to leave your thought process, approach, and UX in the README.md of your repository.
2. A link to your production app on Vercel or any other platform.

References:

- React Player: https://github.com/CookPete/react-player
- Next.js + Image Gallery Starter: https://vercel.com/templates/next.js/image-gallery-starter
  - Demo: https://nextjsconf-pics.vercel.app/
- Many other helpful Next.js examples can be found here for inspiration on the implementation: https://github.com/vercel/next.js/tree/canary/examples
- YouTube data API to get metadata for videos: https://developers.google.com/youtube/v3/docs/videos
