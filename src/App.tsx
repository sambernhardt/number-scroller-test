import ExampleV1 from "./versions/ExampleV1";
import ExampleV2 from "./versions/ExampleV2";
import ExampleV3 from "./versions/ExampleV3";

function App() {
  const examples = [
    {
      title: "Example 1",
      component: <ExampleV1 />,
    },
    {
      title: "Example 2",
      component: <ExampleV2 />,
    },
    {
      title: "Example 3",
      component: <ExampleV3 />,
    },
  ];

  return (
    <div className="max-w-[900px] mx-auto p-10">
      <div className="flex flex-col">
        {examples.map((example) => (
          <div key={example.title} className="flex flex-col gap-4">
            <h1>{example.title}</h1>
            <div className="border border-border rounded-xl p-4 min-h-[400px] flex items-center justify-center">
              {example.component}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
