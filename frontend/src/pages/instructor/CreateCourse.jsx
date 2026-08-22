import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { createCourse } from "../../api/course.services";
import CourseForm from "../../components/course/CourseForm";
import { getErrorMessage } from "../../utils/toast";

const CreateCourse = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createCourse,

    onSuccess: (data) => {
      toast.success(data?.message || "Course created successfully");

      navigate("/instructor/courses");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create course"));
    },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <CourseForm
        onSubmit={(formData) => mutation.mutate(formData)}
        onCancel={() => navigate("/instructor/courses")}
        loading={mutation.isPending}
        submitText="Create Course"
      />
    </div>
  );
};

export default CreateCourse;
