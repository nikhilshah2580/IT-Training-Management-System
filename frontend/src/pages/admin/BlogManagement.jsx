import AdminModulePage from "./AdminModulePage";
import {
  getManageBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
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
  <AdminModulePage
    title="Blog Management"
    description="Create, publish, archive, and manage platform blogs."
    queryKey="admin-blogs"
    listFn={() => getManageBlogs({ limit: 100 })}
    listKeys={["blogs"]}
    createFn={createBlog}
    updateFn={updateBlog}
    deleteFn={deleteBlog}
    createLabel="Create Blog"
    fields={[
      { name: "title", label: "Title", required: true },
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
      { name: "featuredImage", label: "Featured image URL" },
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
      { label: "Title", render: (row) => row.title || "-" },
      { label: "Category", render: (row) => row.category || "-" },
      { label: "Status", render: (row) => row.status || "-" },
      { label: "Views", render: (row) => row.views ?? 0 },
    ]}
  />
);
export default BlogManagement;
