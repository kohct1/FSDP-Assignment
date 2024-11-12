export default function RegModalContent({onClose}) {
    return (
        <div className="z-10 absolute ml-[37.7%] bg-slate-100 bottom-0 p-12 pl-20 pr-20 rounded-md flex justify-center flex-col mb-52 border-2 border-neutral-700 duration-75">
            <h2 className="text-xl font-semibold text-gray-700">Successfully Registered</h2>
        <button onClick={onClose} className="text-gray-700 font-semibold mt-12 bg-white p-1 rounded-md border-2 border-slate-500">Close</button>
    </div>
    )
}