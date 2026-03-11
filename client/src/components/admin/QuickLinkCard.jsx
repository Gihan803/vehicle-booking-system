import { Link } from "react-router-dom";

const QuickLinkCard = ({ to, label, subtitle, icon: Icon, hoverColor, glowColor }) => {
    return (
        <Link
            to={to}
            className={`glass-card border border-white/10 p-6 sm:p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center items-center text-center min-h-[130px] sm:min-h-[150px] ${hoverColor}`}
        >
            {/* Background watermark icon */}
            <Icon
                className={`absolute -bottom-4 -right-4 text-[5rem] sm:text-[6rem] opacity-[0.05] group-hover:opacity-[0.15] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 z-0 ${glowColor}`}
            />

            {/* Label */}
            <div className="text-slate-400 text-sm sm:text-base font-medium leading-snug relative z-10 w-full">
                {label}
            </div>

            {/* Subtitle */}
            <div className="flex items-center justify-center mt-3 sm:mt-4 relative z-10 w-full">
                <div className="text-xl sm:text-2xl font-bold tracking-tight leading-none text-white">
                    {subtitle}
                </div>
            </div>
        </Link>
    );
};

export default QuickLinkCard;
