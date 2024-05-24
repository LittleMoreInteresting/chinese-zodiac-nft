import {Link} from "@nextui-org/react";

export default function  Footer(){
    return (
        <div className="container m-5 mx-auto flex flex-col justify-center items-center">
            <p className="justify-center">
                <span>© {(new Date()).getFullYear()}</span>
                <span className="mx-3">|</span>
                <Link isBlock isExternal showAnchorIcon color="foreground" href="https://x.com/Henry_SUN07">X</Link>
                <Link isBlock isExternal showAnchorIcon color="foreground" href="https://github.com/LittleMoreInteresting">Github</Link>
            </p>
        </div>
    )
}