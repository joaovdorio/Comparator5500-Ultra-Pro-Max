import React from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, DownloadIcon } from './Icons';

interface CodeDisplayBoxProps {
    title: string;
    codes: string[] | { code: string; quantity: number }[];
    variant: 'success' | 'error' | 'info';
}

const CodeDisplayBox: React.FC<CodeDisplayBoxProps> = ({ title, codes, variant }) => {
    const themes = {
        success: {
            bg: 'bg-green-50',
            borderColor: 'border-green-400',
            textColor: 'text-green-800',
            headerBg: 'bg-green-500',
            icon: <CheckCircleIcon className="h-7 w-7" />,
            listItemBg: 'bg-green-600',
            listItemTextColor: 'text-white',
        },
        error: {
            bg: 'bg-red-50',
            borderColor: 'border-red-400',
            textColor: 'text-red-800',
            headerBg: 'bg-red-500',
            icon: <XCircleIcon className="h-7 w-7" />,
            listItemBg: 'bg-red-600',
            listItemTextColor: 'text-white',
        },
        info: {
            bg: 'bg-blue-50',
            borderColor: 'border-blue-400',
            textColor: 'text-blue-800',
            headerBg: 'bg-blue-500',
            icon: <InformationCircleIcon className="h-7 w-7" />,
            listItemBg: 'bg-blue-600',
            listItemTextColor: 'text-white',
        }
    };

    const theme = themes[variant];

    const handleDownload = () => {
        if (codes.length === 0) return;

        const isObjectArray = (arr: any[]): arr is { code: string; quantity: number }[] => {
            return arr.length > 0 && typeof arr[0] === 'object' && 'code' in arr[0] && 'quantity' in arr[0];
        };

        let content = '';
        if (isObjectArray(codes)) {
            content = codes.map(item => `${item.code}\tEstoque: ${item.quantity}`).join('\n');
        } else {
            content = (codes as string[]).join('\n');
        }
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = `${title.replace(/\s+/g, '_').toLowerCase()}.txt`;
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className={`flex flex-col rounded-xl shadow-lg border ${theme.borderColor} overflow-hidden`}>
            <div className={`p-4 ${theme.headerBg} text-white flex justify-between items-center gap-2`}>
                <div className="flex items-center gap-3">
                    {theme.icon}
                    <h3 className="text-xl font-bold">{title}</h3>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-lg font-semibold bg-white rounded-full px-3.5 py-1 text-sm ${theme.textColor}`}>
                        {codes.length}
                    </span>
                    <button
                        onClick={handleDownload}
                        disabled={codes.length === 0}
                        className="disabled:opacity-40 disabled:cursor-not-allowed bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label={`Baixar ${title} como arquivo .txt`}
                        title={`Baixar ${title} como arquivo .txt`}
                    >
                        <DownloadIcon className="h-5 w-5 text-white" />
                    </button>
                </div>
            </div>
            <div className={`p-4 ${theme.bg} ${theme.textColor} h-72 overflow-y-auto flex-grow`}>
                {codes.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="italic text-slate-500">Nenhum código nesta categoria.</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {codes.map((item, index) => (
                            <li key={index} className={`font-mono ${theme.listItemBg} ${theme.listItemTextColor} p-2 rounded-md shadow-sm break-all flex justify-between items-center`}>
                                {typeof item === 'object' && 'code' in item && 'quantity' in item
                                    ? <><span>{item.code}</span><span className="text-xs opacity-80 pl-4">Estoque: {item.quantity}</span></>
                                    : <span>{item}</span>
                                }
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CodeDisplayBox;