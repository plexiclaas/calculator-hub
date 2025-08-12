import { useState, useEffect, useCallback } from "react";

const operators = ["+", "-", "*", "/"];

// Convert number to words (up to 999,999,999,999.99)
const numberToWords = (num: number): string => {
  if (num === 0) return "zero";
  if (num < 0) return "minus " + numberToWords(-num);
  if (!isFinite(num)) return "infinity";
  if (isNaN(num)) return "not a number";

  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const scales = ["", "thousand", "million", "billion"];

  const convertHundreds = (n: number): string => {
    let result = "";
    const h = Math.floor(n / 100);
    const remainder = n % 100;
    
    if (h > 0) {
      result += ones[h] + " hundred";
    }
    
    if (remainder >= 20) {
      const t = Math.floor(remainder / 10);
      const o = remainder % 10;
      if (result) result += " ";
      if (o > 0) {
        result += tens[t] + "-" + ones[o];
      } else {
        result += tens[t];
      }
    } else if (remainder >= 10) {
      if (result) result += " ";
      result += teens[remainder - 10];
    } else if (remainder > 0) {
      if (result) result += " ";
      result += ones[remainder];
    }
    
    return result;
  };

  const [intPart, decPart] = num.toString().split('.');
  let n = parseInt(intPart);
  
  if (n === 0) {
    if (decPart) {
      return "zero point " + decPart.split('').map(d => ones[parseInt(d)] || "zero").join(' ');
    }
    return "zero";
  }

  let result = "";
  let scaleIndex = 0;
  
  while (n > 0) {
    const chunk = n % 1000;
    if (chunk > 0) {
      const chunkWords = convertHundreds(chunk);
      if (scaleIndex > 0) {
        result = chunkWords + " " + scales[scaleIndex] + (result ? " " + result : "");
      } else {
        result = chunkWords + (result ? " " + result : "");
      }
    }
    n = Math.floor(n / 1000);
    scaleIndex++;
  }

  if (decPart && decPart !== '0') {
    result += " point " + decPart.split('').map(d => ones[parseInt(d)] || "zero").join(' ');
  }

  return result;
};

const formatToken = (numStr: string) => {
  if (numStr === "" || numStr === "." || numStr === "-") return numStr;
  
  // Behandle negative Zahlen
  const isNegative = numStr.startsWith('-');
  const absNumStr = isNegative ? numStr.substring(1) : numStr;
  
  const [intPart, decPart] = absNumStr.split(".");
  if (intPart === "") return numStr;
  
  const intFmt = Number(intPart).toLocaleString("en-US");
  const result = decPart !== undefined ? `${intFmt}.${decPart}` : intFmt;
  return isNegative ? `-${result}` : result;
};

// formatiert den gesamten Ausdruck, Zahl für Zahl
const formatExpression = (expr: string) => {
  // Einfacheres Splitting - behandelt negative Zahlen besser
  const parts = [];
  let current = "";
  
  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];
    if (operators.includes(char)) {
      if (current) {
        parts.push(current);
        current = "";
      }
      parts.push(char);
    } else {
      current += char;
    }
  }
  if (current) parts.push(current);
  
  return parts
    .map(part => operators.includes(part) ? part : formatToken(part))
    .join("");
};

// sehr simple Validierung, damit eval nur Mathe sieht
const isSafeExpression = (expr: string) => {
  // Entferne Formatierung für die Validierung
  const cleanExpr = expr.replace(/,/g, '');
  // Erlaube auch .3 Format (wird später zu 0.3 konvertiert)
  return /^[\-]?(\d+(\.\d*)?|\.\d+)([+\-*/][\-]?(\d+(\.\d*)?|\.\d+))*$/.test(cleanExpr);
};

const Calculator = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState("");
  const [justCalculated, setJustCalculated] = useState(false);

  const append = useCallback((value: string) => {
    setInput(prev => {
      // Komma als Dezimalpunkt akzeptieren
      if (value === ",") value = ".";

      // Wenn gerade eine Berechnung durchgeführt wurde und eine Zahl eingegeben wird
      if (justCalculated && /^[0-9.]$/.test(value)) {
        setJustCalculated(false);
        setHistory("");
        return value;
      }

      // Nach einer Berechnung wurde ein Operator eingegeben
      if (justCalculated && operators.includes(value)) {
        setJustCalculated(false);
        // History bleibt, aber wir fügen den Operator hinzu
      }

      const last = prev.slice(-1);

      // Keine zwei Operatoren nacheinander (außer unäres Minus)
      if (operators.includes(value)) {
        if (prev === "") return value === "-" ? "-" : prev; // nur Minus darf vorn stehen
        if (operators.includes(last)) {
          // Ersetze letzten Operator
          return prev.slice(0, -1) + value;
        }
      }

      // pro Zahl nur ein Dezimalpunkt
      if (value === ".") {
        const parts = prev.split(/([+\-*/])/);
        const currentNumber = parts[parts.length - 1] || "";
        if (currentNumber.includes(".")) return prev;
      }

      return prev + value;
    });
  }, [justCalculated]);

  const clearAll = useCallback(() => {
    setInput("");
    setHistory("");
    setJustCalculated(false);
  }, []);
  
  const clearEntry = useCallback(() => {
    setInput(prev => {
      if (prev === "") return "";
      
      // Finde die aktuelle Zahl oder den letzten Operator
      const parts = prev.split(/([+\-*/])/);
      if (parts.length === 1) {
        // Nur eine Zahl vorhanden
        return "";
      }
      
      const lastPart = parts[parts.length - 1];
      if (operators.includes(lastPart)) {
        // Letztes Element ist ein Operator - entferne ihn
        return parts.slice(0, -1).join("");
      } else {
        // Letztes Element ist eine Zahl - entferne sie
        return parts.slice(0, -1).join("");
      }
    });
  }, []);

  const backspace = useCallback(() => {
    setInput(prev => prev.slice(0, -1));
  }, []);

  const evaluate = useCallback(() => {
    if (!input) return;
    const last = input.slice(-1);
    if (operators.includes(last)) return;
    
    // Konvertiere .3 zu 0.3 Format vor der Berechnung
    const processedInput = input.replace(/(^|[+\-*/])\.(\d)/g, '$10.$2');
    
    if (!isSafeExpression(processedInput)) return;
    
    try {
      // eslint-disable-next-line no-eval
      const result = eval(processedInput);
      if (typeof result === "number" && isFinite(result)) {
        // Keine Rundung mehr - zeige Ergebnis wie es ist
        setHistory(formatExpression(input) + " =");
        setInput(result.toString());
        setJustCalculated(true);
      }
    } catch {
      setInput("Error");
      setHistory("");
      setJustCalculated(false);
    }
  }, [input]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;

      if (/^[0-9]$/.test(k)) return append(k);
      if (k === "." || k === ",") return append(k);
      if (operators.includes(k)) return append(k);
      if (k === "Enter" || k === "=") return evaluate();
      if (k === "Backspace") return backspace();
      if (k === "Escape") return clearAll();
      if (k.toLowerCase() === "c") return clearEntry();
    };
    
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [append, evaluate, backspace, clearAll, clearEntry]);

  // Convert current input to words including operators
  const inputToWords = () => {
    if (!input) return "zero";
    
    const operatorWords = {
      '+': 'plus',
      '-': 'minus', 
      '*': 'times',
      '/': 'divided by'
    };
    
    // Split by operators but keep them in the result
    const parts = input.split(/([+\-*/])/).filter(part => part !== '');
    
    return parts.map(part => {
      if (operators.includes(part)) {
        return operatorWords[part as keyof typeof operatorWords];
      } else {
        const num = parseFloat(part);
        return isNaN(num) ? part : numberToWords(num);
      }
    }).join(' ');
  };

  const btn = "bg-gray-200 hover:bg-gray-300 rounded text-lg md:text-xl p-3 md:p-4 text-center transition-colors duration-150";
  const equalsBtn = "bg-blue-200 hover:bg-blue-300 rounded text-lg md:text-xl p-3 md:p-4 text-center font-semibold transition-colors duration-150";

  return (
    <div className="w-full max-w-md mx-auto bg-white p-4 rounded-lg shadow-lg">
      {/* History: fester Platz für die Rechnung vor dem Ergebnis mit unsichtbarem Platzhalter */}
      <div className="text-right text-sm text-gray-500 p-2 mb-2 min-h-[24px] flex items-center justify-end">
        {history || <span className="opacity-0">placeholder</span>}
      </div>
      
      {/* Display: zeigt formatierten AUSDRUCK ohne grauen Hintergrund */}
      <div className="text-right text-3xl md:text-4xl font-bold px-4 py-2 mb-1 min-h-[80px] flex items-center justify-end">
        {input ? formatExpression(input) : "0"}
      </div>

      {/* Input in words */}
      <div className="text-right text-sm text-gray-600 mb-4 min-h-[20px] italic">
        {inputToWords()}
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button className={btn} onClick={clearAll}>AC</button>
        <button className={btn} onClick={clearEntry}>CE</button>
        <button className={btn} onClick={backspace}>⌫</button>
        <button className={btn} onClick={() => append("/")}>/</button>

        <button className={btn} onClick={() => append("7")}>7</button>
        <button className={btn} onClick={() => append("8")}>8</button>
        <button className={btn} onClick={() => append("9")}>9</button>
        <button className={btn} onClick={() => append("*")}>*</button>

        <button className={btn} onClick={() => append("4")}>4</button>
        <button className={btn} onClick={() => append("5")}>5</button>
        <button className={btn} onClick={() => append("6")}>6</button>
        <button className={btn} onClick={() => append("-")}>-</button>

        <button className={btn} onClick={() => append("1")}>1</button>
        <button className={btn} onClick={() => append("2")}>2</button>
        <button className={btn} onClick={() => append("3")}>3</button>
        <button className={btn} onClick={() => append("+")}>+</button>

        <button className={`${btn} col-span-2`} onClick={() => append("0")}>0</button>
        <button className={btn} onClick={() => append(".")}>.</button>
        <button className={equalsBtn} onClick={evaluate}>=</button>
      </div>
    </div>
  );
};

export default Calculator;