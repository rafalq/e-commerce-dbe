import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatarUploader: f({ image: { maxFileSize: "2MB" } })
    // Set permissions and file types for this FileRoute
    .onUploadComplete(async () => {}),
  variantUploader: f({
    image: { maxFileCount: 10, maxFileSize: "4MB" },
  }).onUploadComplete(async () => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
