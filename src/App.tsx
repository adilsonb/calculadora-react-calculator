import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [showDisplay, setShowDisplay] = useState("0");
  const [operator, setOperator] = useState("");
  const [theme, setTheme] = useState("");

  const regexZeroPoint = /^[0]\./;
  const regexZeroStart = /^[0]/;
  const regexNumber = /^\d+$/;
  const regexOperators = /(^[+\-/×÷%]+)/;
  const regexValidKeys = /(^[0-9$+\-/*%,.]+)/;

  let lastChar: string = "";

  /* Clean display and set value to 0 */
  function clearDisplay() {
    setShowDisplay("0");
  }

  /* Turn on/off display dark mode */
  function lightMode() {
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  }

  /* Toggle key */
  function toggleValue() {
    const newValue = parseFloat(showDisplay) * -1;
    setShowDisplay(String(newValue));
  }

  /* Percent key */
  function percentKey(e: string) {
    if (showDisplay != "0") {
      const percentString = e.replace("×", "*").replace("÷", "/");
      let operatorSymbol = percentString.replace(/[0-9]/g, "").trim();

      if (operatorSymbol.length > 1) {
        operatorSymbol = operatorSymbol.charAt(1);
      } else {
        operatorSymbol = operatorSymbol.charAt(0);
      }

      const splitOperation = percentString.split(operatorSymbol);
      const firstValue = parseFloat(splitOperation[0]);
      const secondValue = parseFloat(splitOperation[1]);

      let resultPercent;

      if (operatorSymbol === "+") {
        resultPercent = firstValue + firstValue * (secondValue / 100);
      } else if (operatorSymbol === "-") {
        resultPercent = firstValue - firstValue * (secondValue / 100);
      } else if (operatorSymbol === "/") {
        resultPercent =
          firstValue / (firstValue / (firstValue / (secondValue / 100)));
      } else if (operatorSymbol === "*") {
        resultPercent = firstValue * (secondValue / 100);
      }
      setOperator("result");
      return String(resultPercent);
    } else {
      return "0";
    }
  }

  /* Calculates the result */
  function calcParse(e: string) {
    if (showDisplay.length > 0 && operator != "result") {
      const parseValue = e.replace("×", "*").replace("÷", "/").replace("=", "");
      setOperator("result");
      return Function(`'use strict'; return (${parseValue})`)();
    } else {
      return showDisplay;
    }
  }

  /* Read Keypress or click in button */
  function readKeyOrClick(key: any) {
    if (operator === "result" && regexOperators.test(key) && lastChar != key) {
      setOperator("");
      return setShowDisplay(`${showDisplay}${key}`);
    } else if (operator === "result" && regexNumber.test(showDisplay)) {
      setOperator("");
      return setShowDisplay(key);
    } else if (
      regexZeroStart.test(showDisplay) &&
      !regexZeroPoint.test(showDisplay)
    ) {
      return setShowDisplay(key);
    } else if (regexOperators.test(key) && lastChar === key) {
      return setShowDisplay(`${showDisplay}`);
    } else if (regexOperators.test(key) && regexOperators.test(lastChar)) {
      return setShowDisplay(`${showDisplay.slice(0, -1)}${key}`);
    } else {
      return setShowDisplay(`${showDisplay}${key}`);
    }
  }

  /* Mouse Click Functions */
  const calculatorKey = (e: string) => {
    if (showDisplay.length > 0) {
      lastChar = showDisplay.charAt(showDisplay.length - 1);
    }
    readKeyOrClick(e);
  };

  useEffect(() => {
    /* Load theme from local storage */
    const theme = localStorage.getItem("theme");
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
      setTheme(theme);
    }

    /* Key Press Functions */
    function handleSetSelected(e: any) {
      let key: string = e.key;

      if (showDisplay.length > 0) {
        lastChar = showDisplay.charAt(showDisplay.length - 1);
      }

      if (regexValidKeys.test(key) && key != "enter") {
        key = key.replace("*", "×").replace("/", "÷").replace(",", ".");
        readKeyOrClick(key);
      } else if (key === "Enter" || key === "NumNumpadEnter") {
        const res = calcParse(showDisplay);
        setShowDisplay(res);
      }
    }
    window.addEventListener("keydown", handleSetSelected);
    return () => {
      window.removeEventListener("keydown", handleSetSelected);
    };
  }, [showDisplay, operator, theme]);

  return (
    <div className="App">
      <div className="calculator">
        <input
          type="text"
          className="display"
          value={String(showDisplay).slice(0, 10)}
          disabled
        />
        <div className="keys">
          {/* First key row */}
          <input type="button" value="AC" onClick={() => clearDisplay()} />
          <input
            type="button"
            className="light"
            value="&#9728;"
            onClick={() => lightMode()}
          />
          <input type="button" value="±" onClick={() => toggleValue()} />
          <input
            type="button"
            value="%"
            onClick={() => setShowDisplay(percentKey(showDisplay))}
          />

          {/* Second key row */}
          <input type="button" value="7" onClick={() => calculatorKey("7")} />
          <input type="button" value="8" onClick={() => calculatorKey("8")} />
          <input type="button" value="9" onClick={() => calculatorKey("9")} />
          <input type="button" value="÷" onClick={() => calculatorKey("÷")} />

          {/* Third key row */}
          <input type="button" value="4" onClick={() => calculatorKey("4")} />
          <input type="button" value="5" onClick={() => calculatorKey("5")} />
          <input type="button" value="6" onClick={() => calculatorKey("6")} />
          <input type="button" value="×" onClick={() => calculatorKey("×")} />

          {/* Fourth key row */}
          <input type="button" value="1" onClick={() => calculatorKey("1")} />
          <input type="button" value="2" onClick={() => calculatorKey("2")} />
          <input type="button" value="3" onClick={() => calculatorKey("3")} />
          <input type="button" value="-" onClick={() => calculatorKey("-")} />

          {/* Fifth key row */}
          <input type="button" value="0" onClick={() => calculatorKey("0")} />
          <input type="button" value="." onClick={() => calculatorKey(".")} />
          <input
            type="button"
            value="="
            className="equal"
            onClick={() => setShowDisplay(calcParse(showDisplay))}
          />
          <input type="button" value="+" onClick={() => calculatorKey("+")} />
        </div>
      </div>
    </div>
  );
}

export default App;
