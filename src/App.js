import logo from "./imgs/logo.svg";
import pixi from "./imgs/pixi.svg";
import tailwindSvg from "./imgs/tailwind.svg";
import "./styles/App.css";
import { useDispatch, useSelector } from "react-redux";
import DodgeGame from './DodgeGame';
import { useEffect, useState } from "react";
import {
  exampleCallbackRequest,
  exampleReducerRequest,
} from "./store/actions/example";

function App() {
  const dispatch = useDispatch();
  const [example, setExample] = useState(false);
  // const exampleData = useSelector((state) => state.exampleReducer.chuckNorris);

  useEffect(() => {
    console.info("did mount");
  }, []);

  // useEffect(() => {
  //   console.info("reducer example data muuttui");
  // }, [exampleData]);


  return (
    <div className="App">
      {/* <header className="App-header">
        <div className="flex flex-row w-full justify-center gap-x-20">
          <div className="flex flex-col text-gray-200 bg-[#12192b]  w-[250px]  whitespace-nowrap rounded-md">
            <div className="bg-[#12192b]  h-8 border-b border-gray-800 mx-2">
              <img src={tailwindSvg} className="h-6  pt-2 pl-2" />
            </div>
            <div className="flex flex-col my-3 text-2xl text-left px-4">
              <a
                target="_blank"
                href="https://tailwindcss.com/docs/installation"
                className=" hover:underline"
              >
                Tailwind doc
              </a>
            </div>
          </div>
          <div className="flex flex-row">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <div className="flex flex-col  bg-[#242526] w-[250px]  whitespace-nowrap rounded-lg border border-[#28282b]">
            <div className="bg-[#242526]  h-8 border-b border-[#1b1b1d] mx-2">
              <img src={pixi} className="h-6  pt-2 pl-2" />
            </div>

            <div className="flex flex-col my-3 text-lg text-left mx-2 font-semibold gap-y-2">
              <a
                target="_blank"
                href="https://pixijs.com/guides"
                className=" hover:bg-[#2f3031] px-2 py rounded-lg hover:text-[#e91e63]"
              >
                Guides
              </a>

              <a
                target="_blank"
                href="https://pixijs.com/tutorial"
                className=" hover:bg-[#2f3031] px-2 rounded-lg hover:text-[#e91e63]"
              >
                {" "}
                Tutorials
              </a>
              <a
                target="_blank"
                href="https://pixijs.com/examples"
                className=" hover:bg-[#2f3031] px-2 rounded-lg hover:text-[#e91e63]"
              >
                Examples
              </a>
            </div>
          </div>
        </div>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        <div className="flex flex-row gap-x-10">
          <div className="flex flex-col">
            <button
              className="text-cyan-300  hover:underline"
              onClick={(e) => {
                dispatch(
                  exampleCallbackRequest((res) => {
                    setExample(res);
                  })
                );
              }}
            >
              Callback example
            </button>
            {example && <p className="text-xs w-[200px]">{example?.value}</p>}
          </div>

          <div className="flex flex-col">
            <button
              className="text-cyan-300  hover:underline"
              onClick={(e) => {
                dispatch(exampleReducerRequest());
              }}
            >
              Reducer example
            </button>
            {exampleData && (
              <p className="text-xs w-[200px]">{exampleData?.value}</p>
            )}
          </div>
        </div>
      </header> */}
       <DodgeGame />
    </div>
  );
}

export default App;
