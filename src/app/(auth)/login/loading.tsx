import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function LoginLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}