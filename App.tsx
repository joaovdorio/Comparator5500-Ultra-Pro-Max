import React, { useState, useCallback, useEffect } from 'react';
import CodeDisplayBox from './components/CodeDisplayBox';

type Mode = 'validator' | 'comparator' | 'stock' | 'identifier';

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}


// Helper to parse codes from a string.
// Added a 'unique' flag to control deduplication.
const parseCodes = (text: string, unique: boolean = true): string[] => {
    if (!text.trim()) return [];
    const items = text
        .split(/[\s,;\n]+/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
    return unique ? [...new Set(items)] : items;
};

interface ModeToggleProps {
    mode: Mode;
    setMode: (mode: Mode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, setMode }) => (
    <div className="flex justify-center mb-8">
        <div className="bg-slate-200 rounded-lg p-1 flex flex-wrap gap-1 justify-center">
            <button
                onClick={() => setMode('validator')}
                className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
                    mode === 'validator' ? 'bg-white text-indigo-600 shadow' : 'bg-transparent text-slate-600 hover:bg-slate-300/50'
                }`}
            >
                Validador ISBN
            </button>
            <button
                onClick={() => setMode('comparator')}
                className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
                    mode === 'comparator' ? 'bg-white text-indigo-600 shadow' : 'bg-transparent text-slate-600 hover:bg-slate-300/50'
                }`}
            >
                Comparador
            </button>
             <button
                onClick={() => setMode('stock')}
                className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
                    mode === 'stock' ? 'bg-white text-indigo-600 shadow' : 'bg-transparent text-slate-600 hover:bg-slate-300/50'
                }`}
            >
                Validador de Estoque
            </button>
            <button
                onClick={() => setMode('identifier')}
                className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
                    mode === 'identifier' ? 'bg-white text-indigo-600 shadow' : 'bg-transparent text-slate-600 hover:bg-slate-300/50'
                }`}
            >
                Identificador
            </button>
        </div>
    </div>
);

interface ValidatorViewProps {
    inputValue: string;
    setInputValue: (value: string) => void;
    handleValidation: () => void;
    handleClearValidator: () => void;
    hasValidated: boolean;
    validCodes: string[];
    invalidCodes: string[];
    duplicatedCodes: { code: string; value: number }[];
}

const ValidatorView: React.FC<ValidatorViewProps> = ({
    inputValue,
    setInputValue,
    handleValidation,
    handleClearValidator,
    hasValidated,
    validCodes,
    invalidCodes,
    duplicatedCodes,
}) => (
    <>
        <div className="mb-8">
            <label htmlFor="code-input" className="block text-lg font-medium text-slate-700 mb-2">
                Cole os Códigos Aqui
            </label>
            <textarea
                id="code-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite os códigos separados por vírgulas, espaços ou novas linhas..."
                className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-none bg-white text-blue-600"
                aria-label="Entrada de códigos para validação"
            />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
                onClick={handleValidation}
                className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform hover:scale-105"
            >
                Validar Códigos
            </button>
            <button
                onClick={handleClearValidator}
                className="w-full sm:w-auto bg-slate-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition transform hover:scale-105"
            >
                Limpar
            </button>
        </div>

        {hasValidated && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <CodeDisplayBox title="Códigos Válidos" codes={validCodes} variant="success" />
                <CodeDisplayBox title="Códigos Inválidos" codes={invalidCodes} variant="error" />
                <CodeDisplayBox title="Códigos Duplicados" codes={duplicatedCodes} variant="info" itemLabel="Repetições" />
            </div>
        )}
    </>
);

interface ComparatorViewProps {
    listA: string;
    setListA: (value: string) => void;
    listB: string;
    setListB: (value: string) => void;
    handleCompare: () => void;
    handleClearComparator: () => void;
    hasCompared: boolean;
    commonCodes: string[];
    missingInB: string[];
    missingInA: string[];
}

const ComparatorView: React.FC<ComparatorViewProps> = ({
    listA,
    setListA,
    listB,
    setListB,
    handleCompare,
    handleClearComparator,
    hasCompared,
    commonCodes,
    missingInA,
    missingInB,
}) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
                <label htmlFor="list-a-input" className="block text-lg font-medium text-slate-700 mb-2">
                    Lista A
                </label>
                <textarea
                    id="list-a-input"
                    value={listA}
                    onChange={(e) => setListA(e.target.value)}
                    placeholder="Cole a primeira lista de códigos aqui..."
                    className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-none bg-white text-blue-600"
                    aria-label="Entrada para a lista de códigos A"
                />
            </div>
            <div>
                 <label htmlFor="list-b-input" className="block text-lg font-medium text-slate-700 mb-2">
                    Lista B
                </label>
                <textarea
                    id="list-b-input"
                    value={listB}
                    onChange={(e) => setListB(e.target.value)}
                    placeholder="Cole a segunda lista de códigos aqui..."
                    className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-none bg-white text-blue-600"
                    aria-label="Entrada para a lista de códigos B"
                />
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
                onClick={handleCompare}
                className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform hover:scale-105"
            >
                Comparar Listas
            </button>
            <button
                onClick={handleClearComparator}
                className="w-full sm:w-auto bg-slate-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition transform hover:scale-105"
            >
                Limpar
            </button>
        </div>
        
        {hasCompared && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <CodeDisplayBox title="Apenas na Lista A" codes={missingInB} variant="info" />
                <CodeDisplayBox title="Apenas na Lista B" codes={missingInA} variant="info" />
                <CodeDisplayBox title="Códigos em Comum" codes={commonCodes} variant="info" />
            </div>
        )}
    </>
);

interface StockValidatorViewProps {
    stockCodes: string;
    setStockCodes: (value: string) => void;
    stockQuantities: string;
    setStockQuantities: (value: string) => void;
    minStock: string;
    setMinStock: (value: string) => void;
    handleStockValidation: () => void;
    handleClearStockValidator: () => void;
    hasValidatedStock: boolean;
    insufficientStock: { code: string; value: number }[];
    sufficientStock: { code: string; value: number }[];
}

const StockValidatorView: React.FC<StockValidatorViewProps> = ({
    stockCodes,
    setStockCodes,
    stockQuantities,
    setStockQuantities,
    minStock,
    setMinStock,
    handleStockValidation,
    handleClearStockValidator,
    hasValidatedStock,
    insufficientStock,
    sufficientStock,
}) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
                <label htmlFor="stock-codes-input" className="block text-lg font-medium text-slate-700 mb-2">
                    Lista de Códigos
                </label>
                <textarea
                    id="stock-codes-input"
                    value={stockCodes}
                    onChange={(e) => setStockCodes(e.target.value)}
                    placeholder="Cole a lista de códigos aqui..."
                    className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-none bg-white text-blue-600"
                    aria-label="Entrada para a lista de códigos"
                />
            </div>
            <div>
                 <label htmlFor="stock-quantities-input" className="block text-lg font-medium text-slate-700 mb-2">
                    Lista de Quantidades
                </label>
                <textarea
                    id="stock-quantities-input"
                    value={stockQuantities}
                    onChange={(e) => setStockQuantities(e.target.value)}
                    placeholder="Cole a lista de quantidades aqui..."
                    className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-none bg-white text-blue-600"
                    aria-label="Entrada para a lista de quantidades"
                />
            </div>
        </div>
        <div className="mb-8 max-w-xs mx-auto">
            <label htmlFor="min-stock-input" className="block text-lg font-medium text-slate-700 mb-2 text-center">
                Estoque Mínimo Necessário
            </label>
            <input
                type="text"
                id="min-stock-input"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="w-full p-2 text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white text-blue-600"
                aria-label="Entrada para a quantidade mínima de estoque"
            />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
                onClick={handleStockValidation}
                className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform hover:scale-105"
            >
                Validar Estoque
            </button>
            <button
                onClick={handleClearStockValidator}
                className="w-full sm:w-auto bg-slate-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition transform hover:scale-105"
            >
                Limpar
            </button>
        </div>
        
        {hasValidatedStock && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CodeDisplayBox 
                    title={`Produtos com menos de ${minStock} de estoque`} 
                    codes={insufficientStock} 
                    variant="error" 
                    itemLabel="Estoque"
                />
                 <CodeDisplayBox 
                    title={`Produtos com ${minStock} ou mais de estoque`} 
                    codes={sufficientStock} 
                    variant="success" 
                    itemLabel="Estoque"
                />
            </div>
        )}
    </>
);

interface IdentifierViewProps {
    skusInput: string;
    setSkusInput: (value: string) => void;
    handleClearIdentifier: () => void;
    hasIdentified: boolean;
    todolivroSkus: string[];
    happyBooksSkus: string[];
    unidentifiedSkus: string[];
}

const IdentifierView: React.FC<IdentifierViewProps> = ({
    skusInput,
    setSkusInput,
    handleClearIdentifier,
    hasIdentified,
    todolivroSkus,
    happyBooksSkus,
    unidentifiedSkus,
}) => (
    <>
        <div className="mb-8">
            <label htmlFor="sku-input" className="block text-lg font-medium text-slate-700 mb-2">
                Cole os SKUs Aqui
            </label>
            <textarea
                id="sku-input"
                value={skusInput}
                onChange={(e) => setSkusInput(e.target.value)}
                placeholder="Cole os SKUs e os resultados aparecerão automaticamente..."
                className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-none bg-white text-blue-600"
                aria-label="Entrada de SKUs para identificação"
            />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
                onClick={handleClearIdentifier}
                className="w-full sm:w-auto bg-slate-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition transform hover:scale-105"
            >
                Limpar
            </button>
        </div>

        {hasIdentified && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <CodeDisplayBox title="Todolivro" codes={todolivroSkus} variant="todolivro" />
                <CodeDisplayBox title="Happy Books" codes={happyBooksSkus} variant="happybooks" />
                <CodeDisplayBox title="Não Identificado" codes={unidentifiedSkus} variant="neutral" />
            </div>
        )}
    </>
);


const App: React.FC = () => {
    const [mode, setMode] = useState<Mode>('validator');

    // State for Validator
    const [inputValue, setInputValue] = useState<string>('');
    const [validCodes, setValidCodes] = useState<string[]>([]);
    const [invalidCodes, setInvalidCodes] = useState<string[]>([]);
    const [duplicatedCodes, setDuplicatedCodes] = useState<{ code: string; value: number }[]>([]);
    const [hasValidated, setHasValidated] = useState<boolean>(false);

    // State for Comparator
    const [listA, setListA] = useState<string>('');
    const [listB, setListB] = useState<string>('');
    const [commonCodes, setCommonCodes] = useState<string[]>([]);
    const [missingInB, setMissingInB] = useState<string[]>([]); // In A, not in B
    const [missingInA, setMissingInA] = useState<string[]>([]); // In B, not in A
    const [hasCompared, setHasCompared] = useState<boolean>(false);

    // State for Stock Validator
    const [stockCodes, setStockCodes] = useState<string>('');
    const [stockQuantities, setStockQuantities] = useState<string>('');
    const [minStock, setMinStock] = useState<string>('1');
    const [insufficientStock, setInsufficientStock] = useState<{ code: string; value: number }[]>([]);
    const [sufficientStock, setSufficientStock] = useState<{ code: string; value: number }[]>([]);
    const [hasValidatedStock, setHasValidatedStock] = useState<boolean>(false);

    // State for Identifier
    const [skusInput, setSkusInput] = useState<string>('');
    const [todolivroSkus, setTodolivroSkus] = useState<string[]>([]);
    const [happyBooksSkus, setHappyBooksSkus] = useState<string[]>([]);
    const [unidentifiedSkus, setUnidentifiedSkus] = useState<string[]>([]);
    const [hasIdentified, setHasIdentified] = useState<boolean>(false);
    const debouncedSkusInput = useDebounce(skusInput, 400);


    // Validator Logic
    const handleValidation = useCallback(() => {
        const allCodes = parseCodes(inputValue, false);
        const uniqueCodes = parseCodes(inputValue, true);

        if (allCodes.length === 0) {
            setValidCodes([]);
            setInvalidCodes([]);
            setDuplicatedCodes([]);
            setHasValidated(true);
            return;
        }

        // Find duplicates
        const codeCounts = new Map<string, number>();
        allCodes.forEach(code => {
            codeCounts.set(code, (codeCounts.get(code) || 0) + 1);
        });
        const newDuplicatedCodes: { code: string; value: number }[] = [];
        codeCounts.forEach((count, code) => {
            if (count > 1) {
                newDuplicatedCodes.push({ code, value: count });
            }
        });

        const newValidCodes: string[] = [];
        const newInvalidCodes: string[] = [];
        const validationRegex = /^978\d{10}$/;

        uniqueCodes.forEach(code => {
            if (validationRegex.test(code)) {
                newValidCodes.push(code);
            } else {
                newInvalidCodes.push(code);
            }
        });

        setValidCodes(newValidCodes);
        setInvalidCodes(newInvalidCodes);
        setDuplicatedCodes(newDuplicatedCodes);
        setHasValidated(true);
    }, [inputValue]);

    const handleClearValidator = useCallback(() => {
        setInputValue('');
        setValidCodes([]);
        setInvalidCodes([]);
        setDuplicatedCodes([]);
        setHasValidated(false);
    }, []);

    // Comparator Logic
    const handleCompare = useCallback(() => {
        const codesA = parseCodes(listA, true); // Use unique parsing
        const codesB = parseCodes(listB, true); // Use unique parsing

        if (codesA.length === 0 && codesB.length === 0) {
            setCommonCodes([]);
            setMissingInA([]);
            setMissingInB([]);
            setHasCompared(true);
            return;
        }

        const setA = new Set(codesA);
        const setB = new Set(codesB);

        const newCommon: string[] = [];
        const newMissingInB: string[] = []; // Codes in A but not in B
        const newMissingInA: string[] = []; // Codes in B but not in A

        setA.forEach(code => {
            if (setB.has(code)) {
                newCommon.push(code);
            } else {
                newMissingInB.push(code);
            }
        });

        setB.forEach(code => {
            if (!setA.has(code)) {
                newMissingInA.push(code);
            }
        });

        setCommonCodes(newCommon);
        setMissingInB(newMissingInB);
        setMissingInA(newMissingInA);
        setHasCompared(true);

    }, [listA, listB]);

    const handleClearComparator = useCallback(() => {
        setListA('');
        setListB('');
        setCommonCodes([]);
        setMissingInA([]);
        setMissingInB([]);
        setHasCompared(false);
    }, []);

    // Stock Validator Logic
    const handleStockValidation = useCallback(() => {
        const codes = parseCodes(stockCodes, false); // Do not deduplicate codes
        const quantities = parseCodes(stockQuantities, false).map(Number); // Do not deduplicate quantities
        const minimum = parseInt(minStock, 10);

        if (isNaN(minimum) || codes.length === 0 || quantities.length === 0) {
            setInsufficientStock([]);
            setSufficientStock([]);
            setHasValidatedStock(true);
            return;
        }

        const newInsufficient: { code: string; value: number }[] = [];
        const newSufficient: { code: string; value: number }[] = [];
        const len = Math.min(codes.length, quantities.length);

        for (let i = 0; i < len; i++) {
             if (!isNaN(quantities[i])) {
                if (quantities[i] < minimum) {
                    newInsufficient.push({ code: codes[i], value: quantities[i] });
                } else {
                    newSufficient.push({ code: codes[i], value: quantities[i] });
                }
            }
        }
        
        setInsufficientStock(newInsufficient);
        setSufficientStock(newSufficient);
        setHasValidatedStock(true);
    }, [stockCodes, stockQuantities, minStock]);

    const handleClearStockValidator = useCallback(() => {
        setStockCodes('');
        setStockQuantities('');
        setMinStock('1');
        setInsufficientStock([]);
        setSufficientStock([]);
        setHasValidatedStock(false);
    }, []);
    
    // Identifier Logic
    const handleClearIdentifier = useCallback(() => {
        setSkusInput('');
        setTodolivroSkus([]);
        setHappyBooksSkus([]);
        setUnidentifiedSkus([]);
        setHasIdentified(false);
    }, []);

    useEffect(() => {
        if (mode !== 'identifier') return;

        if (debouncedSkusInput.trim() === '') {
            // If user clears the input, reset the state completely
            if (hasIdentified) {
                 handleClearIdentifier();
            }
            return;
        }

        const skus = parseCodes(debouncedSkusInput, true);

        const newTodolivro: string[] = [];
        const newHappyBooks: string[] = [];
        const newUnidentified: string[] = [];

        skus.forEach(sku => {
            // Todolivro: 7 digits, starts with 1
            if (sku.length === 7 && sku.startsWith('1')) {
                newTodolivro.push(sku);
            }
            // Happy Books: 6 digits, starts with 3
            else if (sku.length === 6 && sku.startsWith('3')) {
                newHappyBooks.push(sku);
            }
            // Unidentified
            else {
                newUnidentified.push(sku);
            }
        });
        
        setTodolivroSkus(newTodolivro);
        setHappyBooksSkus(newHappyBooks);
        setUnidentifiedSkus(newUnidentified);
        setHasIdentified(true);
    }, [debouncedSkusInput, mode, hasIdentified, handleClearIdentifier]);


    const getModeDetails = () => {
        switch (mode) {
            case 'validator':
                return {
                    title: 'Validador ISBN',
                    description: 'Verifique quais códigos seguem o Padrão Internacional de Números de Livros (ISBN)'
                };
            case 'comparator':
                return {
                    title: 'Comparador de Listas',
                    description: 'Compare duas listas para encontrar diferenças e códigos em comum.'
                };
            case 'stock':
                return {
                    title: 'Validador de Estoque',
                    description: 'Encontre produtos com estoque abaixo do mínimo necessário.'
                };
            case 'identifier':
                 return {
                    title: 'Identificador',
                    description: 'Identifique a qual marca pertence os SKUs.'
                };
            default:
                return { title: '', description: '' };
        }
    };

    const { title, description } = getModeDetails();

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex items-center justify-center p-4">
            <main className="w-full max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
                    <header className="text-center mb-8">
                        <h2 className="text-lg font-semibold text-indigo-500 tracking-wider uppercase">Comparator5500 Ultra Pro Max</h2>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-1">
                           {title}
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg">
                           {description}
                        </p>
                    </header>

                    <ModeToggle mode={mode} setMode={setMode} />
                    
                    {mode === 'validator' && <ValidatorView 
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        handleValidation={handleValidation}
                        handleClearValidator={handleClearValidator}
                        hasValidated={hasValidated}
                        validCodes={validCodes}
                        invalidCodes={invalidCodes}
                        duplicatedCodes={duplicatedCodes}
                    />}
                    {mode === 'comparator' && <ComparatorView
                        listA={listA}
                        setListA={setListA}
                        listB={listB}
                        setListB={setListB}
                        handleCompare={handleCompare}
                        handleClearComparator={handleClearComparator}
                        hasCompared={hasCompared}
                        commonCodes={commonCodes}
                        missingInA={missingInA}
                        missingInB={missingInB}
                    />}
                    {mode === 'stock' && <StockValidatorView
                        stockCodes={stockCodes}
                        setStockCodes={setStockCodes}
                        stockQuantities={stockQuantities}
                        setStockQuantities={setStockQuantities}
                        minStock={minStock}
                        setMinStock={setMinStock}
                        handleStockValidation={handleStockValidation}
                        handleClearStockValidator={handleClearStockValidator}
                        hasValidatedStock={hasValidatedStock}
                        insufficientStock={insufficientStock}
                        sufficientStock={sufficientStock}
                    />}
                    {mode === 'identifier' && <IdentifierView
                        skusInput={skusInput}
                        setSkusInput={setSkusInput}
                        handleClearIdentifier={handleClearIdentifier}
                        hasIdentified={hasIdentified}
                        todolivroSkus={todolivroSkus}
                        happyBooksSkus={happyBooksSkus}
                        unidentifiedSkus={unidentifiedSkus}
                    />}

                </div>
                 <footer className="text-center mt-8 text-slate-500">
                    <p>Desenvolvido internamente por Todolivro.</p>
                </footer>
            </main>
        </div>
    );
};

export default App;