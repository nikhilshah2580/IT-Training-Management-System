import InstructorModulePage from "./InstructorModulePage";
import {
  createResource,
  deleteResource,
  getResources,
  updateResource,
} from "../../api/resource.services";

const ResourceManagement = () => (
  <InstructorModulePage
    title="Resources"
    description="Add links, videos, PDFs, documents, and other resources for your courses."
    queryKey="instructor-resources"
    listFn={() => getResources({ limit: 100 })}
    listKeys={["resources"]}
    createFn={createResource}
    updateFn={updateResource}
    deleteFn={deleteResource}
    createLabel="Add Resource"
    fields={[
      {
        name: "course",
        label: "Select course",
        type: "select",
        optionsKey: "courses",
        required: true,
        omitOnEdit: true,
        read: (row) => row.course?._id || row.course,
      },
      { name: "title", label: "Resource title", required: true },
      {
        name: "type",
        label: "Type",
        type: "select",
        required: true,
        options: ["video", "pdf", "document", "link", "image", "other"].map(
          (value) => ({ value, label: value }),
        ),
      },
      { name: "url", label: "Resource URL", required: true },
      {
        name: "isPublished",
        label: "Published",
        type: "checkbox",
        defaultValue: true,
      },
      { name: "description", label: "Description", type: "textarea" },
    ]}
    columns={[
      { label: "Title", render: (row) => row.title || "-" },
      { label: "Course", render: (row) => row.course?.title || "-" },
      { label: "Type", render: (row) => row.type || "-" },
      { label: "Published", render: (row) => (row.isPublished ? "Yes" : "No") },
    ]}
  />
);

export default ResourceManagement;
