import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { useCreateSurvey } from "@/features/surveys/survey.hooks";

const createSurveySchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim()
});

type CreateSurveyValues = z.infer<typeof createSurveySchema>;

export function CreateSurveyPage() {
  const navigate = useNavigate();
  const createSurvey = useCreateSurvey();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<CreateSurveyValues>({
      resolver: zodResolver(createSurveySchema),
      defaultValues: { title: "", description: "" }
    });

  const submit = async (values: CreateSurveyValues) => {
    const survey = await createSurvey.mutateAsync(values);
    navigate(`/surveys/${survey.id}/edit`);
  };

  return (
    <div>
      <PageHeader title="Create Survey" description="Add the basic survey details." />
      <form onSubmit={handleSubmit(submit)} className="max-w-xl rounded-lg border border-neutral-200 bg-white p-6">
        {createSurvey.error ? (
          <div className="mb-4">
            <ErrorState message={createSurvey.error.message} />
          </div>
        ) : null}
        <label className="block text-sm font-medium">
          Title
          <input
            className="mt-2 h-10 w-full rounded-md border border-neutral-300 px-3"
            placeholder="Customer feedback"
            {...register("title")}
          />
        </label>
        {errors.title ? <p className="mt-1 text-sm text-red-600">{errors.title.message}</p> : null}
        <label className="mt-4 block text-sm font-medium">
          Description
          <textarea
            className="mt-2 min-h-24 w-full rounded-md border border-neutral-300 px-3 py-2"
            placeholder="What would you like to learn?"
            {...register("description")}
          />
        </label>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" className="bg-white text-neutral-900 border border-neutral-300" onClick={() => navigate("/surveys")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || createSurvey.isPending}>
            {createSurvey.isPending ? "Creating..." : "Create Survey"}
          </Button>
        </div>
      </form>
    </div>
  );
}
