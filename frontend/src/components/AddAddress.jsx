import { ArrowLeft } from "lucide-react"
import { useState } from "react";
import app from "../utils/app";
import toast from "react-hot-toast";

export default function AddAddress({setAddAddressStatus,setAddresses,Addresses}) {
    const [newAddress, setNewAddress] = useState({
        "door_no": "",
        "landmark": "",
        "city": "",
        "pincode": "",
        "state": ""
    })
    const [loading,setLoading]=useState(false)
    const addAddress = async (e) => {
        e.preventDefault();
        try {
            if(!newAddress.door_no || !newAddress.landmark || !newAddress.state ||!newAddress.city || !newAddress.pincode){
               toast.error("enter all details")
               return
            }
            setLoading(true)
            const response=await app.post("/user/me/address",
            {"location":`${newAddress.door_no},${newAddress.landmark},${newAddress.city}`,
            "pincode":newAddress.pincode,
            "state":newAddress.state
            })
            toast.success(response.data.msg)
            Addresses.push(response.data.data)
            setAddresses(Addresses)
            setAddAddressStatus(false)
        }
        catch (error) {
            toast.error(error.response.data.msg || "something went wrong!")
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <section className="flex flex-col gap-6 p-4 w-full max-w-md border border-gray-100 shadow-2xl rounded-xl">
            {!loading &&
            <div className="flex flex-col gap-5">
                <div><ArrowLeft onClick={() => setAddAddressStatus(false)} size={30} className="cursor-pointer" /></div>
                <form className="flex flex-col gap-4" onSubmit={addAddress}>
                    <label className="flex gap-2 w-full font-semibold text-md px-2 py-1 border border-gray-400 rounded-xl">
                        <span className="w-30">D.No:</span> <input className="w-full outline-none  px-2" placeholder="e.g 12-59D" value={newAddress.door_no}
                            onChange={(e) => setNewAddress(pre => ({ ...pre, "door_no": e.target.value }))} /></label>
                    <label className="flex gap-2 w-full font-semibold text-md px-2 py-1 border border-gray-400 rounded-xl">
                        <span className="w-30">Landmark:</span> <input className="w-full outline-none  px-2" placeholder="e.g near city bank" value={newAddress.landmark}
                            onChange={(e) => setNewAddress(pre => ({ ...pre, "landmark": e.target.value }))} /></label>
                    <label className="flex gap-2 w-full font-semibold text-md px-2 py-1 border border-gray-400 rounded-xl">
                        <span className="w-30">City:</span> <input className="w-full outline-none  px-2" placeholder="e.g eluru" value={newAddress.city}
                            onChange={(e) => setNewAddress(pre => ({ ...pre, "city": e.target.value }))} /></label>
                    <label className="flex gap-2 w-full font-semibold text-md px-2 py-1 border border-gray-400 rounded-xl">
                        <span className="w-30">pincode:</span> <input className="w-full outline-none  px-2" placeholder="e.g 534001" value={newAddress.pincode}
                            onChange={(e) => setNewAddress(pre => ({ ...pre, "pincode": e.target.value }))} /></label>
                    <label className="flex gap-2 w-full font-semibold text-md px-2 py-1 border border-gray-400 rounded-xl">
                        <span className="w-30">State:</span> <input className="w-full outline-none  px-2" placeholder="e.g Andhra pradesh" value={newAddress.state}
                            onChange={(e) => setNewAddress(pre => ({ ...pre, "state": e.target.value }))} /></label>
                    <button type="submit" className="bg-blue-400 text-md font-semibold hover:bg-blue-500 p-2 rounded-xl 
                            hover:shadow-2xl shadow-blue-100 transition-all duration-300 ease-in-out cursor-pointer">Add Address</button>
                </form>
            </div>
            }
            {
                loading &&
                <div className="flex justify-center">
                <div className="animate-spin size-10 rounded-full border-6 border-t-blue-600 border-gray-300"></div>
                </div>
            }
        </section>
    )
}