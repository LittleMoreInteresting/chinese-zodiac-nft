'use client'
import {Image} from "@nextui-org/image";
import {Listbox, ListboxItem} from "@nextui-org/react";
export default function NFTBox() {
    return(
    <div className="container">
        <div className="flex flex-wrap gap-4 min-h-96 " >
        <div className="min-h-96">
            <Image
                width={320}
                isZoomed
                alt="NextUI hero Image"
                src="/chinese-2417918_640.jpg"
            />
        </div>
        <div className="grow ">
            btn
        </div>
        <div className="  w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
                <Listbox className=""
            >
                <ListboxItem key="new">New file</ListboxItem>
                <ListboxItem key="copy">Copy link</ListboxItem>
                <ListboxItem key="edit">Edit file</ListboxItem>
                <ListboxItem key="delete" >
                Delete file
                </ListboxItem>
            </Listbox>
        </div> 
        </div>
    </div>

    )
}