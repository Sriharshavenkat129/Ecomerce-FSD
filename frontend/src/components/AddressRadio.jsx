export default function AddressRadio({ address, setAddressId }) {
    return (
        <label htmlFor={address.address_id} className="cursor-pointer min-w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-2 hover:bg-gray-50 transition-colors">
            <div className="pointer-events-none">
                <p className="font-semibold text-gray-900">{address.location}</p>
                <p className="text-sm text-gray-600">{address.state}, {address.pincode}</p>
            </div>
            <input 
                type="radio" 
                name="address" 
                id={address.address_id}
                className="w-5 h-5 cursor-pointer text-orange-500 focus:ring-orange-500"
                value={address.address_id} 
                onChange={() => setAddressId(pre => ({ ...pre, address_id: address.address_id }))}
            />
        </label>
    );
}