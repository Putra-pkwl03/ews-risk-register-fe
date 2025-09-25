export default function SpinnerLoader() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
        <p className="text-gray-700 text-sm">Loading...</p>
      </div>
    </div>
  );
}