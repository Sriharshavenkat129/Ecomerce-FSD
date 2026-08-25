import { SiThunderbird } from "react-icons/si";

export default function RateLimit({time}){
    return(
        <div className=" flex gap-10  items-center justify-center p-4 shadow-md rounded-md">
        <SiThunderbird size={80} color="red"/>        
        <div className="flex flex-col gap-1 font-semibold text-xl">
            <p>You are sending too many requests</p>
            <p className="text-red-600">
                you are temporarly blocked!
            </p> 
            <p className="text-green-700">
                {`come back after ${time?"15":"some"} minutes.`}
            </p>
        </div>
        </div>
    )
}