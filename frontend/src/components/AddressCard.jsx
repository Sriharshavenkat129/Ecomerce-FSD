export default function AddressCard({ address }) {
    return (
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <p className="font-bold text-gray-800 text-lg capitalize">{address.location}</p>
            </div>
            
            <p className="text-gray-600 text-sm pl-7">{address.state}</p>
            <p className="text-gray-600 text-sm pl-7">Pincode: <span className="font-semibold text-black">{address.pincode}</span></p>
        </div>
    );
}