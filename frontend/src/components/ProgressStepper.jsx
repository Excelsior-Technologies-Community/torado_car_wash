import { useEffect, useRef, useState } from "react";
import {
    CalendarDays,
    ClipboardCheck,
    IndianRupee,
    CheckCircle,
} from "lucide-react";

const steps = [
    { label: "Booking", icon: CalendarDays },
    { label: "Inspection", icon: ClipboardCheck },
    { label: "Valuation", icon: IndianRupee },
    { label: "Completion", icon: CheckCircle },
];

export default function ProgressStepper() {
    const [activeStep, setActiveStep] = useState(0);
    const intervalRef = useRef(null);

    // 🔁 autoplay (runs forever)
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 2000);

        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <div className="w-full flex justify-center py-12">
            <div className="relative w-3/4">
                {/* Base line */}
                <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-300 -translate-y-1/2" />

                {/* Moving dot */}
                <div
                    className="absolute top-1/3 w-3 h-3 bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1/4 transition-all duration-1000"
                    style={{
                        left: `${(activeStep / (steps.length - 1)) * 100}%`,
                    }}
                />

                {/* Steps */}
                <div className="flex justify-between relative z-10">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index === activeStep;

                        return (
                            <div
                                key={index}
                                onClick={() => setActiveStep(index)}
                                className="flex flex-col items-center cursor-pointer group"
                            >
                                <div
                                    className={`
                                            w-16 h-16 flex items-center justify-center rounded-full
                                            border-2 transition-all duration-300
                                            ${isActive
                                            ? "bg-orange-500 border-orange-500 text-white scale-110"
                                            : "bg-white border-gray-300 text-orange-500 "}
                                                group-hover:scale-110
                                            group-hover:border-orange-500 `}
                                >
                                    <Icon size={28} />
                                </div>

                                <p
                                    className={`mt-3 text-sm font-medium transition-colors
                    ${isActive
                                            ? "text-orange-500"
                                            : "text-gray-600 group-hover:text-orange-500"
                                        }`}
                                >
                                    {step.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
