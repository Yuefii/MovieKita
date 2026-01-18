import { LucideIcon } from "lucide-react"

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    icon: LucideIcon
    error?: string
}

export default function Input({
    label,
    icon: Icon,
    error,
    className = "",
    ...props
}: Props) {
    return (
        <div className="space-y-2">
            <label className="text-sm text-gray-400">{label}</label>
            <div className="relative">
                <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                    className={`w-full bg-[#262626] border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-600 transition ${error ? "border-red-500" : "border-gray-700"
                        } ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <div className="text-red-500 text-sm mt-1">
                    {error}
                </div>
            )}
        </div>
    )
}
