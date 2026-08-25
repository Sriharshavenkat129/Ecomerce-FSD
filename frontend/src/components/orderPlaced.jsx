import { CircleCheck } from "lucide-react";

export default function orderPlaced() {
    return (
        <>
        <div className="p-2 ">
            <div className="animate-bounce rounded-full p-4 flex justify-center bg-blue-400">
                <CircleCheck size={100} color="white" />
            </div>
        </div>
        <p className="text-xl font-semibold mt-2">Order placed🎉</p>
        </>
    )
}