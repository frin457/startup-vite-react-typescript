const Playground: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Developer Playground</h1>
        <div className="p-4 bg-gray-50 rounded border border-gray-200">
          <p className="text-gray-700">This is a development-only playground. You can add experimental components and test features here.</p>
        </div>
      </div>
    </div>
  );
};

export default Playground;
