export default function EnquiryModalContent({onClose}) {
    function Reload() {
        console.log("Should be reloading");
        window.location.reload();
    }
    return (
            <div className="z-10 absolute ml-[40%] bg-slate-100 bottom-0 p-9 pl-24 pr-24 rounded-md flex justify-center flex-col mb-52 border-2 border-neutral-700 duration-75">
                <h2 className="text-xl font-semibold text-gray-700">Enquiry Sent</h2>
                <button onClick={() => Reload()} className="text-gray-700 font-semibold mt-12 bg-white p-1 rounded-md border-2 border-slate-500">Close</button>
            </div>
    )
}