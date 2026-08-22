import InstructorModulePage from "./InstructorModulePage";
import {
  createBlog,
  deleteBlog,
  getManageBlogs,
  updateBlog,
} from "../../api/blog.services";

const categories = [
  "Programming",
  "Web Development",
  "Data Science",
  "Cyber Security",
  "Graphic Design",
  "Career",
  "Technology",
  "Other",
];

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const BlogManagement = () => (
  <InstructorModulePage
    title="Blogs"
    description="Create drafts and publish blog posts from your instructor account."
    queryKey="instructor-blogs"
    listFn={() => getManageBlogs({ limit: 100 })}
    listKeys={["blogs"]}
    createFn={createBlog}
    updateFn={updateBlog}
    deleteFn={deleteBlog}
    createLabel="Create Blog"
    colorful
    fields={[
      { name: "title", label: "Blog title", required: true },
      { name: "slug", label: "Slug", required: true, transform: slugify },
      {
        name: "category",
        label: "Category",
        type: "select",
        defaultValue: "Technology",
        options: categories.map((value) => ({ value, label: value })),
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        defaultValue: "Draft",
        options: ["Draft", "Published", "Archived"].map((value) => ({
          value,
          label: value,
        })),
      },
      {
        name: "photo",
        label: "Featured image",
        type: "file",
        accept: "image/*",
        read: (row) => row.featuredImage,
      },
      {
        name: "tags",
        label: "Tags comma separated",
        transform: (value) =>
          String(value || "")
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        read: (row) =>
          Array.isArray(row.tags) ? row.tags.join(", ") : row.tags,
      },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
      { name: "content", label: "Content", type: "textarea", required: true },
    ]}
    columns={[
      {
        label: "Image",
        render: (row) =>
          row.featuredImage ? (
            <img
              src={row.featuredImage}
              alt=""
              className="h-12 w-20 rounded-lg object-cover ring-2 ring-indigo-100"
            />
          ) : (
            <span className="text-xs text-gray-400">No image</span>
          ),
      },
      { label: "Title", render: (row) => row.title || "-" },
      { label: "Category", render: (row) => row.category || "-" },
      { label: "Status", render: (row) => row.status || "-" },
      { label: "Views", render: (row) => row.views ?? 0 },
    ]}
  />
);

export default BlogManagement;
