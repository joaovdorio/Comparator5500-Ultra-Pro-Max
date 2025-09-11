import React from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, DownloadIcon } from './Icons';

interface CodeDisplayBoxProps {
    title: string;
    codes: string[] | { code: string; value: number }[];
    variant: 'success' | 'error' | 'info' | 'todolivro' | 'happybooks' | 'neutral';
    itemLabel?: string;
}

const CodeDisplayBox: React.FC<CodeDisplayBoxProps> = ({ title, codes, variant, itemLabel }) => {
    // Tailwind doesn't support dynamic class names with hex values.
    // To use the specific brand colors, we need to either define them in tailwind.config.js
    // or use inline styles. For simplicity and to avoid config files, we'll use a trick
    // by applying a base class and overriding the color with an inline style.
    // However, a cleaner approach without inline styles is to just use Tailwind classes if the exact hex is not a hard requirement.
    // Let's create the themes with Tailwind classes first.
    
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
        },
        todolivro: {
            bg: 'bg-[#e6f0f9]',
            borderColor: 'border-[#004c97]',
            textColor: 'text-[#002c59]',
            headerBg: 'bg-[#004c97]',
            icon: <InformationCircleIcon className="h-7 w-7" />,
            listItemBg: 'bg-[#004c97]',
            listItemTextColor: 'text-white',
        },
        happybooks: {
            bg: 'bg-[#fde8e9]',
            borderColor: 'border-[#ba1119]',
            textColor: 'text-[#8c0d13]',
            headerBg: 'bg-[#ba1119]',
            icon: <InformationCircleIcon className="h-7 w-7" />,
            listItemBg: 'bg-[#ba1119]',
            listItemTextColor: 'text-white',
        },
        neutral: {
            bg: 'bg-slate-50',
            borderColor: 'border-slate-400',
            textColor: 'text-slate-800',
            headerBg: 'bg-slate-500',
            icon: <InformationCircleIcon className="h-7 w-7" />,
            listItemBg: 'bg-slate-600',
            listItemTextColor: 'text-white',
        }
    };

    const theme = themes[variant];

    const handleDownload = () => {
        if (codes.length === 0) return;

        const isObjectArray = (arr: any[]): arr is { code: string; value: number }[] => {
            return arr.length > 0 && typeof arr[0] === 'object' && 'code' in arr[0] && 'value' in arr[0];
        };

        let content = '';
        if (isObjectArray(codes)) {
            content = codes.map(item => `${item.code}${itemLabel ? `\t${itemLabel}: ${item.value}` : ''}`).join('\n');
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
                                {typeof item === 'object' && 'code' in item && 'value' in item
                                    ? <><span>{item.code}</span>{itemLabel && <span className="text-xs opacity-80 pl-4">{itemLabel}: {item.value}</span>}</>
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