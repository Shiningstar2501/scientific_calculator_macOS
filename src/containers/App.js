import React, { useState, useEffect } from 'react';
import App from '../components/app/App';
import keypads from '../constants/keypads';
import { camelCase } from 'lodash';
import Decimal from '../utils/decimal-custom';
import ConfettiExplosion from 'react-confetti-explosion';
import { FaSun, FaMoon } from 'react-icons/fa'; 



const AppContainer = () => {
  const [state, setState] = useState({
    displayValue: '0',
    currentOutput: null,
    currentOperation: null,
    resetDisplayValueOnNextKeyPress: true,
    mode: 'scientific',
    trigUnit: 'deg',
    memory: null
  });

  const [isExploding, setIsExploding] = useState(false);
  const [theme, setTheme] = useState('light');  // State to control the theme
  const [history, setHistory] = useState([]);  // State to store history of calculations

   // Function to toggle between light and dark mode
   const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
 // Function to add new calculation to history
 const addToHistory = (expression, result) => {
  const newEntry = `${expression} = ${result}`;
  setHistory(prevHistory => [newEntry, ...prevHistory]);
};
  const handleNumberKey = (key) => {
    const { displayValue: prevDisplayValue, resetDisplayValueOnNextKeyPress } = state;
    const number = key.textContent;
    let displayValue = resetDisplayValueOnNextKeyPress ? '' : prevDisplayValue;

    if (key.id === 'decimal' && !displayValue.includes('.')) {
      displayValue = displayValue ? displayValue + '.' : '0.';
    } else if (key.id !== 'decimal') {
      displayValue += number;
    }

    setState({
      ...state,
      displayValue: displayValue.replace(/^0+(?!\.)/, ''),
      resetDisplayValueOnNextKeyPress: false
    });
  };

  const handleConstantKey = ({ id: constant }) => {
    setState({
      ...state,
      displayValue: Decimal[constant].toString(),
      resetDisplayValueOnNextKeyPress: true
    });
  };

  const handleBinaryOperationKey = (key) => {
    const { currentOperation, currentOutput, displayValue } = state;
    const operation = key.id;

    if (currentOperation) {
      handleEqualsKey();
    }

    setState((prevState) => ({
      ...prevState,
      currentOperation: operation,
      currentOutput: prevState.displayValue,
      resetDisplayValueOnNextKeyPress: true
    }));
  };

  const handleUnaryOperationKey = (key) => {
    const { displayValue, trigUnit } = state;
    const operation = key.id;
    let operand = new Decimal(displayValue);

    if (/^(sin|cos|tan)$/.test(operation) && trigUnit === 'deg') {
      const PI = Decimal.acos(-1);
      operand = operand.times(new Decimal(PI).dividedBy(180));
    }

    let output = operand[operation]();

    setState({
      ...state,
      displayValue: output.toString(),
      resetDisplayValueOnNextKeyPress: true
    });
  };
//
  const handleEqualsKey = () => {
    const { currentOperation, currentOutput, displayValue } = state;

    if (!currentOperation) {
      return;
    }

    const firstOperand = new Decimal(currentOutput);
    const secondOperand = displayValue;
    let output = firstOperand[currentOperation](secondOperand);

    setState({
      ...state,
      currentOperation: null,
      currentOutput: output,
      displayValue: output.toString(),
      resetDisplayValueOnNextKeyPress: true
    });

    
    if ((firstOperand == 5 && secondOperand == 6) || (firstOperand == 6 && secondOperand == 5)) {
      setIsExploding(true);
    }
  };

  const handleClearKey = () => {
    setState({
      ...state,
      currentOperation: null,
      currentOutput: null,
      displayValue: '0',
      resetDisplayValueOnNextKeyPress: true
    });
  };

  const handleFunctionKey = ({ id: functionName }) => {
    switch (functionName) {
      case 'trigUnit':
        return setState(prevState => ({
          ...prevState,
          trigUnit: prevState.trigUnit === 'deg' ? 'rad' : 'deg'
        }));

      case 'memoryAdd':
        return setState(({ memory, displayValue }) => ({
          ...state,
          memory: memory ? memory.plus(displayValue) : new Decimal(displayValue)
        }));

      case 'memorySubtract':
        return setState(({ memory, displayValue }) => ({
          ...state,
          memory: memory ? memory.minus(displayValue) : null
        }));

      case 'memoryClear':
        return setState({ ...state, memory: null });

      case 'memoryRecall':
        return (
          state.memory &&
          setState(({ memory }) => ({
            ...state,
            displayValue: memory.toString(),
            resetDisplayValueOnNextKeyPress: true
          }))
        );

      case 'random':
        return setState({
          ...state,
          displayValue: new Decimal(Math.random()).toString(),
          resetDisplayValueOnNextKeyPress: true
        });

      default:
        return;
    }
  };

  const handleClick = (event, { type }) => {
    const handlerName = camelCase(`handle-${type}-key`);
    const handler = {
      handleNumberKey,
      handleConstantKey,
      handleBinaryOperationKey,
      handleUnaryOperationKey,
      handleEqualsKey,
      handleClearKey,
      handleFunctionKey
    }[handlerName];

    if (handler) {
      handler(event.currentTarget);
    }
  };

  return (
    <>
      <div style={{ padding: '10px', backgroundColor: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#000' : '#fff' }}> {/* Apply background and text color based on theme */}
        <button onClick={toggleTheme} style={{ marginBottom: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
          {theme === 'light' ? <FaMoon size={24} /> : <FaSun size={24} />} {/* Toggle button with icon */}
        </button>

        <div className={`app-container ${theme}-mode`}>  {/* Apply theme class */}
          <App
            keys={keypads[state.mode]}
            currentOperation={state.currentOperation}
            mode={state.mode}
            displayValue={state.displayValue}
            trigUnit={state.trigUnit}
            memory={state.memory}
            handleClick={handleClick}
          />

          {isExploding && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <ConfettiExplosion
                force={0.6}
                duration={3000}
                particleCount={200}
                width={window.innerWidth}
                height={window.innerHeight}
                onConfettiComplete={() => setIsExploding(false)}
              />
            </div>
          )}

          {/* History Section */}
          <div style={{ marginTop: '20px', backgroundColor: theme === 'light' ? '#f9f9f9' : '#444', color: theme === 'light' ? '#000' : '#fff', padding: '10px', borderRadius: '5px' }}>
            <h3>History</h3>
            <ul>
              {history.map((entry, index) => (
                <li key={index}>{entry}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppContainer;
