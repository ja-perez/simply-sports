import Image from "next/image"
import ImageNotSupported from "@mui/icons-material/ImageNotSupported"


export const siteToMedia = (site: string) => {
    switch (site) {
        case "ESPN":
            return (
                <ESPNPng />
            )
        case "The Guardian":
            return (
                <TheGuardianPng />
            )
        default:
            return (
                <ImageNotSupported />
            )
    }
}


export function TheGuardianPng() {
    return (
        <Image
            src="/theguardian48.png"
            alt="The Guardian Logo"
            width={48}
            height={48}
            >
            { /* credit: The Guardian icon from https://iconscout.com/free-icon/the-83 */ }
            </Image>
    )
}

export function ESPNPng() {
    return (
        <Image
            src="/espn48.png"
            alt="ESPN Logo"
            width={48}
            height={48}
        >
            {/* credit: ESPN logo from  */ }
        </Image>
    )
}
{/* <a 
href="https://iconscout.com/icons/espn" 
class="text-underline font-size-sm" 
target="_blank">
    Espn
    </a> 
    by 
<a 
href="https://iconscout.com/contributors/icon-mafia" 
class="text-underline font-size-sm">
    Icon Mafia
    </a> 
    on 
<a 
href="https://iconscout.com" 
class="text-underline font-size-sm">
    IconScout
</a> */}