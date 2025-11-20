import "./App.css";
import ButtonPrimary from "./components/ButtonPrimary";
function App() {
  const handleClick = () => {
    console.log("Button clicked!");
  };
  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center app-container">
        <h1 className="text-2xl mb-4">Sample Components</h1>
        <ButtonPrimary onClick={handleClick}>Primary Action</ButtonPrimary>
      </div>
    </>
  );
}

export default App;
