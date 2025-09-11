const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex items-center space-x-3">
        <span className="text-white text-lg font-semibold">Loading...</span>
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
