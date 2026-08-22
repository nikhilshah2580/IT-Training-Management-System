import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getCourseById, updateCourse } from "../../api/course.services";
import CourseForm from "../../components/course/CourseForm";
import { getErrorMessage } from "../../utils/toast";

const EditCourse = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // -----------------------------------------
  // GET COURSE
  // -----------------------------------------

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["course", id],

    queryFn: () => getCourseById(id),

    enabled: Boolean(id),
  });

  // -----------------------------------------
  // UPDATE
  // -----------------------------------------

  const updateMutation = useMutation({
    mutationFn: (formData) => updateCourse(id, formData),

    onSuccess: (response) => {
      toast.success(response?.message || "Course updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["course", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      navigate("/instructor/courses");
    },

    onError: (error) => {
      console.error("Update course:", error?.response?.data);

      toast.error(getErrorMessage(error, "Failed to update course"));
    },
  });

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-gray-500">Loading course...</p>
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // ERROR
  // -----------------------------------------

  if (isError) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Failed to load course
        </h2>

        <p className="mt-2 text-gray-500">
          {getErrorMessage(error, "Course not found")}
        </p>

        <button
          onClick={() => navigate("/instructor/courses")}
          className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-white"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const course = data?.course;

  if (!course) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <h2 className="text-xl font-semibold">Course not found</h2>

        <button
          onClick={() => navigate("/instructor/courses")}
          className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-white"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <CourseForm
        course={course}
        onSubmit={(formData) => updateMutation.mutate(formData)}
        onCancel={() => navigate("/instructor/courses")}
        loading={updateMutation.isPending}
        submitText="Update Course"
      />
    </div>
  );
};

export default EditCourse;
